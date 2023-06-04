import React from "react";
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
  DialogActions,
  Dialog,
  Breadcrumbs,
  Link,
} from "@material-ui/core";
import {
  Info,
  InfoOutlined,
  GetAppOutlined,
  Visibility,
} from "@material-ui/icons";
import { useParams, useSearchParams } from "react-router-dom";
import Navbar from "./Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DisplayLinkShare() {
  const [files, setFiles] = React.useState([]);
  const [folders, setFolders] = React.useState([]);
  const [selectedFolder, setSelectedFolder] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [itemDetails, setItemDetails] = React.useState({});
  const [linkUserPath, setLinkUserPath] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [user, setUser] = React.useState({});
  const [root, setRoot] = React.useState(false);
  const { userId } = useParams();
  const [searchParams] = useSearchParams();

  const handleClickOpen = (item) => {
    setOpen(true);
    setItemDetails(item);
  };

  const handleClose = () => {
    setOpen(false);
    setItemDetails({});
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
      setSelectedFolder("");
      getFilesOrFolders("");
    }
  };

  const getFilesOrFolders = async (folderName) => {
    if ((root || folderName) && linkUserPath) {
      const res = await axios.get(
        `http://localhost:5000/api/upload?customPath=${linkUserPath}&folderName=${folderName}&search=${search}&userId=${userId}`
      );

      if (!res.data.success)
        toast(`${res.data.message}`, {
          position: toast.POSITION.TOP_RIGHT,
        });

      setFolders(res.data.folders);
      setFiles(res.data.files);
    } else {
      const res = await axios.post(`http://localhost:5000/api/upload/shared`, {
        paths: [linkUserPath],
        search: search,
        user,
      });

      if (!res.data.success)
        toast(`${res.data.message}`, {
          position: toast.POSITION.TOP_RIGHT,
        });

      setFolders(res.data.folders);
      setFiles(res.data.files);
      setSelectedFolder("");
    }
  };

  React.useEffect(() => {
    if (user?._id) {
      if (searchParams.get("path")) {
        let temp = searchParams.get("path").split("/");

        temp = temp.join("\\");

        setLinkUserPath(user.folderPath + "\\" + temp);
      } else {
        setLinkUserPath(user.folderPath);
        setRoot(true);
      }

      if (linkUserPath) {
        getFilesOrFolders(selectedFolder);
      }
    }
  }, [linkUserPath, search, user]);

  const getUser = async () => {
    const res = await axios.get("http://localhost:5000/api/user/" + userId);

    if (res.data.success) {
      setUser(res.data.user);
    } else {
      toast(`${res.data.message}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  React.useEffect(() => {
    getUser();
  }, []);

  return (
    <div>
      <ToastContainer />
      <Navbar
        setSearch={setSearch}
        search={search}
        selector={{ files: true }}
      />
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
      <div
        style={{
          borderBottom: "1px solid silver",
          padding: "10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Folders</h1>
        {selectedFolder && (
          <Button variant="outlined" onClick={() => selectFolder()}>
            back to root folder
          </Button>
        )}
        {/* <Breadcrumbs aria-label='breadcrumb'>
          {selectedFolder.split('/').map((item, index) =>
            index === selectedFolder.split('/').length - 1 ? (
              <Typography color='textPrimary'>
                {item ? item : 'My Drive'}
              </Typography>
            ) : (
              <Link
                style={{ cursor: 'pointer' }}
                color='inherit'
                onClick={() => selectFolder(item, index)}>
                {item ? item : 'My Drive'}
              </Link>
            ),
          )}
        </Breadcrumbs> */}
      </div>
      <div style={{ padding: "10px", minWidth: "95vw" }}>
        {folders?.length > 0 ? (
          folders.map((item) => (
            <Card style={{ maxHeight: "80px", margin: "10px" }}>
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
                      <IconButton
                        onClick={() =>
                          handleClickOpen({ ...item, isFolder: true })
                        }
                      >
                        <Info />
                      </IconButton>
                      <IconButton onClick={() => selectFolder(item.folderName)}>
                        <Visibility />
                      </IconButton>
                    </span>
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))
        ) : (
          <Typography variant="h5" style={{ textAlign: "center" }}>
            No Folders Found!
          </Typography>
        )}
      </div>
      <div
        style={{
          borderBottom: "1px solid silver",
          padding: "10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Files</h1>
      </div>
      <div style={{ padding: "10px", minWidth: "95vw" }}>
        {files?.length > 0 ? (
          <>
            <Typography variant="h5">Images</Typography>
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
                              onClick={() =>
                                handleClickOpen({ ...item, isFolder: false })
                              }
                            >
                              <InfoOutlined />
                            </IconButton>
                            <a
                              style={{
                                textDecoration: "none",
                              }}
                              download={item.fileNameWithExt}
                              href={`data:${item.mimeType};base64,${item.file}`}
                            >
                              <IconButton color="primary">
                                <GetAppOutlined />
                              </IconButton>
                            </a>
                          </div>
                        }
                      />
                    </ImageListItem>
                  )
              )}
            </ImageList>
            <Divider />
            <br />
            <Typography variant="h5">Videos</Typography>
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
                          <IconButton
                            color="primary"
                            onClick={() =>
                              handleClickOpen({ ...item, isFolder: false })
                            }
                          >
                            <InfoOutlined />
                          </IconButton>
                        }
                      />
                    </ImageListItem>
                  )
              )}
            </ImageList>
            <Divider />
            <br />
            <Typography variant="h5">Audios</Typography>
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
                  )
              )}
            </ImageList>
            <Divider />
            <br />
            <Typography variant="h5">Documents</Typography>
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
                              <GetAppOutlined color="primary" />
                            </IconButton>
                          </a>
                        </ListItemIcon>
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </List>
                  )
              )}
            </div>
          </>
        ) : (
          <Typography variant="h5" style={{ textAlign: "center" }}>
            No Files Found!
          </Typography>
        )}
      </div>
    </div>
  );
}
