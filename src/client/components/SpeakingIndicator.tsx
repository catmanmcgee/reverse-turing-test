import { useGameStore } from "@/client/contexts/GameContext";

const SpeakingIndicator = () => {
  const { gameState } = useGameStore();

  if (!gameState.participants.some((p) => p.isSpeaking)) {
    return null;
  }

  const speakingParticipant = gameState.participants.find((p) => p.isSpeaking);

  return (
    <div className="mb-4 bg-game-highlight/10 rounded-lg p-3 animate-pulse">
      <p className="text-game-highlight text-center">
        {speakingParticipant?.name} is speaking...
      </p>
    </div>
  );
};

export default SpeakingIndicator;
