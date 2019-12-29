import React from "react";

const Item = ({
  prod,
  handleBuy,
  handleUpdateRedirect,
  handleDelete,
  user
}) => (
  <tr>
    <td>
      <img
        src={prod.image.data}
        style={{ maxHeight: "300px", maxWidth: "300px" }}
      />
    </td>
    <td>{prod.name}</td>
    <td>{`S/.${prod.price}`}</td>
    <td>{prod.stock}</td>
    <td>{prod.owner}</td>
    <td>
      <video
        src={prod.video.data}
        style={{ maxHeight: "300px", maxWidth: "300px" }}
        controls
      >
        <source type="video/mp4"></source>
      </video>
    </td>
    <td>
      {user === prod.owner ? (
        <>
          <button
            onClick={handleDelete}
            data-id={prod._id}
            data-owner={prod.owner}
            className="btn-floating btn-large waves-effect waves-light red"
          >
            X
          </button>
          <div
            onClick={handleUpdateRedirect}
            data-id={prod._id}
            data-name={prod.name}
            data-price={prod.price}
            data-image={prod.image.data}
            data-video={prod.video.data}
            data-owner={prod.owner}
            data-stock={prod.stock}
            className="btn-floating btn-large waves-effect waves-light yellow"
            style={{ fontSize: "30px", fontWeight: "bold", marginLeft: "15px" }}
          >
            &#8594;
          </div>
        </>
      ) : (
        <button
          onClick={handleBuy}
          data-id={prod._id}
          className="btn-large waves-effect waves-light red"
          disabled={prod.stock === 0 ? true : false}
        >
          BUY NOW
        </button>
      )}
    </td>
  </tr>
);

export default Item;
