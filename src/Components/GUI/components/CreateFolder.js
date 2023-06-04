import React from "react";
import "../css/DisplayContainer.css";
import axios from "axios";
import { Button, TextField } from "@material-ui/core";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function CreateFolder({ setSelector }) {
  const [disabled, setDisabled] = React.useState(false);

  const createFolder = async (e) => {
    e.preventDefault();

    const res = await axios.post(
      "http://localhost:5000/api/upload/create",
      { folderName: e.target.folderName.value },
      {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      }
    );

    setDisabled(false);
    console.log(res.data.message);
    if (res.data.message === "Folder already exists!")
      toast.error(`${res.data.message}`, {
        position: toast.POSITION.TOP_RIGHT,
      });

    if (res.data.success) {
      toast.success(`${res.data.message}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setSelector({
        account: false,
        trash: false,
        shared: false,
        files: true,
        uploadFile: false,
        uploadFolder: false,
        starred: false,
        createFolder: false,
        folderName: "",
      });
    }
  };

  return (
    <div id="displayCont">
      <ToastContainer />
      <div id="displayInfoNav">
        <h2 style={{ color: "#0077ef" }}>Create a folder</h2>
      </div>
      <div id="contentDisplayer">
        <form
          onSubmit={(e) => {
            setDisabled(true);
            createFolder(e);
          }}
          style={{ display: "flex", justifyContent: "flex-start", gap: "1rem" }}
        >
          <TextField
            name="folderName"
            placeholder="Folder Name"
            required
            style={{
              padding: "10px",
              backgroundColor: "white",
              borderRadius: "5px",
            }}
          />
          <Button
            type="submit"
            variant="contained"
            style={{ backgroundColor: "#2a3eb1", color: "white" }}
            disabled={disabled}
          >
            Create Folder
          </Button>
        </form>
      </div>
    </div>
  );
}
