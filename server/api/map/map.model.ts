'use strict';

import * as mongoose from 'mongoose';

const MapSchema = new mongoose.Schema(<any>{
  raceId: {type: mongoose.Schema.Types.ObjectId, ref: 'Race'},
  gpx: String
});

export default (MapSchema);

