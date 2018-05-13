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
    const me = req['user'];
    RaceDao
      ['getAll'](
        {
          $or: [
            {'results.runnerName': {'$regex': me.name, '$options': 'i'}},
            {$and: [{'createdBy.userId': me._id}, {custom: {$ne: true}}]}
          ]
        }
      )      
      .then(races => res.status(200).json(races))
      .catch(error => res.status(400).json(error));
  }

  static getMyCalendar(req: express.Request, res: express.Response) {
    const myId = req['user']._id;
    RaceDao
      ['getAll']({$or: [{'createdBy.userId': myId}, {custom: {$ne: true}}]})      
      .then(races => res.status(200).json(races))
      .catch(error => res.status(400).json(error));
  }

  static createNew(req: express.Request, res: express.Response, next: express.NextFunction) {
    const _race = req.body;

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
    const raceId = req.params.id;

    ExcelService.getRaceFromExcel(file.path)
      .then((results: any) => {
        RaceDao['updateOne'](raceId, {results})
          .then(races => res.status(200).json(races))
          .catch(error => res.status(400).json(error));
      })
      .catch(error => console.log(error));
  }

}
