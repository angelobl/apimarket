import React from "react";
import { Link } from "react-router-dom";

const Login = props => (
  <>
    <form className="content" onSubmit={props.handleLogin} style={{marginTop:"350px"}}>
      <input
        type="text"
        placeholder="Username"
        name="username"
        onChange={props.handleChange}
      />
      <input
        type="password"
        placeholder="Password"
        name="password"
        onChange={props.handleChange}
      />
      <button className="btn-large waves-effect waves-light app-btn">
        Login
      </button>
      
    </form>
    <Link to="/register" style={{marginTop:"25px"}}>Register</Link>
  </>
);

export default Login;
