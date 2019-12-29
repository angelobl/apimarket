import React, { useCallback, useContext } from "react";
import { Link } from "react-router-dom";
import { Switch, Route, withRouter, Redirect } from "react-router-dom";

import { UserContext } from "../../context/user-context";

const Nav = props => {
  const { user, setUser } = useContext(UserContext);

  const handleLogout = useCallback(e => {
    localStorage.removeItem("token");
    setUser(null);
  });

  return (
    <nav style={{ display: user ? "" : "none" }}>
      <div className="nav-wrapper" >
        <span className="brand-logo">>Welcome, {user ? user : ""}</span>
        <ul id="nav-mobile" className="right hide-on-med-and-down">
          <li>
            <Link to="/items">Products</Link>
          </li>
          <li>
            <Link to={`/items/addproduct`}>Add Product</Link>
          </li>
          <li>
            <Link to="/chat">Chat</Link>
          </li>
          <li>
            <Link to="/graphs">Graphs</Link>
          </li>
          <li>
            <Link onClick={handleLogout} to="/">
              Sign Out
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default withRouter(Nav);
