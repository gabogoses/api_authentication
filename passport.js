const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const { ExtractJwt } = require('passport-jwt');
const GoogleStrategy = require('passport-google-oauth20');
const FacebookStrategy = require('passport-facebook');
const GithubStrategy = require('passport-github');

const keys = require('./config/keys');
const User = require('./models/user');

//____________________JWT STRATEGY____________________//

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromHeader('authorization'),
      secretOrKey: keys.JWT.SecretOrKey
    },
    async (payload, done) => {
      try {
        const user = await User.findById(payload.sub);

        if (!user) {
          return done(null, false);
        }

        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

//____________________LOCAL STRATEGY____________________//

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email'
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ 'local.email': email });

        if (!user) {
          return done(null, false);
        }

        const isMatch = await user.isValidPassword(password);

        if (!isMatch) {
          return done(null, false);
        }

        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

//____________________GOOGLE STRATEGY____________________//

passport.use(
  'google',
  new GoogleStrategy(
    {
      callbackURL: '/oauth/google/redirect',
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ 'google.id': profile.id });
        if (existingUser) {
          return done(null, existingUser);
        }
        const newUser = new User({
          method: 'google',
          google: {
            id: profile.id,
            username: profile.displayName,
            email: profile._json.email,
            picture: profile._json.picture
          }
        });
        await newUser.save();
        done(null, newUser);
      } catch (error) {
        done(error, false, error.message);
      }
    }
  )
);

//____________________FACEBOOK STRATEGY____________________//

passport.use(
  'facebook',
  new FacebookStrategy(
    {
      callbackURL: '/auth/facebook/redirect',
      clientID: keys.facebook.clientID,
      clientSecret: keys.facebook.clientSecret,
      profileFields: ['id', 'displayName', 'photos', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ 'facebook.id': profile.id });
        if (existingUser) {
          return done(null, existingUser);
        }
        const newUser = new User({
          method: 'facebook',
          facebook: {
            id: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value,
            picture: profile.photos[0].value
          }
        });
        console.log(newUser);
        await newUser.save();
        done(null, newUser);
      } catch (error) {
        done(error, false, error.message);
      }
    }
  )
);

//____________________GITHUB STRATEGY____________________//

passport.use(
  'github',
  new GithubStrategy(
    {
      callbackURL: '/auth/github/redirect',
      clientID: keys.github.clientID,
      clientSecret: keys.github.clientSecret
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ 'github.id': profile.id });
        if (existingUser) {
          return done(null, existingUser);
        }
        const newUser = new User({
          method: 'github',
          github: {
            id: profile.id,
            username: profile.displayName,
            picture: profile._json.avatar_url
          }
        });
        console.log(newUser);
        await newUser.save();
        done(null, newUser);
      } catch (error) {
        done(error, false, error.message);
      }
    }
  )
);
