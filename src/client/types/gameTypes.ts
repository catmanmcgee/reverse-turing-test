export type ParticipantType = "ai" | "human" | "player" | "game";

export type Participant = {
  id: string;
  name: string;
  type: ParticipantType;
  model: string;
  isEliminated: boolean;
  avatar: string | JSX.Element;
  isSpeaking?: boolean;
  isVoting?: boolean;
};

export type Message = {
  senderId: string;
  content: string;
  timestamp: number;
};

export type Vote = {
  from: string;
  vote: string;
  isForPlayer: boolean;
  suspicousLevels: Record<string, number>;
};

export type Round = {
  number: number;
  prompt: string;
  messages: Message[];
  votes: Vote[];
};

export type GameState = {
  playerName: string;
  gameId: string;
  participants: Participant[];
  currentRound: number;
  status: "lobby" | "active" | "voting" | "results" | "player-turn";
  participantOrder: string[];
  winner: string | null;
};
