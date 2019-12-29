import React from "react";

const Spinner = props => (
  <div
    className={`preloader-wrapper ${props.size} active`}
    style={{ display: props.isLoading ? "" : "none", marginLeft: "40%" }}
  >
    <div className="spinner-layer spinner-green-only">
      <div className="circle-clipper left">
        <div className="circle"></div>
      </div>
      <div className="gap-patch">
        <div className="circle"></div>
      </div>
      <div className="circle-clipper right">
        <div className="circle"></div>
      </div>
    </div>
  </div>
);

export default Spinner;
