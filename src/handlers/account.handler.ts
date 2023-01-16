import { compare } from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import CauldronError, { CauldronErrorCodes } from '../models/error.model';
import { createSession, getSessionById, signOut } from '../services/session.service';
import { createUserWithCredentials, getUserById, getUserByUsername } from '../services/user.service';

export async function handleSignUp(req: Request, res: Response, next: NextFunction) {
  const { username, email, password } = req.body;
  const user = await createUserWithCredentials(username, email, password);
  const session = await createSession(user.userId, req.socket.remoteAddress, true);
  (req.session as any).sessionId = session.sessionId;
  req.session.cookie.maxAge = 7 * 24 * 60 * 60 * 1000;
  res.status(204).send();
}

export async function handleSignIn(req: Request, res: Response) {
  const { username, password, persist } = req.body;
  const user = await getUserByUsername(username);
  if (user === null || !(await compare(password, user.password)))
    throw new CauldronError('Invalid username or password', CauldronErrorCodes.INVALID_CREDENTIALS);

  const session = await createSession(user.userId, req.socket.remoteAddress, persist);
  (req.session as any).sessionId = session.sessionId;
  req.session.cookie.maxAge = persist ? 7 * 24 * 60 * 60 * 1000 : null;
  res.status(204).send();
}

export async function handleSignOut(req: Request, res: Response) {
  const sessionId = (req.session as any).sessionId;
  req.session.destroy(async err => {
    if (err) throw err;
    await signOut(sessionId);
    res.clearCookie('connect.sid');
    res.status(204).send();
  });
}

export async function handleGetProfile(req: Request, res: Response) {
  const sessionId = (req.session as any).sessionId;
  const session = await getSessionById(sessionId);
  const user = await getUserById(session.userId);
  res.status(200).json(user.getPersonalProfile());
}
