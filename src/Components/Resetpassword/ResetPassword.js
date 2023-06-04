import React from "react";
import basestyle from "../Base.module.css";
import loginstyle from "./ResetPassword.module.css";
import axios from "axios";
import { useNavigate, NavLink, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { resetPasswordToken } = useParams();
  const [disabled, setDisabled] = React.useState(false);

  const resetPasswordHandler = (e) => {
    e.preventDefault();

    if (!resetPasswordToken) {
      setDisabled(false);

      return toast.error("Token is required!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }

    if (e.target.password.value !== e.target.repeatPassword.value) {
      setDisabled(false);

      return toast.error("Password do not match!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }

    axios
      .post("http://localhost:5000/api/user/resetpassword", {
        password: e.target.password.value,
        resetToken: resetPasswordToken,
      })
      .then((res) => {
        setDisabled(false);

        toast(`${res.data.message}`, {
          position: toast.POSITION.TOP_RIGHT,
        });

        if (res.data.success) navigate("/", { replace: true });
      });
  };

  return (
    <div className={loginstyle.login}>
      <ToastContainer />
      <form
        onSubmit={(e) => {
          setDisabled(true);
          resetPasswordHandler(e);
        }}
      >
        <h1>ResetPassword</h1>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Enter password"
          required
        />
        <input
          type="password"
          name="repeatPassword"
          id="repeatPassword"
          required
          placeholder="Repeat password"
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
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
