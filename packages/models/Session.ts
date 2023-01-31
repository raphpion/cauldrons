/**
 * Represents a user session in the Cauldrons infrastructure.
 */
interface ISession {
  /** Unique identifier for the session. Recommended format is UUIDv4. */
  sessionId: string;

  /** The unique identifier of the user associated with this session. */
  userId: string;

  /** Indicates whether the session is persistent across browser restarts. */
  isPersistent: boolean;

  /** The date and time when the session will expire. */
  expiresAt: Date;

  /** The IP address of the client that initiated the session. */
  ipAddress: string;

  /** The date and time when the user signed out, if applicable. */
  signedOutAt?: Date;

  /** The date and time when the session was created. */
  createdOn: Date;

  /** The date and time when the session was last updated. */
  updatedOn?: Date;
}

export type { ISession };
