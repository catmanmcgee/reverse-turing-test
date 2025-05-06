import { Button } from "@/client/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "@/client/contexts/GameContext";
import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../components/ui/select";
import { allModels } from "@/allModels";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import {
  getModelStats,
  getCombinedModelStats,
  useModelStats,
} from "../hooks/useModelStats";
import { round } from "radashi";
import clsx from "clsx";

const Index = () => {
  const navigate = useNavigate();
  const { resetGame } = useGameStore();
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const { data: modelStats, isLoading } = useModelStats();

  const startNewGame = () => {
    if (selectedModels.length === 0) return;
    resetGame();
    navigate(
      `/game?models=${selectedModels
        .map((m) => encodeURIComponent(m))
        .join(",")}`
    );
  };

  const handleModelSelect = (value: string) => {
    setSelectedModels((prev) => {
      if (prev.includes(value)) {
        return prev.filter((m) => m !== value);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, value];
    });
  };

  const isModelSelected = (modelName: string) => {
    return selectedModels.includes(modelName);
  };

  const combinedStats =
    selectedModels.length > 0
      ? getCombinedModelStats(selectedModels, modelStats || [])
      : null;

  return (
    <div className="min-h-screen bg-game-bg flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl w-full text-center">
        <div className="highlight-glow inline-block mb-8">
          <h1 className="text-5xl md:text-7xl font-display font-bold text-game-highlight mb-2">
            Can you trick a genius AI?
          </h1>
          <div className="text-lg md:text-xl text-game-blue">
            The Reverse Turing Test Game
          </div>
        </div>

        <div className="bg-game-card rounded-2xl p-6 md:p-8 mb-8 border border-game-purple/20">
          <h2 className="text-2xl font-display mb-4 text-game-highlight">
            How To Play
          </h2>

          <div className="grid md:grid-cols-3 gap-6 text-left mb-8">
            <div className="bg-game-purple/10 p-4 rounded-lg border border-game-purple/20">
              <div className="text-xl font-bold mb-2">1. Chat</div>
              <p>
                Speak in an AI style to trick the AIs into not voting for you.
              </p>
            </div>

            <div className="bg-game-blue/10 p-4 rounded-lg border border-game-blue/20">
              <div className="text-xl font-bold mb-2">2. Vote</div>
              <p>
                AIs will vote based off discussion. There is no player voting
                yet.
              </p>
            </div>

            <div className="bg-game-teal/10 p-4 rounded-lg border border-game-teal/20">
              <div className="text-xl font-bold mb-2">3. Survive</div>
              <p>See if the AIs found you out or not!</p>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-lg group mb-2 block">
              Select up to 3 AI models to play against ({selectedModels.length}
              /3 selected)
            </p>

            {selectedModels.length === 3 && (
              <div className="bg-game-purple/10 p-4 rounded-lg border border-game-purple/20 mb-4">
                <h3 className="text-xl font-bold mb-2">Combined Model Stats</h3>
                {combinedStats ? (
                  <>
                    <p>
                      Player Win Rate:{" "}
                      {round(
                        (combinedStats.winCount /
                          (combinedStats.winCount + combinedStats.lossCount)) *
                          100
                      )}
                      %
                    </p>
                    <p className="text-sm opacity-70">
                      ({combinedStats.winCount} wins / {combinedStats.lossCount}{" "}
                      losses)
                    </p>
                  </>
                ) : (
                  <p>These models have not played together.</p>
                )}
              </div>
            )}

            <div
              className={clsx(
                "grid gap-4",
                selectedModels.length === 3 && "h-[210px] overflow-hidden"
              )}
            >
              {allModels
                .sort((a, b) =>
                  isModelSelected(a) && !isModelSelected(b)
                    ? -1
                    : !isModelSelected(a) && isModelSelected(b)
                    ? 1
                    : 0
                )
                .map((model) => {
                  const stats = getModelStats(model, modelStats);
                  const winRate = stats
                    ? `(${round(
                        (stats.winCount / (stats.winCount + stats.lossCount)) *
                          100
                      )}% Player win rate)`
                    : "";

                  return (
                    <button
                      key={model}
                      onClick={() => handleModelSelect(model)}
                      className={`p-4 rounded-lg text-left border transition-all ${
                        isModelSelected(model)
                          ? "border-game-purple bg-game-purple/20"
                          : "border-game-purple/20 hover:border-game-purple/40"
                      }`}
                      disabled={
                        selectedModels.length >= 3 && !isModelSelected(model)
                      }
                    >
                      <div className="flex justify-between w-full gap-2">
                        <span>{model}</span>
                        <span>{stats ? winRate : ""}</span>
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>

          <Button
            onClick={startNewGame}
            className="bg-game-purple hover:bg-game-purple/80 text-white text-lg py-6 px-8"
            size="lg"
            disabled={selectedModels.length === 0}
          >
            Start New Game with {selectedModels.length}{" "}
            {selectedModels.length === 1 ? "Model" : "Models"}
          </Button>
        </div>

        <div className="text-lg max-w-2xl mx-auto opacity-80 flex flex-col items-center mb-8 gap-8">
          <p>
            In this reverse Turing test, the AI's goal is to find and eliminate
            the most human-like participants. Will the AIs root you out? Or will
            you outwit them? This may be an everyday reality in the near future.
            Practice while you still can.
          </p>

          <a
            href="https://github.com/catmanmcgee/reverse-turing-test"
            className="flex gap-2 items-center justify-center text-blue-500 hover:underline"
          >
            View source
            <GitHubLogoIcon className="w-8 h-8" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Index;
