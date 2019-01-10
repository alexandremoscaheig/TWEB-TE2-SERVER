const express = require('express');
const passport = require('passport');
const ResponseError = require('../src/ResponseError');
const DBUtils = require('../src/mongoDBUtils');

const router = express.Router();
const authenticated = () => passport.authenticate('jwt', { session: false });

router.post('/register', (req, res, next) => {
  const user = req.body;
  if (!user.email || user.email === '' || !user.password || user.password === '') {
    throw new ResponseError({ status: 400, url: 'register' }, { message: 'Username and password must not be blank.' });
  }
  DBUtils.getUser(user.email)
    .then((dbUser) => {
      if (dbUser) {
        throw new ResponseError({ status: 400, url: 'register' }, { message: 'Email already exists' });
      }
      DBUtils.addUser(user)
        .then(newUser => res.send(newUser))
        .catch(next);
    })
    .catch(next);
});

router.get('/welcome', authenticated(), (req, res) => {
  res.send({ messages: 'Hello world!' });
});

router.get('/me', authenticated(), (req, res) => {
  // ToDo : Send current user
  res.send({ user: req.user });
});

module.exports = router;
