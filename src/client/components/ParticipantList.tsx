import { useGameStore } from "@/client/contexts/GameContext";
import { cn } from "@/client/lib/utils";
import { ChatBubbleIcon, FileTextIcon } from "@radix-ui/react-icons";
import clsx from "clsx";

const ParticipantList = () => {
  const participantOrder = useGameStore(
    (state) => state.gameState.participantOrder
  );

  return (
    <div className="bg-game-card rounded-lg p-4 mb-4">
      <h3 className="text-lg font-display mb-3 text-game-highlight">
        Participants
      </h3>
      <div className="space-y-2">
        {participantOrder.map((participantName) => {
          return (
            <ParticipantItem
              key={participantName}
              participantName={participantName}
            />
          );
        })}
      </div>
    </div>
  );
};

const typeLabels = {
  ai: "AI",
  human: "Human",
  player: "Player",
};

const avatarColors = {
  ai: "bg-game-blue/20 text-game-blue",
  human: "bg-game-purple/20 text-game-purple",
  player: "bg-game-teal/20 text-game-teal",
};

function ParticipantItem({ participantName }) {
  const participant = useGameStore((state) =>
    state.gameState.participants.find((p) => p.name === participantName)
  );
  const votes =
    useGameStore(
      (state) => state.rounds[state.gameState.currentRound]?.votes
    ) ?? [];
  const playerName = useGameStore((state) => state.gameState.playerName);

  let curVote = null;
  let totalSuspicion = 0;
  let didVoteForPlayer = false;
  if (votes) {
    curVote = votes.find((vote) => vote.from === participant.name)?.vote;
    totalSuspicion = Math.round(
      votes
        .map((vote) => vote.suspicousLevels[participant.name] ?? 0)
        .reduce((a, b) => a + b, 0)
    );
    didVoteForPlayer = curVote === playerName;
  }
  return (
    <div
      className={cn(
        "flex items-center p-2 rounded",
        participant.isEliminated ? "opacity-40" : "opacity-100"
      )}
    >
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center mr-2",
          avatarColors[participant.type]
        )}
      >
        {participant.avatar}
      </div>
      <div className="flex-1">
        <div className="font-medium">{participant.name}</div>
        <div className="text-xs opacity-70">
          {participant.isEliminated
            ? "Eliminated"
            : typeLabels[participant.type]}
        </div>
        <div
          className={clsx(
            "text-xs opacity-70",
            didVoteForPlayer && "text-red-500"
          )}
        >
          {curVote && `Voted for: ${curVote}`}
        </div>
        <div className="text-xs opacity-70">
          {totalSuspicion > 0 && `Suspicion Level: ${totalSuspicion}`}
        </div>
      </div>
      {participant.isSpeaking && (
        <ChatBubbleIcon className="text-game-highlight ml-2 shimmer" />
      )}
      {participant.isVoting && (
        <FileTextIcon className="text-game-highlight ml-2 shimmer" />
      )}
    </div>
  );
}

export default ParticipantList;
