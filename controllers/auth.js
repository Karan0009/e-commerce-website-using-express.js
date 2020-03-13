const crypto = require("crypto");

const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const { validationResult } = require("express-validator/check");
require("dotenv").config();

const User = require("../models/user");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY
    }
  })
);

exports.getLoginPage = (req, res, next) => {
  //   const isLoggedIn = req.get("Cookie");
  //thats how to get cookie
  //for session
  let message = req.flash("message");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    docName: "login",
    path: "/login",
    message: message,
    oldInput: ""
  });
};

exports.postLoginPage = (req, res, next) => {
  //   req.isLoggedin = true;
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      docName: "login",
      path: "/login",
      message: "invalid email or password",
      oldInput: email
    });
  }
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        console.log("invalid email");
        // req.flash("loginError", "Invalid email or password");
        // return res.redirect("/login");
        return res.status(422).render("auth/login", {
          docName: "login",
          path: "/login",
          message: "invalid email or password",
          oldInput: email
        });
      }
      bcrypt
        .compare(password, user.password)
        .then(result => {
          //this block will run even if result is true or false
          if (result) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            //this is normally not necessary
            //this is here to ensure to redirct only when session saving is done
            return req.session.save(err => {
              //console.log(err);
              console.log("logged in");
              req.flash("loginSuccess", "You are logged in");
              res.redirect("/products");
            });
          }
          console.log("invalid password");
          return res.status(422).render("auth/login", {
            docName: "login",
            path: "/login",
            message: "invalid email or password",
            oldInput: email
          });
          // req.flash("loginError", "Invalid email or password");
          // res.redirect("/login");
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    console.log("logged out");
    res.redirect("/products");
  });
};

exports.getSignupPage = (req, res, next) => {
  //   const isLoggedIn = req.get("Cookie");
  //thats how to get cookie
  //for session
  const flashMessage = req.flash("signupError");
  let errorMessage;
  if (flashMessage.length > 0) {
    errorMessage = flashMessage[0];
  } else {
    errorMessage = null;
  }
  const isLoggedIn = req.session.isLoggedIn;
  console.log(isLoggedIn);
  res.render("auth/signup", {
    docName: "signup",
    path: "/signup",
    errorMessage: errorMessage,
    oldInput: { email: "", password: "" },
    validationErrors: []
  });
};

exports.postSignupPage = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    // console.log("signup input errors");
    return res.status(422).render("auth/signup", {
      docName: "signup",
      path: "/signup",
      errorMessage: errors.array()[0].msg,
      oldInput: { email: email, password: password },
      //i am using only email in signup view but storing both for reference purposes
      validationErrors: errors.array()
    });
  }
  //this check is running now in auth.js routes using express-validator
  // User.findOne({ email: email })
  //   .then(userDoc => {
  //     if (userDoc) {
  //       console.log("user with same email found");
  //       req.flash(
  //         "signupError",
  //         "User with same email found,Enter a new email"
  //       );
  //       return res.redirect("/signup");
  //     }
  //hash the password
  //bigger the second argument more secure the password is
  //but more time it takes to hash
  //12 is good number here
  bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
      const user = new User({
        email: email,
        password: hashedPassword,
        cart: { totalPrice: 0, items: [] }
      });
      return user.save();
    })
    .then(result => {
      console.log("new user created");
      res.redirect("/login");
      const emailOptions = {
        from: process.env.SENDGRID_EMAIL,
        to: email,
        subject: "Welcome user",
        text:
          "Hello user \n thank you for signing in.Click here http://localhost:3000/products to see our products."
      };
      return transporter.sendMail(emailOptions, (err, info) => {
        if (err) console.log(err);
        else {
          console.log("email sent ", info);
        }
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getResetPage = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  let message = req.flash("message");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    docName: "reset",
    path: "/reset",
    message: message
  });
};

exports.postResetPage = (req, res, next) => {
  const email = req.body.email;
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      req.flash("message", "some error occured.Please try again");
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    User.findOne({ email: email })
      .then(user => {
        if (!user) {
          req.flash("message", "no user with this email found");
          return req.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpirationDate = Date.now() + 3600000;
        return user.save();
      })
      .then(result => {
        const emailOptions = {
          from: process.env.SENDGRID_EMAIL,
          to: email,
          subject: "password reset",
          html: `
            <p>you requested to reset password</p>
            </p>click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password</p>
            `
        };
        req.flash("message", "An email has been sent to that email");
        res.redirect("/login");
        transporter.sendMail(emailOptions, (err, info) => {
          if (err) console.log(err);
          else {
            console.log("email sent ", info);
          }
        });
      })
      .catch(err => {
        console.log(err);
      });
  });
};

exports.getNewPasswordPage = (req, res, next) => {
  const token = req.params.token;
  User.findOne({
    resetToken: token,
    resetTokenExpirationDate: { $gt: Date.now() }
  })
    .then(user => {
      if (!user) return res.redirect("/reset");
      let message = req.flash("message");
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render("auth/new-password", {
        docName: "new-password",
        path: "/new-password",
        message: message,
        userId: user._id.toString(),
        resetToken: token
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postNewPassword = (req, res, next) => {
  const password = req.body.password;
  const userId = req.body.userId;
  const resetToken = req.body.resetToken;
  let user;
  User.findOne({
    resetToken: resetToken,
    resetTokenExpirationDate: { $gt: Date.now() },
    _id: userId
  })
    .then(user => {
      if (!user) return res.redirect("/reset");
      user = user;
      bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          user.password = hashedPassword;
          user.resetToken = undefined;
          user.resetTokenExpirationDate = undefined;
          return user.save();
        })
        .then(result => {
          console.log("password changed");
          res.redirect("/login");
        });
    })

    .catch(err => {
      console.log(err);
    });
};
