import { useGameStore } from "@/client/contexts/GameContext";
import { cn } from "@/client/lib/utils";
import { ChatBubbleIcon, FileTextIcon } from "@radix-ui/react-icons";
import { Progress } from "@/client/components/ui/progress";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/client/components/ui/popover";
import clsx from "clsx";
import { round } from "radashi";
import { Participant } from "../types/gameTypes";

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
        {participantOrder.map((participantName, idx) => {
          return (
            <ParticipantItem
              key={participantName}
              participantName={participantName}
              idx={idx}
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

function ParticipantItem({
  participantName,
  idx,
}: {
  participantName: string;
  idx: number;
}) {
  const participant = useGameStore((state) =>
    state.gameState.participants.find((p) => p.name === participantName)
  );

  const floatClass = `top-${idx * 8 + 4} fixed md:hidden left-0 w-screen
        bg-black/50 z-50 text-white text-center text-2xl shimmer`;
  return (
    <div
      className={cn(
        "flex items-center p-2 rounded",
        participant.isEliminated ? "opacity-40" : "opacity-100",
        participant.type === "player" && "bg-game-highlight/20"
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
        <div className="font-medium">
          {participant.name}
          {participant.model ? ` (${participant.model.split("/").pop()})` : ""}
        </div>
        <div className="text-xs opacity-70">
          {participant.isEliminated
            ? "Eliminated"
            : typeLabels[participant.type]}
        </div>
        <VoteInfo participant={participant} />
      </div>
      {participant.isSpeaking && (
        <>
          <ChatBubbleIcon className="text-game-highlight ml-2 shimmer" />
          <div className={floatClass}>{participant.name} is speaking</div>
        </>
      )}
      {participant.isVoting && (
        <>
          <FileTextIcon className="text-game-highlight ml-2 shimmer" />
          <div className={floatClass}>{participant.name} is voting</div>
        </>
      )}
    </div>
  );
}

function VoteInfo({ participant }: { participant: Participant }) {
  const votes =
    useGameStore(
      (state) => state.rounds[state.gameState.currentRound]?.votes
    ) ?? [];
  const playerName = useGameStore((state) => state.gameState.playerName);

  if (!votes) {
    return <></>;
  }
  const curVote = votes.find((vote) => vote.from === participant.name)?.vote;
  const participantSuspicion = Math.round(
    votes
      .map((vote) => vote.suspicousLevels[participant.name] ?? 0)
      .reduce((a, b) => a + b, 0)
  );
  const didVoteForPlayer = curVote === playerName;

  // Calculate color based on suspicion level (0-100)
  const maxSuspicion = votes
    .map(
      (vote) =>
        Object.values(vote.suspicousLevels).reduce(
          (acc, c) => acc + (c ?? 0)
        ) ?? 0
    )
    .reduce((a, b) => a + b, 0);
  const suspicionPercentage = (participantSuspicion / maxSuspicion) * 100;

  const getProgressColor = (percentage) => {
    // Interpolate between green (low suspicion) and red (high suspicion)
    const red = Math.round((percentage / 100) * 255);
    const green = Math.round(((100 - percentage) / 100) * 255);
    return `rgb(${red}, ${green}, 0)`;
  };
  return (
    <>
      <div
        className={clsx(
          "text-xs opacity-70",
          didVoteForPlayer ? "text-red-500" : "text-green-500"
        )}
      >
        {curVote && `Voted for: ${curVote} ${didVoteForPlayer ? "(You)" : ""}`}
      </div>
      {participantSuspicion > 0 && (
        <div className="space-y-1">
          <div className="text-xs opacity-70">Suspicion Level</div>
          <Popover>
            <PopoverTrigger asChild>
              <div className="w-full">
                <Progress
                  value={suspicionPercentage}
                  className="h-2 w-full bg-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                  style={
                    {
                      "--progress-foreground":
                        getProgressColor(suspicionPercentage),
                    } as any
                  }
                />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-fit p-2">
              <div className="text-sm">
                Suspicion: {participantSuspicion}
                {round(suspicionPercentage / 100)}%
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </>
  );
}

export default ParticipantList;
