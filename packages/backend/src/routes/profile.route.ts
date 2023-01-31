import express from 'express';

import { hasRole } from '~/middleware/role.middleware';
import { isSignedIn } from '~/middleware/session.middleware';
import { errorHandler } from '~/middleware/error.middleware';
import { handleCreateProfile, handleDeleteProfile, handleGetProfiles, handleGetProfile, handleUpdateProfile } from '~/handlers/profile.handler';

import { RoleCodes } from '@cauldrons/models';
import { validate } from '~/middleware/validation.middleware';
import { createUserProfileSchema, updateUserProfileSchema } from '~/schemas/userProfile.schema';

const router = express.Router();

router.get('/', isSignedIn, handleGetProfiles);
router.get('/:username', hasRole(RoleCodes.PROFILE_MANAGEMENT), handleGetProfile);
router.post('/:username', validate(createUserProfileSchema), hasRole(RoleCodes.PROFILE_MANAGEMENT), handleCreateProfile);
router.put('/:username', validate(updateUserProfileSchema), hasRole(RoleCodes.PROFILE_MANAGEMENT), handleUpdateProfile);
router.delete('/:username', hasRole(RoleCodes.PROFILE_MANAGEMENT), handleDeleteProfile);

router.use(errorHandler);

export default router;
