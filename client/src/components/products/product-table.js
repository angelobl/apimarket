import React from "react";

const Table = props => (
    <table style={{fontSize:"30px"}}>
        <tbody>
          <tr style={{ textAlign: "center" }}>
            <th width="25%">Picture</th>
            <th width="15%">Name</th>
            <th width="15%">Price</th>
            <th width="15%">Stock</th>
            <th width="15%">Owner</th>
            <th  width="10%">Video</th>
            <th  width="25%">Action</th>
          </tr>
            {props.children}
          </tbody>
      </table>
);

export default Table;