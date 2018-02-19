'use strict';

import * as express from 'express';
import MapDao from './map.dao';

const raceFolder = 'client/assets/tracks/';
const fs = require('fs');

export class MapController {

  static getAll(req: express.Request, res: express.Response) {
    MapDao
      ['getAll']()
      .then(maps => res.status(200).json(maps))
      .catch(error => res.status(400).json(error));
  }

  static getAllMe(req: express.Request, res: express.Response) {
    const myId = req['user']._id;
    MapDao
      ['getAll']({'createdBy.userId': myId})
      .then(maps => res.status(200).json(maps))
      .catch(error => res.status(400).json(error));
  }

  static createNew(req: express.Request, res: express.Response, next: express.NextFunction) {
    const _map = req.body;

    MapDao
      ['createNew'](_map)
      .then(map => res.status(200).json(map))
      .catch(error => res.status(400).json(error));
  }

  static getOneByRaceId(req: express.Request, res: express.Response) {
    MapDao
      ['getOneByQuery']({raceId: req.params.raceId})
      .then(map => res.status(200).json(map))
      .catch(error => res.status(400).json(error));
  }

  static getOne(req: express.Request, res: express.Response) {
    MapDao
      ['getOneByQuery']({_id: req.params.id})
      .then(map => res.status(200).json(map))
      .catch(error => res.status(400).json(error));
  }

  static updateOne(req: express.Request, res: express.Response, next: express.NextFunction) {
    const _id = req.params.id;
    const map = req.body;

    MapDao
      ['updateOne'](_id, map)
      .then(_map => res.status(201).json(map))
      .catch(error => res.status(400).json(error));
  }

  static removeById(req: express.Request, res: express.Response) {
    const _id = req.params.id;

    MapDao
      ['removeById'](_id)
        .then(() => res.status(200).end())
        .catch(error => console.log(error));
  }

  static search(req: express.Request, res: express.Response, next: express.NextFunction) {
    const searchText = req.query.search;

    MapDao
      ['getAll'](
      {'flightNumber': {'$regex': searchText, '$options': 'i'}}
    )
      .then(maps => res.status(200).json(maps))
      .catch(error => res.status(400).json(error));
  }

  static getFileNames(req: express.Request, res: express.Response, next: express.NextFunction) {
    fs.readdir(raceFolder, (err, files) => {
      !err ? res.status(200).json(files) : res.status(400).json(err);
    });
  }

}
