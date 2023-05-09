const User = require("../models/users");
const Chat = require("../models/chats");
const { Op } = require("sequelize");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

exports.postChat = async (req, res) => {
  try {
    const user = req.user;
    const message = req.body.message;
    console.log(message);
    const groupId = req.query.groupId;
    console.log("======>" + groupId + user);

    await user.createChat({ chat: message, groupId: groupId });
    res.status(200).json({ success: true });
  } catch (err) {
    console.log("--------->" + err.message);
    res.status(403).json({ message: "failed " });
  }
};

exports.getChats = async (req, res) => {
  try {
    const user = req.user;
    const lastMessageId = req.query.lastmessageid;
    const groupId = req.query.groupid;
    const chats = await Chat.findAll({
      include: [
        {
          model: User,
          attributes: ["name", "id"],
        },
      ],
      attributes: ["chat", "id"],
      where: {
        id: {
          [Op.gt]: lastMessageId,
        },
        groupId: groupId,
      },
    });
    res.status(200).json(chats);
  } catch (err) {
    console.log("--------->" + err.message);
  }
};




