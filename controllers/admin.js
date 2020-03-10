const Product = require("../models/product");
const { validationResult } = require("express-validator/check");
// const Sequelize = require("sequelize");
// const mongodb = require("mongodb");
const mongoose = require("mongoose");

const fileHelper = require("../util/file");

const ITEMS_PER_PAGE = 3;

exports.getAddProductPage = (req, res, next) => {
  // res.sendFile(path.join(rootDir, "views", "add-product.html"));
  res.render("admin/edit-product", {
    docName: "add product",
    path: "/add-product",
    addProductPage: true, //not used
    activeAddProduct: true, //not used
    editing: false,
    hasErrors: false,
    product: { title: "", description: "", price: "" },
    errorMessage: undefined,
    validationErrors: []
  });
};

exports.postAddProductPage = (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const description = req.body.description;
  const price = req.body.price;
  console.log(image, "this is image");
  if (!image) {
    //if image is undefined or null
    console.log("invalid image");
    return res.status(422).render("admin/edit-product", {
      docName: "add product",
      path: "/add-product",
      editing: false,
      hasErrors: true,
      product: {
        title: title,
        description: description,
        price: price
      },
      errorMessage: "Attached file is not image",
      validationErrors: []
    });
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      docName: "add product",
      path: "/add-product",
      editing: false,
      hasErrors: true,
      product: {
        title: title,
        description: description,
        price: price
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }
  //this is for mongodb
  // const product = new Product(
  //   title,
  //   imageUrl,
  //   description,
  //   price,
  //   null,
  //   req.user._id
  // );
  //this is for mongoose
  const imageUrl = image.path;
  const product = new Product({
    title: title,
    imageUrl: imageUrl,
    description: description,
    price: price,
    userId: req.user._id
    // can store the whole user( req.user ) mongoose will select only req.user._id
  });
  product
    .save()
    // req.user
    //   .createProduct({
    //     title: title,
    //     price: price,
    //     imageUrl: imageUrl,
    //     description: description
    //   })
    // Product.create({
    //   title: title,
    //   price: price,
    //   imageUrl: imageUrl,
    //   description: description,
    //   userId: req.user.id
    // })
    .then(result => {
      console.log("product added");
      res.redirect("/admin/products");
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);

      // res.redirect("/error500");

      // res.status(500).render("admin/edit-product", {
      //   docName: "add product",
      //   path: "/add-product",
      //   editing: false,
      //   hasErrors: true,
      //   product: {
      //     title: title,
      //     imageUrl: imageUrl,
      //     description: description,
      //     price: price
      //   },
      //   errorMessage: "database operation failed,please try again",
      //   validationErrors: errors.array()
      // });
    });

  // for mysql
  // const product = new Product(null, title, imageUrl, description, price);
  // product.save().then(() => {
  //   res.redirect("/another"); // redirct to /
  // });
};

exports.getEditProductPage = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) return res.redirect("/admin/products");
  const prodId = req.params.productId;
  // req.user
  //   .getProducts({ where: { Id: prodId } })
  Product.findById(prodId)
    .then(prod => {
      res.render("admin/edit-product", {
        docName: "edit product",
        path: "/adminProducts",
        editing: editMode,
        hasErrors: true,
        product: prod,
        errorMessage: undefined,
        validationErrors: []
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const image = req.file;
  const updatedDesc = req.body.description;
  const updatedprice = req.body.price;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(422).render("admin/edit-product", {
      docName: "edit product",
      path: "/adminProducts",
      editing: true,
      hasErrors: false,
      product: {
        title: updatedTitle,
        description: updatedDesc,
        price: updatedprice,
        _id: prodId
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }
  // Product.findAll({ where: { id: prodId } })
  // const product = new Product(
  //   updatedTitle,
  //   updatedimageUrl,
  //   updatedDesc,
  //   updatedprice,
  //   prodId,
  //   req.user._id
  // );
  let updatedProduct;
  if (image) {
    Product.findById(prodId)
      .then(product => {
        fileHelper.deleteFile(product.imageUrl);
      })
      .catch(err => {
        next(err);
      });

    updatedProduct = {
      title: updatedTitle,
      imageUrl: image.path,
      description: updatedDesc,
      price: updatedprice
    };
  } else {
    updatedProduct = {
      title: updatedTitle,
      description: updatedDesc,
      price: updatedprice
    };
  }

  Product.updateOne({ _id: prodId, userId: req.user._id }, updatedProduct)
    // product
    //   .save()
    .then(result => {
      console.log("product updated");
      res.redirect("/admin/products");
    })
    .catch(err => console.log(err));
};

// exports.deleteProduct = (req, res, next) => {
//   console.log("hey");
//   res.json("karan");
//   // const prodId = req.params.productId;
//   // // Product.destroy({ where: { id: prodId } })
//   // // Product.deleteById(prodId)

//   // Product.findById(prodId)
//   //   .then(product => {
//   //     if (!product) {
//   //       return next(new Error("product not found"));
//   //     }
//   //     fileHelper.deleteFile(product.imageUrl);
//   //     return Product.deleteOne({ _id: prodId, userId: req.user._id });
//   //   })
//   //   .then(() => {
//   //     console.log("product deleted");
//   //     res.status(200).json({ msg: "successful" });
//   //     // res.redirect("/admin/products");
//   //   })
//   //   .catch(err => {
//   //     res.status(500).json({ msg: "failed" });
//   //   });

//   // alternatively
//   // Product.findAll({ where: { id: prodId } })
//   //   .then(product => {
//   //     return product[0].destroy();
//   //   })
//   //   .then(result => {
//   //     console.log("product deleted");
//   //     res.redirect("/admin/products");
//   //   })
//   //   .catch(err => console.log(err));
// };

exports.deleteProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return next(new Error("Product not found."));
      }
      fileHelper.deleteFile(product.imageUrl);
      return Product.deleteOne({ _id: prodId, userId: req.user._id });
    })
    .then(() => {
      console.log("DESTROYED PRODUCT");
      res.status(200).json();
      // res.status(200).json({ message: "Success!" });
    })
    .catch(err => {
      res.status(500).json();
    });
};

exports.getAdminProductsPage = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  Product.find({ userId: req.user._id })
    .countDocuments()
    .then(numProducts => {
      totalItems = numProducts;
      return Product.find({ userId: req.user._id })
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then(products => {
      res.render("admin/products", {
        prods: products,
        docName: "admin/products",
        path: "/adminProducts",
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        currentPage: page,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
      });
    })
    .catch(err => console.log(err));
};
