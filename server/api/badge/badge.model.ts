'use strict';

import * as mongoose from 'mongoose';

const BadgeSchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  chat: {
    type: Number,
    default: 0
  }
});

export default (BadgeSchema);

