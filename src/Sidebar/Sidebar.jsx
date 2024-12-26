import ChatIcon from "@mui/icons-material/Chat";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import { Avatar, IconButton, Popover, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import SidebarChat from "./SidebarChat";

import { id } from "@instantdb/react";

const Sidebar = ({ setActiveContact, db }) => {
  const { isLoading, error, data } = db.useQuery({
    contact: {},
    messages: {},
    admin_user: {},
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const [loginModel, setLoginModel] = useState(false);
  const [addContacts, setaddContacts] = useState(false);

  const [addContactsData, setaddContactsData] = useState({});
  const [loginData, setLogingData] = useState({});
  const [contacts, setContacts] = useState([]);
  const [adminUser, setAdminUser] = useState({});
  let userId = localStorage.getItem("userId");

  // Check if user logged in or not
  useEffect(() => {
    if (localStorage.getItem("userId")) {
      setLoginModel(false);
    } else {
      setLoginModel(true);
    }
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  // const id = open ? "simple-popover" : undefined;

  const handleInput = (e) => {
    const { name, value } = e.target;
    setLogingData({ ...loginData, [name]: value });
  };
  const handlecontacts = (e) => {
    const { name, value } = e.target;
    setaddContactsData({ ...addContactsData, [name]: value });
  };

  const submitContacts = (e) => {
    e.preventDefault();
    console.log(addContactsData);
    db.transact(
      db.tx.contact[id()].update({
        name: addContactsData.name,
        mobile: addContactsData.mobile,
        adminId: localStorage.getItem("userId"),
        createdAt: `${Date.now()}`,
      })
    );

    // axios
    //   .post("/contact/add", addContactsData)
    //   .then(({ data }) => {
    //     console.log(data);
    //     setAnchorEl(null);
    //     getContacts();
    //   })
    //   .catch((err) => console.log(err));
  };

  const loginSubmit = (e) => {
    e.preventDefault();
    console.log(loginData);

    let user = data?.admin_user?.filter(
      (user) => user.mobile === loginData.mobile
    );

    console.log(user);

    if (user?.length === 0) {
      alert("user not found");
    } else {
      setAdminUser(user[0]);
      localStorage.setItem("userId", user[0].mobile);
      setLoginModel(false);
    }

    // axios
    //   .get("/user/login", loginData)
    //   .then(({ data }) => {
    //     console.log(data);
    //     localStorage.setItem("userId", data._id);
    //     setAnchorEl(null);
    //   })
    //   .catch((err) => console.log(err));
  };

  useEffect(() => {
    const contact = data?.contact?.filter(
      (contact) =>
        contact.adminId === userId || contact.mobile === adminUser.mobile
    );
    setContacts(contact || []);
  }, [data, userId, adminUser]);

  // useEffect(() => {
  //   const activeContsctMessage = data?.messages?.filter(
  //     (message) => message.contactId === activeContact
  //   );
  //   setMessages(activeContsctMessage);
  // }, [activeContact, messages, data]);

  // const getContacts = () => {
  //   axios
  //     .get("/contact/recive")
  //     .then(({ data }) => {
  //       console.log(data);
  //       setContacts(data);
  //     })
  //     .catch((err) => console.log(err));
  // };

  if (isLoading) {
    return;
  }
  if (error) {
    return <div>Error querying data: {error.message}</div>;
  }

  return (
    <>
      {loginModel && (
        <div className="login">
          <div className="sidebar__loginHeader">
            <KeyboardBackspaceIcon onClick={() => setLoginModel(false)} />
            <h2>Login</h2>
          </div>
          <div className="sidebar__loginBody">
            <form onSubmit={loginSubmit}>
              <input
                type="text"
                name="mobile"
                onChange={handleInput}
                placeholder="Enter mobile Number"
              />
              <input type="submit" value={"Login"} />
            </form>
          </div>
        </div>
      )}

      {addContacts && (
        <div className="login">
          <div className="sidebar__loginHeader">
            <KeyboardBackspaceIcon onClick={() => setaddContacts(false)} />
            <h2>Add</h2>
          </div>
          <div className="sidebar__loginBody">
            <form onSubmit={submitContacts}>
              <input
                type="text"
                name="mobile"
                onChange={handlecontacts}
                placeholder="Enter mobile Number"
              />
              <input
                type="text"
                name="name"
                onChange={handlecontacts}
                placeholder="Enter name"
              />
              <input
                type="text"
                name="imgUrl"
                onChange={handlecontacts}
                placeholder="Enter image url"
              />
              <input type="submit" value={"Add"} />
            </form>
          </div>
        </div>
      )}

      <div className="sidebar">
        <div className="sidebar__header">
          <Avatar src={adminUser?.imgUrl} />
          <h2>{adminUser?.mobile}</h2>
          <div className="sidebar__headerRight">
            <IconButton>
              <DonutLargeIcon />
            </IconButton>
            <IconButton>
              <ChatIcon />
            </IconButton>
            <IconButton
              aria-describedby={id}
              variant="contained"
              onClick={handleClick}
            >
              <MoreVertIcon />
            </IconButton>
            {/* ----------------------------------------- */}
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              <Typography
                sx={{ p: 2 }}
                onClick={() => {
                  setaddContacts(true);
                  setAnchorEl(null);
                }}
              >
                Add contacts
              </Typography>
              <Typography sx={{ p: 2 }}>Archived</Typography>
              <Typography sx={{ p: 2 }}>Stared message</Typography>
              <Typography sx={{ p: 2 }}>Setting</Typography>
              {!userId ? (
                <Typography
                  sx={{ p: 2 }}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setLoginModel(true);
                    setAnchorEl(null);
                  }}
                >
                  Login
                </Typography>
              ) : (
                <Typography
                  sx={{ p: 2 }}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setAnchorEl(null);
                    localStorage.removeItem("userId");
                    setActiveContact(null);
                    setAdminUser({});
                  }}
                >
                  Logout
                </Typography>
              )}
            </Popover>
            {/* ----------------------------------------- */}
          </div>
        </div>
        <div className="sidebar__search">
          <div className="sidebar__searchContainer">
            <SearchIcon />
            <input />
          </div>
        </div>
        <div className="sidebar__chats">
          {contacts.map((elem) => (
            <SidebarChat
              key={elem.id}
              {...elem}
              setActiveContact={setActiveContact}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
