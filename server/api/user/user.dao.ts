'use strict';

import * as mongoose from 'mongoose';
import userSchema from './user.model';
import * as _ from 'lodash';

const findAndUpdate = (findQuery, query) => {
  return new Promise((resolve, reject) => {
    if (!_.isObject(query)) {
      return reject(new TypeError('query is not a valid Object.'));
    }

    User
      .findOneAndUpdate(
        findQuery,
        query,
        {upsert: true, 'new': true}
      )
      .exec((err, updated) => {
        err ? reject(err) : resolve(updated);
      });
  });
};

const updateMessagesName = (userId, name) => {
  return new Promise((resolve, reject) => {
    User
      .update(
        {'messageConversations.receiver.receiverId': userId},
        {'messageConversations.$.receiver.name': name},
        {multi: true}
      )
      .exec((err, result) => {
        err ? reject(err) : resolve(result);
      });
  });
};

let User;

userSchema.static('getAll', (query?) => {
  return new Promise((resolve, reject) => {
    const _query = query || {};

    User
      .find(_query)
      .exec((err, users) => {
        err ? reject(err) : resolve(users);
      });
  });
});

userSchema.static('getOneByQuery', (query) => {
  return new Promise((resolve, reject) => {

    User
      .findOne(query)
      .lean()
      .exec((err, user) => {
        err ? reject(err) : resolve(user);
      });
  });
});

userSchema.static('updateOne', (userId, query) => {
  return new Promise((resolve, reject) => {
    if (!_.isObject(query)) {
      return reject(new TypeError('query is not a valid Object.'));
    }

    User
      .update(
        {_id: userId},
        {$set: query},
        {upsert: true, new: true}
      ).exec((err, updated) => {
      err ? reject(err) : resolve(updated);
    });
  });
});

userSchema.static('createNew', (user) => {
  return new Promise((resolve, reject) => {
    if (!_.isObject(user)) {
      return reject(new TypeError('Is not a valid object.'));
    }

    const _something = new User(user);

    _something.save((err, saved) => {
      err ? reject(err) : resolve(saved);
    });
  });
});

userSchema.static('removeById', (id) => {
  return new Promise((resolve, reject) => {
    if (!_.isString(id)) {
      return reject(new TypeError('Id is not a valid string.'));
    }

    User
      .findByIdAndRemove(id)
      .exec((err, deleted) => {
        err ? reject(err)
          : resolve();
      });
  });
});

userSchema.static('addEvent', (userId, event) => {
  return new Promise((resolve, reject) => {
    if (!_.isObject(event)) {
      return reject(new TypeError('event is not a valid object.'));
    }

    User
      .update(
        {_id: userId},
        {$push: {events: event}}
      ).exec((err, deleted) => {
      err ? reject(err)
        : resolve();
    });
  });
});


userSchema.static('updateMessageConversations', (messageConversationId, message) => {
  return new Promise((resolve, reject) => {
    if (!_.isString(message)) {
      return reject(new TypeError('message is not a valid String.'));
    }

    User
      .update(
        {'messageConversations._id': messageConversationId},
        {$set: {'messageConversations.$.lastMessage': message, 'messageConversations.$.lastUpdate': new Date()}},
        {multi: true, upsert: true}
      ).exec((err, updated) => {
      err ? reject(err) : resolve(updated);
    });
  });
});


userSchema.static('updateArrProp', (userIds, query) => {
  return new Promise((resolve, reject) => {
    if (!_.isObject(query)) {
      return reject(new TypeError('query is not a valid Object.'));
    }

    User
      .update(
        {_id: {$in: userIds}},
        {$push: query},
        {upsert: true}
      ).exec((err, updated) => {
      err ? reject(err) : resolve(updated);
    });

  });
});

userSchema.static('getChats', (userId) => {
  return new Promise((resolve, reject) => {
    User
      .findOne({_id: userId})
      .exec((err, user) => {
        err ? reject(err)
          : resolve(user.messageConversations);
      });
  });
});

userSchema.static('findAndUpdate', findAndUpdate);


userSchema.static('resetPassword', (passwordToken, newPassword) => {
  return new Promise((resolve, reject) => {
    if (!_.isString(newPassword)) {
      return reject(new TypeError('query is not a valid Object.'));
    }

    User
      .findOne({'passwordToken': passwordToken})
      .exec((error, doc) => {
        doc.passwordToken = undefined;
        doc.resetPasswordExpires = undefined;
        doc.password = newPassword;
        doc.save()
          .then((updated) => resolve(updated))
          .catch(errorSaved => reject(errorSaved));
      });
    //   query,
    //   {upsert: true, 'new': true}
    // )

  });
});

// Working on
userSchema.static('updateUserByMessageConversationId', (messageConversationId, userId, query) => {
  return new Promise((resolve, reject) => {
    if (!_.isObject(query)) {
      return reject(new TypeError('query is not a valid Object.'));
    }

    if (!_.isString(messageConversationId)) {
      return reject(new TypeError('messageConversationId is not a valid String.'));
    }

    if (!_.isObject(userId)) {
      return reject(new TypeError('userId is not a valid Object.'));
    }

    User
      .update(
        {
          'messageConversations.messageConversationId': messageConversationId,
          'messageConversations.receiver._id': userId
        },
        {$set: query},
        {multi: true}
      ).exec((err, updated) => {
      err ? reject(err) : resolve(updated);
    });
  });
});

userSchema.static('updateUserEmail', (userId, email) => {
  return new Promise((resolve, reject) => {
    findAndUpdate({_id: userId}, {'email': email})
      .then((user) => {
        resolve(user);
      });
  });
});

userSchema.static('updateUserName', (userId, name) => {
  return new Promise((resolve, reject) => {
    findAndUpdate({_id: userId}, {'name': name})
      .then((user) => {
        resolve(user);

        // Async work
        updateMessagesName(userId, name);
      });
  });
});

userSchema.static('updateOneByToken', (token, query) => {
  return new Promise((resolve, reject) => {
    if (!_.isObject(query)) {
      return reject(new TypeError('query is not a valid Object.'));
    }

    User
      .update(
        {validateToken: token},
        {$set: query},
        {upsert: true, new: true}
      ).exec((err, updated) => {
      err ? reject(err) : resolve(updated);
    });
  });
});

userSchema.static('updateEventsOnDeleteEvent', (userId, eventId) => {
  return new Promise((resolve, reject) => {
    User
      .update(
        {_id: userId},
        {$pull: {'events': {eventId}}},
        {multi: true}
      ).exec((err, updated) => {
      err ? reject(err) : resolve(updated);
    });
  });
});

userSchema.static('incrementNewChats', (userId, quantity) => {
  return new Promise((resolve, reject) => {

    if (!_.isString(userId)) {
      return reject(new TypeError('userId is not a valid String.'));
    }

    if (!quantity) {
      quantity = 1;
    }

    User
      .update(
        {_id: userId},
        {$inc: {newChats: quantity}}
      ).exec((err, updated) => {
      err ? reject(err) : resolve(updated);
    });
  });
});

User = mongoose.model('user', userSchema);

export default User;
