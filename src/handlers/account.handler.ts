import { compare, hash } from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import CauldronError, { CauldronErrorCodes } from '../models/error.model';
import { RequestWithSessionData } from '../models/request.model';
import { getSessionById } from '../services/session.service';
import { createUserWithCredentials, getUserById, getUserByUsername } from '../services/user.service';

export async function handleSignUp(req: RequestWithSessionData, res: Response, next: NextFunction) {
  try {
    const { username, email, password } = req.body;
    const passwordHash = await hash(password, 10);
    const user = await createUserWithCredentials(username, email, passwordHash);
    req.data = { userId: user.userId, persist: true };
    next();
  } catch (error) {
    next(error);
  }
}

export async function handleSignIn(req: RequestWithSessionData, res: Response, next: NextFunction) {
  try {
    const { username, password } = req.body;
    const user = await getUserByUsername(username);
    if (user === null || !(await compare(password, user.passwordHash)))
      throw new CauldronError('Invalid username or password', CauldronErrorCodes.INVALID_CREDENTIALS);
    req.data = { userId: user.userId };
    next();
  } catch (error) {
    next(error);
  }
}

export async function handleGetProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const sessionId = (req.session as any).sessionId;
    const session = await getSessionById(sessionId);
    const user = await getUserById(session.userId);
    res.status(200).json(user.getPersonalProfile());
  } catch (error) {
    next(error);
  }
}
