import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { toast } from "../components/ui/use-toast";

export const fetchWithRetry = async (
  url: string,
  options: RequestInit,
  retries = 3
): Promise<any> => {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      toast({ title: "Error fetching data, retrying" });
      if (attempt === retries - 1) {
        toast({ title: "Error fetching data - its broken :(" });
        throw error;
      }
    }
  }
};
