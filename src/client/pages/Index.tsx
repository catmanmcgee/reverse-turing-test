import { Button } from "@/client/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useGame } from "@/client/contexts/GameContext";

const Index = () => {
  const navigate = useNavigate();
  const { resetGame } = useGame();

  const startNewGame = () => {
    resetGame();
    navigate("/game");
  };

  return (
    <div className="min-h-screen bg-game-bg flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl w-full text-center">
        <div className="highlight-glow inline-block mb-8">
          <h1 className="text-5xl md:text-7xl font-display font-bold text-game-highlight mb-2">
            Bot or not?
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
                Engage in group conversations with a mix of humans and AIs on
                various topics
              </p>
            </div>

            <div className="bg-game-blue/10 p-4 rounded-lg border border-game-blue/20">
              <div className="text-xl font-bold mb-2">2. Vote</div>
              <p>
                Cast your vote for who you believe is the most human-like
                participant
              </p>
            </div>

            <div className="bg-game-teal/10 p-4 rounded-lg border border-game-teal/20">
              <div className="text-xl font-bold mb-2">3. Eliminate</div>
              <p>The most human-like participant is eliminated each round</p>
            </div>
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
            In this reverse Turing test, your goal is to identify and eliminate
            the most human-like participants. Will the AIs fool you into
            thinking they're human? Can humans appear more robotic than the AI?
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
