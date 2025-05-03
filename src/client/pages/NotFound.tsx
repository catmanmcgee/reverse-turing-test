import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/client/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-game-bg p-4">
      <div className="text-center">
        <h1 className="text-7xl font-display mb-4 text-game-highlight">404</h1>
        <p className="text-xl text-game-text mb-6">
          Oops! This page seems to have been eliminated from the game.
        </p>
        <Button
          onClick={() => navigate("/")}
          className="bg-game-purple hover:bg-game-purple/80"
        >
          Return to Lobby
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
