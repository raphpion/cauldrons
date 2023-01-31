import Joi from 'joi';

export const createMyProfileSchema = Joi.object({
  avatarUrl: Joi.string().uri(),
  bio: Joi.string(),
});

export const updateMyProfileSchema = Joi.object({
  avatarUrl: Joi.string().uri(),
  bio: Joi.string(),
});

export const signUpSchema = Joi.object({
  username: Joi.string().min(3).alphanum().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const signInSchema = Joi.object({
  username: Joi.string().min(3).alphanum().required(),
  password: Joi.string().required(),
  persist: Joi.boolean().required(),
});
