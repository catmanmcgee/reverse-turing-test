import { createContext, useContext, useState, ReactNode } from "react";
import {
  GameState,
  Participant,
  Message,
  Round,
  Vote,
} from "@/client/types/gameTypes";
import {
  mockParticipants,
  mockPrompts,
  aiResponses,
} from "@/client/data/mockData";

interface GameContextType {
  gameState: GameState;
  startGame: () => void;
  sendMessage: (content: string) => void;
  voteParticipant: (voterId: string, targetId: string) => void;
  endVoting: () => void;
  startNextRound: () => void;
  resetGame: () => void;
}

const defaultGameState: GameState = {
  gameId: "",
  participants: [],
  rounds: [],
  currentRound: 0,
  status: "lobby",
  winner: null,
};

export const GameContext = createContext<GameContextType>({
  gameState: defaultGameState,
  startGame: () => {},
  sendMessage: () => {},
  voteParticipant: () => {},
  endVoting: () => {},
  startNextRound: () => {},
  resetGame: () => {},
});

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [gameState, setGameState] = useState<GameState>(defaultGameState);

  const generateId = () => Math.random().toString(36).substring(2, 9);

  // Initialize a new game
  const startGame = () => {
    const gameId = generateId();
    const participants = [...mockParticipants];
    const shuffledPrompts = [...mockPrompts].sort(() => 0.5 - Math.random());

    const firstRound: Round = {
      number: 1,
      prompt: shuffledPrompts[0],
      messages: [],
      votingComplete: false,
      votedOutId: null,
    };

    setGameState({
      gameId,
      participants,
      rounds: [firstRound],
      currentRound: 0,
      status: "active",
      winner: null,
    });

    // Simulate AI responses after a delay
    setTimeout(() => {
      simulateAIResponses(firstRound.prompt);
    }, 2000);
  };

  // Simulate AI responses to the current prompt
  const simulateAIResponses = (prompt: string) => {
    const aiParticipants = gameState.participants.filter(
      (p) => p.type === "ai" && !p.isEliminated
    );

    const promptType = prompt.toLowerCase().includes("hobby")
      ? "hobby"
      : "perfect-day";

    aiParticipants.forEach((ai, index) => {
      const delay = 3000 + index * 4000 + Math.random() * 2000;
      setTimeout(() => {
        const availableResponses = aiResponses[ai.id]?.[promptType] || [];
        if (availableResponses.length > 0) {
          const randomResponse =
            availableResponses[
              Math.floor(Math.random() * availableResponses.length)
            ];
          const aiMessage: Message = {
            id: generateId(),
            senderId: ai.id,
            content: randomResponse,
            timestamp: Date.now(),
          };

          setGameState((prev) => {
            const updatedRounds = [...prev.rounds];
            updatedRounds[prev.currentRound] = {
              ...updatedRounds[prev.currentRound],
              messages: [
                ...updatedRounds[prev.currentRound].messages,
                aiMessage,
              ],
            };
            return {
              ...prev,
              rounds: updatedRounds,
            };
          });
        }
      }, delay);
    });
  };

  // Send a message from the player
  const sendMessage = (content: string) => {
    if (gameState.status !== "active") return;

    const message: Message = {
      id: generateId(),
      senderId: "player",
      content,
      timestamp: Date.now(),
    };

    setGameState((prev) => {
      const updatedRounds = [...prev.rounds];
      updatedRounds[prev.currentRound] = {
        ...updatedRounds[prev.currentRound],
        messages: [...updatedRounds[prev.currentRound].messages, message],
      };
      return {
        ...prev,
        rounds: updatedRounds,
      };
    });
  };

  // Register a vote
  const voteParticipant = (voterId: string, targetId: string) => {
    if (gameState.status !== "voting") return;

    setGameState((prev) => {
      // Set the game to voting status if not already
      let newStatus = "voting";

      // For this simplified version, we'll just count the player's vote
      // In a real implementation, we would track all votes and determine the most voted
      return {
        ...prev,
        status: newStatus,
        rounds: prev.rounds.map((round, index) =>
          index === prev.currentRound
            ? { ...round, votedOutId: targetId }
            : round
        ),
      };
    });
  };

  // End the voting phase and update eliminated participants
  const endVoting = () => {
    setGameState((prev) => {
      const currentRound = prev.rounds[prev.currentRound];
      const eliminatedId = currentRound.votedOutId;

      // Update participants to mark the eliminated one
      const updatedParticipants = prev.participants.map((p) =>
        p.id === eliminatedId ? { ...p, isEliminated: true } : p
      );

      // Check if the game should end
      const remainingHumans = updatedParticipants.filter(
        (p) => p.type === "human" && !p.isEliminated
      ).length;
      const remainingAIs = updatedParticipants.filter(
        (p) => p.type === "ai" && !p.isEliminated
      ).length;
      const remainingPlayers = updatedParticipants.filter(
        (p) => p.type === "player" && !p.isEliminated
      ).length;

      // Game ends if all humans or all AIs are eliminated
      let newStatus: GameState["status"] = "active";
      let winner: string | null = null;

      if (remainingHumans === 0 && remainingPlayers === 0) {
        // AIs win
        newStatus = "results";
        winner = "ai";
      } else if (remainingAIs === 0) {
        // Humans win
        newStatus = "results";
        winner = "human";
      }

      return {
        ...prev,
        participants: updatedParticipants,
        status: newStatus,
        winner,
      };
    });
  };

  // Start the next round
  const startNextRound = () => {
    setGameState((prev) => {
      // Select a new prompt (avoiding repeats)
      const usedPrompts = prev.rounds.map((r) => r.prompt);
      const availablePrompts = mockPrompts.filter(
        (p) => !usedPrompts.includes(p)
      );

      // If we've used all prompts, shuffle and reuse
      let nextPrompt = "";
      if (availablePrompts.length > 0) {
        nextPrompt =
          availablePrompts[Math.floor(Math.random() * availablePrompts.length)];
      } else {
        nextPrompt =
          mockPrompts[Math.floor(Math.random() * mockPrompts.length)];
      }

      const nextRoundNumber = prev.rounds.length + 1;

      // Create the next round
      const nextRound: Round = {
        number: nextRoundNumber,
        prompt: nextPrompt,
        messages: [],
        votingComplete: false,
        votedOutId: null,
      };

      const newState = {
        ...prev,
        rounds: [...prev.rounds, nextRound],
        currentRound: prev.currentRound + 1,
        status: "active",
      };

      // Simulate AI responses after a delay
      setTimeout(() => {
        simulateAIResponses(nextPrompt);
      }, 2000);

      return newState;
    });
  };

  // Reset the game to lobby state
  const resetGame = () => {
    setGameState(defaultGameState);
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        startGame,
        sendMessage,
        voteParticipant,
        endVoting,
        startNextRound,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
