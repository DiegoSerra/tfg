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
  runnerName: String,
  gender: String,
  age: String,
  time: String,
  rhythm: String
}, { _id : false });

const RaceSchema = new mongoose.Schema(<any>{
  name: String,
  dateStart: Date,
  dateEnd: Date,
  createdBy: CreatedBy,
  active: {
    type: Boolean,
    default: true,
  },
  results: [ResultSchema]
});

RaceSchema
  .virtual('systemDateStart')
  .get(function () {
    return TimeService.dateToSystemMoment(this.dateStart);
  });

RaceSchema
  .virtual('systemDateEnd')
  .get(function () {
    return TimeService.dateToSystemMoment(this.dateEnd);
  });

export default (RaceSchema);

