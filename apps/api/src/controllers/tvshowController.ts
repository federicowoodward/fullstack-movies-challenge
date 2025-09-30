import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Episode } from '../entities/Episode';

/**
 * GET /tvshows/:id/episodes/:episodeId
 * Retrieve details of a specific episode (with its director) for a given TV show.
 */
export const getEpisodeDetail = async (req: Request, res: Response) => {
  const showId = parseInt(req.params.id);
  const episodeId = parseInt(req.params.episodeId);
  if (!showId || !episodeId) {
    return res.status(400).json({ success: false, data: null, message: 'TV show ID and episode ID are required' });
  }
  try {
    const episodeRepo = AppDataSource.getRepository(Episode);
    // Find the episode with its season and show and director
    const episode = await episodeRepo.findOne({
      where: { id: episodeId },
      relations: { season: { show: true }, director: true }
    });
    if (!episode || !episode.season || episode.season.show.id !== showId) {
      // Episode not found or does not belong to the TV show
      return res.status(404).json({ success: false, data: null, message: 'Episode not found for this TV show' });
    }
    return res.json({ success: true, data: episode, message: 'Episode retrieved successfully' });
  } catch (error) {
    console.error('Error fetching episode detail:', error);
    return res.status(500).json({ success: false, data: null, message: 'Internal server error' });
  }
};
