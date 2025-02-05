import { create } from "zustand";
import axios from "@/lib/axios";
import { ChatMessage } from "@/types/Types";
import toast from "react-hot-toast";

interface AiStoreInterface {
  currentMessages: ChatMessage[];
  sendMessage: (message: string) => Promise<void>;
  isSendingMessage: boolean;
  resetMessages: () => void;

}

export const useAiStore = create<AiStoreInterface>((set, get) => ({
  currentMessages: [],
  isSendingMessage: false,
  sendMessage: async (message) => {
    try {
      set({ isSendingMessage: true });
      const requestBody = {
        content: message
      }
      const response = await axios.post("/anna/send-completion", requestBody);

      const messages = get().currentMessages;
      messages.push(response.data);
      console.log(response.data);

      set({ currentMessages: messages, isSendingMessage: false })
    } catch (e) {
      set({ isSendingMessage: false });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      console.log("Error: ", e.response.data)
      toast.error("Something went wrong");
    }
  },

  resetMessages: () => set({ isSendingMessage: false, currentMessages: [] }),
}));