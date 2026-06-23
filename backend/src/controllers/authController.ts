import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import logger from '../utils/logger';

interface LoginBody {
  email?: string;
  password?: string;
}

function getAdminConfig() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  const jwtSecret = process.env.JWT_SECRET;

  return { email, passwordHash, jwtSecret };
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body as LoginBody;
    const adminConfig = getAdminConfig();

    if (!adminConfig.email || !adminConfig.passwordHash || !adminConfig.jwtSecret) {
      res.status(503).json({
        success: false,
        message: 'Admin authentication is not configured.',
      });
      return;
    }

    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      email.trim().toLowerCase() !== adminConfig.email
    ) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const passwordMatches = await bcrypt.compare(password, adminConfig.passwordHash);
    if (!passwordMatches) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const expiresIn = (process.env.JWT_EXPIRES_IN ?? '7d') as SignOptions['expiresIn'];

    const token = jwt.sign(
      { id: 'admin', email: adminConfig.email, role: 'admin' },
      adminConfig.jwtSecret,
      { expiresIn },
    );

    res.json({
      success: true,
      message: 'Signed in successfully.',
      data: {
        token,
        user: {
          email: adminConfig.email,
          role: 'admin',
        },
      },
    });
  } catch (error) {
    logger.error('Admin login error:', error);
    res.status(500).json({ success: false, message: 'Failed to sign in.' });
  }
}

export async function getSession(req: Request, res: Response): Promise<void> {
  res.json({
    success: true,
    message: 'Session active.',
    data: req.user,
  });
}
