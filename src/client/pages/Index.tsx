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

const Index = () => {
  const navigate = useNavigate();
  const { resetGame } = useGameStore();
  const [model, setModel] = useState(
    "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free"
  );

  const startNewGame = () => {
    resetGame();
    navigate(`/game?model=${encodeURIComponent(model)}`);
  };

  return (
    <div className="min-h-screen bg-game-bg flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl w-full text-center">
        <div className="highlight-glow inline-block mb-8">
          <h1 className="text-5xl md:text-7xl font-display font-bold text-game-highlight mb-2">
            Can you trick your future overlords?
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
                {togetherAiModels.map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
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
        </div>

        <div className="text-lg max-w-2xl mx-auto opacity-80">
          <p>
            In this reverse Turing test, the AI's goal is to identify and
            eliminate the most human-like participants. Will the AIs root you
            out? Or will you outwit them? This may be an everyday reality in the
            new future. Practice while you still can.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
