import Together from "together-ai";
import OpenAI from "openai";
import { togetherAiModels } from "@/togetherAiModels";
import { geminiModels } from "@/geminiModels";
import { chatGptModels } from "@/chatGptModels";
import { traverse } from "radashi";

const geminiClient = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

const chatGptClient = new OpenAI();

const together = new Together();

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

interface CompletionOptions {
  model: string;
  maxTokens?: number;
  temperature?: number;
  stream?: boolean;
  response_format?: any;
}

export class AiProvider {
  async createChatCompletion(messages: Message[], options: CompletionOptions) {
    if (togetherAiModels.includes(options.model)) {
      return together.chat.completions.create({
        model: options.model,
        messages: messages as any,
        max_tokens: options.maxTokens || 1000,
        temperature: options.temperature,
        stream: options.stream || false,
        response_format: options.response_format,
      });
    } else if (geminiModels.includes(options.model)) {
      return geminiClient.chat.completions.create({
        model: options.model,
        messages: messages as any,
        max_tokens: options.maxTokens || 1000,
        temperature: options.temperature,
        stream: options.stream || false,
        response_format: options.response_format,
      });
    } else if (chatGptModels.includes(options.model)) {
      if (options.response_format) {
        traverse(options.response_format, (value, key, parent) => {
          if (key === "minimum" || key === "maximum") {
            // Openai does not support these and will blow up
            // https://platform.openai.com/docs/guides/structured-outputs?api-mode=responses#some-type-specific-keywords-are-not-yet-supported
            delete parent[key];
          }
        });
      }
      return chatGptClient.chat.completions.create({
        model: options.model,
        messages: messages as any,
        max_tokens: options.maxTokens || 1000,
        temperature: options.temperature,
        stream: options.stream || false,
        response_format: options.response_format,
      });
    } else {
      throw new Error(`Invalid model: ${options.model}`);
    }
  }
}

export class LocalAIProvider {
  async createChatCompletion(messages: Message[], options: CompletionOptions) {
    const response = await fetch("http://127.0.0.1:1234/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: options.model,
        messages,
        temperature: options.temperature || 0.7,
        stream: options.stream || false,
      }),
    });

    if (!response.body) {
      throw new Error("No response body");
    }
    return response.text();
  }
}

// Helper function to format messages
export function formatMessages(
  systemPrompt: string,
  userMessages: string[]
): Message[] {
  return [
    { role: "system" as const, content: systemPrompt },
    ...userMessages.map((message) => ({
      role: "user" as const,
      content: message,
    })),
  ];
}
