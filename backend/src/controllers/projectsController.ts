import { Request, Response } from 'express';
import Project from '../models/Project';
import logger from '../utils/logger';
import { sanitizeOptionalString, sanitizeString, sanitizeStringArray } from '../utils/sanitize';

interface ProjectBody {
  title?: string;
  description?: string;
  longDescription?: string;
  tags?: string[];
  imageUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  order?: number;
  status?: 'active' | 'completed' | 'archived';
}

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
    if (
      req.query.status === 'active' ||
      req.query.status === 'completed' ||
      req.query.status === 'archived'
    ) {
      filter.status = req.query.status;
    }

    const sortParam = typeof req.query.sort === 'string' ? req.query.sort : 'order';
    const sort: [string, 1 | -1][] =
      sortParam === 'createdAt'
        ? [['createdAt', -1]]
        : sortParam === 'title'
          ? [['title', 1]]
          : [
              ['order', 1],
              ['createdAt', -1],
            ];

    const projects = await Project.find(filter).sort(sort);

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

export async function createProject(req: Request, res: Response): Promise<void> {
  try {
    const body = req.body as ProjectBody;
    const project = await Project.create({
      title: sanitizeString(String(body.title)),
      description: sanitizeString(String(body.description)),
      longDescription: sanitizeOptionalString(body.longDescription),
      tags: sanitizeStringArray(body.tags),
      imageUrl: sanitizeOptionalString(body.imageUrl),
      liveUrl: sanitizeOptionalString(body.liveUrl),
      githubUrl: sanitizeOptionalString(body.githubUrl),
      featured: body.featured === true,
      order: Number(body.order) || 0,
      status: body.status ?? 'active',
    });

    res.status(201).json({ success: true, message: 'Project created.', data: project });
  } catch (error) {
    logger.error('Create project error:', error);
    res.status(500).json({ success: false, message: 'Failed to create project.' });
  }
}

export async function updateProject(req: Request, res: Response): Promise<void> {
  try {
    const body = req.body as ProjectBody;
    const update: Record<string, unknown> = {};

    if (body.title !== undefined) update.title = sanitizeString(body.title);
    if (body.description !== undefined) update.description = sanitizeString(body.description);
    if (body.longDescription !== undefined)
      update.longDescription = sanitizeOptionalString(body.longDescription);
    if (body.tags !== undefined) update.tags = sanitizeStringArray(body.tags);
    if (body.imageUrl !== undefined) update.imageUrl = sanitizeOptionalString(body.imageUrl);
    if (body.liveUrl !== undefined) update.liveUrl = sanitizeOptionalString(body.liveUrl);
    if (body.githubUrl !== undefined) update.githubUrl = sanitizeOptionalString(body.githubUrl);
    if (body.featured !== undefined) update.featured = body.featured === true;
    if (body.order !== undefined) update.order = Number(body.order) || 0;
    if (body.status !== undefined) update.status = body.status;

    const project = await Project.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found.' });
      return;
    }

    res.json({ success: true, message: 'Project updated.', data: project });
  } catch (error) {
    logger.error('Update project error:', error);
    res.status(500).json({ success: false, message: 'Failed to update project.' });
  }
}

export async function deleteProject(req: Request, res: Response): Promise<void> {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found.' });
      return;
    }

    res.json({ success: true, message: 'Project deleted.' });
  } catch (error) {
    logger.error('Delete project error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete project.' });
  }
}
