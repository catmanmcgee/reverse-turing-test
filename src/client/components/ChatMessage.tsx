import { useGame } from "@/client/contexts/GameContext";
import { Message } from "@/client/types/gameTypes";
import { cn } from "@/client/lib/utils";

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const { gameState } = useGame();

  const sender = gameState.participants.find((p) => p.id === message.senderId);

  if (!sender) return null;

  const messageClasses = {
    ai: "chat-message-ai",
    human: "chat-message-human",
    player: "chat-message-player",
  };

  const avatarColors = {
    ai: "bg-game-blue/20 text-game-blue",
    human: "bg-game-purple/20 text-game-purple",
    player: "bg-game-teal/20 text-game-teal",
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
