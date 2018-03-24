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

  constructor(private raceService: RaceService, private mapService: MapService) {
    this.updateRaces();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  ngOnInit() {
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
    this.raceService.create(event.race)
      .subscribe(race => {
        const map = {raceId: race._id, gpx: event.track};
        this.mapService.create(map)
          .subscribe((data) => this.updateRaces());
      });
  }

}
