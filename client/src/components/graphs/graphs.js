import React, {useContext} from "react";
import LineChart from "./linechart";
import PieChart from "./piechart";

import {SalesContext} from "../../context/sales-context"

const Graphs = () => {
  const { salesData,salesProductData } = useContext(SalesContext)
  return (
    <>
        <LineChart data={salesData} />
        <PieChart productData={salesProductData} />
    </>
  )
} 

export default Graphs;
