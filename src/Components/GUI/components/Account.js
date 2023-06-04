import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Tabs,
  Button,
  TextField,
  Box,
  Typography,
  Tab,
} from "@material-ui/core";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `nav-tab-${index}`,
    "aria-controls": `nav-tabpanel-${index}`,
  };
}

function LinkTab(props) {
  return (
    <Tab
      component="a"
      onClick={(event) => {
        event.preventDefault();
      }}
      {...props}
    />
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

export default function Account({ getUser: changeUser }) {
  const classes = useStyles();
  const [disabled_1, setDisabled_1] = useState(false);
  const [disabled_2, setDisabled_2] = useState(false);
  const [value, setValue] = React.useState(0);
  const [changePassword, setChangePassword] = useState({
    oldPassword: "",
    newPassword: "",
    repeatNewPassword: "",
  });
  const [user, setUser] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const getUser = async () => {
    const res = await axios.get("http://localhost:5000/api/user", {
      headers: {
        "x-auth-token": localStorage.getItem("token"),
      },
    });

    setUser(res.data.user);
  };

  useEffect(() => {
    getUser();
  }, []);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (changePassword.newPassword !== changePassword.repeatNewPassword) {
      toast.error(`New passwords not matched!`, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }

    const res = await axios.put(
      "http://localhost:5000/api/user/updatepassword/" + user._id,
      { ...changePassword },
      {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      }
    );

    setDisabled_2(false);

    toast(`${res.data.message}`, {
      position: toast.POSITION.TOP_RIGHT,
    });

    if (res.data.success) {
      changeUser();

      setChangePassword({
        oldPassword: "",
        newPassword: "",
        repeatNewPassword: "",
      });
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    const res = await axios.put(
      "http://localhost:5000/api/user/" + user._id,
      { ...user },
      {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      }
    );

    setDisabled_1(false);

    toast(`${res.data.message}`, {
      position: toast.POSITION.TOP_RIGHT,
    });

    if (res.data.success) {
      changeUser();
    }
  };

  // const handleEmailVerification = async (e) => {
  //   e.preventDefault();

  //   const res = await axios.get(
  //     'http://localhost:5000/api/user/sendverifyemail/?email=' + user.email,
  //     {
  //       headers: {
  //         'x-auth-token': localStorage.getItem('token'),
  //       },
  //     },
  //   );

  //   alert(res.data.message);

  //   if (res.data.success) handleChange(null, 2);
  // };

  // const handleVerifyCode = async (e) => {
  //   e.preventDefault();

  //   const res = await axios.post(
  //     'http://localhost:5000/api/user/verifyemail/',
  //     { resetToken: e.target.verificationCode.value },
  //     {
  //       headers: {
  //         'x-auth-token': localStorage.getItem('token'),
  //       },
  //     },
  //   );

  //   alert(res.data.message);

  //   if (res.data.success) {
  //     localStorage.setItem('user', JSON.stringify(res.data.user));

  //     handleChange(null, 0);

  //     setUserState({ ...res.data.user });
  //   }
  // };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const onPasswordsChange = (e) => {
    setChangePassword({ ...changePassword, [e.target.name]: e.target.value });
  };

  const onProfileChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <div id="displayCont">
      <ToastContainer />
      <div
        className={classes.root}
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Tabs
          centered
          value={value}
          onChange={handleChange}
          aria-label="nav tabs example"
          style={{ backgroundColor: "#cedaed", width: "70%", color: "black" }}
        >
          <LinkTab label="Profile" {...a11yProps(0)} />
          <LinkTab label="Change Password" {...a11yProps(1)} />
          {/* {!user?.isEmailVerified && (
              <LinkTab label='Verify Email' {...a11yProps(2)} />
            )} */}
        </Tabs>
        <TabPanel value={value} index={0}>
          <div id="contentDisplayer">
            <form
              onSubmit={(e) => {
                setDisabled_1(true);
                handleProfileSubmit(e);
              }}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                label="Email"
                style={{ width: "40%" }}
                variant="outlined"
                onChange={onProfileChange}
                name="email"
                value={user?.email}
                required
                disabled
              />
              {/* <Button
                variant='contained'
                disabled={user?.isEmailVerified}
                onClick={handleEmailVerification}
                style={{ margin: '10px' }}
                onChange={onProfileChange}
                size='small'>
                Verify Email
              </Button> */}
              <br />
              <TextField
                style={{ width: "40%" }}
                onChange={onProfileChange}
                label="First Name"
                variant="outlined"
                required
                name="firstName"
                id="firstName"
                value={user?.firstName}
              />
              <br />
              <TextField
                style={{ width: "40%" }}
                onChange={onProfileChange}
                label="Last Name"
                variant="outlined"
                required
                name="lastName"
                id="lastName"
                value={user?.lastName}
              />
              <br />
              <Button
                type="submit"
                disabled={disabled_1}
                variant="contained"
                style={{ width: "40%", backgroundColor: "#bfd3f2" }}
              >
                Update Profile
              </Button>
            </form>
          </div>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <div id="contentDisplayer">
            <form
              onSubmit={(e) => {
                setDisabled_2(true);
                handlePasswordSubmit(e);
              }}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                label="Old Password"
                style={{ width: "40%" }}
                variant="outlined"
                onChange={onPasswordsChange}
                name="oldPassword"
                required
                type="password"
                value={changePassword.oldPassword}
              />
              <br />
              <TextField
                style={{ width: "40%" }}
                onChange={onPasswordsChange}
                label="New Password"
                required
                variant="outlined"
                type="password"
                name="newPassword"
                value={changePassword.newPassword}
              />
              <br />
              <TextField
                style={{ width: "40%" }}
                onChange={onPasswordsChange}
                label="Repeat New Password"
                type="password"
                variant="outlined"
                required
                name="repeatNewPassword"
                value={changePassword.repeatNewPassword}
              />
              <br />
              <Button
                disabled={disabled_2}
                type="submit"
                variant="contained"
                style={{ backgroundColor: "#bfd3f2", width: "20%" }}
              >
                Update Password
              </Button>
            </form>
          </div>
        </TabPanel>
        {/* <TabPanel value={value} index={2}>
          <div id='contentDisplayer'>
            <form autoComplete='off' onSubmit={handleVerifyCode}>
              <TextField
                label='Email verification code'
                style={{ margin: '10px' }}
                variant='outlined'
                name='verificationCode'
                required
              />
              <br />
              <Button
                style={{ margin: '10px' }}
                type='submit'
                variant='contained'
                size='small'>
                Verify
              </Button>
            </form>
          </div>
        </TabPanel> */}
      </div>
    </div>
  );
}
