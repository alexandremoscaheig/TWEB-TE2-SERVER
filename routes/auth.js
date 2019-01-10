const express = require('express');
const passport = require('passport');
const passportLocal = require('passport-local');
const passportJWT = require('passport-jwt');
const jwt = require('jsonwebtoken');
const { jwtOptions } = require('../config');

const DBUtils = require('../src/mongoDBUtils');

const USER = {
  id: '1234678',
  email: 'example@example.com',
  username: 'admin',
  password: 'admin',
};

const router = express.Router();
const LocalStrategy = passportLocal.Strategy;
const JWTStrategy = passportJWT.Strategy;
const { ExtractJwt } = passportJWT;

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  (username, password, done) => {
    DBUtils.getUserLogin(username, password).then((user) => {
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    });
  },
));

passport.use(new JWTStrategy(
  {
    secretOrKey: jwtOptions.secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  },
  (jwtPayload, done) => {
    const { userId } = jwtPayload;
    DBUtils.getUserById(userId).then((user) => {
      if (!user) {
        return done(null, false);
      }
      return done(null, USER);
    });
  },
));


router.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
  const { user } = req;
  const token = jwt.sign({ userId: user.id }, jwtOptions.secret);
  res.send({ user, token });
});


module.exports = router;
