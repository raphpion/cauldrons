import { NextFunction, Request, Response } from 'express';
import CauldronError, { CauldronErrorCodes } from '../models/error.model';
import { getUserByEmail, getUserByUsername } from '../services/user.service';

export async function emailAndUsernameAvailable(req: Request, res: Response, next: NextFunction) {
  const { username, email } = req.body;

  if ((await getUserByEmail(email)) !== null)
    return res.status(409).json(new CauldronError(`Email ${email} is already in use`, CauldronErrorCodes.EMAIL_ALREADY_TAKEN));
  if ((await getUserByUsername(username)) !== null)
    return res.status(409).json(new CauldronError(`Username ${username} is arleady in use`, CauldronErrorCodes.USERNAME_ALREADY_TAKEN));

  next();
}
