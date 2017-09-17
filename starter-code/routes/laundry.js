const express = require('express');
const router = express.Router();
const User = require('../models/user');

//middleware de autorización para el resto de rutas de laundry
router.use((req, res, next) => {
  if (req.session.currentUser) {
    return next(); //siguiente ruta
  }
  res.redirect('/login');
});

router.get('/dashboard', (req, res, next) => {
  res.render('laundry/dashboard');
});

router.post('/launderers', (req, res, next) => {
  const userId = req.session.currentUser._id;
  const laundererInfo = {
    fee: req.body.fee,
    isLaunderer: true
  };

  User.findByIdAndUpdate(userId, laundererInfo, { new: true }, (err, theUser) => {
    if (err) {
      next(err);
      return;
    }

    req.session.currentUser = theUser;


    res.redirect('/dashboard');
  });
});

module.exports = router;
