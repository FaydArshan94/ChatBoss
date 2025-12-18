import { create } from "zustand";
import { api } from "./axios.jsx";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:5000";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  updatingProfile: false,
  onlineUsers: [],
  isCheckingAuth: true,

  socket: null,

  checkAuth: async () => {
    try {
      const res = await api.get("/auth/me");
      set({ authUser: res.data.user });
      get().connectSocket();
    } catch (error) {
      console.error("Error checking auth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp: async (data) => {
    try {
      const res = await api.post("/auth/register", data);
      set({ authUser: res.data.user });
      get().connectSocket();
    } catch (error) {
      console.error("Error signing up:", error);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await api.post("/auth/login", data);
      set({ authUser: res.data.user });
      get().connectSocket();
    } catch (error) {
      console.error("Error logging in:", error);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
      set({ authUser: null });
      get().disconnectSocket();
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      await api.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile picture updated");
    } catch (error) {
      console.log(error.response.statusText);
      toast.error(error.response.statusText);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));

export default useAuthStore;
