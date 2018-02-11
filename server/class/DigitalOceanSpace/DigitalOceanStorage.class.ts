import * as fs from 'fs';
const s3Config = require(`../../constants/${process.env.NODE_ENV}/digitalOcean.json`);

import * as request from 'request-promise';

export class DigitalOceanStorageClass {

  static uploadFileFromUrl(url, key, options = {}, acl = 'public-read') {
    return new Promise((resolve, reject) => {
      request(url, {encoding: null})
        .then(data => {
          this.uploadFile(data, key, options, acl)
            .then(result => {
              resolve(result);
            })
            .catch(err => {
              reject(err);
            });
        }).catch(requestError => {
        reject(requestError);
      });
    });
  }

  static uploadFile(data, key, options = {}, acl = 'public-read') {
    return new Promise((resolve, reject) => {
      const params = {
        ...options,
        Bucket: s3Config.bucket,
        Key: key,
        Body: data,
        ACL: acl
      };

      // S3.upload(params, function (error, result) {
      //   if (error) {
      //     console.log('ERROR MSG: ', error);
      //     reject(error);
      //   } else {
      //     resolve(result);
      //   }
      // });
    });
  }

  static uploadLocalFile(filePath, key, options = {}) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, (readFileError, data) => {
        if (readFileError) {
          return reject(readFileError);
        }

        // S3Uploader.uploadFile(data, key, options)
        //   .then(result => {
        //     return resolve(result);
        //   })
        //   .catch(uplaodError => {
        //     return reject(uplaodError);
        //   });
      });
    });
  }

  static getImage(key, res) {
    // return S3Uploader.getFile(key, res, 'image/*');
  }

  static getFile(key, res, contentType?) {
    return new Promise((resolve, reject) => {
      const s3Params = {
        Bucket: s3Config.bucket,
        Key: key,
      };

      if (contentType && !res.finished) {
        res.setHeader('Content-Type', contentType);
      }

      // const object = S3.getObject(s3Params);
      // object.createReadStream()
      //   .on('error', (err) => {
      //     return reject(err);
      //   })
      //   .on('end', () => {
      //     return resolve();
      //   })
      //   .pipe(res, {end: false});
    });
  }

  static getFileUrl(key) {
    return new Promise((resolve, reject) => {
      const s3Params = {
        Bucket: s3Config.bucket,
        Key: key,
      };

      // S3.getSignedUrl('getObject', s3Params, (err, url) => {
      //   if (url) {
      //     resolve(url);
      //   } else {
      //     reject();
      //   }
      // });
    });
  }

  constructor() {
  }


}
