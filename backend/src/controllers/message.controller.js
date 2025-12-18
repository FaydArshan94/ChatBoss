const cloudinary = require("../lib/cloudinary");
const { getSocketReceiverId, io } = require("../lib/socket");
const messageModel = require("../models/message.model");
const userModel = require("../models/user.model");

async function getUsersForSidebar(req, res) {
  try {
    const loginUserId = req.user._id;
    const filteredUsers = await userModel
      .find({ _id: { $ne: loginUserId } })
      .select("-password");
    res.status(200).json({ users: filteredUsers });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getMessages(req, res) {
  try {
    const loginUserId = req.user._id;
    const { id: userToChatId } = req.params;

    const messages = await messageModel
      .find({
        $or: [
          { senderId: loginUserId, receiverId: userToChatId },
          { senderId: userToChatId, receiverId: loginUserId },
        ],
      })
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function sendMessage(req, res) {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!text) {
      return res
        .status(400)
        .json({ message: "Message content cannot be empty" });
    }
    let imageUrl;
    if (image) {
      const imageResponse = await cloudinary.uploader.upload(image);
      imageUrl = imageResponse.secure_url;
    }

    console.log(imageUrl);

    const newMessage = new messageModel({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const receiverSocketId = getSocketReceiverId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getUsersForSidebar,
  getMessages,
  sendMessage,
};
