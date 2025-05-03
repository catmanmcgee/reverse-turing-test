import { useGame } from "@/client/contexts/GameContext";
import { Button } from "@/client/components/ui/button";
import { cn } from "@/client/lib/utils";

const GameResults = () => {
  const { gameState, resetGame } = useGame();

  if (gameState.status !== "results") return null;

  const winnerText = gameState.winner === "human" ? "Humans Win!" : "AIs Win!";

  const descriptionText =
    gameState.winner === "human"
      ? "The humans have successfully eliminated all the AIs!"
      : "The AIs have successfully eliminated all the humans!";

  const bgColor =
    gameState.winner === "human"
      ? "bg-game-purple/10 border-game-purple/30"
      : "bg-game-blue/10 border-game-blue/30";

  const textColor =
    gameState.winner === "human" ? "text-game-purple" : "text-game-blue";

  return (
    <div
      className={cn(
        "rounded-lg p-8 mb-6 border text-center animate-fade-in",
        bgColor
      )}
    >
      <h2 className={cn("text-3xl font-display mb-3", textColor)}>
        Game Over - {winnerText}
      </h2>

      <p className="mb-6 text-lg">{descriptionText}</p>

      <Button
        className="bg-game-purple hover:bg-game-purple/80 w-full mb-4"
        onClick={resetGame}
      >
        Play Again
      </Button>

      {/* Game statistics could go here */}
      <div className="pt-4 border-t border-white/10">
        <h3 className="text-lg mb-3">Game Stats</h3>
        <p className="text-sm opacity-70">
          Rounds played: {gameState.rounds.length}
        </p>
      </div>
    </div>
  );
};

export default GameResults;
