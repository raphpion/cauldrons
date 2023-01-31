export default class CauldronError extends Error {
  public code: CauldronErrorCodes;
  constructor(message: string, code: CauldronErrorCodes) {
    super(message);
    this.code = code;
  }
}

export enum CauldronErrorCodes {
  // Auth
  EMAIL_ALREADY_TAKEN = 'auth/email-already-taken',
  USERNAME_ALREADY_TAKEN = 'auth/username-already-taken',
  INVALID_CREDENTIALS = 'auth/invalid-credentials',

  // Profile
  PROFILE_ALREADY_EXISTS = 'profile/already-exists',

  // General
  INTERNAL = 'internal',
  INVALID_PARAMETER = 'invalid-parameter',
  FORBIDDEN = 'forbidden',
  NOT_FOUND = 'not-found',
  UNAUTHORIZED = 'unauthorized',
  UNKNOWN = 'unknown',
}

export const CauldronErrorStatus = {
  // Auth
  'auth/email-already-taken': 409,
  'auth/username-already-taken': 409,
  'auth/invalid-credentials': 401,

  // Profile
  'profile/already-exists': 409,

  // General
  internal: 500,
  'invalid-parameter': 400,
  forbidden: 403,
  'not-found': 404,
  unauthorized: 401,
  unknown: 500,
};
