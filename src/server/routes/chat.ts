import { Router, Request, Response } from "express";
import { allModels } from "../../allModels";
import { PrismaClient } from "@prisma/client";
import { systemPrompts } from "../../systemPrompts";
import { AiProvider, formatMessages } from "../utils/aiCompletions";

const aiProvider = new AiProvider();

export function initChatRoutes(app: Router): void {
  app.post("/chat", async (req: Request, res: Response) => {
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
    if (!allModels.includes(req.body.model)) {
      res.status(400).send("Invalid model provided");
      return;
    }

    try {
      const formattedMessages = formatMessages(
        systemPrompts[req.body.systemPrompt],
        messages
      );

      const response = await aiProvider.createChatCompletion(
        formattedMessages,
        {
          model: req.body.model,
          stream: false,
          maxTokens: 1000,
        }
      );

      if (!response) {
        res.status(500).send("No response body");
        return;
      }

      const prisma = new PrismaClient();
      await prisma.model_inference_stats.upsert({
        where: {
          model_name: req.body.model,
        },
        create: {
          model_name: req.body.model,
          inference_count: 1,
        },
        update: {
          inference_count: {
            increment: 1,
          },
        },
      });

      res.status(200).write(JSON.stringify(response));
      res.end();
    } catch (e) {
      console.error(e);
      res.status(500).send("Error");
    }
  });
}

const fetchChatCompletion = async (
  userMessages: string[],
  systemPrompt: string,
  model: string
) => {
  const messages = [{ role: "system", content: systemPrompt }].concat(
    userMessages.map((message) => ({
      role: "user",
      content: message,
    }))
  );
  const response = together.chat.completions.create({
    model,
    stream: false,
    messages: messages as any,
    max_tokens: 1000,
  });
  return response;
};

async function localApiCall(messages: string[], model: string) {
  const response = await fetch("http://127.0.0.1:1234/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      stream: false,
    }),
  });
  if (!response.body) {
    throw new Error("No response body");
    return;
  }
  return await response.text();
}
