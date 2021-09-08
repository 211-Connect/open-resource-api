import { Middleware } from 'koa';
import { v4 as uuid } from 'uuid';

/**
 * Grabs the session id and applies it to the request state
 * @returns Middleware
 */
function session(): Middleware {
  return async (ctx, next) => {
    let sessionId = ctx.cookies.get('sessionId');

    if (!sessionId) {
      const newSessionId = uuid();

      ctx.cookies.set('sessionId', newSessionId, {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
      });

      sessionId = newSessionId;
    }

    ctx.state.session = {
      id: sessionId,
    };

    await next();
  };
}

export default session;
