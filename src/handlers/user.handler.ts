import { hash } from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import CauldronError, { CauldronErrorCodes } from '../models/error.model';
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from '../services/user.service';

export async function handleGetUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await getAllUsers();
    res.status(200).json(users.map(x => x.getPersonalProfile()));
  } catch (error) {
    next(error);
  }
}

export async function handleGetUserById(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await getUserById(req.params.userId);
    if (user === null) throw new CauldronError(`User with ID ${req.params.userId} could not be found`, CauldronErrorCodes.NOT_FOUND);
    res.status(200).json(user.getPersonalProfile());
  } catch (error) {
    next(error);
  }
}

export async function handleCreateUser(req: Request, res: Response, next: NextFunction) {
  try {
    // TODO get userId of admin creating this user
    const { username, email, password } = req.body;
    const passwordHash = await hash(password, 10);
    const user = await createUser(username, email, passwordHash);
    res.status(200).json(user.getPersonalProfile());
  } catch (error) {
    next(error);
  }
}

export async function handleUpdateUser(req: Request, res: Response, next: NextFunction) {
  try {
    // TODO get userId of admin updating this user
    const payload = req.body;
    await updateUser(req.params.userId, payload);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function handleDeleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    await deleteUser(req.params.userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
