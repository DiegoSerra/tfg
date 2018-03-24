'use strict';

import * as mongoose from 'mongoose';
import {TimeService} from '../../services/time.service';

const CreatedBy = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  name: String,
  when: {type: Date, default: new Date()}
}, { _id : false });

const ResultSchema = new mongoose.Schema(<any>{
  position: Number,
  time: Number,
  rhythm: Number,
  dorsal: Number,
  runnerName: String,
  positionCategory: Number,
  fullCategory: String,
  category: String,
  gender: String,
  club: String,
}, { _id : false });

const RaceSchema = new mongoose.Schema(<any>{
  name: String,
  dateStart: String,
  hourStart: String,
  dateEnd: String,
  hourEnd: String,
  city: String,
  country: String,
  kms: Number,
  createdBy: CreatedBy,
  active: {
    type: Boolean,
    default: true,
  },
  results: [ResultSchema],
});

export default (RaceSchema);

