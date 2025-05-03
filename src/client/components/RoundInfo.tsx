import { Badge } from "@/client/components/ui/badge";
import { useGame } from "@/client/contexts/GameContext";

const RoundInfo = () => {
  const { gameState } = useGame();

  const currentRound = gameState.rounds[gameState.currentRound];

  if (!currentRound) return null;

  return (
    <div className="bg-game-card rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-display text-game-highlight">
          Current Round
        </h3>
        <Badge variant="outline" className="border-game-blue text-game-blue">
          Round {currentRound.number}
        </Badge>
      </div>
      <div className="bg-game-purple/10 p-3 rounded border border-game-purple/20">
        <p className="italic">{currentRound.prompt}</p>
      </div>
    </div>
  );
};

export default RoundInfo;
