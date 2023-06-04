import React from "react";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import Main from "./Components/GUI/main";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ResetPassword from "./Components/Resetpassword/ResetPassword";
import SendVerifyEmail from "./Components/sendverifyemail/SendVerifyEmail";
import DisplayLinkShare from "./Components/GUI/components/DisplayLinkShare";
import ForgotPassword from "./Components/ForgotPassword/ForgotPassword";

function App() {
  const [token, setToken] = React.useState(localStorage.getItem("token"));

  return (
    <div>
      <Router>
        <Routes>
          <Route
            path="/share/link/:userId"
            element={
              <div
                style={{
                  height: "100vh",
                  alignItems: "center",
                  display: "flex",
                }}
              >
                <DisplayLinkShare />
              </div>
            }
          />
          <Route
            path="/"
            element={
              token ? (
                <Main setToken={setToken} />
              ) : (
                <div
                  style={{
                    height: "100vh",
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <Login setToken={setToken} />
                </div>
              )
            }
          />
          {(!token || token == "undefined") && (
            <>
              <Route
                path="/login"
                element={
                  <div
                    style={{
                      height: "100vh",
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    <Login setToken={setToken} />
                  </div>
                }
              />
              <Route
                path="/login/:verifyEmailToken"
                element={
                  <div
                    style={{
                      height: "100vh",
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    <Login setToken={setToken} />
                  </div>
                }
              />
              <Route
                path="/signup"
                element={
                  <div
                    style={{
                      height: "100vh",
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    <Register />
                  </div>
                }
              />
              <Route
                path="/forgotpassword"
                element={
                  <div
                    style={{
                      height: "100vh",
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    <ForgotPassword />
                  </div>
                }
              />
              <Route
                path="/resetpassword/:resetPasswordToken"
                element={
                  <div
                    style={{
                      height: "100vh",
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    <ResetPassword />
                  </div>
                }
              />
              <Route
                path="/VerifyEmail"
                element={
                  <div
                    style={{
                      height: "100vh",
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    <SendVerifyEmail />
                  </div>
                }
              />
            </>
          )}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
