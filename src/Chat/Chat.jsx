import { id } from "@instantdb/react";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import SendIcon from "@mui/icons-material/Send";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import TagFacesIcon from "@mui/icons-material/TagFaces";
import { Avatar, IconButton } from "@mui/material";
import Picker from "emoji-picker-react";
import React, { useEffect, useState } from "react";
import "./Chat.css";

function Chat({ db, activeContact }) {
  const { data } = db.useQuery({ contact: {}, messages: {}, admin_user: {} });
  const [message, setMessage] = useState([]);
  const [contactDetails, setcontactDetails] = useState(null);
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [openEmogi, setEmogiOpen] = useState(false);
  const [input, setInput] = useState("");

  let userId = localStorage.getItem("userId");

  const openEmogiModel = () => {
    setEmogiOpen(!openEmogi);
  };

  const onEmojiClick = (event, emojiObject) => {
    console.log(emojiObject);
    setChosenEmoji(emojiObject);
    setInput((emojiObject.emoji += input));
  };

  useEffect(() => {
    const activeMessage = data?.messages.filter(
      (msg) => msg.contactId === activeContact || message.contactId === userId
    );
    const activeContactDetails = data?.contact.filter(
      (contact) => contact.id === activeContact
    )[0];
    setMessage(activeMessage || []);
    setcontactDetails(activeContactDetails);
  }, [activeContact, data]);

  // useEffect(() => {
  //   contact = JSON.parse(localStorage.getItem("contact"));

  //   if (contact) {
  //     console.log("getting data");
  //     axios
  //       .get(`/message/sync/${contact._id}`)
  //       .then(({ data }) => {
  //         console.log(data);
  //         setMessage(data);
  //       })
  //       .catch((err) => console.log(err));
  //   }
  // }, []);

  // useEffect(() => {
  //   var pusher = new Pusher("378a25a927c5164b685d", {
  //     cluster: "ap2",
  //   });

  //   var channel = pusher.subscribe("message");
  //   channel.bind("inserted", (newMessage) => {
  //     // alert(JSON.stringify(newMessage));
  //     setMessage([...message, newMessage]);
  //   });

  //   return () => {
  //     channel.unbind_all();
  //     channel.unsubscribe();
  //   };
  // }, [message]);

  const sendMessage = async (e) => {
    e.preventDefault();

    db.transact(
      db.tx.messages[id()].update({
        message: input,
        timestamp: Date.now(),
        status: "sent",
        contactId: activeContact,
        recieved: false,
        senderId: userId,
      })
    );

    setInput("");
  };

  if (activeContact === null) {
    return (
      <div className="chat">
        <div className="chat__header">No Active Contact</div>
      </div>
    );
  }

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar src={contactDetails?.imgUrl} />
        <div className="chat__headerInfo">
          <h3>{contactDetails?.name}</h3>
        </div>

        <div className="chat__headerRight">
          <IconButton>
            <SearchIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>

      <div className="chat__body">
        {message?.map((message) => (
          <p
            key={message?.id}
            className={`chat_message ${
              message?.senderId === userId && "chat__reciver"
            }`}
          >
            {message?.message}
            <span className="chat__timestamp">
              {new Date(message?.timestamp).toLocaleString()}
            </span>
          </p>
        ))}
      </div>

      {openEmogi && (
        <div className="chat__emogi">
          {chosenEmoji ? (
            <span>You chose: {chosenEmoji.emoji}</span>
          ) : (
            <span>No emoji Chosen</span>
          )}
          <Picker onEmojiClick={onEmojiClick} />
        </div>
      )}

      <div className="chat__footer">
        <IconButton onClick={openEmogiModel}>
          <TagFacesIcon />
        </IconButton>
        <IconButton>
          <AttachFileIcon />
        </IconButton>
        <form action="">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a Message"
          />
          <IconButton>
            <SendIcon onClick={sendMessage} type="submit" />
          </IconButton>
        </form>

        <IconButton>
          <KeyboardVoiceIcon />
        </IconButton>
      </div>
    </div>
  );
}

export default Chat;
