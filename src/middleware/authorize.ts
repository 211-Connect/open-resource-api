import { Middleware } from 'koa';
import jwkToPem from 'jwk-to-pem';
import { JwtPayload } from 'jsonwebtoken';
import axios from 'axios';

import * as jwt from '../lib/jwt';
import Cache from '../services/cache';

// In memory cache for storing JWKs
const cache = new Cache();

/**
 * The purpose of this middleware is to authorize access of endpoints to already authenticated users.
 * It verifies the provided user token, decodes the provided token, and passes a long the token payload
 * to be used for all further requests.
 * @returns Middleware
 */
function authorize(): Middleware {
  return async (ctx, next) => {
    const bearerTokenRegex = /^Bearer\s+/;
    const authorizationHeader = ctx.headers['authorization'];

    if (!authorizationHeader || !bearerTokenRegex.test(authorizationHeader))
      throw new Error('Invalid authorization header.');

    // Extracted token from authorization header
    const token = authorizationHeader.replace(bearerTokenRegex, '');

    // Decoded JWT payload
    const decoded = jwt.decode(token, { complete: true }) as JwtPayload;

    // Fetch JWKs from cache. If not in cache, fetch from AWS
    let jwks = cache.get(process.env.AWS_USER_POOL_ID as string);
    if (!jwks) {
      const res = await axios.get(
        `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_USER_POOL_ID}/.well-known/jwks.json`
      );
      jwks = cache.set(process.env.AWS_USER_POOL_ID as string, res.data);
    }

    const jwk = jwks.keys.find((jwk: any) => jwk.kid === decoded.header.kid);

    const pem = jwkToPem(jwk);
    const user = await jwt.verify(token, pem, {
      algorithms: ['RS256'],
      issuer: `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_USER_POOL_ID}`,
    });

    ctx.state.user = user;

    await next();
  };
}

export default authorize;
