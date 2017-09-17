const express = require('express');
const User = require('../models/user');
const LaundryPickup = require('../models/laundry-pickup');
const router = express.Router();


//middleware de autorización para el resto de rutas de laundry
router.use((req, res, next) => {
  if (req.session.currentUser) {
    return next(); //siguiente ruta
  }
  res.redirect('/login');
});

router.get('/dashboard', (req, res, next) => {
  let query = { launderer: req.session.currentUser._id };

  if(!req.session.currentUser.isLaunderer) {
    query = { user: req.session.currentUser._id };
  }

  LaundryPickup
    .find(query)
    .populate('user', 'name')
    .populate('launderer', 'name')
    .sort('pickupDate')
    .exec((err, pickupDocs) => {
      if(err) {
        return next(err);
      }
      res.render('laundry/dashboard', {
        pickups: pickupDocs
      });
    });
});

router.get('/launderers', (req, res, next) => {
  User.find({ isLaunderer: true}, (err, launderersList) => {
    if(err) {
      return next(err)
    }
    res.render('laundry/launderers', { launderers: launderersList })
  });
});

router.get('/launderers/:id', (req, res, next) => {
  const laundererId = req.params.id;

  User.findById(laundererId, (err, theUser) => {
    if (err) {
      return next(err);
    }
    res.render('laundry/launderer-profile', { theLaunderer: theUser });
  });
});

router.post('/laundry-pickups', (req, res, next) => {
  const pickupInfo = {
    pickupDate: req.body.pickupDate,
    launderer: req.body.laundererId,
    user: req.session.currentUser._id
  }

  const thePickup = new LaundryPickup(pickupInfo);

  thePickup.save((err) => {
    if(err) {
      return next(err);
    }
    res.redirect('/dashboard')
  })
})

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
