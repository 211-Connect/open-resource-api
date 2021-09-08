import Koa from 'koa';
import logger from 'koa-logger';
import json from 'koa-json';
import bodyParser from 'koa-bodyparser';
import helmet from 'koa-helmet';
import cors from '@koa/cors';

import routerV1 from './routes/v1';
import session from './middleware/session';

const app = new Koa();
const PORT = process.env.PORT || 3001;

// Use proxy in production (required for ctx.hostname to work properly when behind a proxy)
if (app.env === 'production') {
  app.proxy = true;
}

// Use logger only in development
if (app.env === 'development') {
  app.use(logger());
}

app.use(helmet());
app.use(cors());
app.use(json({ pretty: false, param: 'pretty' }));
app.use(bodyParser());
app.use(session());

// API Version 1 routes
app.use(routerV1.routes()).use(routerV1.allowedMethods());

app.listen(PORT, () => console.log(`Listening on *:${PORT}`));
