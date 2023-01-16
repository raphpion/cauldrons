import express from 'express';
import { handleGetProfile, handleSignIn, handleSignOut, handleSignUp } from '../handlers/account.handler';
import { errorHandler } from '../middleware/error.middleware';
import { isSignedIn } from '../middleware/session.middleware';
import { emailAndUsernameAvailable } from '../middleware/user.middleware';
import { validate } from '../middleware/validation.middleware';
import { signInSchema, signUpSchema } from '../schemas/account.schema';

const router = express.Router();

router.post('/sign/up', validate(signUpSchema), emailAndUsernameAvailable, handleSignUp);
router.post('/sign/in', validate(signInSchema), handleSignIn);
router.post('/sign/out', handleSignOut);
router.get('/profile', isSignedIn, handleGetProfile);
// router.post('/password/recover' => envoyer courriel de reset password);
// router.post('/password/reset' => effectuer le reset password);

router.use(errorHandler);

export default router;
