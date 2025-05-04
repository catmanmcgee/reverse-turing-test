import { useGameStore } from "@/client/contexts/GameContext";
import { useState } from "react";

const VotingPanel = () => {
  const { gameState, endVoting } = useGameStore();
  const [selectedParticipantId, setSelectedParticipantId] = useState<
    string | null
  >(null);

  const isVotingPhase = gameState.status === "voting";

  if (!isVotingPhase) return <></>;

  return (
    <div className="bg-game-purple/10 rounded-lg p-4 mb-6 border border-game-purple/30 animate-fade-in">
      <p>Ai is currently deciding your fate...</p>
    </div>
  );
};

export default VotingPanel;
