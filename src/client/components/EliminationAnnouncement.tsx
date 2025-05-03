import { useGame } from "@/client/contexts/GameContext";
import { Button } from "@/client/components/ui/button";
import { cn } from "@/client/lib/utils";

const EliminationAnnouncement = () => {
  const { gameState, startNextRound } = useGame();

  const currentRound = gameState.rounds[gameState.currentRound];

  if (
    !currentRound ||
    !currentRound.votedOutId ||
    gameState.status === "active"
  )
    return null;

  const eliminatedParticipant = gameState.participants.find(
    (p) => p.id === currentRound.votedOutId
  );

  if (!eliminatedParticipant) return null;

  const typeColor = {
    ai: "text-game-blue",
    human: "text-game-purple",
    player: "text-game-teal",
  };

  const bgColor = {
    ai: "bg-game-blue/10 border-game-blue/30",
    human: "bg-game-purple/10 border-game-purple/30",
    player: "bg-game-teal/10 border-game-teal/30",
  };

  const isGameOver = gameState.status === "results";

  return (
    <div
      className={cn(
        "rounded-lg p-6 mb-6 border text-center animate-fade-in",
        bgColor[eliminatedParticipant.type]
      )}
    >
      <h3 className="text-xl font-display mb-3">
        Round {currentRound.number} Results
      </h3>

      <div className="mb-4">
        <p className="mb-2">The group has eliminated:</p>
        <div className="text-2xl font-bold mb-1">
          {eliminatedParticipant.name}
        </div>
        <p className={cn("text-lg", typeColor[eliminatedParticipant.type])}>
          who was{" "}
          {eliminatedParticipant.type === "human" ||
          eliminatedParticipant.type === "player"
            ? "a Human"
            : "an AI"}
          !
        </p>
      </div>

      {!isGameOver && (
        <Button
          className="bg-game-purple hover:bg-game-purple/80 w-full"
          onClick={startNextRound}
        >
          Start Next Round
        </Button>
      )}
    </div>
  );
};

export default EliminationAnnouncement;
