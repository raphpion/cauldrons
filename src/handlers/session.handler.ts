import { compare } from 'bcryptjs';
import { randomBytes } from 'crypto';
import { Request, Response } from 'express';
import CauldronError, { CauldronErrorCodes } from '../models/error.model';
import { createSession, getSessionById, signOut } from '../services/session.service';
import { getUserByUsername } from '../services/user.service';
