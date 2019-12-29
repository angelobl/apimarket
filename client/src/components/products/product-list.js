import React, { useState, useContext } from "react";
import {UserContext} from "../../context/user-context"

import Item from './product-item'
import Pagination from '../utils/pagination'
import Spinner from '../utils/spinner'


const ProductList = props => {
  const [paginationStart, setPaginationStart] = useState(0);
  const [paginationEnd, setPaginationEnd] = useState(10);
  const { user } = useContext(UserContext)

  return (
    <div style={{ padding: "50px",width:"100%" }}>
      {props.isLoading ? (
        <Spinner isLoading={props.isLoading} size="big" />
      ) : (
        <>
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
          {props.products
            .filter((p, i) => paginationStart <= i && i < paginationEnd)
            .map(prod => (
              <Item
                key={prod._id}
                prod={prod}
                handleBuy={props.handleBuy}
                handleUpdateRedirect={props.handleUpdateRedirect}
                handleDelete={props.handleDelete}
                user={user}
              />
            ))}
        </tbody>
      </table>
      <Pagination list={props.products} setPaginationStart={setPaginationStart} setPaginationEnd={setPaginationEnd}/>
      </>
      )}
    </div>
  );
};

export default ProductList;
