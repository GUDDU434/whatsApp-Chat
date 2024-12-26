import { Avatar } from "@mui/material";
import React from "react";
import "./sidebarChat.css";

const SidebarChat = ({ name, mobile, id, setActiveContact }) => {
  const showIt = (id) => {
    setActiveContact(id);
    localStorage.setItem("contact", id);
  };

  // Generate a random seed
  const randomSeed = Math.random().toString(36).substring(7);

  // DiceBear URL with a random seed
  const imgUrl = `https://avatars.dicebear.com/api/adventurer/${randomSeed}.svg`;
  return (
    <div onClick={() => showIt(id)} className="sidebarChat">
      <Avatar src={imgUrl} />
      <div className="sidebarChat__info">
        <h2>{name}</h2>
      </div>
    </div>
  );
};

export default SidebarChat;
