// this is used when using mysql2
// const mysql = require("mysql2");

// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   database: "nodetutshop",
//   password: "thisisme"
// });
// module.exports = pool.promise();

// for sequelize
// const Sequelize = require("sequelize");

// const sequelize = new Sequelize("nodetutshop", "root", "thisisme", {
//   dialect: "mysql",
//   host: "localhost"
// });

// module.exports = sequelize;
// for mongodb
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

var _db;

const mongoConnect = callback => {
  MongoClient.connect(
    "mongodb+srv://karan:12341234@cluster0-nuagw.mongodb.net/test?retryWrites=true&w=majority",
    { useNewUrlParser: true }
  )
    .then(client => {
      console.log("connected");
      _db = client.db();
      callback();
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) return _db;
  throw "no database connected";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
