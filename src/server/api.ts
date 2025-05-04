import express, { Router } from "express";
import { initChatRoutes } from "./routes/chat";
import { initVoteRoutes } from "./routes/vote";

export function initServer(app: Router): void {
  initChatRoutes(app);
  initVoteRoutes(app);
}
