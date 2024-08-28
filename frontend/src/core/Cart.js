import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "react-use-cart";
import Layout from "./Layout";
import Card from "./Card";


const Cart = () => {
    const [itemsObj, setItemsObj] = useState([]);
    const { items } = useCart();


    useEffect(() => {
        setItemsObj(items);
    }, []);

    const showItems = itemsObj => {
        return (
            <div>
                <h2>Your cart has {`${itemsObj.length}`} items</h2>
                <hr />
                {itemsObj.map((product, i) => (
                    <Card key={i} product={product} />
                ))}
            </div>
        );
    };

    const noItemsMessage = () => (
        <h2>
            Your cart is empty. <br /> <Link to="/shop">Continue shopping</Link>
        </h2>
    );

    return (
        <Layout
            title="Shopping Cart"
            description="Manage your cart items. Add remove checkout or continue shopping."
            className="container-fluid"
        >
            <div className="row">
                <div className="col-6">
                    {itemsObj.length > 0 ? showItems(itemsObj) : noItemsMessage()}
                </div>

                <div className="col-6">
                    <p>
                        show checkout options/shipping address/total/update
                        quantity
                    </p>
                </div>
            </div>
        </Layout>
    );
};

export default Cart;
