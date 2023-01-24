import { NextFunction, Response } from 'express';
import CauldronError, { CauldronErrorCodes } from '../models/error.model';
import { CauldronRequest } from '../models/request.model';
import { getUserByEmail, getUserByUsername } from '../services/user.service';

export async function emailAndUsernameAvailable(req: CauldronRequest, res: Response, next: NextFunction) {
  try {
    let { username, email } = req.body;
    username = username.trim().toLowerCase();
    email = email.trim().toLowerCase();

    if ((await getUserByEmail(email)) !== null) throw new CauldronError(`Email ${email} is already in use`, CauldronErrorCodes.EMAIL_ALREADY_TAKEN);
    if ((await getUserByUsername(username)) !== null)
      throw new CauldronError(`Username ${username} is arleady in use`, CauldronErrorCodes.USERNAME_ALREADY_TAKEN);
    next();
  } catch (error) {
    next(error);
  }
}
