'use strict';

import * as express from 'express';
import RaceDao from './race.dao';
import UserDao from '../user/user.dao';
import {BadgeSocket} from '../../sockets/badge.socket';
import { ExcelService } from '../../services/excel.service';


export class RaceController {

  static getAll(req: express.Request, res: express.Response) {
    RaceDao
      ['getAll']()
      .then(races => res.status(200).json(races))
      .catch(error => res.status(400).json(error));
  }

  static getAllMe(req: express.Request, res: express.Response) {
    const myId = req['user']._id;
    RaceDao
      ['getAll']({'createdBy.userId': myId})
      .then(races => res.status(200).json(races))
      .catch(error => res.status(400).json(error));
  }

  static createNew(req: express.Request, res: express.Response, next: express.NextFunction) {
    const _race = req.body;

    _race.from = _race.connections[0].from;
    _race.dateStart = _race.connections[0].dateStart;

    const lastIndex = _race.connections.length - 1;
    _race.to = _race.connections[lastIndex].to;
    _race.dateEnd = _race.connections[lastIndex].dateEnd;

    _race.createdBy = {
      userId: req['user']._id,
      name: req['user'].name
    };

    RaceDao
      ['createNew'](_race)
      .then(race => res.status(200).json(race))
      .catch(error => res.status(400).json(error));
  }

  static getOne(req: express.Request, res: express.Response) {
    RaceDao
      ['getOneByQuery']({_id: req.params.id})
      .then(race => res.status(200).json(race))
      .catch(error => res.status(400).json(error));
  }

  static updateOne(req: express.Request, res: express.Response, next: express.NextFunction) {
    const _id = req.params.id;
    const race = req.body;

    RaceDao
      ['updateOne'](_id, race)
      .then(_race => res.status(201).json(race))
      .catch(error => res.status(400).json(error));
  }

  static removeById(req: express.Request, res: express.Response) {
    const _id = req.params.id;

    const updatePromises = [];

    updatePromises.push(
      RaceDao
        ['removeById'](_id)
    );

    updatePromises.push(
      RaceDao
        ['updateMatchOnDeleteRace'](_id)
    );

    updatePromises.push(
      UserDao
        ['updateRacesOnDeleteRace'](req['user']._id, _id)
    );

    Promise.all(updatePromises)
      .then(() => res.status(200).end())
      .catch(error => console.log(error));
  }

  static search(req: express.Request, res: express.Response, next: express.NextFunction) {
    const searchText = req.query.search;

    RaceDao
      ['getAll'](
      {'flightNumber': {'$regex': searchText, '$options': 'i'}}
    )
      .then(races => res.status(200).json(races))
      .catch(error => res.status(400).json(error));
  }

  static importRaces(req: express.Request, res: express.Response) {
    const user = req['user'];
    const file = req['files'].file;

    ExcelService.getRaceFromExcel(file.path)
      .then((result: any) => {
        result.createdBy = user;
        return RaceDao.createOrEdit(result);
      })
      .then((result) => {
        res.status(201).json(result);
      })
      .catch(error => res.status(400).json(error));
  }

}
