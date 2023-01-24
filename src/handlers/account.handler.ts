import { compare, hash } from 'bcryptjs';
import { NextFunction, Response } from 'express';
import CauldronError, { CauldronErrorCodes } from '../models/error.model';
import { CauldronRequest } from '../models/request.model';
import { getSessionById } from '../services/session.service';
import { createUserWithCredentials, getUserById, getUserByUsername } from '../services/user.service';

export async function handleSignUp(req: CauldronRequest, res: Response, next: NextFunction) {
  try {
    const { username, email, password } = req.body;
    const passwordHash = await hash(password, 10);
    const user = await createUserWithCredentials(username, email, passwordHash);
    req.data = { user, persist: true };
    next();
  } catch (error) {
    next(error);
  }
}

export async function handleSignIn(req: CauldronRequest, res: Response, next: NextFunction) {
  try {
    const { username, password, persist } = req.body;
    const user = await getUserByUsername(username);
    if (user === null || !(await compare(password, user.passwordHash)))
      throw new CauldronError('Invalid username or password', CauldronErrorCodes.INVALID_CREDENTIALS);
    req.data = { user, persist };
    next();
  } catch (error) {
    next(error);
  }
}

// export async function handleGetProfile(req: CauldronRequest, res: Response, next: NextFunction) {
//   try {
//     const sessionId = (req.session as any).sessionId;
//     const session = await getSessionById(sessionId);
//     res.status(200).json(session.user.getUserInfo());
//   } catch (error) {
//     next(error);
//   }
// }
