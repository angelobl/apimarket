import React from "react";

const Dropbox = props => (
    <div
    onDragOver={e => e.preventDefault()}
    onDrop={props.handleDrop}
    className="dropbox"
  >
    <p>Drag and Drop your {props.name} here</p>
  </div>
);

export default Dropbox;