import React from "react";
import "../css/DisplayContainer.css";
import axios from "axios";
import {
  Typography,
  Divider,
  ImageListItem,
  IconButton,
  ImageListItemBar,
  ListItem,
  ListItemIcon,
  ListItemText,
  List,
  ImageList,
  Card,
  CardActionArea,
  CardContent,
} from "@material-ui/core";
import { DeleteOutlined, Cached, Delete } from "@material-ui/icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Trash({ user, getUser, search }) {
  const [files, setFiles] = React.useState([]);
  const [folders, setFolders] = React.useState([]);

  const getFilesOrFolders = async () => {
    let temp = user.folderPath.split("\\");

    temp.splice(temp.length - 1, 0, "trash");

    const customPath = temp.join("\\");
    const res = await axios.get(
      `http://localhost:5000/api/upload?customPath=${customPath}&search=${search}`,
      {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      }
    );

    if (res.data.success) {
      setFolders(res.data.folders);
      setFiles(res.data.files);
    }
  };

  React.useEffect(() => {
    getFilesOrFolders();
  }, [search]);

  const recoverFile = async (name) => {
    let temp = user.folderPath.split("\\");

    temp.splice(temp.length - 1, 0, "trash");

    const newPath = user.folderPath + "\\" + name;
    const oldPath = temp.join("\\") + "\\" + name;
    const res = await axios.post(
      "http://localhost:5000/api/upload/recover",
      { oldPath, newPath },
      {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      }
    );

    toast(`${res.data.message}`, {
      position: toast.POSITION.TOP_RIGHT,
    });

    if (res.data.success) {
      getUser();
      getFilesOrFolders();
    }
  };

  const deleteFile = async (fileNameWithExt, folder) => {
    let temp = user.folderPath.split("\\");

    temp.splice(temp.length - 1, 0, "trash");

    const customPath = temp.join("\\") + "\\" + fileNameWithExt;
    const res = await axios.post(
      "http://localhost:5000/api/upload/delete",
      { folder, customPath },
      {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      }
    );

    toast(`${res.data.message}`, {
      position: toast.POSITION.TOP_RIGHT,
    });

    if (res.data.success) {
      getUser();
      getFilesOrFolders();
    }
  };

  return (
    <div>
      <ToastContainer />
      <div id="displayInfoNav">
        <h2 style={{ color: "#0077ef" }}>Folders</h2>
      </div>
      <div id="contentDisplayer">
        {folders?.length > 0 ? (
          folders.map((item) => (
            <Card
              style={{ maxHeight: "80px", maxWidth: "300px", margin: "10px" }}
            >
              <CardActionArea>
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="h2"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>{item.folderName}</span>
                    <span>
                      <IconButton onClick={() => recoverFile(item.folderName)}>
                        <Cached />
                      </IconButton>
                      <IconButton
                        onClick={() => deleteFile(item.folderName, true)}
                      >
                        <Delete />
                      </IconButton>
                    </span>
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))
        ) : (
          <Typography variant="h6" style={{ textAlign: "center" }}>
            No Folders Found!
          </Typography>
        )}
      </div>
      <div id="displayInfoNav">
        <h2 style={{ color: "#0077ef" }}>Files</h2>
      </div>
      <div id="contentDisplayer">
        {files?.length > 0 ? (
          <>
            <Typography variant="h6">Images</Typography>
            <ImageList
              style={{
                marginBottom: "50px",
                marginTop: "50px",
              }}
              rowHeight={164}
            >
              {files.map(
                (item, key) =>
                  item.mimeType &&
                  item.mimeType.split("/")[0] === "image" && (
                    <ImageListItem key={key}>
                      <img
                        src={`data:${item.mimeType};base64,${item.file}`}
                        alt="image"
                        loading="lazy"
                      />
                      <ImageListItemBar
                        title={
                          <Typography
                            variant="body1"
                            style={{ color: "white" }}
                          >
                            {item.fileName}
                          </Typography>
                        }
                        actionIcon={
                          <div style={{ display: "flex" }}>
                            <IconButton
                              color="primary"
                              onClick={() => recoverFile(item.fileNameWithExt)}
                            >
                              <Cached />
                            </IconButton>
                            <IconButton
                              color="primary"
                              onClick={() =>
                                deleteFile(item.fileNameWithExt, false)
                              }
                            >
                              <DeleteOutlined />
                            </IconButton>
                          </div>
                        }
                      />
                    </ImageListItem>
                  )
              )}
            </ImageList>
            <Divider />
            <br />
            <Typography variant="h6">Videos</Typography>
            <ImageList
              style={{
                marginBottom: "50px",
                marginTop: "50px",
              }}
              rowHeight={164}
            >
              {files.map(
                (item, key) =>
                  item.mimeType &&
                  item.mimeType.split("/")[0] === "video" && (
                    <ImageListItem key={key}>
                      <video controls>
                        <source
                          type={item.mimeType}
                          src={`data:${item.mimeType};base64,${item.file}`}
                        />
                      </video>
                      <ImageListItemBar
                        title={
                          <Typography
                            variant="body1"
                            style={{ color: "white" }}
                          >
                            {item.fileName}
                          </Typography>
                        }
                        actionIcon={
                          <>
                            <IconButton
                              color="primary"
                              onClick={() => recoverFile(item.fileNameWithExt)}
                            >
                              <Cached />
                            </IconButton>
                            <IconButton
                              color="primary"
                              onClick={() =>
                                deleteFile(item.fileNameWithExt, false)
                              }
                            >
                              <DeleteOutlined />
                            </IconButton>
                          </>
                        }
                      />
                    </ImageListItem>
                  )
              )}
            </ImageList>
            <Divider />
            <br />
            <Typography variant="h6">Audios</Typography>
            <ImageList
              style={{
                marginBottom: "50px",
                marginTop: "50px",
              }}
              rowHeight={164}
            >
              {files.map(
                (item, key) =>
                  item.mimeType &&
                  item.mimeType.split("/")[0] === "audio" && (
                    <ImageListItem key={key}>
                      <audio
                        controls
                        src={`data:${item.mimeType};base64,${item.file}`}
                      />
                      <ImageListItemBar
                        title={
                          <Typography
                            variant="body1"
                            style={{ color: "white" }}
                          >
                            {item.fileName}
                          </Typography>
                        }
                        actionIcon={
                          <>
                            <IconButton
                              color="primary"
                              onClick={() => recoverFile(item.fileNameWithExt)}
                            >
                              <Cached />
                            </IconButton>
                            <IconButton
                              color="primary"
                              onClick={() =>
                                deleteFile(item.fileNameWithExt, false)
                              }
                            >
                              <DeleteOutlined />
                            </IconButton>
                          </>
                        }
                      />
                    </ImageListItem>
                  )
              )}
            </ImageList>
            <Divider />
            <br />
            <Typography variant="h6">Documents</Typography>
            <div
              style={{
                marginBottom: "50px",
                marginTop: "50px",
              }}
            >
              {files.map(
                (item, key) =>
                  item.mimeType &&
                  (item.mimeType.split("/")[0] === "application" ||
                    item.mimeType.split("/")[0] === "text") && (
                    <List
                      sx={{
                        width: "100%",
                        bgcolor: "background.paper",
                      }}
                    >
                      <ListItem alignItems="flex-start">
                        <ListItemText primary={item.fileName} />
                        <ListItemIcon>
                          <IconButton
                            color="primary"
                            onClick={() => recoverFile(item.fileNameWithExt)}
                          >
                            <Cached />
                          </IconButton>
                          <IconButton
                            color="primary"
                            onClick={() =>
                              deleteFile(item.fileNameWithExt, false)
                            }
                          >
                            <DeleteOutlined />
                          </IconButton>
                        </ListItemIcon>
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </List>
                  )
              )}
            </div>
          </>
        ) : (
          <Typography variant="h6" style={{ textAlign: "center" }}>
            No Files Found!
          </Typography>
        )}
      </div>
    </div>
  );
}
