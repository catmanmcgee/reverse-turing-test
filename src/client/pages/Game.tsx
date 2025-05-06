import { useEffect, useState } from "react";
import { useGameStore } from "@/client/contexts/GameContext";
import ChatMessage from "@/client/components/ChatMessage";
import ChatInput from "@/client/components/ChatInput";
import ParticipantList from "@/client/components/ParticipantList";
import RoundInfo from "@/client/components/RoundInfo";
import VotingPanel from "@/client/components/VotingPanel";
import EliminationAnnouncement from "@/client/components/EliminationAnnouncement";
import GameResults from "@/client/components/GameResults";
import SpeakingIndicator from "@/client/components/SpeakingIndicator";
import { Button } from "@/client/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { EnterFullScreenIcon } from "@radix-ui/react-icons";
import { last } from "radashi";

const Game = () => {
  const { gameState, startGame, startVoting, rounds } = useGameStore();
  const navigate = useNavigate();

  // Start the game when the component mounts if we're in the lobby
  useEffect(() => {
    const models = new URLSearchParams(window.location.search)
      .get("models")
      ?.split(",");
    if (gameState.status === "lobby") {
      if (models.length !== 3) {
        throw new Error("Invalid number of models");
      }
      startGame(models);
    }
  }, [gameState.status, startGame]);

  // If the game hasn't started yet, show a loading state
  if (gameState.status === "lobby" || gameState.participants.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-game-bg">
        <div className="text-center">
          <h2 className="text-2xl font-display mb-4 text-game-highlight">
            Starting Game...
          </h2>
          <div className="w-16 h-16 border-4 border-game-purple/30 border-t-game-purple rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  const currentRound = rounds[gameState.currentRound];

  return (
    <div className="min-h-screen bg-game-bg p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6 md:flex-row flex-col">
          <Button
            variant="ghost"
            className="text-game-text hover:bg-game-card"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Lobby
          </Button>
          <h1 className="text-2xl font-display text-center text-game-highlight">
            Reverse Turing Test
          </h1>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div>
            <ParticipantList />
          </div>
          <div className="lg:col-span-2">
            {/* Game state components */}
            {gameState.status === "results" ? (
              <GameResults />
            ) : (
              <>
                <EliminationAnnouncement />
                {gameState.status === "voting" && <VotingPanel />}
                <RoundInfo />
              </>
            )}

            {rounds.length > 1 && (
              <div className="space-y-4">
                {rounds.slice(0, gameState.currentRound).map((_, index) => (
                  <PreviousRound key={index} roundIndex={index} />
                ))}
              </div>
            )}

            {/* Chat container */}
            <div className="bg-game-card rounded-lg p-4">
              <h2 className="text-xl font-display mb-4 text-game-highlight">
                Discussion
              </h2>

              <SpeakingIndicator />

              <div className="mb-4 max-h-[50vh] overflow-y-auto space-y-2">
                {currentRound?.messages.map((message, idx) => (
                  <ChatMessage key={idx} message={message} />
                ))}

                {currentRound?.messages.length === 0 && (
                  <p className="text-center opacity-50 py-8">
                    No messages yet.
                  </p>
                )}
              </div>

              <ChatInput />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;

function PreviousRound({ roundIndex }) {
  const { rounds } = useGameStore();
  const round = rounds[roundIndex];
  const [open, setOpen] = useState(false);

  if (!round) return <></>;

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="w-full">
      <CollapsibleTrigger className="w-full">
        <div className="bg-game-card rounded-lg p-4 mb-4 w-full flex">
          Round {roundIndex + 1} Recap -{" "}
          {last(rounds[roundIndex].messages).content}
          <EnterFullScreenIcon className="ml-auto h-6 w-6 " />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="bg-game-card rounded-lg p-4 mb-4">
          <h3 className="text-lg font-display mb-3 text-game-highlight">
            Round {roundIndex + 1} Recap
          </h3>
          <div className="mb-4">
            <h4 className="text-md font-display text-game-highlight">Votes:</h4>
            <ul className="list-disc list-inside">
              {round.votes.map((vote, idx) => (
                <li key={idx}>
                  {vote.from} voted for {vote.vote}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-md font-display text-game-highlight">
              Discussion:
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {round.messages.map((message, idx) => (
                <div key={idx} className="text-sm">
                  <strong>{message.senderId}:</strong> {message.content}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
