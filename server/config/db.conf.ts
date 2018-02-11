import * as mongoose from 'mongoose';

const dbConst = require(`../constants/${process.env.NODE_ENV}/db.json`);

export class DBConfig {
  static init(): void {

    const URL = dbConst.host;

    (<any>mongoose).Promise = Promise;
    mongoose.connect(URL, {
      useMongoClient: true,
      server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
      replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
    }).then(() => {
      console.log(`Successfully connected to ${URL}`);
    });
    mongoose.connection.on('error', console.error.bind(console, 'An error ocurred with the DB connection: '));
  }
}
