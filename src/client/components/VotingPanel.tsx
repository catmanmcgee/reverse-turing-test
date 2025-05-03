import { Button } from "@/client/components/ui/button";
import { useGame } from "@/client/contexts/GameContext";
import { useState } from "react";
import { cn } from "@/client/lib/utils";

const VotingPanel = () => {
  const { gameState, voteParticipant, endVoting } = useGame();
  const [selectedParticipantId, setSelectedParticipantId] = useState<
    string | null
  >(null);

  const isVotingPhase = gameState.status === "voting";

  const eligibleParticipants = gameState.participants.filter(
    (p) => !p.isEliminated && p.id !== "player"
  );

  const handleVote = () => {
    if (selectedParticipantId) {
      voteParticipant("player", selectedParticipantId);

      // In this simplified version, we'll end voting immediately
      // In a full implementation, you'd wait for all votes to be cast
      setTimeout(() => {
        endVoting();
      }, 1000);
    }
  };

  if (!isVotingPhase) return null;

  return (
    <div className="bg-game-purple/10 rounded-lg p-4 mb-6 border border-game-purple/30 animate-fade-in">
      <h3 className="text-lg font-display mb-3 text-game-highlight">
        Vote for the Most Human-Like
      </h3>
      <p className="mb-4 text-sm">
        Who do you think is the most human-like in this round?
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
        {eligibleParticipants.map((participant) => (
          <Button
            key={participant.id}
            variant="outline"
            className={cn(
              "justify-start border-game-blue/30 hover:border-game-blue",
              selectedParticipantId === participant.id &&
                "border-game-blue bg-game-blue/10"
            )}
            onClick={() => setSelectedParticipantId(participant.id)}
          >
            <span className="mr-2">{participant.avatar}</span>
            {participant.name}
          </Button>
        ))}
      </div>

      <Button
        className="w-full bg-game-accent hover:bg-game-accent/80"
        disabled={!selectedParticipantId}
        onClick={handleVote}
      >
        Cast Vote
      </Button>
    </div>
  );
};

export default VotingPanel;
