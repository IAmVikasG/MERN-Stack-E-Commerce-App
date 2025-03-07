import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import moment from "moment";
import { useCart } from "react-use-cart";
import ShowImage from "./ShowImage";

const Card = ({
    product,
    showViewProductButton = true,
    showAddToCartButton = true,
    cartUpdate = false,
    showRemoveProductButton = false
}) =>
{
    const { addItem, updateItemQuantity, getItem, removeItem } = useCart();
    const [redirect, setRedirect] = useState(false);
    const [count, setCount] = useState(getItem(product.id)?.quantity);

    const showViewButton = showViewProductButton =>
    {
        return (
            showViewProductButton && (
                <Link to={`/product/${product._id}`} className="mr-2">
                    <button className="btn btn-outline-primary mt-2 mb-2">
                        View Product
                    </button>
                </Link>
            )
        );
    };

    const addToCart = () =>
    {
        addItem(product);
        setRedirect(true);
    };

    const shouldRedirect = redirect =>
    {
        if (redirect)
        {
            return <Redirect to="/cart" />;
        }
    };

    const showAddToCart = showAddToCartButton =>
    {
        return (
            showAddToCartButton && (
                <button
                    onClick={addToCart}
                    className="btn btn-outline-warning mt-2 mb-2"
                >
                    Add to cart
                </button>
            )
        );
    };

    const showRemoveButton = showRemoveProductButton =>
    {
        return (
            showRemoveProductButton && (
                <button
                    onClick={() => removeItem(product.id)}
                    className="btn btn-outline-danger mt-2 mb-2"
                >
                    Remove Product
                </button>
            )
        );
    };

    const showStock = quantity =>
    {
        return quantity > 0 ? (
            <span className="badge badge-primary badge-pill">In Stock</span>
        ) : (
            <span className="badge badge-primary badge-pill">Out of Stock</span>
        );
    };


    const handleChange = productId => event =>
    {
        setCount(event.target.value < 1 ? 1 : event.target.value);
        if (event.target.value >= 1)
        {
            updateItemQuantity(productId, parseInt(event.target.value));
        }
    };

    const showCartUpdateOptions = cartUpdate =>
    {
        return (
            cartUpdate && (
                <div>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text">
                                Adjust Quantity
                            </span>
                        </div>
                        <input
                            type="number"
                            className="form-control"
                            value={count}
                            onChange={handleChange(product.id)}
                        />
                    </div>
                </div>
            )
        );
    };

    return (
        <div className="card">
            <div className="card-header name">{product.name}</div>
            <div className="card-body">
                {shouldRedirect(redirect)}
                <ShowImage item={product} url="product" />
                <p className="lead mt-2">
                    {product.description.substring(0, 100)}
                </p>
                <p className="black-10">${product.price}</p>
                <p className="black-9">
                    Category: {product.category && product.category.name}
                </p>
                <p className="black-8">
                    Added on {moment(product.createdAt).fromNow()}
                </p>

                {showStock(product.quantity)}
                <br />

                {showViewButton(showViewProductButton)}

                {showAddToCart(showAddToCartButton)}

                {showRemoveButton(showRemoveProductButton)}

                {showCartUpdateOptions(cartUpdate)}
            </div>
        </div>
    );
};

export default Card;
