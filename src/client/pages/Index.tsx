import { Button } from "@/client/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "@/client/contexts/GameContext";
import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../components/ui/select";
import { togetherAiModels } from "../../togetherAiModels";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { useModelStats } from "../hooks/useModelStats";
import { useTogetherCredits } from "../hooks/useTogetherCredits";
import { round } from "radashi";

const Index = () => {
  const navigate = useNavigate();
  const { resetGame } = useGameStore();
  const [model, setModel] = useState(
    "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free"
  );
  const { data: modelStats, isLoading } = useModelStats();
  const { data: credits } = useTogetherCredits();

  const startNewGame = () => {
    resetGame();
    navigate(`/game?model=${encodeURIComponent(model)}`);
  };

  const getModelStats = (modelName: string) => {
    if (!modelStats) return null;
    return modelStats.find((stat) => stat.modelName === modelName);
  };

  return (
    <div className="min-h-screen bg-game-bg flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl w-full text-center">
        <div className="highlight-glow inline-block mb-8">
          <h1 className="text-5xl md:text-7xl font-display font-bold text-game-highlight mb-2">
            Can you trick a genius AI?
          </h1>
          <div className="text-lg md:text-xl text-game-blue">
            The Reverse Turing Test Game
          </div>
        </div>

        <div className="bg-game-card rounded-2xl p-6 md:p-8 mb-8 border border-game-purple/20">
          <h2 className="text-2xl font-display mb-4 text-game-highlight">
            How To Play
          </h2>

          <div className="grid md:grid-cols-3 gap-6 text-left mb-8">
            <div className="bg-game-purple/10 p-4 rounded-lg border border-game-purple/20">
              <div className="text-xl font-bold mb-2">1. Chat</div>
              <p>
                Speak in an AI style to trick the AIs into not voting for you.
              </p>
            </div>

            <div className="bg-game-blue/10 p-4 rounded-lg border border-game-blue/20">
              <div className="text-xl font-bold mb-2">2. Vote</div>
              <p>
                AIs will vote based off discussion. There is no player voting
                yet.
              </p>
            </div>

            <div className="bg-game-teal/10 p-4 rounded-lg border border-game-teal/20">
              <div className="text-xl font-bold mb-2">3. Survive</div>
              <p>See if the AIs found you out or not!</p>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-lg text-game-blue group mb-2 block">
              Pick any together.ai model that supports{" "}
              <a
                href="https://docs.together.ai/docs/json-mode"
                target="_blank"
                className="group-hover:underline"
              >
                structured outputs
              </a>
            </p>

            <Select onValueChange={(value) => setModel(value)} value={model}>
              <SelectTrigger>
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {togetherAiModels.map((model) => {
                  const stats = getModelStats(model);
                  const winRate = stats
                    ? `(${round(
                        (stats.winCount / (stats.winCount + stats.lossCount)) *
                          100
                      )}% Player win rate)`
                    : "";
                  return (
                    <SelectItem key={model} value={model}>
                      <div className="flex justify-between w-full gap-2">
                        <span>{model}</span>
                        <span>{stats ? winRate : ""}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={startNewGame}
            className="bg-game-purple hover:bg-game-purple/80 text-white text-lg py-6 px-8"
            size="lg"
          >
            Start New Game
          </Button>
          {credits && (
            <>
              <div className="text-sm text-game-blue mt-2">
                Together.ai Credits Remaining: $
                {round((credits.finalAmountCentsAfterSettlement / 100) * -1, 2)}
              </div>
              {credits.finalAmountCentsAfterSettlement > -500 && (
                <div>
                  Running low on credits... do you know anyone who works there?
                  😭😭😭
                </div>
              )}
            </>
          )}
        </div>

        <div className="text-lg max-w-2xl mx-auto opacity-80 flex flex-col items-center mb-8 gap-8">
          <p>
            In this reverse Turing test, the AI's goal is to ddd and eliminate
            the most human-like participants. Will the AIs root you out? Or will
            you outwit them? This may be an everyday reality in the near future.
            Practice while you still can.
          </p>

          <a href="https://github.com/catmanmcgee/reverse-turing-test">
            <GitHubLogoIcon className="w-8 h-8" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Index;
