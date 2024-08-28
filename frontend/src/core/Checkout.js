import React, { useState, useEffect } from "react";
import { useCart } from "react-use-cart";
import Layout from "./Layout";
import { getProducts } from "./apiCore";
import Card from "./Card";
import { isAuthenticated } from "../API/auth";
import { Link } from "react-router-dom";

const Checkout = () =>
{
    const { cartTotal } = useCart();

    const getTotal = () => {
        return cartTotal;
    };

    const showCheckout = () => {
        return isAuthenticated() ? (
            <button className="btn btn-success">Checkout</button>
        ) : (
            <Link to="/signin">
                <button className="btn btn-primary">Sign in to checkout</button>
            </Link>
        );
    };

    return (
        <div>
            <h2>Total: ${getTotal()}</h2>

            {showCheckout()}
        </div>
    );
};

export default Checkout;
