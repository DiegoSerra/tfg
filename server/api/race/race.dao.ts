'use strict';

import * as mongoose from 'mongoose';
import raceSchema from './race.model';
import UserDAO from '../user/user.dao';
import * as _ from 'lodash';

let Race;

raceSchema.static('getAll', (query?) => {
  return new Promise((resolve, reject) => {
    const _query = query || {};

    Race
      .find(_query)
      .exec((err, races) => {
        err ? reject(err) : resolve(races);
      });
  });
});

raceSchema.static('getAllObjects', (query?) => {
  return new Promise((resolve, reject) => {
    const _query = query || {};

    Race
      .find(_query)
      .lean()
      .exec((err, races) => {
        err ? reject(err) : resolve(races);
      });
  });
});

raceSchema.static('getOneByQuery', (query) => {
  return new Promise((resolve, reject) => {
    const _query = query;

    Race
      .findOne(_query)
      .exec((err, race) => {
        err ? reject(err)
          : resolve(race);
      });
  });
});

raceSchema.static('updateOne', (raceId, query) => {
  return new Promise((resolve, reject) => {
    if (!_.isObject(query)) {
      return reject(new TypeError('query is not a valid Object.'));
    }

    if (!_.isString(raceId)) {
      return reject(new TypeError('raceId is not a valid String.'));
    }

    Race
      .update(
        {_id: raceId},
        {$set: query},
        {upsert: true}
      ).exec((err, updated) => {
      err ? reject(err) : resolve(updated);
    });
  });
});

raceSchema.static('updateAll', (raceIds, query) => {
  return new Promise((resolve, reject) => {
    if (!_.isObject(query)) {
      return reject(new TypeError('query is not a valid Object.'));
    }

    Race
      .update(
        {_id: {$in: raceIds}},
        {$set: query},
        {multi: true}
      ).exec((err, updated) => {
      err ? reject(err) : resolve(updated);
    });
  });
});

// // Working on
// raceSchema.static('updateRacesByUserId', (userId, query) => {
//   return new Promise((resolve, reject) => {
//     if (!_.isObject(query)) {
//       return reject(new TypeError('query is not a valid Object.'));
//     }

//     if (!_.isString(userId)) {
//       return reject(new TypeError('userId is not a valid String.'));
//     }

//     Race
//       .update(
//         {'createdBy.userId' : userId},
//         {$set: query},
//         {multi: true}
//       ).exec((err, updated) => {
//       err ? reject(err) : resolve(updated);
//     });
//   });
// });

raceSchema.static('updateArrProp', (raceId, query) => {
  return new Promise((resolve, reject) => {
    if (!_.isObject(query)) {
      return reject(new TypeError('query is not a valid Object.'));
    }

    if (!_.isString(raceId)) {
      return reject(new TypeError('raceId is not a valid String.'));
    }

    Race
      .findOneAndUpdate(
        {_id: raceId},
        {$push: query},
        {upsert: true}
      ).exec((err, updated) => {
      err ? reject(err) : resolve(updated);
    });

  });
});

// raceSchema.static('createNew', (user) => {
//   return new Promise((resolve, reject) => {
//     if (!_.isObject(user)) {
//       return reject(new TypeError('Is not a valid object.'));
//     }

//     const _something = new Race(user);

//     _something.save((err, saved) => {
//       err ? reject(err)
//         : resolve(saved);
//     });
//   });
// });

raceSchema.static('createNew', (race) => {
  return new Promise((resolve, reject) => {
    if (!_.isObject(race)) {
      return reject(new TypeError('Is not a valid object.'));
    }

    const _something = new Race(race);
    _something.save((err, saved) => {
      const raceId = saved._id;
      const userId = race.createdBy.userId;
      UserDAO.findOneAndUpdate(
        {_id: userId},
        {$push: {races: {$each: [{raceId: raceId}]}}},
        {upsert: true}
      ).exec((userError, updated) => {
        userError ? reject(userError) : resolve(saved);
      });
    });
  });
});

raceSchema.static('createOrEdit', (race) => {
  return new Promise((resolve, reject) => {
    if (!_.isObject(race)) {
      return reject(new TypeError('race is not a valid object.'));
    }

    const id = race._id;
    delete race._id;

    if (id) {

      Race
        .update(
          {_id: id},
          {$set: race},
          {upsert: true}
        ).exec((err, updated) => {
        err ? reject(err) : resolve(updated);
      });

    } else {

      const newRace = new Race(race);

      newRace.save((err, saved) => {
        err ? reject(err) : resolve(saved);
      });
    }

  });
});

raceSchema.static('removeById', (id) => {
  return new Promise((resolve, reject) => {
    if (!_.isString(id)) {
      return reject(new TypeError('Id is not a valid string.'));
    }

    Race
      .findByIdAndRemove(id)
      .exec((err, deleted) => {
        err ? reject(err)
          : resolve();
      });
  });
});

raceSchema.static('updateUserEmail', (userId, email) => {
  return new Promise((resolve, reject) => {
    if (!_.isString(email)) {
      return reject(new TypeError('email is not a valid string.'));
    }

    Race
      .update(
        {'createdBy.userId': userId},
        {'createdBy.email': email},
        {multi: true}
      )
      .exec((err, updated) => {
        err ? reject(err)
          : resolve(updated);
      });

    Race
      .update(
        {'matches.requestedBy.userId': userId},
        {'matches.$.requestedBy.email': email},
        {multi: true}
      )
      .exec((err, updated) => {
        err ? reject(err)
          : resolve(updated);
      });
  });
});

raceSchema.static('updateNameInRace', (userId, name) => {
  return new Promise((resolve, reject) => {
    if (!_.isString(name)) {
      return reject(new TypeError('name is not a valid string.'));
    }

    Race
      .update(
        {'createdBy.userId': userId},
        {'createdBy.name': name},
        {multi: true}
      )
      .exec((err, updated) => {
        err ? reject(err)
          : resolve(updated);
      });

    Race
      .update(
        {'matches.requestedBy.userId': userId},
        {'$set': {'matches.$.requestedBy.name': name}},
        {multi: true}
      )
      .exec((err, updated) => {
        err ? reject(err)
          : resolve(updated);
      });
  });
});

raceSchema.static('updateMatchOnDeleteRace', (raceId, userId) => {
  return new Promise((resolve, reject) => {
    Race
      .update(
        {'matches.raceId': raceId},
        {$pull: {'matches': {raceId}}},
        {multi: true}
      ).exec((err, updated) => {
      err ? reject(err) : resolve(updated);
    });
  });
});

Race = mongoose.model('races', raceSchema);

export default Race;
