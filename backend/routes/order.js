const express = require("express");
const router = express.Router();

const { requireSignin, isAuth } = require("../controllers/auth");
const { userById, addOrderToUserHistory } = require("../controllers/user");
const { create, listOrders } = require("../controllers/order");
const { decreaseQuantity } = require("../controllers/product");


router.get("/order/list/:userId", requireSignin, isAuth, isAdmin, listOrders);

router.post("/order/create/:userId", requireSignin, isAuth, addOrderToUserHistory, decreaseQuantity, create);

router.param("userId", userById);

module.exports = router;
