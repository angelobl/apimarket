import React, { useCallback, useState, useContext } from "react";
import { Switch, Route, withRouter } from "react-router-dom";

import Login from "./login";
import Register from "./register";

import { api } from "../../api";

import { UserContext } from "../../context/user-context";

const Authentication = props => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(UserContext);

  const handleChange = useCallback(e => {
    const { value, name } = e.target;
    if (name === "username") setUsername(value);
    if (name === "password") setPassword(value);
  });

  const handleRegister = useCallback(async e => {
    e.preventDefault();

    if (!username || !password) {
      alert("Insert all fields");
      return;
    }

    const res = await api(
      "/users/register",
      {
        username: username,
        password: password
      },
      "POST"
    );

    const json = await res.json();
    alert(json.message);
    props.history.push("/");
  });

  const handleLogin = useCallback(async e => {
    e.preventDefault();

    const res = await api(
      "/users/login",
      {
        username: username,
        password: password
      },
      "POST"
    );
    const json = await res.json();
    if (res.statusText === "OK") {
      localStorage.setItem("token", res.headers.get("Authorization"));
      setUser(username);
      props.history.push("/");
    } else if (json.message) {
      alert(json.message);
    }
  });

  return (
    <>
      <Switch>
        <Route exact path="/">
          <Login handleChange={handleChange} handleLogin={handleLogin} />
        </Route>

        <Route path={`/register`}>
          <Register
            handleChange={handleChange}
            handleRegister={handleRegister}
          />
        </Route>
      </Switch>
    </>
  );
};

export default withRouter(Authentication);
