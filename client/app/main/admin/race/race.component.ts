import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {RaceService} from '../../../core/services/race.service';
import {MapService} from '../../../core/services/map.service';
import {Observable} from 'rxjs/Observable';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import {DataSource} from '@angular/cdk/collections';

let races: any[] = [];
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/merge';
import { Race } from '../../../models/race.model';
import { TimeService } from '../../../time.service';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';

@Component({
  selector: 'app-race',
  templateUrl: './race.component.html',
  styleUrls: ['./race.component.scss']
})
export class RaceComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  displayedColumns = ['name', 'createdBy', 'when', 'participants', 'actions'];
  dataSource = new MatTableDataSource<Race>(races);
  loading = false;

  totalRaces: any;

  uploaderImportFile: FileUploader;

  constructor(private raceService: RaceService, private mapService: MapService, private timeService: TimeService) {
    this.updateRaces();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  ngOnInit() {
    this.uploaderImportFile = new FileUploader({url: `api/race/byId/import`});
    this.uploaderImportFile.onSuccessItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      this.updateRaces();        
    };
  }

  importFile(raceId) {
    this.uploaderImportFile.setOptions({url: `api/race/${raceId}/import`});
    setTimeout(() => {
      this.uploaderImportFile.uploadAll();
    });
  }

  updateRaces() {
    this.loading = true;
    this.raceService.getAll()
      .subscribe((currentRaces: any) => {
        this.loading = false;
        races = currentRaces;
        this.totalRaces = races;
        this.dataSource = new MatTableDataSource<Race>(races);    
        this.dataSource.paginator = this.paginator;
        this.dataSource.sortingDataAccessor = (item: any, property) => {
          switch (property) {
            case 'createdBy': return item.createdBy.name;
            case 'when': return item.createdBy.when;
            case 'participants': return item.results.length;
            default: return item[property];
          }
        };
        this.dataSource.sort = this.sort;
      });
  }

  dataChange(event) {
    event.race.dateStart = this.createDateSystem(event.race.dateStart, event.race.hourStart);
    event.race.dateEnd = this.createDateSystem(event.race.dateEnd, event.race.hourEnd);

    this.raceService.create(event.race)
      .subscribe(race => {
        const map = {raceId: race._id, gpx: event.track};
        this.mapService.create(map)
          .subscribe((data) => this.updateRaces());
      });
  }

  createDateSystem(date, hour) {
    const splitHour = hour.split(':');

    return this.timeService.createSystemMoment(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      splitHour[0],
      splitHour[1]
    );
  }

}
