import express from 'express';

import {
  handleCreateMyProfile,
  handleGetMyProfile,
  handleUpdateMyProfile,
  handleSignIn,
  handleSignUp,
  handleDeleteMyProfile,
} from '~/handlers/account.handler';
import { handleCreateSession, handleSignOut } from '~/handlers/session.handler';
import { errorHandler } from '~/middleware/error.middleware';
import { isSignedIn } from '~/middleware/session.middleware';
import { emailAndUsernameAvailable } from '~/middleware/user.middleware';
import { validate } from '~/middleware/validation.middleware';
import { createMyProfileSchema, signInSchema, signUpSchema, updateMyProfileSchema } from '~/schemas/account.schema';

const router = express.Router();

router.get('/profile', isSignedIn, handleGetMyProfile);
router.post('/profile', validate(createMyProfileSchema), isSignedIn, handleCreateMyProfile);
router.put('/profile', validate(updateMyProfileSchema), isSignedIn, handleUpdateMyProfile);
router.delete('/profile', isSignedIn, handleDeleteMyProfile);

router.post('/sign/up', validate(signUpSchema), emailAndUsernameAvailable, handleSignUp, handleCreateSession);
router.post('/sign/in', validate(signInSchema), handleSignIn, handleCreateSession);
router.post('/sign/out', handleSignOut);

router.use(errorHandler);

export default router;
