import { NextFunction, Response } from 'express';

import CauldronError, { CauldronErrorCodes } from '~/models/error.model';
import { CauldronRequest } from '~/models/request.model';
import { getUserByUsername } from '~/services/user.service';
import { createUserProfile, deleteUserProfile, getAllProfiles, updateUserProfile } from '~/services/userProfile.service';

export async function handleCreateProfile(req: CauldronRequest, res: Response, next: NextFunction) {
  try {
    const { username } = req.params;
    const { avatarUrl, bio } = req.body;
    const manager = req.data.user!;

    const user = await getUserByUsername(username);
    if (user === null) throw new CauldronError(`User ${username} could not be found`, CauldronErrorCodes.NOT_FOUND);

    const currentProfile = await user.profile;
    if (currentProfile !== null) throw new CauldronError(`User ${username} already has a profile`, CauldronErrorCodes.PROFILE_ALREADY_EXISTS);

    await createUserProfile(user, avatarUrl, bio, manager);
    res.setHeader('Location', `/profiles/${username}`).status(201).send();
  } catch (error) {
    next(error);
  }
}

export async function handleDeleteProfile(req: CauldronRequest, res: Response, next: NextFunction) {
  try {
    const { username } = req.params;
    const user = await getUserByUsername(username);
    if (user === null) throw new CauldronError(`User ${username} could not be found`, CauldronErrorCodes.NOT_FOUND);

    await deleteUserProfile(user);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

export async function handleGetProfiles(req: CauldronRequest, res: Response, next: NextFunction) {
  try {
    const profiles = await getAllProfiles();
    const publicProfiles = await Promise.all(profiles.map(profile => profile.getPublicProfile()));
    res.status(200).json(publicProfiles);
  } catch (error) {
    next(error);
  }
}

export async function handleGetProfile(req: CauldronRequest, res: Response, next: NextFunction) {
  try {
    const { username } = req.params;
    const user = await getUserByUsername(username);
    if (user === null) throw new CauldronError(`User ${username} could not be found`, CauldronErrorCodes.NOT_FOUND);

    const profile = await user.profile;
    if (profile === null) throw new CauldronError(`Profile of User ${username} could not be found`, CauldronErrorCodes.NOT_FOUND);

    const publicProfile = await profile.getPublicProfile();
    res.status(200).json(publicProfile);
  } catch (error) {
    next(error);
  }
}

export async function handleUpdateProfile(req: CauldronRequest, res: Response, next: NextFunction) {
  try {
    const { username } = req.params;
    const manager = req.data.user!;
    const payload = req.body;
    const user = await getUserByUsername(username);
    const profile = await updateUserProfile(user, payload, manager);
    const publicProfile = await profile.getPublicProfile();
    res.status(200).json(publicProfile);
  } catch (error) {
    next(error);
  }
}
