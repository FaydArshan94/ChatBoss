import { create } from "zustand";
import { api } from "./axios";
import toast from "react-hot-toast";
import useAuthStore from "./store";

export const useMessageStore = create((set, get) => ({
  messages: [],
  users: [],
  isMessagesLoading: false,
  isUsersLoading: false,
  selectedUser: null,

  setSelectedUser: (user) => set({ selectedUser: user }),

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const response = await api.get("/message/users");

      set({ users: response.data.users });
    } catch (error) {
      toast.error("Failed to load users");
      console.error("Error fetching users:", error);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const response = await api.get(`/message/${userId}`);
      set({ messages: response.data });
    } catch (error) {
      toast.error("Failed to load messages");
      console.error("Error fetching messages:", error);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();

    try {
      const response = await api.post(
        `/message/send/${selectedUser?._id}`,
        messageData
      );
      set({ messages: [...messages, response.data] });
    } catch (error) {
      toast.error("Failed to send message");
      console.error("Error sending message:", error);
    }
  },

  subscribeToMessages: async () => {
    const { selectedUser } = get();

    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const messageSentFromSelectedUser =
        newMessage.senderId === selectedUser._id;

      if (!messageSentFromSelectedUser) return;``

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeToMessages: async () => {
    const socket = useAuthStore.getState().socket;

    socket.off("newMessage");
  },
}));

export default useMessageStore;
