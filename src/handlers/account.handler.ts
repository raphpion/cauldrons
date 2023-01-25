import { compare, hash } from 'bcryptjs';
import { NextFunction, Response } from 'express';
import CauldronError, { CauldronErrorCodes } from '../models/error.model';
import { CauldronRequest } from '../models/request.model';
import { createUserWithCredentials, getUserByUsername } from '../services/user.service';
import { createUserProfile, deleteUserProfile, updateUserProfile } from '../services/userProfile.service';

export async function handleCreateMyProfile(req: CauldronRequest, res: Response, next: NextFunction) {
  try {
    const { user } = req.data;
    const currentProfile = await user.profile;
    if (currentProfile) throw new CauldronError(`User ${user.username} already has a profile!`, CauldronErrorCodes.PROFILE_ALREADY_EXISTS);

    const { avatarUrl, bio } = req.body;
    await createUserProfile(user, avatarUrl, bio);
    res.setHeader('Location', '/account/profile').status(201).send();
  } catch (error) {
    next(error);
  }
}

export async function handleDeleteMyProfile(req: CauldronRequest, res: Response, next: NextFunction) {
  try {
    const { user } = req.data;
    await deleteUserProfile(user);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function handleGetMyProfile(req: CauldronRequest, res: Response, next: NextFunction) {
  try {
    const { user } = req.data;
    const profile = await user.profile;
    if (profile === null) throw new CauldronError(`Profile of User ${user.username} could not be found`, CauldronErrorCodes.NOT_FOUND);
    const publicProfile = await profile.getPublicProfile();
    res.status(200).json(publicProfile);
  } catch (error) {
    next(error);
  }
}

export async function handleUpdateMyProfile(req: CauldronRequest, res: Response, next: NextFunction) {
  try {
    const { user } = req.data;
    const payload = req.body;
    const profile = await updateUserProfile(user, payload);
    const publicProfile = await profile.getPublicProfile();
    res.status(200).json(publicProfile);
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
