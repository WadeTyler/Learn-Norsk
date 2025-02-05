import {create} from "zustand";
import axios from "@/lib/axios";
import {CompletedLesson, Lesson, UserAnswer} from "@/types/Types";

interface LessonStore {
  isCreatingLesson: boolean;
  newLesson: Lesson | null;
  createLessonError: string;
  createLesson: (title: string, description: string, lessonNumber: number, experienceReward: number, questionIds: number[]) => Promise<void>;
  isSearchingLessons: boolean;
  lessons: Lesson[];
  searchLessons: () => Promise<void>;
  searchLessonsById: (id: number) => Promise<void>;
  deleteLesson: (id: number) => Promise<void>;
  isDeletingLesson: boolean;
  deleteLessonError: string;
  deleteLessonSuccess: string;
  isLoadingTotalLessons: boolean;
  total: number | null;
  fetchTotal: () => Promise<void>;

  userAnswers: UserAnswer[];
  addToUserAnswers: (userAnswer: UserAnswer) => Promise<void>;
  resetUserAnswers: () => void;
  isCheckingAnswers: boolean;
  checkAnswers: (sectionId: number, lessonId: number) => Promise<boolean>;

  completedLessons: CompletedLesson[];
  isLoadingCompletedLessons: boolean;
  loadCompletedLessonsError: string;
  fetchCompletedLessons: () => Promise<void>;
};

export const useLessonStore = create<LessonStore>((set, get) => ({

  isCreatingLesson: false,
  newLesson: null,
  createLessonError: "",
  createLesson: async (title, description, lessonNumber, experienceReward, questionIds) => {
    try {
      set({ isCreatingLesson: true, newLesson: null, createLessonError: "" });
      const response = await axios.post("/lessons", { title, description, lessonNumber, experienceReward, questionIds });
      set({ isCreatingLesson: false, newLesson: response.data });
      get().fetchTotal();
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      set({ createLessonError: e.response?.data || "Failed to create lesson", isCreatingLesson: false });
    }
  },

  isSearchingLessons: false,
  lessons: [],
  searchLessons: async () => {
    try {
      set({ isSearchingLessons: true })
      const response = await axios.get("/lessons");
      set({ lessons: response.data });
    } catch (e) {
      set({ lessons: [] });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      console.log(e.response?.data || "Failed to search lessons.");
    } finally {
      set({ isSearchingLessons: false });
    }
  },
  searchLessonsById: async (id) => {
    try {
      set({ isSearchingLessons: true });
      const response = await axios.get(`/lessons/${id}`);
      set({ lessons: [response.data] });
    } catch (e) {
      set({ lessons: [] });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      console.log(e.response?.data || "Failed to search lessons.");
    } finally {}
    set({ isSearchingLessons: false });
  },


  isDeletingLesson: false,
  deleteLessonError: "",
  deleteLessonSuccess: "",
  deleteLesson: async (id) => {
    try {
      set({ isDeletingLesson: true, deleteLessonSuccess: "", deleteLessonError: "" });
      const response = await axios.delete(`/lessons/${id}`);
      set({ isDeletingLesson: false, deleteLessonSuccess: response.data });
      get().fetchTotal();
  } catch (e) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
    set({ isDeletingLesson: false, deleteLessonError: e.response?.data || "Failed to delete lesson" })};
  },

  isLoadingTotalLessons: false,
  total: null,
  fetchTotal: async () => {
    try {
      set({ isLoadingTotalLessons: true });
      const response = await axios.get("/lessons/total");
      set({ total: response.data, isLoadingTotalLessons: false });
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      console.log(e.response?.data || "Failed to fetch total lessons.");
      set({ total: null, isLoadingTotalLessons: false })
    }
  },

  userAnswers: [],
  addToUserAnswers: async (userAnswer) => {
    const newUserAnswers = get().userAnswers;
    newUserAnswers.push(userAnswer);
    set({ userAnswers: newUserAnswers });
  },
  resetUserAnswers: () => {
    set({ userAnswers: [] });
  },

  isCheckingAnswers: false,
  checkAnswers: async (sectionId, lessonId) => {
    try {
      set({ isCheckingAnswers: true });
      const response = await axios.post(`/sections/${sectionId}/lessons/${lessonId}/check-answers`, get().userAnswers);
      set({ isCheckingAnswers: false });
      console.log(response.data);
      return true;
    } catch (e) {
      set({ isCheckingAnswers: false });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      console.log(e.response?.data || "Failed to check answers.");
      return false;
    }
  },

  completedLessons: [],
  isLoadingCompletedLessons: false,
  loadCompletedLessonsError: "",
  fetchCompletedLessons: async () => {
    try {
      set({ isLoadingCompletedLessons: true, loadCompletedLessonsError: "" });
      const response = await axios.get("/lessons/completed");
      set({ completedLessons: response.data, isLoadingCompletedLessons: false });
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      set({ isLoadingCompletedLessons: false, loadCompletedLessonsError: e.response.data || "Failed to load completed lessons" });
    }
  },

}))