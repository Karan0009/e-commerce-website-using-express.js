const express = require("express");
const { check, body } = require("express-validator/check");
const router = express.Router();

const authController = require("../controllers/auth");
const User = require("../models/user");

router.get("/login", authController.getLoginPage);
router.post(
  "/login",
  [
    check("email")
      .isEmail()
      .normalizeEmail(),
    body("password")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim()
  ],
  authController.postLoginPage
);
router.post("/logout", authController.postLogout);
router.get("/signup", authController.getSignupPage);
// check for email(name="email" set on signup page) as if it is in email format or not
router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject("user with same email found");
          }
        });
      })
      .normalizeEmail(),
    body("password", "password must be atleast 5 alphanumeric characters")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords don't match");
        }
        return true;
      })
  ],
  authController.postSignupPage
);
router.get("/reset", authController.getResetPage);
router.post("/reset", authController.postResetPage);
router.get("/reset/:token", authController.getNewPasswordPage);
router.post("/new-password", authController.postNewPassword);
module.exports = router;
