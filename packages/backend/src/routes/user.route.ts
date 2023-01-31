import express from 'express';

import { RoleCodes } from '@cauldrons/models';

import { handleCreateUser, handleDeleteUser, handleGetUserById, handleGetUsers, handleUpdateUser } from '~/handlers/user.handler';
import { errorHandler } from '~/middleware/error.middleware';
import { hasRole } from '~/middleware/role.middleware';
import { emailAndUsernameAvailable } from '~/middleware/user.middleware';
import { validate } from '~/middleware/validation.middleware';
import { createUserSchema, updateUserSchema } from '~/schemas/user.schema';

const router = express.Router();

router.use(hasRole(RoleCodes.USER_MANAGEMENT));

router.get('/', handleGetUsers);
router.get('/:userId', handleGetUserById);
router.post('/', validate(createUserSchema), emailAndUsernameAvailable, handleCreateUser);
router.put('/:userId', validate(updateUserSchema), handleUpdateUser);
router.delete('/:userId', handleDeleteUser);

router.use(errorHandler);

export default router;
