import { create } from 'zustand';
import axios from "@/lib/axios";
import toast from "react-hot-toast";
import {Question} from "@/types/Types";

interface QuestionStore {
  isCreatingQuestion: boolean;
  createQuestionError: string;
  notFoundWords: string[];
  createQuestion: (
    lessonId: number,
    questionNumber: number,
    title: string,
    type: string,
    options: string,
    answer: string
  ) => Promise<Question | null>;
  resetNotFoundWords: () => void;
  newQuestion: Question | null;

  total: number | null;
  fetchTotal: () => Promise<void>;

  isSearchingForQuestion: boolean;
  questions: Question[];
  searchForQuestion: (query: string) => Promise<void>;

  isDeletingQuestion: boolean;
  deleteQuestionError: string;
  deleteQuestionSuccess: string;
  deleteQuestion: (id: number) => Promise<boolean>;

  isChangingQuestionNumber: boolean;
  changeQuestionNumberError: string;
  changeQuestionNumber: (id: number, questionNumber: number) => Promise<Question>;
}

export const useQuestionStore = create<QuestionStore>((set) => ({
  // Variables
  isCreatingQuestion: false,
  createQuestionError: "",
  notFoundWords: [],
  newQuestion: null,

  total: null,

  isSearchingForQuestion: false,
  questions: [],

  isDeletingQuestion: false,
  deleteQuestionError: "",
  deleteQuestionSuccess: "",

  // Functions
  searchForQuestion: async (query: string) => {
    try {
      set({ isSearchingForQuestion: true });
      const response = await axios.get(`/questions/search?query=${query}`);
      set({ questions: response.data, isSearchingForQuestion: false });
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      console.log(e.response.data || "Failed to search for questions.");
      set({ questions: [], isSearchingForQuestion: false });
    }
  },

  fetchTotal: async () => {
    try {
      const response = await axios.get("/questions/total");
      set({ total: response.data });
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      console.log(e.response.data || "Failed to fetch total.");
      set({ total: null });
    }
  },

  createQuestion: async (lessonId, questionNumber, title, type, options, answer) => {
    try {
      set({ isCreatingQuestion: true, createQuestionError: "", newQuestion: null });
      const response = await axios.post("/questions", {
        lessonId, questionNumber, title, type, options, answer
      });
      toast.success("Question created successfully.");
      console.log("Question created successfully:", response.data);
      set({ isCreatingQuestion: false, newQuestion: response.data });
      return response.data;
    } catch (e) {
      set({ isCreatingQuestion: false });

      if (e.response.data.errorType === "WORDS_NOT_FOUND" && e.response.data.notFoundWords) {
        set({ createQuestionError: e.response.data.message });
        set({ notFoundWords: e.response.data.notFoundWords });
      }

      else {
        set({ createQuestionError: e.response.data || "Failed to create question" });
      }

      return null;
    }
  },

  resetNotFoundWords: () => {
    set({ notFoundWords: [] });
  },

  deleteQuestion: async (id) => {
    try {
      set({ isDeletingQuestion: true, deleteQuestionError: "", deleteQuestionSuccess: "" });
      const response = await axios.delete(`/questions/${id}`);
      set({ deleteQuestionSuccess: response.data || "Question Deleted.", isDeletingQuestion: false });
      return true;
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      set({ isDeletingQuestion: false, deleteQuestionError: e.response?.data || "Failed to delete question.", deleteQuestionSuccess: "" });
      return false;
    }
  },

  isChangingQuestionNumber: false,
  changeQuestionNumberError: "",
  changeQuestionNumber: async (id, questionNumber) => {
    try {
      set({ isChangingQuestionNumber: true, changeQuestionNumberError: "" });
      const response = await axios.patch(`/questions/${id}/change-question-number/${questionNumber}`);
      set({ isChangingQuestionNumber: false });
      return response.data;
    } catch (e) {
      set({ isChangingQuestionNumber: false, changeQuestionNumberError: e.response.data || "Failed to change question number" });
      return null;
    }
  }
}));
