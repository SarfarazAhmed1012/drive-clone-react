import React, { useEffect } from "react";
// import icon from '../pics/drive_icon.png';
import drive from "../pics/myDrive.png";
import computers from "../pics/computers.png";
import shared from "../pics/shared.png";
import trash from "../pics/trash.png";
import cloud from "../pics/cloud.png";
import starred from "../pics/starred.png";
// import google from '../pics/google.png';
import "../css/SideBar.css";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Dialog,
  ListItemText,
  ListItem,
  List,
  Divider,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Slide,
  Container,
  Grid,
  Box,
  Card,
  CardContent,
  CardHeader,
  Link,
  Switch,
} from "@material-ui/core";
import { Close as CloseIcon } from "@material-ui/icons";
import ToggleButton from "@material-ui/lab/ToggleButton";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  section: {
    backgroundImage: 'url("nereus-assets/img/bg/pattern1.png")',
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  },
  cardHeader: {
    paddingTop: theme.spacing(3),
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function SideBar({
  user,
  getUser,
  selector,
  setSelector,
  setSearch,
}) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [paidPlan, setPaidPlan] = React.useState(0);

  useEffect(() => {
    if (user?._id) {
      setPaidPlan(
        user.storageLimit === 5
          ? 0
          : user.storageLimit === 25
          ? 1
          : user.storageLimit === 50 && 2
      );
    }
  }, [user]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await axios.put(
      "http://localhost:5000/api/user/" + user._id,
      {
        storageLimit:
          paidPlan === 0 ? 5 : paidPlan === 1 ? 25 : paidPlan === 2 && 50,
      },
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
      handleClose();
      getUser();
    }
  };

  const content = {
    badge: "Paid Plans",
    "header-p1": "Choose a plan that suits your needs",
    // 'header-p2': 'Choose a plan that suits your needs',
    // description:
    //   'Integer feugiat massa sapien, vitae tristique metus suscipit nec.',
    // option1: 'Monthly',
    // option2: 'Annual',
    "01_title": "Basic",
    "01_price": "0 PKR",
    "01_suffix": " / mo",
    // '01_benefit1': '3 Emails',
    // '01_benefit2': '1 Database',
    "01_benefit3": "Unlimited Access",
    "01_benefit4": "5 GB Storage",
    "01_primary-action": "Select plan",
    // '01_secondary-action': 'Learn more',
    "02_title": "Standard",
    "02_price": "1000 PKR",
    "02_suffix": " / mo",
    // '02_benefit1': '6 Emails',
    // '02_benefit2': '2 Database',
    "02_benefit3": "Unlimited Access",
    "02_benefit4": "25 GB Storage",
    "02_primary-action": "Select plan",
    // '02_secondary-action': 'Learn more',
    "03_title": "Premium",
    "03_price": "10000 PKR",
    "03_suffix": " / mo",
    // '03_benefit1': '9 Emails',
    // '03_benefit2': '3 Database',
    "03_benefit3": "Unlimited Access",
    "03_benefit4": "50 GB Storage",
    "03_primary-action": "Select plan",
    // '03_secondary-action': 'Learn more',
  };

  return (
    <>
      <ToastContainer />
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Paid Plans
            </Typography>
            <Button
              autoFocus
              color="inherit"
              size="large"
              disabled={
                (user?.storageLimit === 5 && paidPlan === 0) ||
                (user?.storageLimit === 25 && paidPlan === 1) ||
                (user?.storageLimit === 50 && paidPlan === 2)
              }
              onClick={handleSubmit}
            >
              save
            </Button>
          </Toolbar>
        </AppBar>
        <section className={classes.section}>
          <Container maxWidth="lg">
            <Box py={8} textAlign="center">
              <Box mb={3}>
                <Container maxWidth="sm">
                  <Typography variant="overline" color="textSecondary">
                    {content["badge"]}
                  </Typography>
                  <Typography variant="h3" component="h2" gutterBottom={true}>
                    <Typography variant="h3" component="span" color="primary">
                      {content["header-p1"]}{" "}
                    </Typography>
                    <Typography variant="h3" component="span">
                      {content["header-p2"]}
                    </Typography>
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="textSecondary"
                    paragraph={true}
                  >
                    {content["description"]}
                  </Typography>
                  {/* <div>
                    <Typography variant='subtitle1' component='span'>
                      {content['option1']}
                    </Typography>
                    &nbsp;{' '}
                    <Switch
                      name='checkbox'
                      color='primary'
                      checked={checkbox}
                      onChange={handleChange}
                    />{' '}
                    &nbsp;
                    <Typography variant='subtitle1' component='span'>
                      {content['option2']}
                    </Typography>
                  </div> */}
                </Container>
              </Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined">
                    <CardHeader
                      title={content["01_title"]}
                      className={classes.cardHeader}
                    ></CardHeader>
                    <CardContent>
                      <Box px={1}>
                        <Typography
                          variant="h3"
                          component="h2"
                          gutterBottom={true}
                        >
                          {content["01_price"]}
                          <Typography
                            variant="h6"
                            color="textSecondary"
                            component="span"
                          >
                            {content["01_suffix"]}
                          </Typography>
                        </Typography>
                        <Typography
                          color="textSecondary"
                          variant="subtitle1"
                          component="p"
                        >
                          {content["01_benefit1"]}
                        </Typography>
                        <Typography
                          color="textSecondary"
                          variant="subtitle1"
                          component="p"
                        >
                          {content["01_benefit2"]}
                        </Typography>
                        <Typography
                          color="textSecondary"
                          variant="subtitle1"
                          component="p"
                        >
                          {content["01_benefit3"]}
                        </Typography>
                        <Typography
                          color="textSecondary"
                          variant="subtitle1"
                          component="p"
                          paragraph={true}
                        >
                          {content["01_benefit4"]}
                        </Typography>
                      </Box>
                      <ToggleButton
                        name="paidPlan"
                        value={paidPlan}
                        selected={paidPlan === 0}
                        className={classes.primaryAction}
                        color="primary"
                        onChange={() => {
                          setPaidPlan(0);
                        }}
                      >
                        <Typography
                          color={paidPlan === 0 ? "primary" : "textSecondary"}
                          variant="subtitle1"
                          component="p"
                        >
                          {content["01_primary-action"]}
                        </Typography>
                      </ToggleButton>
                      <Box mt={2}>
                        <Link href="#" color="primary">
                          {content["03_secondary-action"]}
                        </Link>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined">
                    <CardHeader
                      title={content["02_title"]}
                      className={classes.cardHeader}
                    ></CardHeader>
                    <CardContent>
                      <Box px={1}>
                        <Typography
                          variant="h3"
                          component="h2"
                          gutterBottom={true}
                        >
                          {content["02_price"]}
                          <Typography
                            variant="h6"
                            color="textSecondary"
                            component="span"
                          >
                            {content["02_suffix"]}
                          </Typography>
                        </Typography>
                        <Typography
                          color="textSecondary"
                          variant="subtitle1"
                          component="p"
                        >
                          {content["02_benefit1"]}
                        </Typography>
                        <Typography
                          color="textSecondary"
                          variant="subtitle1"
                          component="p"
                        >
                          {content["02_benefit2"]}
                        </Typography>
                        <Typography
                          color="textSecondary"
                          variant="subtitle1"
                          component="p"
                        >
                          {content["02_benefit3"]}
                        </Typography>
                        <Typography
                          color="textSecondary"
                          variant="subtitle1"
                          component="p"
                          paragraph={true}
                        >
                          {content["02_benefit4"]}
                        </Typography>
                      </Box>
                      <ToggleButton
                        name="paidPlan"
                        value={paidPlan}
                        selected={paidPlan === 1}
                        onChange={() => {
                          setPaidPlan(1);
                        }}
                      >
                        <Typography
                          color={paidPlan === 1 ? "primary" : "textSecondary"}
                          variant="subtitle1"
                          component="p"
                        >
                          {content["02_primary-action"]}
                        </Typography>
                      </ToggleButton>
                      <Box mt={2}>
                        <Link href="#" color="primary">
                          {content["03_secondary-action"]}
                        </Link>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined">
                    <CardHeader
                      title={content["03_title"]}
                      className={classes.cardHeader}
                    ></CardHeader>
                    <CardContent>
                      <Box px={1}>
                        <Typography
                          variant="h3"
                          component="h2"
                          gutterBottom={true}
                        >
                          {content["03_price"]}
                          <Typography
                            variant="h6"
                            color="textSecondary"
                            component="span"
                          >
                            {content["03_suffix"]}
                          </Typography>
                        </Typography>
                        <Typography
                          color="textSecondary"
                          variant="subtitle1"
                          component="p"
                        >
                          {content["03_benefit1"]}
                        </Typography>
                        <Typography
                          color="textSecondary"
                          variant="subtitle1"
                          component="p"
                        >
                          {content["03_benefit2"]}
                        </Typography>
                        <Typography
                          color="textSecondary"
                          variant="subtitle1"
                          component="p"
                        >
                          {content["03_benefit3"]}
                        </Typography>
                        <Typography
                          color="textSecondary"
                          variant="subtitle1"
                          component="p"
                          paragraph={true}
                        >
                          {content["03_benefit4"]}
                        </Typography>
                      </Box>
                      <ToggleButton
                        name="paidPlan"
                        value={paidPlan}
                        selected={paidPlan === 2}
                        onChange={() => {
                          setPaidPlan(2);
                        }}
                      >
                        <Typography
                          color={paidPlan === 2 ? "primary" : "textSecondary"}
                          variant="subtitle1"
                          component="p"
                        >
                          {content["03_primary-action"]}
                        </Typography>
                      </ToggleButton>
                      <Box mt={2}>
                        <Link href="#" color="primary">
                          {content["03_secondary-action"]}
                        </Link>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Container>
        </section>
      </Dialog>
      <div id="sideBar">
        <div id="sideBarOpt">
          <div
            className={`sideBarOptions ${selector.account && "activeSideOpt"}`}
            onClick={() =>
              setSelector({
                starred: false,
                account: true,
                trash: false,
                shared: false,
                files: false,
                uploadFile: false,
                uploadFolder: false,
                createFolder: false,
              })
            }
          >
            <img src={shared} alt="Reload page" className="opacity" />
            <h3>Account</h3>
          </div>
          <div
            className={`sideBarOptions ${selector.files && "activeSideOpt"}`}
            onClick={() => {
              setSelector({
                account: false,
                trash: false,
                starred: false,
                shared: false,
                files: true,
                uploadFile: false,
                uploadFolder: false,
                createFolder: false,
              });
              setSearch("");
            }}
          >
            <img src={drive} alt="Reload page" className="opacity" />
            <h3>My Drive</h3>
          </div>
          <div
            className={`sideBarOptions ${selector.starred && "activeSideOpt"}`}
            onClick={() => {
              setSelector({
                account: false,
                trash: false,
                shared: false,
                starred: true,
                files: false,
                uploadFile: false,
                uploadFolder: false,
                createFolder: false,
              });
              setSearch("");
            }}
          >
            <img src={starred} alt="Reload page" className="opacity" />
            <h3>Favourites</h3>
          </div>
          <div
            className={`sideBarOptions ${
              selector.uploadFile && "activeSideOpt"
            }`}
            onClick={() =>
              setSelector({
                account: false,
                trash: false,
                starred: false,
                shared: false,
                files: false,
                uploadFile: true,
                uploadFolder: false,
                createFolder: false,
              })
            }
          >
            <img src={computers} alt="Reload page" className="opacity" />
            <h3>Upload Files</h3>
          </div>
          <div
            className={`sideBarOptions ${
              selector.uploadFolder && "activeSideOpt"
            }`}
            onClick={() =>
              setSelector({
                account: false,
                trash: false,
                starred: false,
                shared: false,
                files: false,
                uploadFile: false,
                uploadFolder: true,
                createFolder: false,
              })
            }
          >
            <img src={computers} alt="Reload page" className="opacity" />
            <h3>Upload Folder</h3>
          </div>
          <div
            className={`sideBarOptions ${
              selector.createFolder && "activeSideOpt"
            }`}
            onClick={() =>
              setSelector({
                account: false,
                trash: false,
                shared: false,
                files: false,
                starred: false,
                uploadFile: false,
                uploadFolder: false,
                createFolder: true,
              })
            }
          >
            <img src={computers} alt="Reload page" className="opacity" />
            <h3>Create a Folder</h3>
          </div>
          <div
            className={`sideBarOptions ${selector.shared && "activeSideOpt"}`}
            onClick={() => {
              setSelector({
                account: false,
                trash: false,
                shared: true,
                files: false,
                uploadFile: false,
                starred: false,
                uploadFolder: false,
                createFolder: false,
              });
              setSearch("");
            }}
          >
            <img src={shared} alt="Reload page" className="opacity" />
            <h3>Shared with me</h3>
          </div>
          <div
            className={`sideBarOptions ${selector.trash && "activeSideOpt"}`}
            onClick={() => {
              setSelector({
                account: false,
                trash: true,
                shared: false,
                starred: false,
                files: false,
                uploadFile: false,
                uploadFolder: false,
                createFolder: false,
              });
              setSearch("");
            }}
          >
            <img src={trash} alt="Reload page" className="opacity" />
            <h3>Trash</h3>
          </div>
        </div>
        <div id="storageInfo">
          <div className="sideBarOptions">
            <img src={cloud} alt="Reload page" className="opacity" />
            <h3>Storage</h3>
          </div>
          <div className="sideBarOptions">
            <div id="storageLoader">
              <div
                style={{
                  width: `${
                    user?.currentStorage
                      ? (user?.currentStorage / user?.storageLimit) * 100
                      : 0
                  }%`,
                  height: "3px",
                  borderRadius: "30px",
                  backgroundColor: "dodgerblue",
                }}
              />
            </div>
          </div>
          <div id="storageNumericalInfo">
            <p>
              {user?.currentStorage ? (user?.currentStorage).toFixed(2) : 0} GB
              of {user?.storageLimit} GB Used
            </p>
          </div>
          <button id="buyStorage" onClick={handleClickOpen}>
            Buy storage
          </button>
        </div>
        {/* <div id='sponsor'>
          <p>Product by </p>
          <p> Online drive</p>
        </div> */}
      </div>
    </>
  );
}
