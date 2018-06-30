'use strict';

if (process.env.NEW_RELIC_ENABLED === 'true') require('newrelic');

const PORT = process.env.PORT || 5000;
process.env.NODE_ENV = process.env.NODE_ENV || 'local';


import * as express from 'express';
import * as os from 'os';
import * as d3 from 'd3';
import * as http from 'http';

import {RoutesConfig} from './config/routes.conf';
import {DBConfig} from './config/db.conf';
import {JWTConf} from './config/jwt.conf';
import {Routes} from './routes/index';
import {SocketRoute} from './sockets/socket.route';

const app = express();

console.log(`Environment: ${process.env.NODE_ENV}`);

// app.get('*', function (req, res, next) {
//   if (process.env.ONLY_HTTPS && req.headers['x-forwarded-proto'] != 'https') {
//     res.redirect((process.env.HOSTURL || 'https://localhost:4200') + req.url);
//   } else {
//     next();
//     /* Continue to other routes if we're not redirecting */
//   }
// });

RoutesConfig.init(app);
DBConfig.init();
Routes.init(app, express.Router());
JWTConf.init(app);

const server = http.createServer(app);
SocketRoute.init(server);

server.listen(PORT, () => {
  console.log(`up and running: ${os.hostname()} on PORT: ${PORT}`);
});

module.exports = app;
