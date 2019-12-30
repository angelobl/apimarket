import React, { useCallback, useState, useRef, useEffect } from "react";
import { predict } from "../../api";

import Spinner from "../utils/spinner";
import Dropbox from "../utils/dropbox";

const AddProduct = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageURL, setimageURL] = useState(null);
  const [videoURL, setVideoURL] = useState(null);

  const imageRef = useRef();

  const onDropImage = useCallback(e => {
    e.preventDefault();
    let file = e.dataTransfer.files[0];
    console.log(file);
    if (file.type !== "image/png" && file.type !== "image/jpeg") {
      alert("Only jpg and png format are accepted");
      return;
    }
    if (file.size > 150000000) {
      alert("Only 16mb files are accepted");
      return;
    }

    props.setFileImage(file);

    const reader = new FileReader();

    reader.onabort = () => console.log("file reading was aborted");
    reader.onerror = () => console.log("file reading has failed");
    reader.onload = () => {
      setimageURL(reader.result);
    };
    reader.readAsDataURL(file);
  }, []);

  const onDropVideo = useCallback(e => {
    e.preventDefault();
    let file = e.dataTransfer.files[0];
    if (file.type !== "video/mp4") {
      alert("Only mp4 format are accepted");
      return;
    }
    if (file.size > 150000000) {
      alert("Only 16mb files are accepted");
      return;
    }
    props.setFileVideo(file);

    const reader = new FileReader();

    reader.onabort = () => console.log("file reading was aborted");
    reader.onerror = () => console.log("file reading has failed");
    reader.onload = () => {
      setVideoURL(reader.result);
    };
    reader.readAsDataURL(file);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    predict(imageURL, imageRef)
      .then(res => {
        props.setPrediction(res);
        setIsLoading(false);
      })
      .catch(err => alert(err));
  }, [imageURL]);

  return (
    <div
      className="content"
      style={{
        flexDirection: "row",
        height: "50%",
        width: "60%",
        marginTop: "120px"
      }}
    >
      <div style={{ flexBasis: "60%", paddingRight: "10px" }}>
        <form onSubmit={props.handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            name="productName"
            onChange={props.handleChange}
          />
          <input
            type="text"
            placeholder="Price"
            name="productPrice"
            onChange={props.handleChange}
          />
          <input
            type="text"
            placeholder="Stock"
            name="productStock"
            onChange={props.handleChange}
          />
          <button className="btn waves-effect waves-light app-btn">
            Añadir Producto
          </button>
          <Dropbox handleDrop={onDropImage} name="image" />
          <Dropbox handleDrop={onDropVideo} name="video"/>
        </form>
      </div>
      <div
        style={{
          minHeight: "300px",
          width: "300px",
          display: "inline-block"
        }}
      >
        <img
          src={imageURL}
          ref={imageRef}
          style={{ maxHeight: "300px", maxWidth: "300px" }}
        />
        <video
          src={videoURL}
          style={{ maxHeight: "300px", maxWidth: "300px" }}
          controls
        >
          <source type="video/mp4"></source>
        </video>
        <Spinner isLoading={isLoading} size="small" />
      </div>
    </div>
  );
};

export default AddProduct;
