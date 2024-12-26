import { useState } from "react";
import "./App.css";
import Chat from "./Chat/Chat";
import Sidebar from "./Sidebar/Sidebar";
import { i, init } from "@instantdb/react";

const schema = i.schema({
  entities: {
    admin_user: i.entity({
      name: i.string(),
      mobile: i.string(),
    }),
    contact: i.entity({
      name: i.string(),
      mobile: i.boolean(),
      createdAt: i.number(),
    }),
    messages: i.entity({
      senderId: i.string(),
      message: i.string(),
      timestamp: i.string(),
      status: i.string(),
      contactId: i.string(),
      recieved: i.boolean(),
    }),
  },
});

const db = init({ appId: process.env.REACT_APP_API, schema });

function App() {
  const [activeContact, setActiveContact] = useState(null);
  return (
    <div className="app">
      <div className="app__body">
        <Sidebar setActiveContact={setActiveContact} db={db} />
        <Chat activeContact={activeContact} db={db} />
      </div>
    </div>
  );
}

export default App;
