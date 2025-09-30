import 'reflect-metadata';  // required for TypeORM
import express from 'express';
import passport from 'passport';
import swaggerUi from 'swagger-ui-express';

import { AppDataSource } from './config/database';
import './config/passport';  // import to initialize JWT strategy
import { authRouter } from './routes/auth.routes';
import { movieRouter } from './routes/movie.routes';
import { tvshowRouter } from './routes/tvshow.routes';

// Swagger documentation JSON
// (Using require to import the JSON file. Ensure `resolveJsonModule` is enabled in tsconfig if using import.)
const swaggerDocument = require('./config/swagger.json');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(passport.initialize());

// Routes
app.use('/auth', authRouter);
// Protect movie and tvshow routes with JWT authentication
app.use('/movies', passport.authenticate('jwt', { session: false }), movieRouter);
app.use('/tvshows', passport.authenticate('jwt', { session: false }), tvshowRouter);

// Swagger UI setup at /docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Root route (optional, e.g., health check or welcome)
app.get('/', (_req, res) => {
  res.send('Welcome to the Movies & TV Shows API');
});

// Initialize database and start server
AppDataSource.initialize()
  .then(() => {
    console.log('Data Source initialized successfully');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
