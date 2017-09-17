const path = require('path')
const express = require('express');
const bcrypt = require('bcrypt');
const multer = require('multer'); //es un objeto y tiene método single (solo un archivo con nombre que digamos)
const User = require('../models/user');

const router = express.Router();
const bcryptSalt = 10;
const destination = path.join(__dirname, '../public/avatars/')
const upload = multer({ dest: destination })


router.get('/signup', (req, res, next) => {
  res.render('auth/signup', {
    errorMessage: ''
  });
});

router.post('/signup', upload.single('avatar'), (req, res, next) => {
  const avatarInput = req.body.avatar;
  const nameInput = req.body.name;
  const emailInput = req.body.email;
  const passwordInput = req.body.password;

  // console.log('\n\n\n\n')
  // console.log(req.file)
  // console.log('\n\n\n\n')

  if (emailInput === '' || passwordInput === '') {
    res.render('auth/signup', {
      errorMessage: 'Enter both email and password to sign up.'
    });
    return;
  }

  User.findOne({ email: emailInput }, '_id', (err, existingUser) => { //existingUser 2º param del cb, exito
    if (err) { return next(err); }

    if (existingUser) {
      return res.render('auth/signup', {
        errorMessage: `The email ${emailInput} is already in use.`
      });

    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashedPass = bcrypt.hashSync(passwordInput, salt);

    const userSubmission = {
      avatar: `/avatars/${req.file.filename}`,
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

router.post('/login', (req, res, next) => {
  const emailInput = req.body.email;
  const passwordInput = req.body.password;

  if (emailInput === '' || passwordInput === '') {
    res.render('auth/login', {
      errorMessage: 'Enter both email and password to log in.'
    });
    return;
  }

  User.findOne({ email: emailInput }, (err, theUser) => {
    if (err || theUser === null) {
      res.render('auth/login', {
        errorMessage: `There isn't an account with email ${emailInput}.`
      });
      return;
    }

    if (!bcrypt.compareSync(passwordInput, theUser.password)) {
      res.render('auth/login', {
        errorMessage: 'Invalid password.'
      });
      return;
    }

    req.session.currentUser = theUser; //de aquí vamos al middleware... local!
    res.redirect('/');
  });
});

router.get('/logout', (req, res, next) => {
  console.log(req.session)
  if(!req.session.currentUser) {
    res.redirect('/');
    return;
  }

  req.session.destroy((err) => {
    if (err) {
      next(err);
      return;
    }
  })
  res.redirect('/')
})


module.exports = router;
