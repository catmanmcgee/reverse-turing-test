import { togetherAiModels } from "./togetherAiModels";
import { geminiModels } from "./geminiModels";
import { chatGptModels } from "./chatGptModels";

export const allModels = [
  ...togetherAiModels,
  ...geminiModels,
  ...chatGptModels,
];
