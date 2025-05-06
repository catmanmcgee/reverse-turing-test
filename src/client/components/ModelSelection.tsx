import { Button } from "@/client/components/ui/button";
import { allModels } from "@/allModels";
import { CheckIcon } from "@radix-ui/react-icons";
import { round, unique } from "radashi";
import clsx from "clsx";
import {
  getCombinedModelStats,
  useModelStats,
  getModelStats,
} from "../hooks/useModelStats";

interface ModelSelectionProps {
  selectedModels: string[];
  onModelSelect: (model: string) => void;
  onClearModels: () => void;
}

const getModelCount = (modelName: string, selectedModels: string[]) => {
  return selectedModels.filter((model) => model === modelName).length;
};

const isModelSelected = (modelName: string, selectedModels: string[]) => {
  return selectedModels.includes(modelName);
};

export const ModelSelection = ({
  selectedModels,
  onModelSelect,
  onClearModels,
}: ModelSelectionProps) => {
  const uniqueModelCount = unique(selectedModels).length;
  const { data: modelStats, isLoading } = useModelStats();

  console.log(modelStats);
  const combinedStats =
    selectedModels.length > 0
      ? getCombinedModelStats(selectedModels, modelStats || [])
      : null;

  return (
    <div className="mb-4">
      <p className="text-lg group mb-2 flex items-center justify-between">
        <span>
          Select up to 3 AI models to play against ({selectedModels.length}
          /3 selected)
        </span>
        {selectedModels.length > 0 && (
          <Button
            onClick={onClearModels}
            variant="outline"
            className="text-sm border-game-purple/20 hover:border-game-purple/40 hover:bg-game-purple/10"
          >
            Clear Selections
          </Button>
        )}
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
          selectedModels.length === 3 && "overflow-hidden"
        )}
        style={{
          height: selectedModels.length === 3 && `${70 * uniqueModelCount}px`,
        }}
      >
        {allModels
          .sort((a, b) =>
            isModelSelected(a, selectedModels) &&
            !isModelSelected(b, selectedModels)
              ? -1
              : !isModelSelected(a, selectedModels) &&
                isModelSelected(b, selectedModels)
              ? 1
              : 0
          )
          .map((model) => {
            const stats = getModelStats(model, modelStats);
            const winRate = stats
              ? `(${round(
                  (stats.winCount / (stats.winCount + stats.lossCount)) * 100
                )}% Player win rate)`
              : "";

            return (
              <button
                key={model}
                onClick={() => onModelSelect(model)}
                className={`p-4 rounded-lg text-left border transition-all ${
                  isModelSelected(model, selectedModels)
                    ? "border-game-purple bg-game-purple/20"
                    : "border-game-purple/20 hover:border-game-purple/40"
                }`}
                disabled={
                  selectedModels.length >= 3 &&
                  !isModelSelected(model, selectedModels)
                }
              >
                <div className="flex justify-between w-full gap-2 items-center">
                  <span>
                    {model}
                    {winRate}
                  </span>
                  <div className="flex items-center gap-1">
                    {getModelCount(model, selectedModels) > 0 && (
                      <div className="flex gap-0.5">
                        {[...Array(getModelCount(model, selectedModels))].map(
                          (_, i) => (
                            <CheckIcon
                              key={i}
                              className="w-4 h-4 text-game-purple"
                            />
                          )
                        )}
                      </div>
                    )}
                    <span>{stats ? winRate : ""}</span>
                  </div>
                </div>
              </button>
            );
          })}
      </div>
    </div>
  );
};
