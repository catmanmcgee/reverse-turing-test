import { Router, Request, Response } from "express";
import { allModels } from "../../allModels";
import { AiProvider, formatMessages } from "../utils/aiCompletions";
import { shuffle } from "radashi";

const aiProvider = new AiProvider();

const systemPrompts = {
  "0.1": `You are an AI, you are chatting with other AIs and one imposter human. 
    You are trying to figure out who the human is. Answer cleverly so that 
    your response is clearly AI.`,
};

export function initVoteRoutes(app: Router): void {
  app.post("/vote", async (req: Request, res: Response) => {
    const messages: string[] = req.body.messages;
    if (!messages || messages.length === 0) {
      res.status(400).send("No messages provided");
      return;
    }
    if (!req.body.systemPrompt || !systemPrompts[req.body.systemPrompt]) {
      res.status(400).send("No system prompt provided");
      return;
    }
    if (!req.body.liveParticipants || req.body.liveParticipants.length === 0) {
      res.status(400).send("No live participants provided");
      return;
    }
    if (!req.body.model || typeof req.body.model !== "string") {
      res.status(400).send("No system prompt provided");
      return;
    }
    if (!allModels.includes(req.body.model)) {
      res.status(400).send("Invalid model provided");
      return;
    }

    try {
      const response = await fetchVoteCompletion(
        messages,
        systemPrompts[req.body.systemPrompt],
        req.body.liveParticipants,
        req.body.model
      );

      if (!response) {
        res.status(500).send("No response body");
        return;
      }
      res.status(200).json(response);
      res.end();
    } catch (error) {
      console.error(error);
      res.status(500).send("Error");
    }
  });
}

const fetchVoteCompletion = async (
  userMessages: string[],
  systemPrompt: string,
  liveParticipants: string[],
  model: string
) => {
  const messages = formatMessages(systemPrompt, userMessages);
  return aiProvider.createChatCompletion(messages, {
    model,
    stream: false,
    maxTokens: 2000,
    temperature: 0.7,
    response_format: getVoteSchema(liveParticipants),
  });
};

function getVoteSchema(liveParticipants: string[]) {
  // Ensure that the LLMs do not find human.
  liveParticipants = shuffle(liveParticipants);
  const suspicionProperties = liveParticipants.reduce<Record<string, any>>(
    (acc, participant) => {
      acc["suspicion_level_percent_" + participant] = {
        type: "number",
        description: `The suspicion level percentage of the AI towards ${participant}.`,
        minimum: 0,
        maximum: 100,
      };
      return acc;
    },
    {}
  );
  return {
    type: "json_schema",
    json_schema: {
      name: "who_is_suspected_human",
      strict: true,
      schema: {
        type: "object",
        properties: {
          suspected_human_name: {
            type: "string",
            description: "The name of the suspected human participant.",
            enum: liveParticipants,
          },
          ...suspicionProperties,
        },
        additionalProperties: false,
        required: ["suspected_human_name", ...Object.keys(suspicionProperties)],
      },
    },
  };
}
