const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const bcryptSalt = 10;
const User = require('../models/user');


router.get('/signup', (req, res, next) => {
  res.render('auth/signup', {
    errorMessage: ''
  });
});

router.post('/signup', (req, res, next) => {
  const nameInput = req.body.name;
  const emailInput = req.body.email;
  const passwordInput = req.body.password;

  if (emailInput === '' || passwordInput === '') {
    res.render('auth/signup', {
      errorMessage: 'Enter both email and password to sign up.'
    });
    return;
  }

  User.findOne({ email: emailInput }, '_id', (err, existingUser) => { //dónde defino existingUSer???????
    if (err) {
      next(err);
      return;
    }

    if (existingUser !== null) {
      res.render('auth/signup', {
        errorMessage: `The email ${emailInput} is already in use.`
      });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashedPass = bcrypt.hashSync(passwordInput, salt);

    const userSubmission = {
      name: nameInput,
      email: emailInput,
      password: hashedPass
    };

    const theUser = new User(userSubmission);

    theUser.save((err) => {
     if (err) {
       res.render('auth/signup', {
         errorMessage: 'Something went wrong. Try again later.'
       });
       return;
     }

     res.redirect('/');

   });
  });
});

router.get('/login', (req, res, next) => {
  res.render('auth/login', {
    errorMessage: ''
  });
});
module.exports = router;
