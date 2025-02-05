export interface Word {
  id?: number;
  norsk: string;
  eng: string;
  image?: string;
}

export interface Question {
  id: number;
  type: "image-choice" | "sentence-forming" | "sentence-typing";
  title: string;
  titleWords?: Word[];
  options?: Word[];
  answer: Word[];
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  level: number;
  experience: number;
  role: string;
  createdAt: string;
}

export interface Lesson {
  id: number;
  title: string;
  description: string;
  lessonNumber: number;
  experienceReward: number;
  questions?: Question[];
  createdAt: string;
}

export interface Section {
  id: number;
  title: string;
  sectionNumber: number;
  experienceReward: number;
  createdAt: string;
  lessons: Lesson[];
}

export interface UserAnswer {
  questionId: number;
  answer: Word[];
}

export interface CompletedLesson {
  id?: number;
  userId?: number;
  sectionId: number;
  lessonId: number;
}


export interface ChatMessage {
  id: number;
  userMessage: string;
  aiMessage: string;
  userId: string;
  timestamp: string;
}