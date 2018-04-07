'use strict';

import * as mongoose from 'mongoose';
import mapSchema from './map.model';
import * as _ from 'lodash';

let Map;

mapSchema.static('getAll', (query?) => {
  return new Promise((resolve, reject) => {
    const _query = query || {};

    Map
      .find(_query)
      .exec((err, maps) => {
        err ? reject(err) : resolve(maps);
      });
  });
});

mapSchema.static('getAllObjects', (query?) => {
  return new Promise((resolve, reject) => {
    const _query = query || {};

    Map
      .find(_query)
      .lean()
      .exec((err, maps) => {
        err ? reject(err) : resolve(maps);
      });
  });
});

mapSchema.static('getOneByQuery', (query) => {
  return new Promise((resolve, reject) => {
    const _query = query;

    Map
      .findOne(_query)
      .exec((err, map) => {
        err ? reject(err)
          : resolve(map);
      });
  });
});

mapSchema.static('updateOne', (mapId, query) => {
  return new Promise((resolve, reject) => {
    if (!_.isObject(query)) {
      return reject(new TypeError('query is not a valid Object.'));
    }

    if (!_.isString(mapId)) {
      return reject(new TypeError('mapId is not a valid String.'));
    }

    Map
      .update(
        {_id: mapId},
        {$set: query},
        {upsert: true}
      ).exec((err, updated) => {
      err ? reject(err) : resolve(updated);
    });
  });
});

mapSchema.static('updateAll', (mapIds, query) => {
  return new Promise((resolve, reject) => {
    if (!_.isObject(query)) {
      return reject(new TypeError('query is not a valid Object.'));
    }

    Map
      .update(
        {_id: {$in: mapIds}},
        {$set: query},
        {multi: true}
      ).exec((err, updated) => {
      err ? reject(err) : resolve(updated);
    });
  });
});

mapSchema.static('updateArrProp', (mapId, query) => {
  return new Promise((resolve, reject) => {
    if (!_.isObject(query)) {
      return reject(new TypeError('query is not a valid Object.'));
    }

    if (!_.isString(mapId)) {
      return reject(new TypeError('mapId is not a valid String.'));
    }

    Map
      .findOneAndUpdate(
        {_id: mapId},
        {$push: query},
        {upsert: true}
      ).exec((err, updated) => {
      err ? reject(err) : resolve(updated);
    });

  });
});

mapSchema.static('createNew', (map) => {
  return new Promise((resolve, reject) => {
    if (!_.isObject(map)) {
      return reject(new TypeError('Is not a valid object.'));
    }

    if (map.gpx) {
      map.gpx = `assets/tracks/${map.gpx}`;
    }

    const _something = new Map(map);
    _something.save((err, saved) => {
      err ? reject(err) : resolve(saved);
    });
  });
});

mapSchema.static('createOrEdit', (map) => {
  return new Promise((resolve, reject) => {
    if (!_.isObject(map)) {
      return reject(new TypeError('map is not a valid object.'));
    }

    const id = map._id;
    delete map._id;

    if (id) {

      Map
        .update(
          {_id: id},
          {$set: map},
          {upsert: true}
        ).exec((err, updated) => {
        err ? reject(err) : resolve(updated);
      });

    } else {

      const newMap = new Map(map);

      newMap.save((err, saved) => {
        err ? reject(err) : resolve(saved);
      });
    }

  });
});

mapSchema.static('removeById', (id) => {
  return new Promise((resolve, reject) => {
    if (!_.isString(id)) {
      return reject(new TypeError('Id is not a valid string.'));
    }

    Map
      .findByIdAndRemove(id)
      .exec((err, deleted) => {
        err ? reject(err)
          : resolve();
      });
  });
});

Map = mongoose.model('maps', mapSchema);

export default Map;
