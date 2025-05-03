import express, { Application } from "express";
import { initChatRoutes } from "./routes/chat";

export function initServer(app: Application): void {
  initChatRoutes(app);
}
