import React from "react";
import icon from "../pics/drive_icon.png";
import { Link } from "react-router-dom";
import {
  IconButton,
  Typography,
  InputAdornment,
  OutlinedInput,
  InputLabel,
  FormControl,
} from "@material-ui/core";
import { ExitToApp, Search } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
}));

export default function Navbar({
  search,
  setToken,
  user,
  setSearch,
  selector,
}) {
  const classes = useStyles();
  const [tempSearch, setTempSearch] = React.useState("");

  const logout = () => {
    localStorage.removeItem("token");

    setToken("");
  };

  React.useEffect(() => {
    if (search !== tempSearch) setTempSearch(search);
  }, [search]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#F7F9FC",
        width: "100%",
        height: "12vh",
      }}
    >
      <div>
        <Link
          to="/"
          style={{
            textDecoration: "none",
            color: "black",
            display: "flex",
            alignItems: "center",
          }}
        >
          <img
            src={icon}
            style={{ width: "35px", height: "35px", marginRight: "10px" }}
          />
          <Typography variant="h5" color="textPrimary">
            Drive
          </Typography>
        </Link>
      </div>
      {selector &&
        (selector.trash ||
          selector.shared ||
          selector.starred ||
          selector.files) && (
          <form
            onSubmit={(e) => {
              e.preventDefault();

              setSearch(tempSearch);
            }}
          >
            <FormControl
              className={classes.margin}
              variant="outlined"
              style={{ width: "600px", backgroundColor: "#EDF2FC" }}
            >
              <InputLabel htmlFor="search">Search file/folder</InputLabel>
              <OutlinedInput
                id="search"
                name="search"
                value={tempSearch}
                onChange={(e) => setTempSearch(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton type="submit" edge="end">
                      {<Search />}
                    </IconButton>
                  </InputAdornment>
                }
                fullWidth
                labelWidth={125}
              />
            </FormControl>
          </form>
        )}
      {user && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography style={{ fontSize: "1.2rem", fontWeight: "500" }}>
            {user?.firstName && user.firstName + " " + user.lastName}
          </Typography>
          <div
            style={{ marginLeft: "10px", cursor: "pointer" }}
            onClick={logout}
          >
            <IconButton
              aria-label="delete"
              style={{
                marginLeft: "10px",
                color: "#226cad",
                width: "14px",
                height: "14px",
              }}
            >
              <ExitToApp />
            </IconButton>
            <Typography
              style={{
                fontSize: "0.9rem",
                fontWeight: "normal",
              }}
            >
              Logout
            </Typography>
          </div>
        </div>
      )}
    </div>
  );
}
