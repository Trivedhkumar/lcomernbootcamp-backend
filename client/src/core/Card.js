import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import ImageHelper from "./helper/ImageHelper";
import { addItemToCart, removeItemFromCart } from "./helper/CartHelper";
const Card = ({
  product,
  addtoCart = true,
  removeFromCart = false,
  setReload = (f) => f,
  reload = undefined,
}) => {
  const [redirect, setRedirect] = useState(false);
  const cardTitle = product ? product.name : "404 Product";
  const cardDescription = product ? product.description : "404 description";
  const cardPrice = product ? product.price : "404 price";
  const getARedirect = (redirect) => {
    if (redirect) {
      return <Redirect to="/cart" />;
    }
  };
  const addItemsToCart = () => {
    addItemToCart(product, () => setRedirect(true));
  };
  const addToCart = () => {
    addItemToCart(product, () => setRedirect(true));
  };
  const showAddToCart = (addToCart) => {
    return (
      addtoCart && (
        <div className="col-12">
          <button
            onClick={addItemsToCart}
            className="btn btn-block btn-outline-success mt-2 mb-2"
          >
            Add to Cart
          </button>
        </div>
      )
    );
  };
  const showRemoveFromCart = (removeFromCart) => {
    return (
      removeFromCart && (
        <div className="col-12">
          <button
            onClick={() => {
              removeItemFromCart(product._id);
              setReload(!reload);
            }}
            className="btn btn-block btn-outline-danger mt-2 mb-2"
          >
            Remove from cart
          </button>
        </div>
      )
    );
  };
  return (
    <div className="card text-white bg-dark border border-info ">
      <div className="card-header lead">{cardTitle}</div>
      <div className="card-body">
        <ImageHelper product={product} />
        <p className="lead bg-success font-weight-normal text-wrap">
          {cardDescription}
        </p>
        <p className="btn btn-success rounded  btn-sm px-4">$ {cardPrice}</p>
        <div className="row">
          {showAddToCart(addtoCart)}
          {showRemoveFromCart(removeFromCart)}
          {getARedirect(redirect)}
        </div>
      </div>
    </div>
  );
};
export default Card;
