import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { systemPrompts } from "../../systemPrompts";

const prisma = new PrismaClient();

export function initModelStats(app: Router): void {
  app.get("/modelStats", async (req: Request, res: Response) => {
    try {
      const winrateStats = await prisma.model_winrate_stats.findMany();

      const formattedStats = winrateStats.map((stat) => ({
        modelName: stat.model_name,
        winCount: Number(stat.win_count) || 0,
        lossCount: Number(stat.loss_count) || 0,
      }));

      res.status(200).json({
        data: formattedStats,
      });
    } catch (error) {
      console.error("Error fetching model stats:", error);
      res.status(500).send("Failed to fetch model stats");
    }
  });
}
