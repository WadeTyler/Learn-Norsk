import axios from "@/lib/axios";
import {create} from "zustand";
import {AdminDashboardData} from "@/types/Types";
import toast from "react-hot-toast";

interface AdminStore {
  isLoadingAdminDashboardData: boolean;
  getAdminDashboardData: () => Promise<AdminDashboardData>;
}

export const useAdminStore = create<AdminStore>((set) => ({

  isLoadingAdminDashboardData: false,
  getAdminDashboardData: async () => {
    try {
      set({ isLoadingAdminDashboardData: true });
      const response = await axios.get("/admin/dashboard");
      set({ isLoadingAdminDashboardData: false });
      return response.data;
    } catch (e) {
      set({ isLoadingAdminDashboardData: false });
      toast.error("Failed to load dashboard data.");
      return null;
    }
  }

}));