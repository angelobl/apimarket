import React from "react";

const Pagination = props => (
  <ul className="pagination">
    <li className="disabled">
      <a href="#!">
        <i className="material-icons">chevron_left</i>
      </a>
    </li>
    {props.list.map((p, i) =>
      i % 10 === 0 ? (
        <li className="waves-effect" key={p._id}>
          <a
            href="#!"
            onClick={() => {
              props.setPaginationStart(i);
              props.setPaginationEnd(i + 10);
            }}
            style={{ cursor: "pointer", fontSize: "20px" }}
          >
            {i / 10 + 1}
          </a>
        </li>
      ) : null
    )}
    <li className="waves-effect">
      <a href="#!">
        <i className="material-icons">chevron_right</i>
      </a>
    </li>
  </ul>
);

export default Pagination;
