import React, { useEffect, useState } from "react";
import basestyle from "../Base.module.css";
import registerstyle from "./Register.module.css";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [user, setUserDetails] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    cpassword: "",
  });

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

    if (!values.fname) {
      setDisabled(false);

      error.fname = "First Name is required!";
    }

    if (!values.lname) {
      setDisabled(false);

      error.lname = "Last Name is required!";
    }

    if (!values.email) {
      setDisabled(false);

      error.email = "Email is required!";
    } else if (!regex.test(values.email)) {
      setDisabled(false);

      error.email = "This is not a valid email format!";
    }

    if (!values.password) {
      setDisabled(false);

      error.password = "Password is required!";
    } else if (values.password.length < 4) {
      setDisabled(false);

      error.password = "Password must be more than 4 characters!";
    } else if (values.password.length > 10) {
      setDisabled(false);

      error.password = "Password cannot exceed more than 10 characters!";
    }

    if (!values.cpassword) {
      setDisabled(false);

      error.cpassword = "Confirm Password is required!";
    } else if (values.cpassword !== values.password) {
      setDisabled(false);

      error.cpassword = "Confirm password and password should be same!";
    }

    return error;
  };

  const signupHandler = (e) => {
    e.preventDefault();

    setFormErrors(validateForm(user));
    setIsSubmit(true);

    // if (!formErrors) {
    //   setIsSubmit(true);
    // }
  };

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      axios
        .post("http://localhost:5000/api/user/register", {
          email: user.email,
          firstName: user.fname,
          lastName: user.lname,
          password: user.password,
          passwordCheck: user.cpassword,
        })
        .then((res) => {
          toast(`${res.data.message}`, {
            position: toast.POSITION.TOP_RIGHT,
          });

          setDisabled(false);

          navigate("/login", { replace: true });
        });
    }
  }, [formErrors]);

  return (
    <div className={registerstyle.register}>
      <ToastContainer />
      <form>
        <h1 style={{ color: "#1d88b3" }}>Create your account</h1>
        <input
          type="text"
          name="fname"
          id="fname"
          placeholder="First Name"
          onChange={changeHandler}
          value={user.fname}
        />
        <p className={basestyle.error}>{formErrors.fname}</p>
        <input
          type="text"
          name="lname"
          id="lname"
          placeholder="Last Name"
          onChange={changeHandler}
          value={user.lname}
        />
        <p className={basestyle.error}>{formErrors.lname}</p>
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
        <p className={basestyle.error}>{formErrors.password}</p>
        <input
          type="password"
          name="cpassword"
          id="cpassword"
          placeholder="Confirm Password"
          onChange={changeHandler}
          value={user.cpassword}
        />
        <p className={basestyle.error}>{formErrors.cpassword}</p>
        <button
          className={basestyle.button_common}
          style={{
            backgroundColor: `${disabled ? "grey" : "#1d88b3"}`,
            cursor: `${!disabled && "pointer"}`,
          }}
          disabled={disabled}
          onClick={(e) => {
            setDisabled(true);
            signupHandler(e);
          }}
        >
          Register
        </button>
      </form>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        <p>Already registered?</p>
        <NavLink to="/login" style={{ textDecoration: "none" }}>
          <span style={{ color: "#1d88b3", fontWeight: "bold" }}>Login</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Register;
