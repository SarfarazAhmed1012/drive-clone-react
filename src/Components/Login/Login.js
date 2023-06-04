import React, { useState, useEffect } from "react";
import basestyle from "../Base.module.css";
import loginstyle from "./Login.module.css";
import axios from "axios";
import { useNavigate, NavLink, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = ({ setToken }) => {
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [user, setUserDetails] = useState({
    email: "",
    password: "",
  });
  const { verifyEmailToken } = useParams();

  const changeHandler = (e) => {
    const { name, value } = e.target;

    setUserDetails({
      ...user,
      [name]: value,
    });
  };

  const validateForm = (values) => {
    const error = {};
    const regex = /^[^\s+@]+@[^\s@]+\.[^\s@]{2,}$/i;

    if (!values.email) {
      setDisabled(false);

      error.email = "Email is required";
    } else if (!regex.test(values.email)) {
      setDisabled(false);

      error.email = "Please enter a valid email address!";
    }

    if (!values.password) {
      setDisabled(false);

      error.password = "Password is required!";
    }

    return error;
  };

  const loginHandler = (e) => {
    e.preventDefault();

    setFormErrors(validateForm(user));
    setIsSubmit(true);
  };

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      axios.post("http://localhost:5000/api/user/login", user).then((res) => {
        if (res.data.message === "User does not exist!") {
          toast.error("User does not exists", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
        if (res.data.message === "Logged In!") {
          toast.success("Logged in!", {
            position: toast.POSITION.TOP_RIGHT,
          });
          console.log("as");
        }
        console.log(res.data.message);
        localStorage.setItem("token", res.data.token);

        setDisabled(false);
        setToken(res.data.token);

        if (res.data.message === "Verify your email address first!")
          return navigate("/verifyemail", { replace: true });

        navigate("/", { replace: true });
      });
    }
  }, [formErrors]);

  const handleVerifyCode = async () => {
    const res = await axios.post("http://localhost:5000/api/user/verifyemail", {
      resetToken: verifyEmailToken,
    });

    toast(`${res.data.message}`, {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  useEffect(() => {
    if (verifyEmailToken) handleVerifyCode();
  }, []);

  return (
    <div className={loginstyle.login}>
      <ToastContainer />
      <form>
        <h1 style={{ color: "#1d88b3" }}>Login</h1>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          onChange={changeHandler}
          value={user.email}
        />
        <p className={basestyle.error}>{formErrors.email}</p>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          onChange={changeHandler}
          value={user.password}
        />
        <NavLink
          to="/forgotpassword"
          style={{ float: "right", textDecoration: "none" }}
        >
          <span style={{ color: "#1d88b3", fontWeight: "bold" }}>
            Forgot Passsword?
          </span>
        </NavLink>
        <p className={basestyle.error}>{formErrors.password}</p>
        <button
          className={basestyle.button_common}
          style={{
            backgroundColor: `${disabled ? "grey" : "#1d88b3"}`,
            cursor: `${!disabled && "pointer"}`,
          }}
          disabled={disabled}
          onClick={(e) => {
            setDisabled(true);
            loginHandler(e);
          }}
        >
          Login
        </button>
      </form>
      <NavLink to="/signup" style={{ textDecoration: "none" }}>
        <p>
          Not yet registered?{" "}
          <span style={{ color: "#1d88b3", fontWeight: "bold" }}>
            Register Now
          </span>
        </p>
      </NavLink>
    </div>
  );
};

export default Login;
