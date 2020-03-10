//core module of node for paths
const path = require("path");

//rootDir not used in this code
const rootDir = require("../util/path");

//controllers
const shopController = require("../controllers/shop");

//middlewares
const isAuth = require("../middlewares/isAuth");

const express = require("express");
const router = express.Router();

router.get("/another", shopController.getProductsPage);

// here :productId is dynamic param which can take place of any random thing
// after /products/,e.g., /products/23
// productId is kinda like variable which can be used now
//using req.params.productId
router.get("/products", shopController.getIndexPage);
router.get("/products/:productId", shopController.getProductDetailsPage);
router.get("/cart", isAuth, shopController.getCartPage); // cart page
router.post("/cart", isAuth, shopController.postCart); // adding products to cart
router.post("/cart-deleteProd", isAuth, shopController.postCartDeleteProduct);
// // router.get("/checkout", shopController.getCheckoutPage);
router.get("/orders", isAuth, shopController.getOrders);
router.post("/create-order", isAuth, shopController.postOrder);
router.get("/orders/:orderId", isAuth, shopController.getInvoice);

module.exports = router;
