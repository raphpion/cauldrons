import Joi from 'joi';

export const signUpSchema = Joi.object({
  username: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const signInSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  persist: Joi.boolean().required(),
});
