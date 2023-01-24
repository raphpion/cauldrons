import { compare, hash } from 'bcryptjs';
import { NextFunction, Response } from 'express';
import CauldronError, { CauldronErrorCodes } from '../models/error.model';
import { CauldronRequest } from '../models/request.model';
import { createUserWithCredentials, getUserByUsername } from '../services/user.service';

export async function handleSignUp(req: CauldronRequest, res: Response, next: NextFunction) {
  try {
    let { username, email, password } = req.body;
    email = email.trim().toLowerCase();
    username = username.trim().toLowerCase();
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
    let { username, password, persist } = req.body;
    username = username.trim().toLowerCase();
    const user = await getUserByUsername(username);
    if (user === null || !(await compare(password, user.passwordHash)))
      throw new CauldronError('Invalid username or password', CauldronErrorCodes.INVALID_CREDENTIALS);
    req.data = { user, persist };
    next();
  } catch (error) {
    next(error);
  }
}
