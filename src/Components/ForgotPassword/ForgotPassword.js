import React, { useState, useEffect } from "react";
import basestyle from "../Base.module.css";
import loginstyle from "./ForgotPassword.module.css";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(false);

  const forgotPasswordHandler = (e) => {
    e.preventDefault();

    axios
      .post(
        "http://localhost:5000/api/user/forgotpassword?email=" +
          e.target.email.value
      )
      .then((res) => {
        toast(`${res.data.message}`, {
          position: toast.POSITION.TOP_RIGHT,
        });

        setDisabled(false);

        if (res.data.success) navigate("/", { replace: true });
      });
  };

  return (
    <div className={loginstyle.login}>
      <ToastContainer />
      <form
        onSubmit={(e) => {
          forgotPasswordHandler(e);
          setDisabled(true);
        }}
      >
        <h1>ForgotPassword</h1>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          required
        />
        <NavLink to="/" style={{ float: "right" }}>
          Back to login
        </NavLink>
        <button
          className={basestyle.button_common}
          style={{
            backgroundColor: `${disabled ? "grey" : "olivedrab"}`,
            cursor: `${!disabled && "pointer"}`,
          }}
          disabled={disabled}
          type="submit"
        >
          Send Email
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
