exports.getError404Page = (req, res, next) => {
  // res.status(404).sendFile(path.join(rootDir, "views", "error404.html"));
  res.render("error404", {
    docName: "page not found",
    path: "page not found"
  });
};

exports.getError500Page = (req, res, next) => {
  // res.status(404).sendFile(path.join(rootDir, "views", "error404.html"));
  res.render("error500", {
    docName: "error",
    path: "/error500"
  });
};
