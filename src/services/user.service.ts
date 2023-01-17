import User, { IUser } from '../models/user.model';
import { randomUUID } from 'crypto';
import { hash } from 'bcryptjs';
import { IUpdateUserPayload } from '../schemas/user.schema';
import CauldronError, { CauldronErrorCodes } from '../models/error.model';

export async function getAllUsers(): Promise<IUser[]> {
  return User.find();
}

export async function getUserByEmail(email: string): Promise<IUser | null> {
  return User.findOne({ email });
}

export async function getUserByUsername(username: string): Promise<IUser | null> {
  return User.findOne({ username });
}

export async function getUserById(userId: string): Promise<IUser | null> {
  return User.findOne({ userId });
}

export async function createUser(username: string, email: string, password: string): Promise<IUser | null> {
  const userId = randomUUID();
  const passwordHash = await hash(password, 10);

  return User.create({
    userId,
    username,
    email,
    password: passwordHash,
    createdAt: new Date(),
    createdBy: 'an-admin-user-id', // TODO replace this with actual requester's ID
  });
}

export async function createUserWithCredentials(username: string, email: string, password: string): Promise<IUser | null> {
  const userId = randomUUID();
  const passwordHash = await hash(password, 10);

  return User.create({
    userId,
    username,
    email,
    password: passwordHash,
    createdAt: new Date(),
    createdBy: userId,
  });
}

export async function updateUser(userId: string, payload: IUpdateUserPayload): Promise<IUser | null> {
  const user = await getUserById(userId);
  if (user === null) throw new CauldronError(`User with ID ${userId} could not be found`, CauldronErrorCodes.NOT_FOUND);

  const payloadWithHash = { ...payload };
  if (payload.password !== undefined) {
    const passwordHash = await hash(payload.password, 10);
    payloadWithHash.password = passwordHash;
  }

  return User.findByIdAndUpdate(
    user._id,
    {
      ...payloadWithHash,
      updatedAt: new Date(),
      updatedBy: 'an-admin-user-id', // TODO replace this with actual requester's ID
    },
    { new: true }
  );
}

export async function deleteUser(userId: string) {
  const user = await getUserById(userId);
  if (user === null) throw new CauldronError(`User with ID ${userId} could not be found`, CauldronErrorCodes.NOT_FOUND);
  return User.findByIdAndDelete(user._id);
}
