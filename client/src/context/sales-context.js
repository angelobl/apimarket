import React from "react"

export const SalesContext = React.createContext({
    salesData: [],
    setSalesData: () => {},
    salesProductData: [],
    setSalesProductData: () => {}
  });