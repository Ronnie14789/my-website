import { Request, Response } from 'express';
import Project from '../models/Project';
import logger from '../utils/logger';

/**
 * @swagger
 * /projects:
 *   get:
 *     tags: [Projects]
 *     summary: Get all projects
 *     parameters:
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of projects
 */
export async function getProjects(req: Request, res: Response): Promise<void> {
  try {
    const filter: Record<string, unknown> = { status: { $ne: 'archived' } };
    if (req.query.featured === 'true') filter.featured = true;

    const projects = await Project.find(filter).sort({ order: 1, createdAt: -1 });

    res.json({ success: true, message: 'Projects fetched', data: projects });
  } catch (error) {
    logger.error('Get projects error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch projects' });
  }
}

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     tags: [Projects]
 *     summary: Get project by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project found
 *       404:
 *         description: Not found
 */
export async function getProjectById(req: Request, res: Response): Promise<void> {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }
    res.json({ success: true, message: 'Project found', data: project });
  } catch (error) {
    logger.error('Get project by id error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch project' });
  }
}
