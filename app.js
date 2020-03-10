const path = require("path");
//uses http.js in app.js or we can say using http.js
//const http = require("http");

const rootDir = require("./util/path");

//third party modules
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const csrf = require("csurf");
const flash = require("connect-flash");
const session = require("express-session");
const MongodbStore = require("connect-mongodb-session")(session);
require("dotenv").config();

//consts
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASS = process.env.DB_PASSWORD;
const PORT = process.env.PORT || 3000;
const MONGODB_URI = `mongodb+srv://${DB_USERNAME}:${DB_PASS}@cluster0-nuagw.mongodb.net/shop`;
// const expressHbs = require("express-handlebars");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

//sequelize
// const sequelize = require("./util/database");
//models
// const Product = require("./models/product");
const User = require("./models/user");
// const Cart = require("./models/cart");
// const CartItem = require("./models/cartItem");
// const Order = require("./models/order");
// const OrderItem = require("./models/orderItem");

//mongodb
// const mongoConnect = require("./util/database").mongoConnect;

//mongoose
const mongoose = require("mongoose");

//contorllers
const errorControllers = require("./controllers/error");

const app = express();
const store = new MongodbStore({
  uri: MONGODB_URI,
  collectin: "sessions"
});
const csrfProtection = csrf();

// if using handlebars template engine uncomment below snippet
// and expressHbs on line 9
// app.engine(
//   "hbs",
//   expressHbs({
//     layoutsDir: "views/layouts/",
//     defaultLayout: "main-layout",
//     extname: "hbs"
//   })
// );
//setting of default templating engine as pug
//and folder to look templates as views
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/product-images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: storage, fileFilter: fileFilter }).single("image"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use(express.static(path.join(__dirname, "uploads")));
//secret is the secret key for hashing
//check docs for express-session for more details
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
app.use(csrfProtection);
app.use(flash());

//sets isAuthen... and csrfToken for every rendered page
//so don't need to set these fields for each page individually
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

//save user in request so that user can be used
// anywhere in app conveniently
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      next(new Error(err));
    });
});

// app.get((req, res, next) => {
//   console.log("this always runs");
// });

app.use(adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

//route of error500 page
app.get("/error500", errorControllers.getError500Page);

app.use(errorControllers.getError404Page);

//error handling middleware
app.use((error, req, res, next) => {
  res.redirect("/error500");
});

// default path is "/"
// app.get("/", (req, res, next) => {
//   res.send("<h1>hello</h1>");
//   // used to pass request to next middleware
// });

//const routes = require("./routes");
//this three statements for running routes.js
//but remember to remove other http.createServer(()
//const server = http.createServer(routes);

// const server = http.createServer(app);
// server.listen(3000);
//above two lines or below one line do the same thing

//association
//one use can have many products(as in admin)
// Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
// User.hasMany(Product); // this is redundant but this is just to show
// User can have many Products

// User.hasOne(Cart);
// Cart.belongsToMany(Product, { through: CartItem });
// Product.belongsToMany(Cart, { through: CartItem });
// Order.belongsTo(User);
// User.hasMany(Order);
// Order.belongsToMany(Product, { through: OrderItem });

// sequelize
//   .sync()
//   // .sync({ force: true })
//   .then(result => {
//     // console.log(res);
//     return User.findAll({
//       where: {
//         id: 1
//       }
//     });
//   })
//   .then(users => {
//     const user = users[0];
//     if (!user) {
//       return User.create({ name: "raj", email: "rajJha@ab.com" });
//     }
//     return user; // a promise must be returned so
//     // return Promise.resolve(user);
//     // but return user is same
//     // because a value returned in then block
//     // is already a promise
//   })
//   // .then(user => {
//   //   return user.createCart();
//   // })
//   .then(user => {
//     app.listen(3000);
//   })
//   .catch(err => console.log(err));

// mongoConnect(() => {
//   app.listen(3000);
// });

//make mongoose connection
mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true })
  // .then(res => {
  //   const user = new User({
  //     username: "karan",
  //     email: "ks@test.com",
  //     cart: { items: [] }
  //   });
  //   return user.save();
  // })
  .then(res => {
    app.listen(PORT);
    console.log("connected");
  })
  .catch(err => console.log(err));
