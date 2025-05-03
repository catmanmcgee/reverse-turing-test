import { Application, Request, Response } from "express";

export function initChatRoutes(app: Application): void {
  app.post("/chat", async (req: Request, res: Response) => {
    const messages: string[] = req.body.messages;

    const response = await fetchChatCompletion(messages ?? ["hi"]);

    const decoder = new TextDecoder(); // To decode Uint8Array to string

    for await (const chunk of response.body!) {
      const decoded = decoder.decode(chunk, { stream: true });
      const dataChunks = decoded
        .split("\n")
        .filter((line) => line.trim().startsWith("data:")); // Handle multiple chunks
      for (const dataChunk of dataChunks) {
        try {
          const parsed = JSON.parse(dataChunk.replace(/^data: /, "").trim());
          if (parsed.choices && parsed.choices[0]?.delta) {
            const { role, content } = parsed.choices[0].delta;
            if (content) {
              res.write(JSON.stringify({ role, content }));
            }
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
    res.end();
  });
}

const fetchChatCompletion = async (userMessages: string[]) => {
  const messages = userMessages.map((message) => ({
    role: "user",
    content: message,
  }));
  const response = await fetch("http://127.0.0.1:1234/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Corrected content type
    },
    body: JSON.stringify({
      model: "mistral-small-3.1-24b-instruct-2503",
      messages: [...messages],
      temperature: 0.7,
      stream: true,
    }),
  });

  return response;
};
