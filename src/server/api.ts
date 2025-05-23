import express, { Router } from "express";
import { initChatRoutes } from "./routes/chat";
import { initVoteRoutes } from "./routes/vote";
import { initRecordGame } from "./routes/recordGame";
import { initModelStats } from "./routes/modelStats";
import { initTogetherCreditsRoutes } from "./routes/togetherCredits";

export function initServer(app: Router): void {
  initChatRoutes(app);
  initVoteRoutes(app);
  initRecordGame(app);
  initModelStats(app);
  initTogetherCreditsRoutes(app);
}
