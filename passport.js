const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const { ExtractJwt } = require('passport-jwt');

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
    async (username, email, password, done) => {
      const user = await User.findOne({ email });

      if (!user) {
        return done(null, false);
      }
    }
  )
);
