import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';

export class StaticDispatcher {

  static sendIndex(req: express.Request, res: express.Response):void {
    const _root = process.cwd();
    const _env = process.env.NODE_ENV;

    res.type('.html');

    if (_env === 'production') {
      fs.createReadStream(path.join(`${_root}/dist/index.html`)).pipe(res);
    } else {
      fs.createReadStream(path.join(`${_root}/client/index.html`)).pipe(res);
    }

  }
}
