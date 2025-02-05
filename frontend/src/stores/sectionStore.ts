import {create} from "zustand";
import axios from "@/lib/axios";
import {Question, Section} from "@/types/Types";
import {QuestionQueue} from "@/lib/QuestionQueue";

interface SectionStore {

  total: null | number;
  fetchTotal: () => Promise<void>;

  sections: Section[];
  isSearchingSections: boolean;
  searchSectionsById: (id: number) => Promise<void>;
  getAllSections: () => Promise<void>;

  newSection: Section | null;
  isCreatingSection: boolean;
  createSectionError: string;
  createSection: (title: string, sectionNumber: number, experienceReward: number, lessonIds: number[]) => Promise<void>;

  isDeletingSection: boolean;
  deleteSectionSuccess: string;
  deleteSectionError: string;
  deleteSection: (id: number) => Promise<void>;

  questions: QuestionQueue;
  currentQuestion: Question | null;
  questionsLength: number;
  isLoadingQuestions: boolean;
  fetchQuestionsError: string;
  setFetchQuestionsError: (message: string) => void;
  fetchQuestions: (sectionId: number, lessonId: number) => Promise<void>;

  handleIncorrectQuestion: (question: Question) => void;
  handleNextQuestion: () => void;
}

export const useSectionStore = create<SectionStore>((set, get) => ({
  sections: [],

  total: null,
  fetchTotal: async () => {
    try {
      const response = await axios.get("/sections/total");
      set({total: response.data});
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      console.log(e.response?.data || "Failed to fetch total sections");
    }
  },

  isSearchingSections: false,
  searchSectionsById: async (id) => {
    try {
      const response = await axios.get(`/sections/${id}`);
      set({sections: [response.data]});
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      console.log(e.response?.data || "Section not found");
      set({sections: []});
    }
  },

  getAllSections: async () => {
    try {
      set({isSearchingSections: true});
      const response = await axios.get("/sections");
      set({sections: response.data, isSearchingSections: false});
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      console.log(e.response?.data || "Failed to get all sections");
      set({sections: [], isSearchingSections: false});
    }
  },


  newSection: null,
  isCreatingSection: false,
  createSectionError: "",
  createSection: async (title, sectionNumber, experienceReward, lessonIds) => {
    try {
      set({isCreatingSection: true, newSection: null});
      const response = await axios.post("/sections", {title, sectionNumber, experienceReward, lessonIds});
      set({newSection: response.data, isCreatingSection: false});
      get().fetchTotal();
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      set({createSectionError: e.response?.data || "Failed to create section", isCreatingSection: false});
    }
  },

  isDeletingSection: false,
  deleteSectionError: "",
  deleteSectionSuccess: "",

  deleteSection: async (id) => {
    try {
      set({isDeletingSection: true, deleteSectionError: "", deleteSectionSuccess: ""});
      const response = await axios.delete(`/sections/${id}`);
      set({deleteSectionSuccess: response.data, isDeletingSection: false});
      get().fetchTotal();
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      set({deleteSectionError: e.response?.data || "Failed to delete section", isDeletingSection: false});
    }
  },

  questions: new QuestionQueue(),
  currentQuestion: null,
  questionsLength: 0,
  isLoadingQuestions: true,
  fetchQuestionsError: "",
  setFetchQuestionsError: (message) => {
    set({fetchQuestionsError: message, isLoadingQuestions: false});
  },
  // Load questions in the lesson, in the section
  fetchQuestions: async (sectionId, lessonId) => {
    try {
      set({questions: new QuestionQueue(), isLoadingQuestions: true, fetchQuestionsError: ""});
      const response = await axios.get(`/sections/${sectionId}/lessons/${lessonId}/questions`);
      const queue = convertQuestionsToQueue(response.data);
      const firstQuestion = queue.dequeue();

      console.log(response.data);
      set({
        currentQuestion: firstQuestion,
        questions: queue,
        questionsLength: response.data.length,
        isLoadingQuestions: false
      });

    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      set({fetchQuestionsError: e.response?.data || "Failed to load questions.", isLoadingQuestions: false});
    }
  },

  // add question back to end of queue
  handleIncorrectQuestion: (question: Question) => {
    const questions = get().questions;
    questions.enqueue(question);
    set({questions: questions});
  },

  // sets current question to the next
  handleNextQuestion: () => {
    const questions = get().questions;
    const nextQuestion = questions.dequeue();
    set({currentQuestion: nextQuestion, questions: questions});
  },

}));

// Convert to queue and return queue
function convertQuestionsToQueue(arr: Question[]): QuestionQueue {
  const queue = new QuestionQueue();
  for (let i = 0; i < arr.length; i++) {
    queue.enqueue(arr[i]);
  }
  return queue;
}
