import { create } from "zustand";
import {
  GameState,
  Participant,
  Message,
  Round,
} from "@/client/types/gameTypes";
import { initParticipants, mockPrompts } from "@/client/data/mockData";
import { shuffle } from "radashi";
import { immer } from "zustand/middleware/immer";
import { fetchWithRetry } from "./Fetch";
import { formatRoundMessages, generateId, getModelName } from "./Util";

const defaultGameState: GameState = {
  gameId: "",
  participants: [],
  participantOrder: [],
  currentRound: -1,
  status: "lobby",
  winner: null,
  playerName: "",
};

const defaultRounds: Round[] = [];

interface GameStore {
  gameState: GameState;
  rounds: Round[];
  startGame: () => void;
  sendPlayerMessage: (content: string) => void;
  aiVote: (obj: { from: string; vote: Record<string, any> }) => void;
  endVoting: () => void;
  startNextRound: () => void;
  startChatting: () => Promise<void>;
  resetGame: () => void;
  aiResponse: (participant: Participant) => Promise<void>;
  startVoting: () => void;
}

export const useGameStore = create<GameStore>()(
  immer((set) => ({
    gameState: defaultGameState,
    rounds: defaultRounds,
    startGame: () => {
      const gameId = generateId();
      const participants = initParticipants();

      set((state) => {
        state.gameState = {
          playerName: participants[0].name,
          gameId,
          participants,
          participantOrder: shuffle(participants.map((p) => p.name)),
          currentRound: -1,
          status: "active",
          winner: null,
        };
        state.rounds = [];
      });

      setTimeout(() => {
        useGameStore.getState().startNextRound();
      }, 100);
    },

    aiResponse: async (participant: Participant) => {
      const { gameState, rounds } = useGameStore.getState();

      const textContext = formatRoundMessages(rounds)
        .concat([`Now it's ${participant.name}'s turn to respond.`])
        .join("\n\n");

      const body = await fetchWithRetry("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          messages: [textContext],
          systemPrompt: "0.1",
          model: getModelName(),
        }),
      });

      const message = body.choices[0].message.content;

      const aiMessage: Message = {
        senderId: participant.name,
        content: message,
        timestamp: Date.now(),
      };

      set((state) => {
        const { currentRound } = state.gameState;
        state.rounds[currentRound].messages.push(aiMessage);
      });
    },

    aiVote: ({ from, vote }) => {
      // Sample vote:
      // {
      //   suspected_human_name: 'Dakota',
      //   suspicion_level_percent_Dakota: 80,
      //   suspicion_level_percent_Sage: 5,
      //    suspicion_level_percent_Jamie: 5
      // }
      const votedPlayer = vote.suspected_human_name;
      const suspicousLevels = Object.entries(vote).reduce<
        Record<string, number>
      >((acc, [key, value]) => {
        if (key.startsWith("suspicion_level_percent_")) {
          const participantName = key.replace("suspicion_level_percent_", "");
          acc[participantName] = value;
        }
        return acc;
      }, {});
      const { gameState } = useGameStore.getState();
      if (gameState.status !== "voting") return;

      set((state) => {
        const { currentRound } = state.gameState;
        state.rounds[currentRound].votes.push({
          from,
          vote: votedPlayer,
          isForPlayer: votedPlayer === state.gameState.playerName,
          suspicousLevels,
        });
      });
    },

    sendPlayerMessage: (content: string) => {
      const { gameState } = useGameStore.getState();
      if (gameState.status !== "player-turn") return;

      const message: Message = {
        senderId: gameState.participants.find((i) => i.type === "player")
          ?.name!,
        content,
        timestamp: Date.now(),
      };

      set((state) => {
        const { currentRound } = state.gameState;
        state.rounds[currentRound].messages.push(message);
        state.gameState.status = "active";
      });
    },

    voteParticipant: (voterId: string, targetId: string) => {
      console.log("not implemented");
    },

    endVoting: () =>
      set((state) => {
        const currentRound = state.rounds[state.gameState.currentRound];

        const voteCounts = Object.entries(
          Object.values(currentRound.votes).reduce<Record<string, number>>(
            (acc, vote) => {
              acc[vote.vote] = (acc[vote.vote] || 0) + 1;
              return acc;
            },
            {}
          )
        );
        voteCounts.sort((a, b) => b[1] - a[1]);

        const eliminatedId = voteCounts[0][0];
        const eliminatedParticipant = state.gameState.participants.find(
          (p) => p.name === eliminatedId
        );
        currentRound.messages.push({
          senderId: "game",
          content: `${eliminatedParticipant?.name} has been eliminated!`,
          timestamp: Date.now(),
        });

        eliminatedParticipant.isEliminated = true;

        const remainingAIs = state.gameState.participants.filter(
          (p) => p.type === "ai" && !p.isEliminated
        ).length;
        const remainingPlayers = state.gameState.participants.filter(
          (p) => p.type === "player" && !p.isEliminated
        ).length;

        const isGameOver = remainingPlayers === 0 || remainingAIs === 0;

        if (isGameOver) {
          fetchWithRetry("/api/recordGame", {
            method: "POST",
            body: JSON.stringify({
              messages: JSON.stringify(state.rounds),
              systemPrompt: "0.1",
              model: getModelName(),
              isWin: remainingPlayers > 0,
            }),
          });

          if (remainingPlayers === 0) {
            state.gameState.status = "results";
            state.gameState.winner = "ai";
            // Record the game
          } else if (remainingAIs === 0) {
            state.gameState.status = "results";
            state.gameState.winner = "human";
          }
          setTimeout(() => {
            window.scrollTo(0, 0);
          }, 100);
        } else {
          state.gameState.status = "active";
          state.gameState.winner = null;
          setTimeout(() => {
            useGameStore.getState().startNextRound();
          }, 100);
        }
      }),

    startChatting: async () => {
      const { participantOrder } = useGameStore.getState().gameState;
      let i = 0;
      const participants = participantOrder
        .map(
          (a) =>
            useGameStore
              .getState()
              .gameState.participants.find((p) => p.name === a)!
        )
        .filter((a) => !a.isEliminated);
      for (const participant of participants) {
        if (participant.type === "ai") {
          set((state) => {
            state.gameState.participants.find(
              (p) => p.name === participant.name
            )!.isSpeaking = true;
          });
          await useGameStore.getState().aiResponse(participant);
          set((state) => {
            state.gameState.participants.find(
              (p) => p.name === participant.name
            )!.isSpeaking = false;
          });
        } else {
          set((state) => {
            state.gameState.status = "player-turn";
          });
          await new Promise<void>((resolve) => {
            const interval = setInterval(() => {
              if (useGameStore.getState().gameState.status !== "player-turn") {
                clearInterval(interval);
                resolve();
              }
            }, 100);
          });
        }
        i++;
      }
      useGameStore.getState().startVoting();
    },

    startNextRound: () => {
      set((state) => {
        const usedPrompts = state.rounds.map((r) => r.prompt);
        const availablePrompts = mockPrompts.filter(
          (p) => !usedPrompts.includes(p)
        );

        const nextPrompt =
          availablePrompts.length > 0
            ? availablePrompts[
                Math.floor(Math.random() * availablePrompts.length)
              ]
            : mockPrompts[Math.floor(Math.random() * mockPrompts.length)];

        const nextRoundNumber = state.rounds.length + 1;

        const nextRound: Round = {
          number: nextRoundNumber,
          prompt: nextPrompt,
          messages: [],
          votes: [],
        };

        state.rounds = state.rounds.concat([nextRound]);

        state.gameState = {
          ...state.gameState,
          currentRound: state.gameState.currentRound + 1,
          status: "active",
          participantOrder: shuffle(
            state.gameState.participants.map((p) => p.name)
          ),
        };
        setTimeout(() => {
          useGameStore.getState().startChatting();
        }, 100);
      });
    },

    resetGame: () => {
      set((state) => {
        state.gameState = defaultGameState;
        state.rounds = defaultRounds;
      });
    },

    startVoting: () => {
      const voteCalls = Promise.all(
        useGameStore
          .getState()
          .gameState.participants.filter((a) => a.type === "ai")
          .map(async (participant) => {
            const textContext = formatRoundMessages(
              useGameStore.getState().rounds
            )
              .map(
                (roundText) => `${roundText}
    Now it's ${participant.name}'s turn to vote for who they think is the human.`
              )
              .join("\n\n");

            set((state) => {
              state.gameState.participants.find(
                (p) => p.name === participant.name
              )!.isVoting = true;
            });
            const body = await fetchWithRetry("/api/vote", {
              method: "POST",
              body: JSON.stringify({
                messages: [textContext],
                systemPrompt: "0.1",
                model: getModelName(),
                liveParticipants: useGameStore
                  .getState()
                  .gameState.participants.filter(
                    (a) => !a.isEliminated && a.name !== participant.name
                  )
                  .map((a) => a.name),
              }),
            });
            const vote = JSON.parse(body.choices[0].message.content);
            set((state) => {
              state.gameState.participants.find(
                (p) => p.name === participant.name
              )!.isVoting = false;
            });
            useGameStore.getState().aiVote({ from: participant.name, vote });
          })
      );

      voteCalls.then(() => useGameStore.getState().endVoting());

      set((state) => {
        state.gameState.status = "voting";
      });
    },
  }))
);
