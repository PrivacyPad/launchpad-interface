import { decodeJwt, JWTPayload, jwtVerify, SignJWT } from 'jose';
import { config } from '~/config';

/**
 * Secret key for the token.
 */
const JWT_SECRET_KEY = config.JWT_SECRET;

export const PAYLOAD_TOKEN_EXPIRATION_TIME = 5 * 60; // 5 minutes

/**
 * Payload of the token.
 */
export type AuthToken = {
  address: string;
  id: number;
};

export type PayloadToken = {
  randomBytes: string;
};

/**
 * Create a token with the given payload.
 */
function buildCreateToken<T extends JWTPayload>(expirationTime: string): (payload: T) => Promise<string> {
  return async (payload: T) => {
    const encoder = new TextEncoder();
    const key = encoder.encode(JWT_SECRET_KEY);
    return new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(expirationTime)
      .sign(key);
  };
}

export const createAuthToken = buildCreateToken<AuthToken>(config.JWT_EXPIRE_TIME);
export const createPayloadToken = buildCreateToken<PayloadToken>('5m');

/**
 * Verify the given token.
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  const encoder = new TextEncoder();
  const key = encoder.encode(JWT_SECRET_KEY);
  try {
    const { payload } = await jwtVerify(token, key);
    return payload;
  } catch {
    return null;
  }
}

/**
 * Decode the given token.
 */
function buildDecodeToken<T extends JWTPayload>(): (token: string) => T | null {
  return (token: string) => {
    try {
      return decodeJwt(token) as T;
    } catch {
      return null;
    }
  };
}

export const decodeAuthToken = buildDecodeToken<AuthToken>();
export const decodePayloadToken = buildDecodeToken<PayloadToken>();
