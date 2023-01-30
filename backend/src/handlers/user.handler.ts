import { hash } from 'bcryptjs';
import { Response, NextFunction } from 'express';
import CauldronError, { CauldronErrorCodes } from '../models/error.model';
import { CauldronRequest } from '../models/request.model';
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from '../services/user.service';

export async function handleGetUsers(req: CauldronRequest, res: Response, next: NextFunction) {
  try {
    const users = await getAllUsers();
    const usersInfo = await Promise.all(users.map(user => user.getUserInfo()));
    res.status(200).json(usersInfo);
  } catch (error) {
    next(error);
  }
}

export async function handleGetUserById(req: CauldronRequest, res: Response, next: NextFunction) {
  try {
    const user = await getUserById(req.params.userId);
    if (user === null) throw new CauldronError(`User with ID ${req.params.userId} could not be found`, CauldronErrorCodes.NOT_FOUND);
    res.status(200).json(user.getUserInfo());
  } catch (error) {
    next(error);
  }
}

export async function handleCreateUser(req: CauldronRequest, res: Response, next: NextFunction) {
  try {
    const { username, email, password } = req.body;
    const manager = req.data.user!;
    const passwordHash = await hash(password, 10);
    const user = await createUser(manager, username, email, passwordHash);
    res.setHeader('Location', `/users/${user.userId}`);
  } catch (error) {
    next(error);
  }
}

export async function handleUpdateUser(req: CauldronRequest, res: Response, next: NextFunction) {
  try {
    const payload = req.body;
    const manager = req.data.user!;
    const user = await updateUser(req.params.userId, payload, manager);
    const userInfo = await user.getUserInfo();
    res.status(200).json(userInfo);
  } catch (error) {
    next(error);
  }
}

export async function handleDeleteUser(req: CauldronRequest, res: Response, next: NextFunction) {
  try {
    await deleteUser(req.params.userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
