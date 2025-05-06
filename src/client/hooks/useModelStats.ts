import { useQuery } from "@tanstack/react-query";

interface ModelStat {
  modelName: string;
  models: string[];
  winCount: number;
  lossCount: number;
}

export const getModelStats = (modelName: string, modelStats: ModelStat[]) => {
  if (!modelStats) return null;
  // Find all stats that contain this model name
  const relevantStats = modelStats.filter((stat) =>
    stat.models.includes(modelName)
  );
  if (relevantStats.length === 0) return null;

  // Aggregate the stats
  const winCount = relevantStats.reduce((sum, stat) => sum + stat.winCount, 0);
  const lossCount = relevantStats.reduce(
    (sum, stat) => sum + stat.lossCount,
    0
  );

  return { winCount, lossCount };
};

export const getCombinedModelStats = (
  modelNames: string[],
  modelStats: ModelStat[]
): ModelStat | null => {
  if (!modelStats || modelNames.length === 0) return null;

  return modelStats.find((a) => a.models.every((b) => modelNames.includes(b)));
};

export const useModelStats = () => {
  return useQuery<ModelStat[]>({
    queryKey: ["modelStats"],
    queryFn: async () => {
      const response = await fetch("/api/modelStats");
      const data = await response.json();
      data.data.models = data.data.modelName.split(",");
      return data.data;
    },
  });
};
