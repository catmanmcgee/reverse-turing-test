export type ParticipantType = "ai" | "human" | "player";

export type Participant = {
  id: string;
  name: string;
  type: ParticipantType;
  isEliminated: boolean;
  avatar: string;
};

export type Message = {
  id: string;
  senderId: string;
  content: string;
  timestamp: number;
};

export type Round = {
  number: number;
  prompt: string;
  messages: Message[];
  votingComplete: boolean;
  votedOutId: string | null;
};

export type GameState = {
  gameId: string;
  participants: Participant[];
  rounds: Round[];
  currentRound: number;
  status: "lobby" | "active" | "voting" | "results";
  winner: string | null;
};

export type Vote = {
  voterId: string;
  targetId: string;
};
