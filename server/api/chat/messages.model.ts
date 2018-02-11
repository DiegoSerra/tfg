'use strict';

import * as mongoose from 'mongoose';

const messageConversationSchema = new mongoose.Schema({
  users: [ String ],
  userMessages: [{
    senderId: String,
    sender: String,
    body: String,
    createdAt: Date
  }]
});


export default (messageConversationSchema);
