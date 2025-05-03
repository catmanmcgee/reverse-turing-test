import { useGame } from "@/client/contexts/GameContext";
import { cn } from "@/client/lib/utils";

const ParticipantList = () => {
  const { gameState } = useGame();

  const { participants } = gameState;

  const typeLabels = {
    ai: "AI",
    human: "Human",
    player: "Player",
  };

  const avatarColors = {
    ai: "bg-game-blue/20 text-game-blue",
    human: "bg-game-purple/20 text-game-purple",
    player: "bg-game-teal/20 text-game-teal",
  };

  return (
    <div className="bg-game-card rounded-lg p-4 mb-4">
      <h3 className="text-lg font-display mb-3 text-game-highlight">
        Participants
      </h3>
      <div className="space-y-2">
        {participants.map((participant) => (
          <div
            key={participant.id}
            className={cn(
              "flex items-center p-2 rounded",
              participant.isEliminated ? "opacity-40" : "opacity-100"
            )}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center mr-2",
                avatarColors[participant.type]
              )}
            >
              {participant.avatar}
            </div>
            <div>
              <div className="font-medium">{participant.name}</div>
              <div className="text-xs opacity-70">
                {participant.isEliminated
                  ? "Eliminated"
                  : typeLabels[participant.type]}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParticipantList;
