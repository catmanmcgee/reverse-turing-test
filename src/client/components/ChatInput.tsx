import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { Button } from "@/client/components/ui/button";
import { Textarea } from "@/client/components/ui/textarea";
import { useGameStore } from "@/client/contexts/GameContext";

const ChatInput = () => {
  const [message, setMessage] = useState("");
  const gameState = useGameStore((state) => state.gameState);
  const sendMessage = useGameStore((state) => state.sendPlayerMessage);

  const isActive = gameState.status === "player-turn";

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && isActive) {
      sendMessage(message.trim());
      setMessage("");
    }
  };
  const inputRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
      window.scrollTo(0, document.body.scrollHeight);
    }
  }, [inputRef, isActive]);
  return (
    <>
      {isActive && (
        <div className="text-sm text-game-text font-bold bg-game-purple/10 p-2 rounded-md">
          It is your turn!
        </div>
      )}
      <form onSubmit={handleSendMessage} className="mt-4 flex gap-2 flex-col">
        <Textarea
          ref={inputRef}
          placeholder={
            isActive ? "Type your message..." : "Waiting for your turn..."
          }
          value={message}
          onKeyDown={(e: KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === "Enter" && (e.altKey || e.ctrlKey || e.metaKey)) {
              handleSendMessage(e);
            }
          }}
          maxLength={1000}
          onChange={(e) => setMessage(e.target.value)}
          disabled={!isActive}
          className="bg-game-card border-game-purple/30 text-game-text w-full"
        />
        <Button
          type="submit"
          disabled={!isActive || !message.trim()}
          className="bg-game-purple hover:bg-game-purple/80 text-white"
        >
          Send (ctrl/alt/meta + enter)
        </Button>
      </form>
    </>
  );
};

export default ChatInput;
