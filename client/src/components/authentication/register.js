import React from "react";

const Register = props => (
  <>
    <form className="content" onSubmit={props.handleRegister} style={{marginTop:"350px"}}>
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
      <button className="btn-large waves-effect waves-light app-btn">Register</button>
    </form>
  </>
);

export default Register;
