import { useEffect } from "react";
import { useGame } from "@/client/contexts/GameContext";
import ChatMessage from "@/client/components/ChatMessage";
import ChatInput from "@/client/components/ChatInput";
import ParticipantList from "@/client/components/ParticipantList";
import RoundInfo from "@/client/components/RoundInfo";
import VotingPanel from "@/client/components/VotingPanel";
import EliminationAnnouncement from "@/client/components/EliminationAnnouncement";
import GameResults from "@/client/components/GameResults";
import { Button } from "@/client/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Game = () => {
  const { gameState, startGame } = useGame();
  const navigate = useNavigate();

  // Start the game when the component mounts if we're in the lobby
  useEffect(() => {
    if (gameState.status === "lobby") {
      startGame();
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

  const currentRound = gameState.rounds[gameState.currentRound];

  return (
    <div className="min-h-screen bg-game-bg p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="ghost"
            className="text-game-text hover:bg-game-card"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Lobby
          </Button>
          <h1 className="text-2xl font-display text-center text-game-highlight">
            Bot or Not
          </h1>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

            {/* Chat container */}
            <div className="bg-game-card rounded-lg p-4">
              <h2 className="text-xl font-display mb-4 text-game-highlight">
                Discussion
              </h2>

              <div className="max-h-96 overflow-y-auto mb-4 space-y-2">
                {currentRound?.messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}

                {currentRound?.messages.length === 0 && (
                  <p className="text-center opacity-50 py-8">
                    No messages yet. Be the first to respond!
                  </p>
                )}
              </div>

              <ChatInput />
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <ParticipantList />

            {gameState.status === "active" &&
              currentRound?.messages.length >= 3 && (
                <div className="bg-game-accent/10 rounded-lg p-4 border border-game-accent/30">
                  <h3 className="font-display mb-2 text-game-accent">
                    Ready to vote?
                  </h3>
                  <p className="text-sm mb-3">
                    Once everyone has responded, you can vote on who seems most
                    human.
                  </p>
                  <Button
                    className="w-full bg-game-accent hover:bg-game-accent/80"
                    onClick={() => {
                      // Set the game state to voting
                      gameState.status = "voting";
                    }}
                  >
                    Start Voting
                  </Button>
                </div>
              )}

            <div className="bg-game-card rounded-lg p-4 mt-4">
              <h3 className="text-lg font-display mb-3 text-game-highlight">
                Game Rules
              </h3>
              <ul className="text-sm space-y-2 list-disc pl-4">
                <li>Chat with other participants about the given topic</li>
                <li>Try to determine who is human and who is AI</li>
                <li>Vote for who you think is most human-like</li>
                <li>The most human-like participant gets eliminated</li>
                <li>Humans win if all AIs are eliminated</li>
                <li>AIs win if all humans are eliminated</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
