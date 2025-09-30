import express from 'express';
import { getEpisodeDetail } from '../controllers/tvshowController';

export const tvshowRouter = express.Router();

// Get details of a specific episode of a TV show
tvshowRouter.get('/:id/episodes/:episodeId', getEpisodeDetail);
