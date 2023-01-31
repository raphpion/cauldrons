import db from '~/db';
import CauldronError, { CauldronErrorCodes } from '~/models/error.model';
import User from '~/models/user.model';
import UserProfile from '~/models/userProfile.model';
import { IUpdateProfilePayload } from '~/schemas/userProfile.schema';

export async function createUserProfile(user: User, avatarUrl: string, bio: string, manager?: User): Promise<UserProfile> {
  const profile = db.getRepository(UserProfile).create({
    avatarUrl,
    bio,
  });

  profile.user = Promise.resolve(user);
  profile.createdBy = manager !== undefined ? Promise.resolve(manager) : Promise.resolve(user);

  await db.getRepository(UserProfile).save(profile);
  return profile;
}

export async function deleteUserProfile(user: User): Promise<void> {
  const profile = await user.profile;
  if (profile === null) throw new CauldronError(`Profile of User ${user.username} could not be found`, CauldronErrorCodes.NOT_FOUND);
  await db.getRepository(UserProfile).delete(profile.id);
}

export async function getAllProfiles(): Promise<UserProfile[]> {
  return db.getRepository(UserProfile).find();
}

export async function updateUserProfile(user: User, payload: IUpdateProfilePayload, manager?: User): Promise<UserProfile> {
  const profile = await user.profile;
  if (profile === null) throw new CauldronError(`Profile of User ${user.username} could not be found`, CauldronErrorCodes.NOT_FOUND);
  profile.updatedBy = manager !== undefined ? Promise.resolve(manager) : Promise.resolve(user);
  db.getRepository(UserProfile).merge(profile, payload);
  return db.getRepository(UserProfile).save(profile);
}
