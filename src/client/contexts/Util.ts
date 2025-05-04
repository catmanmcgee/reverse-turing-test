import { Round } from "../types/gameTypes";

export const formatRoundMessages = (rounds: Round[]): string[] => {
  return rounds.map((round) => {
    const messages = round.messages
      .map((msg) => `${msg.senderId}: ${msg.content}`)
      .join("\n");
    return `Round ${round.number}: ${round.prompt}\n${messages}`;
  });
};
export const generateId = () => Math.random().toString(36).substring(2, 9);

export const getModelName = () => {
  const urlModel = new URLSearchParams(window.location.search).get("model");
  if (urlModel) return urlModel;

  return "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free";
};
