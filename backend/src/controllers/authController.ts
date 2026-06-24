import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import AdminUser from '../models/AdminUser';
import { AuthenticatedRequest } from '../middleware/auth';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { logger } from '../utils/logger';

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

const generateToken = (payload: object, expiresIn: string): string => {
  const secret: Secret | undefined = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET not configured');
  return jwt.sign(payload, secret, { expiresIn } as SignOptions);
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    sendError(res, 'Validation failed', 422);
    return;
  }

  try {
    const { username, password } = req.body;

    const user = await AdminUser.findOne({
      $or: [{ username }, { email: username }],
      isActive: true,
    }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      sendError(res, 'Invalid credentials', 401);
      return;
    }

    user.lastLogin = new Date();
    await user.save();

    const tokenPayload = { id: user._id.toString(), username: user.username, role: user.role };
    const token = generateToken(tokenPayload, JWT_EXPIRES_IN);
    const refreshToken = generateToken(tokenPayload, JWT_REFRESH_EXPIRES_IN);

    sendSuccess(
      res,
      {
        token,
        refreshToken,
        user: { id: user._id, username: user.username, email: user.email, role: user.role },
      },
      'Login successful',
    );
  } catch (error) {
    logger.error('Login error:', error);
    sendError(res, 'Login failed', 500);
  }
};

export const refreshToken = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'Authentication required', 401);
      return;
    }
    const tokenPayload = { id: req.user.id, username: req.user.username, role: req.user.role };
    const token = generateToken(tokenPayload, JWT_EXPIRES_IN);
    sendSuccess(res, { token }, 'Token refreshed');
  } catch (error) {
    logger.error('Token refresh error:', error);
    sendError(res, 'Token refresh failed', 500);
  }
};

export const getProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'Authentication required', 401);
      return;
    }
    const user = await AdminUser.findById(req.user.id).select('-password').lean();
    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }
    sendSuccess(res, user, 'Profile retrieved');
  } catch (error) {
    logger.error('Get profile error:', error);
    sendError(res, 'Failed to get profile', 500);
  }
};
