import axios from '@/lib/axios';
import { create } from 'zustand';
import {Word} from "@/types/Types";
import toast from "react-hot-toast";

interface WordStore {
  words: Word[];
  isAddingWords: boolean;
  existingWords: Word[];
  addWords: (words: Word[]) => Promise<void>;
  addWordsError: string;
  searchForWordError: string;
  searchForWord: (word: string) => Promise<void>;
  isSearchingForWord: boolean;

  isUpdatingWord: boolean;
  updateWordError: string;
  updatedWord: Word | null;
  updateWord: (id: number, updatedWord: Word) => Promise<void>;

  isDeletingWord: boolean;
  deleteWordError: string;
  deleteWordSuccess: string;
  deleteWord: (id: number) => Promise<void>;

  isLoadingTotal: boolean;
  total: number | null;
  fetchTotal: () => Promise<void>;
}

export const useWordStore = create<WordStore>((set, get) => ({
  // Variables
  words: [],

  isAddingWords: false,
  existingWords: [],
  addWordsError: "",

  searchForWordError: "",
  isSearchingForWord: false,

  isUpdatingWord: false,
  updateWordError: "",
  updatedWord: null,

  isDeletingWord: false,
  deleteWordError: "",
  deleteWordSuccess: "",

  isLoadingTotal: false,
  total: null,

  // Functions

  fetchTotal: async () => {
    try {
      set({ isLoadingTotal: true });
      const response = await axios.get("/words/total");
      set({ total: response.data, isLoadingTotal: false});
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      console.log("Error fetching total:", error.response.data);
      set({ isLoadingTotal: false });
    }
  },

  searchForWord: async (word: string) => {
    try {
      set({ isSearchingForWord: true });

      const response = await axios.get(`/words/search?query=${word}`);
      set({ words: response.data, searchForWordError: "" });
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      set({ searchForWordError: error.response?.data?.message || "Failed to search for words." });
    } finally {
      set({ isSearchingForWord: false });
    }

  },

  addWords: async (words: Word[]) => {
    try {
      set({ isAddingWords: true });
      const response = await axios.post("/words", words);
      toast.success("Words added successfully.");
      console.log("Words added successfully:", response.data);

      set({ existingWords: [] });
      set({ addWordsError: "" });

      // Refetch total
      get().fetchTotal();

    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      set({ addWordsError: error.response?.data?.message || "Failed to add words." });

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      if (error.response?.data?.existingWords) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        set({ existingWords: error.response.data.existingWords });
      }

    } finally {
      set({ isAddingWords: false });
    }
  },

  updateWord: async (id: number, updatedWord: Word) => {
    try {
      console.log(id);
      console.log(updatedWord);

      set({ isUpdatingWord: true, updateWordError: "" });
      const response = await axios.put(`/words/${id}`, updatedWord);
      toast.success("Word updated successfully.");
      set({ isUpdatingWord: false, updateWordError: "", updatedWord: response.data });

    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      set({ isUpdatingWord: false, updateWordError: error.response?.data || "Failed to update word.", updatedWord: null });
    }
  },

  deleteWord: async (id: number) => {
    try {
      set({ isDeletingWord: true, deleteWordError: "" });
      const response = await axios.delete(`/words/${id}`);
      set({ isDeletingWord: false, deleteWordSuccess: response.data || "Word Deleted." });

      // Refetch total
      get().fetchTotal();
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      set({ deleteWordSuccess: "", deleteWordError: error.response?.data || "Failed to delete word.", isDeletingWord: false });
    }
  }

}))