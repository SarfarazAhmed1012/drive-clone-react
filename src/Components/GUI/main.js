import Navbar from "./components/Navbar";
import SideBar from "./components/SideBar";
import DisplayContainer from "./components/DisplayContainer";
import FileUpload from "./components/fileupload";
import axios from "axios";
import FolderUpload from "./components/FolderUpload";
import CreateFolder from "./components/CreateFolder";
import Account from "./components/Account";
import Shared from "./components/Shared";
import Trash from "./components/Trash";
import "./main.css";
import React from "react";
import Starred from "./components/Starred";

function Main({ setToken }) {
  const [selector, setSelector] = React.useState({
    account: false,
    trash: false,
    shared: false,
    files: true,
    uploadFile: false,
    uploadFolder: false,
    createFolder: false,
    starred: false,
  });
  const [user, setUser] = React.useState({});
  const [search, setSearch] = React.useState("");

  const getUser = async () => {
    const res = await axios.get("http://localhost:5000/api/user", {
      headers: {
        "x-auth-token": localStorage.getItem("token"),
      },
    });

    setUser(res.data.user);
  };

  React.useEffect(() => {
    getUser();
  }, []);

  return (
    <div style={{ width: "95vw" }}>
      <Navbar
        user={user}
        getUser={getUser}
        setToken={setToken}
        selector={selector}
        setSelector={setSelector}
        setSearch={setSearch}
        search={search}
      />
      <div id="mainCont">
        <SideBar
          user={user}
          setSearch={setSearch}
          getUser={getUser}
          selector={selector}
          setSelector={setSelector}
        />
        {selector.files && (
          <DisplayContainer
            user={user}
            getUser={getUser}
            selector={selector}
            setSelector={setSelector}
            setSearch={setSearch}
            search={search}
          />
        )}
        {selector.uploadFile && (
          <FileUpload
            user={user}
            getUser={getUser}
            selector={selector}
            setSelector={setSelector}
          />
        )}
        {selector.uploadFolder && (
          <FolderUpload
            user={user}
            getUser={getUser}
            selector={selector}
            setSelector={setSelector}
          />
        )}
        {selector.createFolder && (
          <CreateFolder
            user={user}
            getUser={getUser}
            selector={selector}
            setSelector={setSelector}
          />
        )}
        {selector.account && (
          <Account
            user={user}
            getUser={getUser}
            selector={selector}
            setSelector={setSelector}
          />
        )}
        {selector.trash && (
          <Trash
            user={user}
            getUser={getUser}
            selector={selector}
            setSelector={setSelector}
            setSearch={setSearch}
            search={search}
          />
        )}
        {selector.shared && (
          <Shared
            user={user}
            getUser={getUser}
            selector={selector}
            setSelector={setSelector}
            setSearch={setSearch}
            search={search}
          />
        )}
        {selector.starred && (
          <Starred
            user={user}
            setSearch={setSearch}
            getUser={getUser}
            search={search}
            selector={selector}
            setSelector={setSelector}
          />
        )}
      </div>
    </div>
  );
}

export default Main;
