import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Movie } from '../entities/Movie';
import { Actor } from '../entities/Actor';
import { Director } from '../entities/Director';

/**
 * GET /movies
 * Retrieve all movies, with optional filter by genre and sort by a specified field.
 */
export const getMovies = async (req: Request, res: Response) => {
  try {
    const movieRepo = AppDataSource.getRepository(Movie);
    // Build query with optional filter and sorting
    const where: any = {};
    if (req.query.genre) {
      where.genre = req.query.genre;
    }
    let order: any = {};
    if (req.query.sort) {
      const sortField = req.query.sort as string;
      // Allow sort by title or year for example
      if (['title', 'year'].includes(sortField)) {
        order[sortField] = 'ASC';
      }
    }
    // Find movies with relations (director and actors)
    const movies = await movieRepo.find({
      relations: { director: true, actors: true },
      where,
      order,
    });
    return res.json({ success: true, data: movies, message: 'Movies retrieved successfully' });
  } catch (error) {
    console.error('Error fetching movies:', error);
    return res.status(500).json({ success: false, data: null, message: 'Internal server error' });
  }
};

/**
 * POST /movies
 * Add a new movie. Expects title, genre, year, directorId, and optional actorIds in request body.
 */
export const addMovie = async (req: Request, res: Response) => {
  try {
    const { title, genre, year, directorId, actorIds } = req.body;
    if (!title || !genre || !directorId) {
      return res.status(400).json({ success: false, data: null, message: 'Title, genre, and directorId are required' });
    }
    const movieRepo = AppDataSource.getRepository(Movie);
    const directorRepo = AppDataSource.getRepository(Director);
    const actorRepo = AppDataSource.getRepository(Actor);

    // Find director by ID
    const director = await directorRepo.findOneBy({ id: directorId });
    if (!director) {
      return res.status(404).json({ success: false, data: null, message: 'Director not found' });
    }
    // Find actors by IDs (if provided)
    let actors: Actor[] = [];
    if (Array.isArray(actorIds) && actorIds.length > 0) {
      actors = await actorRepo.findByIds(actorIds);
      // Optionally, check if some actorIds were not found
      const foundIds = actors.map(a => a.id);
      const notFoundIds = actorIds.filter((id: number) => !foundIds.includes(id));
      if (notFoundIds.length) {
        return res.status(404).json({ success: false, data: null, message: `Actors not found: ${notFoundIds.join(', ')}` });
      }
    }
    // Create and save new Movie
    const newMovie = movieRepo.create({ title, genre, year: year || new Date().getFullYear(), director, actors });
    await movieRepo.save(newMovie);
    return res.status(201).json({ success: true, data: newMovie, message: 'Movie created successfully' });
  } catch (error) {
    console.error('Error adding movie:', error);
    return res.status(500).json({ success: false, data: null, message: 'Internal server error' });
  }
};
