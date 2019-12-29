import { BASE_URL } from "./urls";
import * as ml5 from "ml5";

export const api = async (route,body,method,jwt = "") => {
  
    return await fetch(`${BASE_URL}${route}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Authorization": jwt
        },
        method: method,
        body: JSON.stringify(body)
      });
}

export const getProducts = async (jwt = "") => {
  const response = await fetch(`${BASE_URL}/products`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Authorization": jwt
    },
    method: "GET"
  });
  const products = await response.json();
  return products;
};

export const getSales = async (jwt = "") => {
  const response = await fetch(`${BASE_URL}/sales/data`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Authorization": jwt
    },
    method: "GET"
  });
  const initialValue = {};
  const sales = await response.json();
  const salesData = sales.data.map(d => ({date:new Date(d._id.year,d._id.month-1,d._id.dayOfMonth),value:d.count}))
  const productsData = sales.products.reduce((obj, item) => ({...obj,[item._id.product]:item.count}), initialValue)
  return {salesData,productsData}
};

export const predict = async (imageURL, imageRef) => {
  if (!imageURL) return;
  try {
    const classifier = await ml5.imageClassifier("MobileNet");

    const results = await classifier.predict(imageRef.current);
    console.log(results);

    return results;
  } catch (error) {
    console.log(error);
    return;
  }
};

export const validateImage = (productName,prediction) => {
  const productNames = productName.split(" ");
    const predictions = prediction.map(p => p.label);

    return predictions.filter(p => {
      for (var i = 0; i < productNames.length; i++) {
        if (productNames[i] === "") return false;
        if (p.includes(productNames[i].toLowerCase())) return true;
      }
    });
}
