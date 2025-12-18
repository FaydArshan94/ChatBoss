import React, { useEffect } from "react";
import SideBar from "../components/SideBar";
import ChatPanel from "../components/ChatPanel";
import { useMessageStore } from "../lib/messageStore";
import NoChatSelected from "../components/NoChatSelected";
const HomePage = () => {
  const { isUsersLoading, getUsers, users, selectedUser } = useMessageStore();

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="h-[90vh] flex w-full ">
      <SideBar />

      {!selectedUser ? <NoChatSelected /> : <ChatPanel />}
    </div>
  );
};

export default HomePage;
