const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');

const passportSetup = require('../passport');
const { validateBody, schemas } = require('../helpers/routesHelpers');
const UsersController = require('../controllers/users');

router
  .route('/signup')
  .post(validateBody(schemas.authSchema), UsersController.signUp);

router
  .route('/signin')
  .post(
    validateBody(schemas.signInSchema),
    passport.authenticate('local', { session: false }),
    UsersController.signIn
  );

router
  .route('/secret')
  .get(
    passport.authenticate('jwt', { session: false }),
    UsersController.secret
  );

router
  .route('/oauth/google')
  .post(
    passport.authenticate(
      'google',
      { scope: ['profile', 'email'] },
      { session: false }
    ),
    UsersController.googleOAuth
  );

router
  .route('/oauth/facebook')
  .post(passport.authenticate('facebook'), UsersController.facebookOAuth);

module.exports = router;
