import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { systemPrompts } from "../../systemPrompts";

const prisma = new PrismaClient();

export function initRecordGame(app: Router): void {
  app.post("/recordGame", async (req: Request, res: Response) => {
    const messages: string[] = req.body.messages;
    if (!messages || messages.length === 0) {
      res.status(400).send("No messages provided");
      return;
    }
    if (!req.body.systemPrompt || !systemPrompts[req.body.systemPrompt]) {
      res.status(400).send("No system prompt provided");
      return;
    }
    if (!req.body.model || typeof req.body.model !== "string") {
      res.status(400).send("No model provided");
      return;
    }
    const isWin = req.body.isWin;

    try {
      const game = await prisma.recorded_game.create({
        data: {
          model_name: req.body.model,
          history: messages.join("\n"),
          is_win: isWin,
        },
      });
      await prisma.model_winrate_stats.upsert({
        where: { model_name: req.body.model },
        create: {
          model_name: req.body.model,
          win_count: isWin ? 1 : 0,
          loss_count: isWin ? 0 : 1,
        },
        update: {
          win_count: isWin ? { increment: 1 } : undefined,
          loss_count: !isWin ? { increment: 1 } : undefined,
        },
      });

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error recording game:", error);
      res.status(500).send("Failed to record game");
    }
  });
}
