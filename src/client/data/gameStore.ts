import { create } from "zustand";
import { combine } from "zustand/middleware";

interface Message {
  who: string;
  content: string;
  isPrivate: boolean;
}

interface Participant {
  name: string;
  type: "ai" | "human";
  isEliminated: boolean;
  avatar: string;
}

interface ConversationState {
  conversation: Message[];
  addMessage: (message: Message) => void;
}
export const useConversationStore = create<ConversationState>((set) => ({
  conversation: [],
  addMessage: (val) =>
    set((state) => ({ conversation: state.conversation.concat([val]) })),
}));

interface ParticipationState {
  participants: Participant[];
  setParticipants: (participants: Participant[]) => void;
  killParticipant: (name: string) => void;
}
export const useParticipantStore = create<ParticipationState>((set) => ({
  participants: [],
  setParticipants: (val) => set((state) => ({ participants: val })),
  killParticipant: (val) =>
    set((state) => {
      const updatedParticipants = state.participants.map((participant) =>
        participant.name === val
          ? { ...participant, isEliminated: true }
          : participant
      );
      return { participants: updatedParticipants };
    }),
}));
