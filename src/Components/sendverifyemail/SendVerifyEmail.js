import React from "react";
import basestyle from "../Base.module.css";
import loginstyle from "./SendVerifyEmail.module.css";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SendVerifyEmail = () => {
  const navigate = useNavigate();
  const [disabled, setDisabled] = React.useState(false);

  const handleEmailVerification = async (e) => {
    e.preventDefault();

    const res = await axios.get(
      "http://localhost:5000/api/user/sendverifyemail/?email=" +
        e.target.email.value
    );

    setDisabled(false);

    toast(`${res.data.message}`, {
      position: toast.POSITION.TOP_RIGHT,
    });

    if (res.data.success) navigate("/login", { replace: true });
  };

  return (
    <div className={loginstyle.login}>
      <ToastContainer />
      <form
        onSubmit={(e) => {
          setDisabled(true);
          handleEmailVerification(e);
        }}
      >
        <h2 style={{ color: "#0077ef" }}>Send Verification Email</h2>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter your email"
          required
        />
        <NavLink to="/" style={{ float: "right", textDecoration: "none" }}>
          <p style={{ color: "#0077ef", fontWeight: "bold" }}>Back to login</p>
        </NavLink>
        <button
          className={basestyle.button_common}
          style={{
            backgroundColor: `${disabled ? "grey" : "#1d88b3"}`,
            cursor: `${!disabled && "pointer"}`,
          }}
          disabled={disabled}
          type="submit"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default SendVerifyEmail;
