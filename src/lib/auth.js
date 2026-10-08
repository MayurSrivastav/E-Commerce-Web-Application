import { SignJWT, jwtVerify } from 'jose';

const secretKey = process.env.JWT_SECRET || 'fallback_secret_key_change_in_production';
const key = new TextEncoder().encode(secretKey);

export async function signToken(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(key);
}

export async function verifyToken(input) {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    return null;
  }
}
