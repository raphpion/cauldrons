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

  // General
  INTERNAL = 'internal',
  INVALID_PARAMETER = 'invalid-parameter',
  UNAUTHORIZED = 'unauthorized',
  UNKNOWN = 'unknown',
}

export const CauldronErrorStatus = {
  // Auth
  'auth/email-already-taken': 409,
  'auth/username-already-taken': 409,
  'auth/invalid-credentials': 401,

  // General
  internal: 500,
  'invalid-parameter': 400,
  unauthorized: 401,
  unknown: 500,
};
