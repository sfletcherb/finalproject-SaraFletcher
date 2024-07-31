const setBodyClass = (req, res, next) => {
  res.locals.bodyClass = "other-pages";

  if (req.path === "/" || req.path === "/login-register") {
    res.locals.bodyClass = "main-page";
  }

  next();
};

const showHeader = (req, res, next) => {
  const noHeaderRoutes = ["/", "/login-register"];
  res.locals.showHeader = !noHeaderRoutes.includes(req.path);
  next();
};

module.exports = { setBodyClass, showHeader };
