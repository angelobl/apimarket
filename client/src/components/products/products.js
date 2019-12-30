import React, { useCallback, useState, useEffect, useContext } from "react";
import {
  Switch,
  Route,
  withRouter,
  useRouteMatch
} from "react-router-dom";

import ProductList from "./product-list";
import AddProduct from "./add-product";
import Update from "./update";
import { getProducts, api, getSales, validateImage } from "../../api";

import { UserContext } from "../../context/user-context";
import { SalesContext } from "../../context/sales-context";


const Products = props => {
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState("");
  const [productId, setProductId] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productStock, setProductStock] = useState("");
  const [prediction, setPrediction] = useState([]);
  const [fileImage, setFileImage] = useState(null);
  const [fileVideo, setFileVideo] = useState(null);
  const [image, setImage] = useState("");
  const [video, setVideo] = useState("");
  const [owner, setOwner] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(UserContext);
  const { setSalesData, setSalesProductData } = useContext(SalesContext);

  let { path } = useRouteMatch();

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("token");
      if (token) {
        setIsLoading(true)
        const productslist = await getProducts(token);
        setProducts(productslist);
        setIsLoading(false)
      }
    }
    fetchData();
  }, []);

  const handleChange = useCallback(e => {
    const { value, name } = e.target;
    if (name === "productName") setProductName(value);
    if (name === "productPrice") setProductPrice(value);
    if (name === "productStock") setProductStock(value);
  });

  const handleDelete = useCallback(async e => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const res = await api(
      "/products",
      { owner: e.target.dataset.owner, id: e.target.dataset.id },
      "DELETE",
      token
    );
    const json = await res.json();
    alert(json.message);
    const productslist = await getProducts(token);
    setProducts(productslist);
  });

  const handleSubmit = useCallback(async e => {
    e.preventDefault();

    //Validaciones
    if (!productName || !productPrice || !productStock) {
      alert("Insert all fields");
      return;
    }
    if (!prediction || !fileImage || !fileVideo) {
      alert("Insert an image");
      return;
    }

    const matches = validateImage(productName, prediction);

    if (!matches.length) {
      alert("Insert an image that matches your product");
      return;
    }

    //Get token from localstorage
    const token = localStorage.getItem("token");

    //Get signed url and url for image
    const resImage = await api(
      "/products/generateUrl",
      {
        Bucket: "apimarket",
        Key: `${user}/products/${fileImage.name}`,
        type: fileImage.type
      },
      "POST",
      token
    );
    const imageJson = await resImage.json();

    //Get signed url and url for video
    const resVideo = await api(
      "/products/generateUrl",
      {
        Bucket: "apimarket",
        Key: `${user}/products/${fileVideo.name}`,
        type: fileVideo.type
      },
      "POST",
      token
    );
    const videoJson = await resVideo.json();

    //Upload image to s3
    const resAwsImage = await fetch(imageJson.signedUrl, {
      headers: {
        "Content-Type": fileImage.type
      },
      method: "PUT",
      body: fileImage
    });

    //Upload video to s3
    const resAwsVideo = await fetch(videoJson.signedUrl, {
      headers: {
        "Content-Type": fileVideo.type
      },
      method: "PUT",
      body: fileVideo
    });

    if (resAwsImage.status !== 200 || resAwsVideo.status !== 200) {
      return;
    }

    //Save product in database
    const res = await api(
      "/products",
      {
        name: productName,
        price: productPrice,
        stock: productStock,
        image: imageJson.url,
        video: videoJson.url
      },
      "POST",
      token
    );
    const json = await res.json();

    const productList = await getProducts(token);

    setProducts(productList);
    setProductName("");
    setProductPrice("");
    setProductStock("");
    setFileImage(null);
    setFileVideo(null);

    alert(json.message);
    props.history.push(path);
    
  });

  const handleUpdateRedirect = useCallback(e => {
    setProductId(e.target.dataset.id);
    setProductName(e.target.dataset.name);
    setProductPrice(e.target.dataset.price);
    setProductStock(e.target.dataset.stock);
    setImage(e.target.dataset.image);
    setVideo(e.target.dataset.video);
    setOwner(e.target.dataset.owner);
    props.history.push(`${path}/update`);
  });

  const handleUpdate = useCallback(async e => {
    e.preventDefault();

    if (!productName || !productPrice || !productStock) {
      alert("Insert all fields");
      return;
    }
    if (!prediction) {
      alert("Error with prediction");
      return;
    }

    const matches = validateImage(productName, prediction);

    if (!matches.length) {
      alert("Insert an image that matches your product");
      return;
    }

    const token = localStorage.getItem("token");

    let body = {
      id: productId,
      name: productName,
      price: productPrice,
      stock: productStock,
      owner: owner
    };

    if (fileImage) {
      //Get signed url and url for image
    const resImage = await api(
      "/products/generateUrl",
      {
        Bucket: "apimarket",
        Key: `${user}/products/${fileImage.name}`,
        type: fileImage.type
      },
      "POST",
      token
    );
    const imageJson = await resImage.json();

      //Upload image to s3
    const resAwsImage = await fetch(imageJson.signedUrl, {
      headers: {
        "Content-Type": fileImage.type
      },
      method: "PUT",
      body: fileImage
    });

    
      if (resAwsImage.status === 200) {
        body.image = imageJson.url;
      }
    }

    if (fileVideo) {
       //Get signed url and url for video
    const resVideo = await api(
      "/products/generateUrl",
      {
        Bucket: "apimarket",
        Key: `${user}/products/${fileVideo.name}`,
        type: fileVideo.type
      },
      "POST",
      token
    );
    const videoJson = await resVideo.json();
      //Upload video to s3
    const resAwsVideo = await fetch(videoJson.signedUrl, {
      headers: {
        "Content-Type": fileVideo.type
      },
      method: "PUT",
      body: fileVideo
    });
      if (resAwsVideo.status === 200) {
        body.video = videoJson.url;
      }
    }

    //Save product in database
    const res = await api(
      "/products",
      body,
      "PUT",
      token
    );
    const json = await res.json();

    const productList = await getProducts(token);

    setProducts(productList);
    setProductId("");
    setProductName("");
    setProductPrice("");
    setProductStock("");
    setOwner("");
    setImage(null);
    setVideo(null);
    alert(json.message);
    props.history.push(path);
  });

  const handleBuy = useCallback(async e => {
    const token = localStorage.getItem("token");
    const res = await api(
      "/sales",
      {
        id: e.target.dataset.id
      },
      "POST",
      token
    );
    const json = await res.json();
    const productList = await getProducts(token);
    const sales = await getSales(token);
    setSalesData(sales.salesData);
    setSalesProductData(sales.productsData);
    setProducts(productList);
    alert(json.message);
  });

  return (
    <Switch>
      <Route exact path={path}>
        <ProductList
          owner={user}
          products={products}
          handleDelete={handleDelete}
          handleUpdate={handleUpdate}
          handleUpdateRedirect={handleUpdateRedirect}
          handleBuy={handleBuy}
          isLoading={isLoading}
        />
      </Route>
      <Route exact path={`${path}/addproduct`}>
        <AddProduct
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          setPrediction={setPrediction}
          setFileImage={setFileImage}
          setFileVideo={setFileVideo}
        />
      </Route>
      <Route path={`${path}/update`}>
        <Update
          handleUpdate={handleUpdate}
          handleChange={handleChange}
          productName={productName}
          productPrice={productPrice}
          productStock={productStock}
          setPrediction={setPrediction}
          setFileImage={setFileImage}
          setFileVideo={setFileVideo}
          image={image}
          video={video}
        />
      </Route>
    </Switch>
  );
};

export default withRouter(Products);
