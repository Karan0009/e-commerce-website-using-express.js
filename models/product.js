//for mongoose
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

module.exports = mongoose.model("Product", productSchema);

// // this is when file system is being used
// // but now db is using
// // const fs = require("fs");
// // const path = require("path");
// // const rootDir = require("../util/path");

// const Cart = require("./cart");
// const db = require("../util/database");

// let products = [];

// // const getPath = path.join(rootDir, "data", "products.json");
// // //function that reads from file
// // const getProductsFromFile = cb => {
// //   fs.readFile(getPath, (err, fileContent) => {
// //     if (err) {
// //       cb([]);
// //     } else {
// //       if (fileContent != "") cb(JSON.parse(fileContent));
// //       else cb([]);
// //     }
// //   });
// // };

// module.exports = class Product {
//   constructor(id, title, imageUrl, description, price) {
//     this.id = id;
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this.price = price;
//   }

//   save() {
//     return db.execute(
//       "insert into products(title,description,imageUrl,price) values(?,?,?,?)",
//       [this.title, this.description, this.imageUrl, this.price]
//     );
//     // does the same work as getProductsFromFile()
//     // fs.readFile(getPath, (err, fileContent) => {
//     //   if (!err) {
//     //     console.log("fileContent >>>>>>>>", fileContent);
//     //     if (fileContent != "") products = JSON.parse(fileContent);
//     //     // console.log("no error");
//     //   }
//     //   // console.log("error");
//     // functionality for fs save()
//     // getProductsFromFile(products => {
//     //   if (this.id) {
//     //     const existingProductIndex = products.findIndex(p => p.id === this.id);
//     //     const updatedProducts = [...products];
//     //     updatedProducts[existingProductIndex] = this;
//     //     fs.writeFile(getPath, JSON.stringify(updatedProducts), err => {
//     //       //console.log(err);
//     //     });
//     //   } else {
//     //     this.id = Math.random().toString();
//     //     products.push(this);
//     //     fs.writeFile(getPath, JSON.stringify(products), err => {
//     //       //console.log(err);
//     //     });
//     //   }
//     // });
//   }

//   static deleteById(id) {
//     // functionality for fs
//     // getProductsFromFile(products => {
//     //   const product = products.find(p => p.id === id);
//     //   const newProductsArr = products.filter(p => p.id !== id);
//     //   fs.writeFile(getPath, JSON.stringify(newProductsArr), err => {
//     //     if (!err) {
//     //       // console.log("deleting from cart");
//     //       Cart.deleteProduct(id, product.price);
//     //     }
//     //   });
//     // });
//   }

//   static fetchAll() {
//     return db.execute("select * from products");
//     // put cb as argument in fetchAll() for fs
//     // functionality for fs
//     // getProductsFromFile(cb);
//   }

//   static findById(id) {
//     return db.execute("select * from products where products.id = ?", [id]);
//     // functionality for fs
//     // put cb as argument in fetchAll() for fs
//     // getProductsFromFile(products => {
//     //   const product = products.find(p => {
//     //     if (p.id === id) return p;
//     //   });
//     //   cb(product);
//     // });
//   }
// };

// above code for file and mysql
// below code for sequelize

// for sequelize

/* const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Product = sequelize.define("product", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  title: Sequelize.STRING,
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Product;
*/

// for mongodb
/* const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

class Product {
  constructor(title, imageUrl, description, price, id, userId) {
    this.title = title;
    this.description = description;
    this.imageUrl = imageUrl;
    this.price = price;
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.userId = userId;
  }

  save() {
    const db = getDb();
    var dbOp;
    if (this._id) {
      //update product
      dbOp = db
        .collection("products")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      //save new product
      dbOp = db.collection("products").insertOne(this);
    }
    return dbOp
      .then(() => {
        console.log("product inserted or updated");
      })
      .catch(err => {
        console.log(err);
      });
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection("products")
      .find()
      .toArray()
      .then(products => {
        return products;
      })
      .catch(err => {
        console.log(err);
      });
  }
  static findById(prodId) {
    const db = getDb();
    return db
      .collection("products")
      .find({ _id: new mongodb.ObjectId(prodId) })
      .next()
      .then(product => {
        return product;
      })
      .catch(err => {
        console.log(err);
      });
  }
  static deleteById(prodId) {
    const db = getDb();
    return db
      .collection("products")
      .deleteOne({ _id: new mongodb.ObjectId(prodId) })
      .then(() => {
        console.log("product deleted");
      })
      .catch(err => {
        console.log(err);
      });
  }
}

module.exports = Product; 
*/
