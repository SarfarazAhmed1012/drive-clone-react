import React from "react";
import "../css/DisplayContainer.css";
import axios from "axios";
import {
  Typography,
  Box,
  Button,
  CircularProgress,
  Backdrop,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

function CircularProgressWithLabel(props) {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress variant="indeterminate" {...props} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography
          variant="p"
          component="div"
          color="textSecondary"
        >{`${props.value}%`}</Typography>
      </Box>
    </Box>
  );
}

export default function FileUpload({ setSelector, user, getUser }) {
  const classes = useStyles();
  const fileInput = React.useRef(null);
  const [percentage, setPercentage] = React.useState(0);
  const [open, setOpen] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (fileInput.current.files.length === 0) {
      setOpen(false);

      return;
    }

    const formData = new FormData();
    let size = 0;

    for (let i = 0; i < fileInput.current.files.length; i++) {
      size += fileInput.current.files[i].size;

      formData.append("files", fileInput.current.files[i]);
    }

    if (user?.currentStorage + size / 1024 / 1024 / 1024 >= user?.storageLimit)
      return toast.error(
        "Uploaded files size is greater than your storage limit",
        {
          position: toast.POSITION.TOP_RIGHT,
        }
      );

    const res = await axios.post("http://localhost:5000/api/upload", formData, {
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;

        // if (percent <= 100) {
        setPercentage(Math.floor((loaded * 100) / total));
        // }
      },
      headers: {
        "x-auth-token": localStorage.getItem("token"),
      },
    });

    toast(`${res.data.message}`, {
      position: toast.POSITION.TOP_RIGHT,
    });

    if (res.data.success) {
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
      setOpen(false);
      setPercentage(0);

      getUser();
    }
    // }
  };

  return (
    <div id="displayCont">
      <ToastContainer />
      <Backdrop className={classes.backdrop} open={open}>
        <CircularProgressWithLabel
          color="primary"
          value={percentage}
          size={80}
        />
      </Backdrop>
      <div id="displayInfoNav">
        <h2 style={{ color: "#0077ef" }}>Upload Files</h2>
      </div>
      <div id="contentDisplayer">
        <form
          onSubmit={(e) => {
            setOpen(true);
            handleSubmit(e);
          }}
          style={{ display: "flex", justifyContent: "flex-start", gap: "1rem" }}
        >
          <input
            multiple
            type="file"
            ref={fileInput}
            style={{
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "8px 12px",
              backgroundColor: "white",
              color: "#333",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              outline: "none",
              width: "300px",
              cursor: "pointer",
            }}
          />
          <Button
            type="submit"
            variant="contained"
            style={{ backgroundColor: "#2a3eb1", color: "white" }}
          >
            Upload
          </Button>
        </form>
      </div>
    </div>
  );
}
