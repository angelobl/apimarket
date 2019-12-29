import React from "react";

import Nav from "./nav";

const Layout = ({ children }) => (
  <>
    <Nav />
    <div className="page-container">{children}</div>
  </>
);

export default Layout;
