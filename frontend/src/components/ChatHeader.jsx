import React from "react";
import useMessageStore from "../lib/messageStore";
import useAuthStore from "../lib/store";

const ChatHeader = () => {
  const { selectedUser } = useMessageStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div>
      <div className="border-b  border-base-300 p-4">
        <div className="flex items-center gap-3">
          <img
            src={selectedUser?.profilePicture || "/public/user.png"}
            alt={selectedUser?.name}
            className="size-12 object-cover rounded-full"
          />
          <div>
            <div className="font-medium">{selectedUser?.fullName}</div>
            <div className="text-sm text-zinc-500">
              {onlineUsers?.includes(selectedUser._id) ? "Online" : "Offline"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
