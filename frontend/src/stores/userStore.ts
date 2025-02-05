import { create } from 'zustand';
import axios from "@/lib/axios";
import {User} from "@/types/Types";
import toast from "react-hot-toast";

interface UserStore {
  user: User | null;
  isLoadingUser: boolean;
  fetchUser: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  isLoggingIn: boolean;
  loginError: string;
  signup: (firstName: string, lastName: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  isSigningUp: boolean;
  signupError: string;
  logout: () => Promise<void>;
  isLoggingOut: boolean
}

export const useUserStore = create<UserStore>((set) => ({
  // Load User
  user: null,
  isLoadingUser: true,
  fetchUser: async () => {
    try {
      set({ isLoadingUser: true });
      const response = await axios.get("/auth/me");
      set({ user: response.data, isLoadingUser: false });
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      console.log(e.response?.data || "Failed to fetch user.");
      set({ isLoadingUser: false, user: null });
    }
  },

  // Login
  isLoggingIn: false,
  loginError: "",
  login: async (email, password) => {
    try {
      set({ isLoggingIn: true, loginError: "" });
      const response = await axios.post("/auth/login", { email, password });
      set({ user: response.data, isLoggingIn: false });
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      set({ loginError: e.response?.data || "Failed to login.", isLoggingIn: false, user: null });
    }
  },

  // Signup
  isSigningUp: false,
  signupError: "",
  signup: async (firstName, lastName, email, password, confirmPassword) => {
    try {
      set({ isSigningUp: true, signupError: "" });
      const response = await axios.post("/auth/signup", { firstName, lastName, email, password, confirmPassword });
      set({ user: response.data, isSigningUp: false });
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      set({ signupError: e.response?.data || "Failed to signup.", isSigningUp: false, user: null });
    }
  },

  // Logout
  isLoggingOut: false,
  logout: async () => {
    try {
      set({ isLoggingOut: true });
      await axios.delete("/auth/logout");
      set({ user: null, isLoggingOut: false });
    } catch (e) {
      set({ isLoggingOut: false });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      toast.error(e.response?.data || "Something went wrong");
    }
  }

}));