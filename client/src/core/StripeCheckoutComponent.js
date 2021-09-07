import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { isAutheticated } from "../auth/helper";
import { cartEmpty, loadCart } from "./helper/CartHelper";
import StripeCheckout from "react-stripe-checkout";
import { API } from "../backend";
export default function StripeCheckoutComponent({
  products,
  setReload = (f) => f,
  reload = undefined,
}) {
  const [data, setData] = useState({
    loading: false,
    success: false,
    error: "",
    address: "",
  });
  const token = isAutheticated() && isAutheticated().token;
  const userId = isAutheticated() && isAutheticated().user._id;

  const getFinalPrice = () => {
    let amount = 0;
    products.map((product) => {
      amount = amount + product.price;
    });
    return amount;
  };
  const makePayment = (token) => {
    const body = {
      token,
      products,
    };
    const headers = {
      "Content-Type": "application/json",
    };
    return fetch(`${API}/stripepayment`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    })
      .then((response) => {
        console.log("====================================");
        console.log(response);
        console.log("====================================");
      })
      .catch((err) => console.log(err));
  };
  const showStripeButton = () => {
    return isAutheticated() ? (
      <StripeCheckout
        stripeKey="pk_test_51JEUjdSCf6j2metuxlB2NdetMzvqAd2o2M44VoLHqJoV7gcTqlM20gqwv9EGLivXieYIhRgMHHOOBwNuLJ5SzCJy00xCZ9O6JX"
        token={makePayment}
        amount={getFinalPrice() * 100}
        name="Buy this product"
        shippingAddress
        billingAddress
      >
        <button className="btn btn-success">Pay with Stripe</button>
      </StripeCheckout>
    ) : (
      <Link to="/signin">
        <button className="btn btn-warning">SignIn to Checkout</button>
      </Link>
    );
  };
  return (
    <div>
      <h3 className="text-white">Stripe Checkout {getFinalPrice()}</h3>
      {showStripeButton()}
    </div>
  );
}
