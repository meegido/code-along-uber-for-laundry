module.exports = (req, res, next) =>  {
  if (req.session.currentUser) {
    res.locals.currentUserInfo = req.session.currentUser;
    res.locals.isUserLoggedIn = true;
  } else {
    res.locals.isUserLoggedIn = false;
  }

  next();
};

//les queremos dar a todas las plantillas esto así que middleware.
