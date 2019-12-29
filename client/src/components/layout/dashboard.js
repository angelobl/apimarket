import React, {  useState, useEffect, useContext } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Products from "../products/products";
import Chat from "../chat/chat";
import Graphs from "../graphs/graphs";

import { UserContext } from "../../context/user-context";
import { SalesContext } from "../../context/sales-context";

import { getSales } from "../../api";

const Dashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const [salesProductData, setSalesProductData] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("token");
      if (token) {
        const sales = await getSales(token);
        setSalesData(sales.salesData);
        setSalesProductData(sales.productsData);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      <SalesContext.Provider
        value={{
          salesData,
          setSalesData,
          salesProductData,
          setSalesProductData
        }}
      >
        <Switch>
        <Route exact path="/">
            <Redirect to="/items" />
          </Route>
          <Route path="/items">
            <Products />
          </Route>
          <Route path={`/chat`}>
            <Chat owner={user} />
          </Route>
          k
          <Route path={`/graphs`}>
            <Graphs />
          </Route>
        </Switch>
      </SalesContext.Provider>
    </>
  );
};
export default Dashboard;
