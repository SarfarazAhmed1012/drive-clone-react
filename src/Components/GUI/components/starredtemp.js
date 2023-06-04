import React, { useState } from "react";
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
  Button,
  Card,
  CardActionArea,
  CardContent,
  DialogTitle,
  DialogContent,
  Checkbox,
  DialogActions,
  Dialog,
  Breadcrumbs,
  Link,
} from "@material-ui/core";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { MoreVert } from "@material-ui/icons";
import {
  Info,
  InfoOutlined,
  GetAppOutlined,
  Visibility,
  Star,
} from "@material-ui/icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Starred({ user, search, selector, setSelector }) {
  const [files, setFiles] = React.useState([]);
  const [folders, setFolders] = React.useState([]);
  const [selectedFolder, setSelectedFolder] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [itemDetails, setItemDetails] = React.useState({});
  const [downloadFiles, setDownloadFiles] = React.useState([]);
  const [downloadFileNames, setDownloadFileNames] = React.useState([]);
  const [select, setSelect] = React.useState(false);

  const handleClickOpen = (item) => {
    setOpen(true);
    setItemDetails(item);
  };

  const handleClose = () => {
    setOpen(false);
    setItemDetails({});
  };

  const saveFileBinary = (e, binary, name) => {
    if (e.target.checked) {
      setDownloadFiles((prev) => prev.concat(binary));
      setDownloadFileNames((prev) => prev.concat(name));
    } else {
      setDownloadFiles((prev) => {
        let index = prev.indexOf(binary);
        let temp = [...prev];

        temp.splice(index, 1);

        return temp;
      });
      setDownloadFileNames((prev) => {
        let index = prev.indexOf(name);
        let temp = [...prev];

        temp.splice(index, 1);

        return temp;
      });
    }
  };

  const selectFolder = (folderName, index) => {
    if (folderName && !index) {
      setSelectedFolder((prev) => prev + "/" + folderName);

      getFilesOrFolders(
        selectedFolder ? selectedFolder + "/" + folderName : folderName
      );
    } else if (folderName && index) {
      let temp = selectedFolder.split("/");

      temp.splice(index + 1, temp.length - index - 1);
      temp = temp.join("/");

      setSelectedFolder(temp);
      getFilesOrFolders(temp);
    } else {
      getFilesOrFolders();
    }
  };

  const getFilesOrFolders = async (folderName) => {
    const temp = user.folderPath.split("\\");

    temp.splice(temp.length - 1, 0, "starred");

    const customPath = temp.join("\\");

    if (folderName) {
      const res = await axios.get(
        `http://localhost:5000/api/upload?customPath=${customPath}&folderName=${folderName}&search=${search}&userId=${user._id}`,
        {
          headers: {
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      );

      setFolders(res.data.folders);
      setFiles(res.data.files);
      setSelector({ ...selector, folderName });
    } else {
      const res = await axios.get(
        `http://localhost:5000/api/upload?customPath=${customPath}&search=${search}&userId=${user._id}`,
        {
          headers: {
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      );

      setFolders(res.data.folders);
      setFiles(res.data.files);
      setSelector({ ...selector, folderName: "" });
      setSelectedFolder("");
    }
  };

  React.useEffect(() => {
    getFilesOrFolders(selectedFolder);
  }, [search]);

  const removeFromStarred = async (customPath) => {
    const res = await axios.post(
      "http://localhost:5000/api/upload/unstare",
      { customPath },
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
      getFilesOrFolders();
    }
  };

  const downloadMultipleFiles = () => {
    const link = document.createElement("a");

    link.style.display = "none";

    document.body.appendChild(link);

    for (let i = 0; i < downloadFileNames.length; i++) {
      link.setAttribute("download", downloadFileNames[i]);
      link.setAttribute("href", downloadFiles[i]);
      link.click();
    }

    document.body.removeChild(link);

    setSelect(false);
    setDownloadFileNames([]);
    setDownloadFiles([]);
  };

  const ITEM_HEIGHT = 48;
  const [activeIndex, setActiveIndex] = useState(null);

  const handleClick = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div>
      <ToastContainer />
      <Breadcrumbs aria-label="breadcrumb">
        {selectedFolder.split("/").map((item, index) =>
          index === selectedFolder.split("/").length - 1 ? (
            <Typography color="textPrimary">
              {item ? item : "My Drive"}
            </Typography>
          ) : (
            <Link
              style={{ cursor: "pointer" }}
              color="inherit"
              onClick={() => selectFolder(item, index)}
            >
              {item ? item : "My Drive"}
            </Link>
          )
        )}
      </Breadcrumbs>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title-2"
      >
        <DialogTitle id="form-dialog-title-2">
          {itemDetails.isFolder ? "Folder details" : "File details"}
        </DialogTitle>
        <DialogContent>
          {itemDetails.isFolder ? (
            <Typography variant="p">
              <b>Folder size (MB):</b>{" "}
              {(itemDetails.size / 1024 / 1024).toFixed(2)}
              <br />
              <b>Folder name:</b> {itemDetails.folderName}
              <br />
              <b>Folder location:</b> {itemDetails.location}
              <br />
              <b>Created at:</b> {itemDetails.createdAt}
              <br />
              <b>Updated at:</b> {itemDetails.updatedAt}
            </Typography>
          ) : (
            <Typography variant="p">
              <b>File size (MB):</b>
              {(itemDetails.size / 1024 / 1024).toFixed(2)}
              <br />
              <b>File type:</b> {itemDetails.mimeType}
              <br />
              <b>File location:</b> {itemDetails.location}
              <br />
              <b>File name:</b> {itemDetails.fileNameWithExt}
              <br />
              <b>Created at:</b> {itemDetails.createdAt}
              <br />
              <b>Updated at:</b> {itemDetails.updatedAt}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <div id="displayInfoNav">
        <h2 style={{ color: "#0077ef" }}>Folders</h2>
        {selectedFolder ? (
          <>
            {downloadFiles.length > 0 && (
              <Button
                onClick={downloadMultipleFiles}
                variant="contained"
                style={{ backgroundColor: "#2a3eb1", color: "white" }}
              >
                download multiple
              </Button>
            )}
            <Button
              variant="outlined"
              onClick={() => setSelect((prev) => !prev)}
            >
              {select ? "Deselect" : "Select"}
            </Button>
            <Button
              onClick={() => getFilesOrFolders()}
              variant="contained"
              style={{ backgroundColor: "#2a3eb1", color: "white" }}
            >
              back to root folder
            </Button>
          </>
        ) : (
          <>
            {downloadFiles.length > 0 && (
              <Button
                onClick={downloadMultipleFiles}
                variant="contained"
                style={{ backgroundColor: "#2a3eb1", color: "white" }}
              >
                download multiple
              </Button>
            )}
            <Button
              onClick={() => setSelect((prev) => !prev)}
              variant="contained"
              style={{
                backgroundColor: "#2a3eb1",
                color: "white",
                marginRight: "10vh",
              }}
            >
              {select ? "Deselect" : "Select"}
            </Button>
          </>
        )}
      </div>
      <div id="contentDisplayer" style={{ display: "flex", flexWrap: "wrap" }}>
        {folders?.length > 0 ? (
          folders.map((item, index) => (
            <>
              {/* &nbsp;
              {select && <Checkbox color='primary' />} */}
              <Card
                style={{
                  maxHeight: "80px",
                  margin: "10px",
                  width: "500px",
                  position: "relative",
                }}
              >
                <CardActionArea>
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="h2"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span>{item.folderName}</span>
                      {/* <span style={{ display: "flex", gap: "2px" }}> */}
                      {/* <IconButton
                          onClick={() =>
                            handleClickOpen({ ...item, isFolder: true })
                          }
                          style={{
                            color: "primary",
                            backgroundColor: "#dee6f2",
                          }}
                        >
                          <Info />
                        </IconButton>
                        {!selectedFolder && (
                          <IconButton
                            onClick={() => removeFromStarred(item.location)}
                            style={{
                              color: "primary",
                              backgroundColor: "#dee6f2",
                            }}
                          >
                            <Star />
                          </IconButton>
                        )}
                        <IconButton
                          onClick={() => selectFolder(item.folderName)}
                          style={{
                            color: "primary",
                            backgroundColor: "#dee6f2",
                          }}
                        >
                          <Visibility />
                        </IconButton> */}
                      <div>
                        <IconButton
                          aria-label="more"
                          id="long-button"
                          aria-controls="long-menu"
                          aria-haspopup="true"
                          onClick={() => handleClick(index)}
                        >
                          <MoreVert />
                        </IconButton>
                      </div>
                      {/* </span> */}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                {activeIndex === index ? (
                  <div
                    style={{
                      zIndex: "99999",
                      display: "flex",
                      position: "absolute",
                      top: "1.2rem",
                      right: "3rem",
                    }}
                  >
                    {!selectedFolder && (
                      <IconButton
                        onClick={() => removeFromStarred(item.location)}
                        style={{
                          color: "primary",
                          backgroundColor: "#dee6f2",
                        }}
                      >
                        <Star />
                      </IconButton>
                    )}
                    <IconButton
                      onClick={() => selectFolder(item.folderName)}
                      style={{
                        color: "primary",
                        backgroundColor: "#dee6f2",
                      }}
                    >
                      <Visibility />
                    </IconButton>
                  </div>
                ) : null}
              </Card>
            </>
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
                display: "flex",
                flexWrap: "wrap",
              }}
              rowHeight={164}
            >
              {files.map(
                (item, key) =>
                  item.mimeType &&
                  item.mimeType.split("/")[0] === "image" && (
                    <ImageListItem
                      key={key}
                      style={{ width: "500px", height: "300px" }}
                    >
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
                              style={{ color: "white" }}
                              onClick={() => handleClick(key)}
                            >
                              <MoreVert />
                            </IconButton>
                            {activeIndex === key && (
                              <div
                                style={{
                                  zIndex: "99999",
                                  display: "flex",
                                  position: "absolute",
                                  gap: "10px",
                                  top: "0.5rem",
                                  right: "3rem",
                                  backgroundColor: "white",
                                  height: "5vh",
                                  borderRadius: "10px",
                                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                }}
                              >
                                {!selectedFolder && (
                                  <IconButton
                                    onClick={() =>
                                      removeFromStarred(item.location)
                                    }
                                    style={{
                                      color: "black",
                                    }}
                                  >
                                    <Star />
                                  </IconButton>
                                )}
                                <a
                                  style={{
                                    textDecoration: "none",
                                  }}
                                  download={item.fileNameWithExt}
                                  href={`data:${item.mimeType};base64,${item.file}`}
                                >
                                  <IconButton style={{ color: "black" }}>
                                    <GetAppOutlined />
                                  </IconButton>
                                </a>
                              </div>
                            )}
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
                display: "flex",
                flexWrap: "wrap",
              }}
              rowHeight={164}
            >
              {files.map(
                (item, key) =>
                  item.mimeType &&
                  item.mimeType.split("/")[0] === "video" && (
                    <>
                      &nbsp;
                      {select && (
                        <Checkbox
                          color="primary"
                          onChange={(e) =>
                            saveFileBinary(
                              e,
                              `data:${item.mimeType};base64,${item.file}`,
                              item.fileNameWithExt
                            )
                          }
                        />
                      )}
                      <ImageListItem
                        key={key}
                        style={{ width: "500px", height: "300px" }}
                      >
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
                                style={{ color: "white" }}
                                onClick={() =>
                                  handleClickOpen({ ...item, isFolder: false })
                                }
                              >
                                <InfoOutlined />
                              </IconButton>
                              <IconButton
                                style={{ color: "lightblue" }}
                                onClick={() => removeFromStarred(item.location)}
                              >
                                <Star />
                              </IconButton>
                            </>
                          }
                        />
                      </ImageListItem>
                    </>
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
                display: "flex",
                flexWrap: "wrap",
              }}
              rowHeight={164}
            >
              {files.map(
                (item, key) =>
                  item.mimeType &&
                  item.mimeType.split("/")[0] === "audio" && (
                    <>
                      &nbsp;
                      {select && (
                        <Checkbox
                          color="primary"
                          onChange={(e) =>
                            saveFileBinary(
                              e,
                              `data:${item.mimeType};base64,${item.file}`,
                              item.fileNameWithExt
                            )
                          }
                        />
                      )}
                      <ImageListItem
                        key={key}
                        style={{ width: "500px", height: "100px" }}
                      >
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
                                style={{ color: "lightblue" }}
                                onClick={() => removeFromStarred(item.location)}
                              >
                                <Star />
                              </IconButton>
                              <IconButton
                                style={{
                                  color: "white",
                                }}
                                onClick={() =>
                                  handleClickOpen({ ...item, isFolder: false })
                                }
                              >
                                <InfoOutlined />
                              </IconButton>
                            </>
                          }
                        />
                      </ImageListItem>
                    </>
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
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              {files.map(
                (item, key) =>
                  item.mimeType &&
                  (item.mimeType.split("/")[0] === "application" ||
                    item.mimeType.split("/")[0] === "text") && (
                    <>
                      &nbsp;
                      {select && (
                        <Checkbox
                          color="primary"
                          onChange={(e) =>
                            saveFileBinary(
                              e,
                              `data:${item.mimeType};base64,${item.file}`,
                              item.fileNameWithExt
                            )
                          }
                        />
                      )}
                      <List
                        style={{
                          bgcolor: "background.paper",
                          width: "500px",
                          height: "100px",
                        }}
                      >
                        <ListItem
                          alignItems="flex-start"
                          style={{
                            backgroundColor: "white",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <ListItemText primary={item.fileName} />
                          <ListItemIcon>
                            <IconButton
                              style={{ color: "lightblue" }}
                              onClick={() => removeFromStarred(item.location)}
                            >
                              <Star />
                            </IconButton>
                            <IconButton
                              style={{ color: "#494949" }}
                              onClick={() =>
                                handleClickOpen({ ...item, isFolder: false })
                              }
                            >
                              <InfoOutlined />
                            </IconButton>
                            <a
                              href={`data:${item.mimeType};base64,${item.file}`}
                              download={
                                item.fileNameWithExt.split(".")[1] === "rar"
                                  ? item.fileNameWithExt
                                  : item.fileName
                              }
                              rel="noreferrer"
                              target="_blank"
                            >
                              <IconButton>
                                <GetAppOutlined style={{ color: "#494949" }} />
                              </IconButton>
                            </a>
                          </ListItemIcon>
                        </ListItem>
                        <Divider variant="inset" component="li" />
                      </List>
                    </>
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
