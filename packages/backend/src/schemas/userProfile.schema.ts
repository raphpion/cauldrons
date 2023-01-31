import Joi from 'joi';

export const createUserProfileSchema = Joi.object({
  avatarUrl: Joi.string().uri(),
  bio: Joi.string(),
});

export const updateUserProfileSchema = Joi.object({
  avatarUrl: Joi.string().uri().allow(''),
  bio: Joi.string().allow(''),
});

interface IUpdateProfilePayload {
  avatarUrl?: string;
  bio?: string;
}

export type { IUpdateProfilePayload };
