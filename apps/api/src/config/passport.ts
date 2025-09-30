import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';

// JWT strategy options
const jwtOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'my_jwt_secret', // secret key for access tokens
};

// Payload interface (if we were to strongly type the JWT payload)
interface JwtPayload {
  id: number;
  username: string;
}

// Configure Passport to use JWT strategy
passport.use(new JwtStrategy(jwtOptions, (jwtPayload: JwtPayload, done) => {
  try {
    // In a real app, we could look up the user by ID in the payload here.
    // For this challenge, we'll accept the token if it is valid.
    return done(null, jwtPayload); // attach payload to req.user
  } catch (err) {
    return done(err, false);
  }
}));

// We won't use sessions for APIs, so disable session support
passport.serializeUser((user, done) => done(null, false));
