const fs = require("fs");
const path = require("path");

const PDFDocument = require("pdfkit");

const Product = require("../models/product");
const Order = require("../models/order");
// const Cart = require("../models/cart");

const ITEMS_PER_PAGE = 3;

exports.getProductsPage = (req, res, next) => {
  // Product.fetchAll()

  Product.find()
    .then(products => {
      res.render("shop/product-list", {
        prods: products,
        docName: "shop",
        path: "/shop",
        shopPage: true,
        activeShop: true
      });
    })
    .catch(err => console.log(err));
  // Product.fetchAll()
  //   .then(([rows, fieldData]) => {
  //     res.render("shop/product-list", {
  //       prods: rows,
  //       docName: "shop",
  //       path: "/shop",
  //       hasProducts: rows.length > 0,
  //       shopPage: true,
  //       activeShop: true
  //     });
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   });
};

exports.getProductDetailsPage = (req, res, next) => {
  const prodId = req.params.productId;
  //Product.findById() is also a function for this purpose
  // Product.findAll({ where: { id: prodId } })
  Product.findById(prodId)
    .then(prod => {
      res.render("shop/product-details", {
        product: prod,
        title: prod.title,
        docName: prod.title,
        path: "/products"
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getIndexPage = (req, res, next) => {
  // + to convert string to int
  const page = +req.query.page || 1;
  let totalItems;

  const flashMessage = req.flash("loginSuccess");
  let errorMessage;
  if (flashMessage.length > 0) {
    alertMessage = flashMessage[0];
  } else {
    alertMessage = null;
  }

  Product.find()
    .countDocuments()
    .then(numProducts => {
      totalItems = numProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then(products => {
      res.render("shop/index", {
        prods: products,
        docName: "index-products",
        path: "/products",
        alertMessage: alertMessage,
        totalProducts: totalItems,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        currentPage: page,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
      });
    })
    .catch(err => console.log(err));
  // Product.fetchAll()
  //   .then(([rows, fieldData]) => {
  //     res.render("shop/index", {
  //       prods: rows,
  //       docName: "index-products",
  //       path: "/products"
  //     });
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   });
};

exports.getCartPage = (req, res, next) => {
  let totalPrice = 0;
  req.user
    // .getCart()
    .populate("cart.items.productId")
    .execPopulate()
    .then(user => {
      const products = user.cart.items;
      res.render("shop/cart", {
        cart: products,
        //totalPrice: cart.totalPrice,
        docName: "cart",
        path: "/cart"
      });
    })
    .catch(err => console.log(err));
};
// Cart.getCart(cart => {
//   if (typeof cart !== null) {
//     Product.fetchAll()
//       .then(([rows]) => {
//         const cartProducts = [];
//         for (product of rows) {
//           const cartProductData = cart.products.find(
//             p => p.id === product.id
//           );
//           if (cartProductData) {
//             cartProducts.push({
//               productData: product,
//               qty: cartProductData.qty
//             });
//           }
//         }
//         res.render("shop/cart", {
//           cart: cartProducts,
//           totalPrice: cart.totalPrice,
//           docName: "cart",
//           path: "/cart"
//         });
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   } else res.redirect("/another");
// });

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      console.log("product added to cart");
      res.redirect("/cart");
    })
    .catch(err => {
      console.log(err);
    });
  // let fetchedCart;
  // let newQuantity = 1;
  // req.user
  //   .getCart()
  //   .then(cart => {
  //     fetchedCart = cart;
  //     return cart.getProducts({ where: { id: prodId } });
  //   })
  //   .then(products => {
  //     let product;
  //     if (products.length > 0) {
  //       product = products[0];
  //     }
  //     if (product) {
  //       const oldQuantity = product.cartItem.quantity;
  //       newQuantity = oldQuantity + 1;
  //       return product;
  //     }
  //     return Product.findAll({ where: { id: prodId } });
  //   })
  //   .then(product => {
  //     return fetchedCart.addProduct(product, {
  //       through: { quantity: newQuantity }
  //     });
  //   })
  //   .then(result => {
  //     res.redirect("/cart");
  //   })
  //   .catch(err => console.log(err));
  // Product.findById(prodId, product => {
  //   Cart.addProduct(prodId, product.price);
  // });
  // res.redirect("/cart");
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .deleteItemFromCart(prodId)
    // req.user
    //   .getCart()
    //   .then(cart => {
    //     return cart.getProducts({ where: { id: prodId } });
    //   })
    //   .then(products => {
    //     const product = products[0];
    //     return product.cartItem.destroy();
    //   })
    .then(result => {
      console.log("product(s) removed from cart");
      res.redirect("/cart");
    })
    .catch(err => {
      console.log(err);
    });
  // Product.findById(prodId, product => {
  //   Cart.deleteProduct(prodId, product.price);
  //   res.redirect("/cart");
  // });
};

// exports.getCheckoutPage = (req, res, next) => {
//   res.render("shop/checkout", {
//     docName: "checkout",
//     path: "/checkout"
//   });
// };

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then(orders => {
      res.render("shop/orders", {
        path: "/orders",
        docName: "your orders",
        orders: orders
      });
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  req.user
    // .addOrder()
    .populate("cart.items.productId")
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          userEmail: req.user.email,
          userId: req.user._id
        },
        products: products
      });
      return order.save();
    })
    .then(res => {
      return req.user.clearCart();
    })
    // let fetchedCart;
    // req.user
    //   .getCart()
    //   .then(cart => {
    //     fetchedCart = cart;
    //     return cart.getProducts();
    //   })
    //   .then(products => {
    //     prods = products;
    //     return req.user.createOrder();
    //   })
    //   .then(order => {
    //     return order.addProducts(
    //       prods.map(product => {
    //         product.orderItem = { quantity: product.cartItem.quantity };
    //         return product;
    //       })
    //     );
    //   })
    //   .then(result => {
    //     return fetchedCart.setProducts(null);
    //   })
    .then(result => {
      res.redirect("/orders");
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
    .then(order => {
      if (!order) {
        return next(new Error("no order found"));
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error("unauthorized"));
      }
      const invoiceName = "invoice-" + orderId + ".pdf";
      const invoicePath = path.join("data", "invoices", invoiceName);

      const pdfDoc = new PDFDocument();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        "inline;"
        // 'attachment; filename="' + invoiceName + '"'
      );

      let totalPrice = 0;
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);
      pdfDoc.fontSize(26).text("Invoice", {
        underline: true
      });
      pdfDoc.text("------------------------");
      order.products.forEach(prod => {
        totalPrice += prod.product.price * prod.quantity;
        pdfDoc.fontSize(10).text("Item name: " + prod.product.title);
        pdfDoc.text("quantity: " + prod.quantity);
        pdfDoc.text(
          "Price: " +
            prod.product.price +
            "(" +
            prod.quantity +
            ") = " +
            prod.quantity * prod.product.price
        );
        pdfDoc.text("--------------");
      });
      pdfDoc.text("Total Price: " + totalPrice);
      pdfDoc.end();

      // const file = fs.createReadStream(invoicePath);
      // res.setHeader("Content-Type", "application/pdf");
      // res.setHeader(
      //   "Content-Disposition",
      //   "inline;"
      //   // 'attachment; filename="' + invoiceName + '"'
      // );

      // file.pipe(res);

      // fs.readFile(invoicePath, (err, data) => {
      //   if (err) {
      //     console.log(err);
      //     return next(err);
      //   }
      //   res.setHeader("Content-Type", "application/pdf");
      //   res.setHeader(
      //     "Content-Disposition",
      //     'attachment; filename="' + invoiceName + '"'
      //   );
      //   res.send(data);
      // });
    })
    .catch(err => next(err));
};
