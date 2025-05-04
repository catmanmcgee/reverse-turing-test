import { useQuery } from "@tanstack/react-query";

interface TogetherCreditsResponse {
  finalAmountCentsAfterSettlement: number;
}

export const useTogetherCredits = () => {
  return useQuery<TogetherCreditsResponse>({
    queryKey: ["togetherCredits"],
    queryFn: async () => {
      const response = await fetch("/api/togetherCredits");
      const data = await response.json();
      return data;
    },
  });
};
