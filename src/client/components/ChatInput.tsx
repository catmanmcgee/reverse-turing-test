import { useState } from "react";
import { Button } from "@/client/components/ui/button";
import { Input } from "@/client/components/ui/input";
import { useGame } from "@/client/contexts/GameContext";

const ChatInput = () => {
  const [message, setMessage] = useState("");
  const { gameState, sendMessage } = useGame();

  const isActive = gameState.status === "active";

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && isActive) {
      sendMessage(message.trim());
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
      <Input
        type="text"
        placeholder={
          isActive ? "Type your message..." : "Waiting for next round..."
        }
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={!isActive}
        className="bg-game-card border-game-purple/30 text-game-text"
      />
      <Button
        type="submit"
        disabled={!isActive || !message.trim()}
        className="bg-game-purple hover:bg-game-purple/80 text-white"
      >
        Send
      </Button>
    </form>
  );
};

export default ChatInput;
