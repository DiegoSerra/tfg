'use strict';

import * as mongoose from 'mongoose';
import BadgeSchema from './badge.model';
import * as _ from 'lodash';

let Badge;

BadgeSchema.static('getAll', (query?) => {
  return new Promise((resolve, reject) => {
    const _query = query || {};

    Badge
      .find(_query)
      .lean()
      .exec((err, badges) => {
        err ? reject(err) : resolve(badges);
      });
  });
});

BadgeSchema.static('getBadges', (userId) => {
  return new Promise((resolve, reject) => {
    if (!_.isString(userId)) {
      return reject(new TypeError('userId is not a valid String.'));
    }

    Badge
      .findOne({userId})
      .lean()
      .exec((err, badges) => {
        err ? reject(err) : resolve(badges);
      });
  });
});

BadgeSchema.static('getOneByQuery', (query) => {
  return new Promise((resolve, reject) => {
    const _query = query;

    Badge
      .findOne(_query)
      .lean()
      .exec((err, badge) => {
        err ? reject(err) : resolve(badge);
      });
  });
});

BadgeSchema.static('updateBadges', (userId, query) => {
  return new Promise((resolve, reject) => {
    if (!_.isObject(query)) {
      return reject(new TypeError('query is not a valid Object.'));
    }

    if (!_.isString(userId)) {
      return reject(new TypeError('userId is not a valid String.'));
    }

    Badge
      .update(
        {userId},
        {$set: query},
        {upsert: true}
      ).exec((err, updated) => {
      err ? reject(err) : resolve(updated);
    });
  });
});

BadgeSchema.static('incrementChats', (userId, quantity) => {
  return new Promise((resolve, reject) => {

    if (!_.isString(userId)) {
      return reject(new TypeError('userId is not a valid String.'));
    }

    if (!quantity) {
      quantity = 1;
    }

    Badge
      .update(
        {userId},
        {$inc: {chat: quantity}}
      ).exec((err, updated) => {
      err ? reject(err) : resolve(updated);
    });
  });
});

BadgeSchema.static('createNew', (badge) => {
  return new Promise((resolve, reject) => {
    if (!_.isObject(badge)) {
      return reject(new TypeError('Is not a valid object.'));
    }

    const _something = new Badge(badge);

    _something.save((err, saved) => {
      err ? reject(err) : resolve(saved);
    });
  });
});

BadgeSchema.static('createOrEdit', (badge) => {
  return new Promise((resolve, reject) => {
    if (!_.isObject(badge)) {
      return reject(new TypeError('badge is not a valid object.'));
    }

    const id = badge._id;
    delete badge._id;

    if (id) {

      Badge
        .update(
          {_id: id},
          {$set: badge},
          {upsert: true}
        ).exec((err, updated) => {
        err ? reject(err) : resolve(updated);
      });

    } else {

      const _something = new Badge(badge);

      _something.save((err, saved) => {
        err ? reject(err) : resolve(saved);
      });
    }

  });
});

BadgeSchema.static('removeById', (id) => {
  return new Promise((resolve, reject) => {
    if (!_.isString(id)) {
      return reject(new TypeError('Id is not a valid string.'));
    }

    Badge
      .findByIdAndRemove(id)
      .exec((err, deleted) => {
        err ? reject(err)
          : resolve();
      });
  });
});

Badge = mongoose.model('badges', BadgeSchema);

export default Badge;
