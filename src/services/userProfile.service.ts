import db from '../db';
import CauldronError, { CauldronErrorCodes } from '../models/error.model';
import User from '../models/user.model';
import UserProfile from '../models/userProfile.model';
import { IUpdateProfilePayload } from '../schemas/userProfile.schema';

export async function createUserProfile(user: User, avatarUrl: string, bio: string): Promise<UserProfile> {
  const profile = db.getRepository(UserProfile).create({
    avatarUrl,
    bio,
    createdOn: new Date(),
  });

  profile.user = Promise.resolve(user);
  profile.createdBy = Promise.resolve(user);

  await db.getRepository(UserProfile).save(profile);
  return profile;
}

export async function deleteUserProfile(user: User): Promise<void> {
  const profile = await user.profile;
  if (profile === null) throw new CauldronError(`Profile of User ${user.username} could not be found`, CauldronErrorCodes.NOT_FOUND);
  await db.getRepository(UserProfile).delete(profile.id);
}

export async function updateUserProfile(user: User, payload: IUpdateProfilePayload) {
  const profile = await user.profile;
  if (profile === null) throw new CauldronError(`Profile of User ${user.username} could not be found`, CauldronErrorCodes.NOT_FOUND);
  db.getRepository(UserProfile).merge(profile, payload);
  await db.getRepository(UserProfile).save(profile);
}
