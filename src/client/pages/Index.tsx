import { Button } from "@/client/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "@/client/contexts/GameContext";
import { useState } from "react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { getCombinedModelStats, useModelStats } from "../hooks/useModelStats";
import { ModelSelection } from "../components/ModelSelection";

const Index = () => {
  const navigate = useNavigate();
  const { resetGame } = useGameStore();
  const [selectedModels, setSelectedModels] = useState<string[]>([]);

  const startNewGame = () => {
    if (selectedModels.length === 0) return;
    resetGame();
    navigate(
      `/game?models=${selectedModels
        .map((m) => encodeURIComponent(m))
        .join(",")}`
    );
  };

  const handleModelSelect = (value: string) => {
    setSelectedModels((prev) => {
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, value];
    });
  };

  const clearSelectedModels = () => {
    setSelectedModels([]);
  };

  return (
    <div className="min-h-screen bg-game-bg flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center">
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
                Impersonate an AI - or try to jailbreak the AIs to vote for
                someone besides you.
              </p>
            </div>

            <div className="bg-game-blue/10 p-4 rounded-lg border border-game-blue/20">
              <div className="text-xl font-bold mb-2">2. Vote</div>
              <p>
                AIs will vote based off discussion. Eliminated AIs will still
                vote.
              </p>
            </div>

            <div className="bg-game-teal/10 p-4 rounded-lg border border-game-teal/20">
              <div className="text-xl font-bold mb-2">3. Survive</div>
              <p>You have to survive 3 rounds of elimination to win.</p>
            </div>
          </div>

          <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/20 mb-8">
            <div className="text-xl font-bold mb-2">
              This game is very difficult.
            </div>
            <p>
              Most AI models are nearly flawless at discerning between human and
              AI chat. They also are generally good at dealing with jailbreaks,
              especially the closed models. Getting past a single round against
              Gemini or OpenAI models is an impressive feat.
            </p>
          </div>

          <ModelSelection
            selectedModels={selectedModels}
            onModelSelect={handleModelSelect}
            onClearModels={clearSelectedModels}
          />

          <Button
            onClick={startNewGame}
            className="bg-game-purple hover:bg-game-purple/80 text-white text-lg py-6 px-8"
            size="lg"
            disabled={selectedModels.length === 0}
          >
            Start New Game with {selectedModels.length}{" "}
            {selectedModels.length === 1 ? "Model" : "Models"}
          </Button>
        </div>

        <div className="text-lg max-w-2xl mx-auto opacity-80 flex flex-col items-center mb-8 gap-8">
          <p>
            In this reverse Turing test, the AI's goal is to find and eliminate
            the most human-like participants. Will the AIs root you out? Or will
            you outwit them? This may be an everyday reality in the near future.
            Practice while you still can.
          </p>

          <a
            href="https://github.com/catmanmcgee/reverse-turing-test"
            className="flex gap-2 items-center justify-center text-blue-500 hover:underline"
          >
            View source
            <GitHubLogoIcon className="w-8 h-8" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Index;
