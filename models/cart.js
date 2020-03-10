// const fs = require("fs");
// const path = require("path");
// const rootDir = require("../util/path");

// const getPath = path.join(rootDir, "data", "cart.json");

// module.exports = class cart {
//   static addProduct(id, productPrice) {
//     //fetch the previous cart
//     let cart = { products: [], totalPrice: 0 };
//     fs.readFile(getPath, (err, fileContent) => {
//       if (!err) {
//         if (fileContent !== {}) cart = JSON.parse(fileContent);
//       }
//       //analyse the cart => find existing product

//       //existingProduct / updatedProduct is an object stored in a list in products in cart object
//       //which is different then product model
//       const existingProductIndex = cart.products.findIndex(prod => {
//         if (prod.id === id) return prod;
//       });
//       const existingProduct = cart.products[existingProductIndex];
//       let updatedProduct;
//       //add new product or increase quantity
//       if (existingProduct) {
//         updatedProduct = { ...existingProduct };
//         updatedProduct.qty = updatedProduct.qty + 1;
//         cart.products = [...cart.products];
//         cart.products[existingProductIndex] = updatedProduct;
//         // console.log(cart, "<<from existing prod block>>");
//       } else {
//         updatedProduct = { id: id, qty: 1 };
//         cart.products = [...cart.products, updatedProduct];
//         // console.log(cart, "<<from new prod block>>");
//       }
//       cart.totalPrice = cart.totalPrice + Number(productPrice);
//       // console.log(cart, "<<<<<<<cart>>>>>>>>");
//       fs.writeFile(getPath, JSON.stringify(cart), err => {
//         console.log(err);
//       });
//     });
//   }

//   static deleteProduct(id, price) {
//     fs.readFile(getPath, (err, fileContent) => {
//       if (err) return;
//       const updatedCart = { ...JSON.parse(fileContent) };
//       const product = updatedCart.products.find(p => p.id === id);
//       if (!product) return;
//       const prodQty = product.qty;
//       updatedCart.totalPrice = updatedCart.totalPrice - prodQty * price;
//       updatedCart.products = updatedCart.products.filter(p => p.id !== id);
//       fs.writeFile(getPath, JSON.stringify(updatedCart), err => {
//         // console.log(err);
//       });
//     });
//   }

//   static getCart(cb) {
//     fs.readFile(getPath, (err, fileContent) => {
//       const cart = JSON.parse(fileContent);
//       if (err) {
//         cb(null);
//       } else {
//         if (cart) cb(cart);
//         else cb(null);
//       }
//     });
//   }
// };
const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Cart = sequelize.define("cart", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  }
});

module.exports = Cart;
