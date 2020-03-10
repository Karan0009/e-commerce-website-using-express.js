const path = require("path");

const { body } = require("express-validator/check");
const express = require("express");
const router = express.Router();

//rootDir is not used in this code
//so it's useless here
const rootDir = require("../util/path");

//conrollers below
const adminController = require("../controllers/admin");

//middlewares
const isAuth = require("../middlewares/isAuth");

//request to the route will go from left to right.....------------->
router.get("/add-product", isAuth, adminController.getAddProductPage);
router.post(
  "/product",
  [
    body("title")
      .isString()
      .isLength({ min: 3 })
      .trim()
      .withMessage("title must be at least 3 characters long"),
    body("price")
      .isNumeric()
      .withMessage("price is invalid"),
    body("description")
      .isString()
      .isLength({ min: 5, max: 400 })
      .trim()
      .withMessage(
        "description must be al least 5 and maximum 400 characters long"
      )
  ],
  isAuth,
  adminController.postAddProductPage
);
router.get(
  "/admin/edit-product/:productId",
  isAuth,
  adminController.getEditProductPage
);
router.post(
  "/admin/edit-product",
  [
    body("title")
      .isString()
      .isLength({ min: 3 })
      .trim()
      .withMessage("title must be at least 3 characters long"),
    body("price")
      .isNumeric()
      .withMessage("price is invalid"),
    body("description")
      .isString()
      .isLength({ min: 5, max: 400 })
      .trim()
      .withMessage(
        "description must be al least 5 and maximum 400 characters long"
      )
  ],
  isAuth,
  adminController.postEditProduct
);
router.get("/admin/products", isAuth, adminController.getAdminProductsPage);

//this route is for async deletion of product
router.post("/admin/product/:productId", isAuth, adminController.deleteProduct);

// router.post(
//   "/admin/delete-product",
//   isAuth,
//   adminController.postAdminDeleteProduct
// );

//exports.routes = router;
//exports.products = products;

// other way of exporting stuff
module.exports = router;
