import express from 'express';
import { getMovies, addMovie } from '../controllers/movieController';

export const movieRouter = express.Router();

// Get all movies (with optional filter/sort) and Add a new movie
movieRouter.get('/', getMovies);
movieRouter.post('/', addMovie);
