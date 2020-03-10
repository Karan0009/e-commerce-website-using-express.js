module.exports = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    console.log("this code is in middleware/isAuth");
    return res.redirect("/login");
  }
  next();
};
