'use strict';

import * as mongoose from 'mongoose';
import messageConversationSchema from './messages.model';
import * as _ from 'lodash';

let MessageConversation;

messageConversationSchema.static('getAll', (query?) => {
  return new Promise((resolve, reject) => {
    const _query = query || {};

    MessageConversation
      .find(_query)
      .lean()
      .exec((err, messageConversations) => {
        err ? reject(err) : resolve(messageConversations);
      });
  });
});

messageConversationSchema.static('getOneByQuery', (query) => {
  return new Promise((resolve, reject) => {
    const _query = query;

    MessageConversation
      .findOne(_query)
      .exec((err, messageConversation) => {
        err ? reject(err) : resolve(messageConversation);
      });
  });
});

messageConversationSchema.static('updateOne', (messageConversationId, query) => {
  return new Promise((resolve, reject) => {
    if (!_.isObject(query)) {
      return reject(new TypeError('query is not a valid Object.'));
    }

    if (!_.isString(messageConversationId)) {
      return reject(new TypeError('messageConversationId is not a valid String.'));
    }

    MessageConversation
      .update(
        {_id: messageConversationId},
        {$set: query},
        {upsert: true}
      ).exec((err, updated) => {
      err ? reject(err) : resolve(updated);
    });
  });
});

messageConversationSchema.static('createNew', (messageConversation) => {
  return new Promise((resolve, reject) => {
    if (!_.isObject(messageConversation)) {
      return reject(new TypeError('Is not a valid object.'));
    }

    const _something = new MessageConversation(messageConversation);

    _something.save((err, saved) => {
      err ? reject(err) : resolve(saved);
    });
  });
});

messageConversationSchema.static('removeById', (id) => {
  return new Promise((resolve, reject) => {
    if (!_.isString(id)) {
      return reject(new TypeError('Id is not a valid string.'));
    }

    MessageConversation
      .findByIdAndRemove(id)
      .exec((err, deleted) => {
        err ? reject(err)
          : resolve();
      });
  });
});


messageConversationSchema.static('updateArrProp', (messageConversationId, query) => {
  return new Promise((resolve, reject) => {
    if (!_.isObject(query)) {
      return reject(new TypeError('query is not a valid Object.'));
    }

    if (!_.isString(messageConversationId)) {
      return reject(new TypeError('messageConversationId is not a valid String.'));
    }

    MessageConversation
      .findOneAndUpdate(
        {_id: messageConversationId},
        {$push: query},
        {upsert: true}
      ).exec((err, updated) => {
      err ? reject(err) : resolve(updated);
    });

  });
});

MessageConversation = mongoose.model('message_conversations', messageConversationSchema);

export default MessageConversation;
