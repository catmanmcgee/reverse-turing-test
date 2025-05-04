import { useGameStore } from "@/client/contexts/GameContext";
import { Message } from "@/client/types/gameTypes";
import { cn } from "@/client/lib/utils";
import { InfoCircledIcon } from "@radix-ui/react-icons";

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const { gameState } = useGameStore();

  let sender = gameState.participants.find((p) => p.name === message.senderId);

  if (message.senderId === "game") {
    sender = {
      name: "Game",
      type: "game",
      avatar: <InfoCircledIcon className="w-4 h-4" />,
      isEliminated: false,
      id: "game",
    };
  }

  const messageClasses = {
    ai: "chat-message-ai",
    human: "chat-message-human",
    player: "chat-message-player",
    game: "chat-message-game",
  };

  const avatarColors = {
    ai: "bg-game-blue/20 text-game-blue",
    human: "bg-game-purple/20 text-game-purple",
    player: "bg-game-teal/20 text-game-teal",
    game: "bg-game-yellow/20 text-game-yellow",
  };

  return (
    <div
      className={cn(
        "rounded-lg p-4 mb-3 animate-fade-in",
        messageClasses[sender.type]
      )}
    >
      <div className="flex items-center mb-2">
        <div
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center mr-2",
            avatarColors[sender.type]
          )}
        >
          {sender.avatar}
        </div>
        <div className="font-medium">{sender.name}</div>
      </div>
      <div className="pl-10 whitespace-pre-wrap">{message.content}</div>
    </div>
  );
};

export default ChatMessage;
