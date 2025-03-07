import React, { useState, useEffect } from "react";
import { useCart } from "react-use-cart";
import Layout from "./Layout";
import { getBraintreeClientToken, processPayment, createOrder } from "./apiCore";
import { isAuthenticated } from "../API/auth";
import { Link } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";

const Checkout = () =>
{
    const { cartTotal, items, isEmpty, emptyCart } = useCart();

    const [data, setData] = useState({
        success: false,
        clientToken: null,
        error: "",
        instance: {},
        address: ""
    });

    const userId = isAuthenticated() && isAuthenticated().user._id;
    const token = isAuthenticated() && isAuthenticated().token;

    const getToken = (userId, token) =>
    {
        getBraintreeClientToken(userId, token).then(data =>
        {
            if (data.error)
            {
                setData({ ...data, error: data.error });
            } else
            {
                setData({ clientToken: data.clientToken });
            }
        });
    };

    useEffect(() =>
    {
        getToken(userId, token);
    }, []);

    const handleAddress = event =>
    {
        setData({ ...data, address: event.target.value });
    };

    const getTotal = () => {
        return cartTotal;
    };

    const showCheckout = () =>
    {
        return isAuthenticated() ? (
            <div>{showDropIn()}</div>
        ) : (
            <Link to="/signin">
                <button className="btn btn-primary">Sign in to checkout</button>
            </Link>
        );
    };

    let deliveryAddress = data.address;

    const buy = () =>
    {
        // send the nonce to your server
        // nonce = data.instance.requestPaymentMethod()
        let nonce;
        let getNonce = data.instance
            .requestPaymentMethod()
            .then(data =>
            {
                // console.log(data);
                nonce = data.nonce;
                // once you have nonce (card type, card number) send nonce as 'paymentMethodNonce'
                // and also total to be charged
                // console.log(
                //     "send nonce and total to process: ",
                //     nonce,
                //     getTotal(products)
                // );
                const paymentData = {
                    paymentMethodNonce: nonce,
                    amount: getTotal()
                };

                processPayment(userId, token, paymentData)
                    .then(response =>
                    {
                        // console.log(response
                        setData({ ...data, success: response.success });
                        // create order
                        const createOrderData = {
                            products: items,
                            transaction_id: response.transaction.id,
                            amount: response.transaction.amount,
                            address: deliveryAddress
                        };

                        createOrder(userId, token, createOrderData)
                            .then(response =>
                            {
                                emptyCart();
                            })
                            .catch(error =>
                            {
                                console.log(error);
                                setData({ loading: false });
                            });
                    })
                    .catch(error => console.log(error));
            })
            .catch(error =>
            {
                // console.log("dropin error: ", error);
                setData({ ...data, error: error.message });
            });
    };

    const showDropIn = () => (
        <div onBlur={() => setData({ ...data, error: "" })}>
            {data.clientToken !== null && !isEmpty && items.length > 0 ? (
                <div>
                    <div className="gorm-group mb-3">
                        <label className="text-muted">Delivery address:</label>
                        <textarea
                            onChange={handleAddress}
                            className="form-control"
                            value={data.address}
                            placeholder="Type your delivery address here..."
                        />
                    </div>
                    <DropIn
                        options={{
                            authorization: data.clientToken
                            // paypal: {
                            //     flow: "vault"
                            // }
                        }}
                        onInstance={instance => (data.instance = instance)}
                    />
                    <button onClick={buy} className="btn btn-success btn-block">
                        Pay
                    </button>
                </div>
            ) : null}
        </div>
    );

    const showError = error => (
        <div
            className="alert alert-danger"
            style={{ display: error ? "" : "none" }}
        >
            {error}
        </div>
    );

    const showSuccess = success => (
        <div
            className="alert alert-info"
            style={{ display: success ? "" : "none" }}
        >
            Thanks! Your payment was successful!
        </div>
    );

    return (
        <div>
            <h2>Total: ${getTotal()}</h2>
            {showSuccess(data.success)}
            {showError(data.error)}
            {showCheckout()}
        </div>
    );
};

export default Checkout;
