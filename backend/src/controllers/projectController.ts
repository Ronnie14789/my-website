import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Project from '../models/Project';
import { cacheGet, cacheSet, cacheDel } from '../config/redis';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { logger } from '../utils/logger';

const CACHE_TTL = 30 * 60;

export const listProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const featured = req.query['featured'] === 'true';
    const cacheKey = `projects:list:${featured}`;

    const cached = await cacheGet(cacheKey);
    if (cached) {
      res.json(JSON.parse(cached));
      return;
    }

    const filter: Record<string, unknown> = { status: { $ne: 'archived' } };
    if (featured) filter['featured'] = true;

    const projects = await Project.find(filter)
      .sort({ featured: -1, order: 1, createdAt: -1 })
      .lean();

    const response = { success: true, data: projects, message: 'Projects retrieved' };
    await cacheSet(cacheKey, JSON.stringify(response), CACHE_TTL);
    res.json(response);
  } catch (error) {
    logger.error('List projects error:', error);
    sendError(res, 'Failed to retrieve projects', 500);
  }
};

export const getProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await Project.findById(req.params['id']).lean();
    if (!project) {
      sendError(res, 'Project not found', 404);
      return;
    }
    sendSuccess(res, project, 'Project retrieved');
  } catch (error) {
    logger.error('Get project error:', error);
    sendError(res, 'Failed to retrieve project', 500);
  }
};

export const createProject = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    sendError(res, 'Validation failed', 422, JSON.stringify(errors.array()));
    return;
  }

  try {
    const project = await Project.create(req.body);
    await cacheDel('projects:list:true');
    await cacheDel('projects:list:false');
    sendSuccess(res, project, 'Project created', 201);
  } catch (error) {
    logger.error('Create project error:', error);
    sendError(res, 'Failed to create project', 500);
  }
};

export const updateProject = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    sendError(res, 'Validation failed', 422, JSON.stringify(errors.array()));
    return;
  }

  try {
    const {
      title,
      description,
      shortDescription,
      coverImage,
      images,
      tags,
      technologies,
      status,
      featured,
      order,
      githubUrl,
      liveUrl,
    } = req.body as Record<string, unknown>;

    const project = await Project.findByIdAndUpdate(
      req.params['id'],
      {
        $set: {
          title,
          description,
          shortDescription,
          coverImage,
          images,
          tags,
          technologies,
          status,
          featured,
          order,
          githubUrl,
          liveUrl,
        },
      },
      { new: true, runValidators: true }
    );

    if (!project) {
      sendError(res, 'Project not found', 404);
      return;
    }

    await cacheDel('projects:list:true');
    await cacheDel('projects:list:false');
    sendSuccess(res, project, 'Project updated');
  } catch (error) {
    logger.error('Update project error:', error);
    sendError(res, 'Failed to update project', 500);
  }
};

export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await Project.findByIdAndDelete(req.params['id']);
    if (!project) {
      sendError(res, 'Project not found', 404);
      return;
    }
    await cacheDel('projects:list:true');
    await cacheDel('projects:list:false');
    sendSuccess(res, null, 'Project deleted');
  } catch (error) {
    logger.error('Delete project error:', error);
    sendError(res, 'Failed to delete project', 500);
  }
};
