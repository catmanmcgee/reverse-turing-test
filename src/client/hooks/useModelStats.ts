import { useQuery } from "@tanstack/react-query";

interface ModelStat {
  modelName: string;
  winCount: number;
  lossCount: number;
  winrate: number;
}

export const useModelStats = () => {
  return useQuery<ModelStat[]>({
    queryKey: ["modelStats"],
    queryFn: async () => {
      const response = await fetch("/api/modelStats");
      const data = await response.json();
      data.winrate = data.winCount / (data.winCount + data.lossCount);
      return data.data;
    },
  });
};
