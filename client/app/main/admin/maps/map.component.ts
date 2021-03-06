import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {RaceService} from '../../../core/services/race.service';
import {MapService} from '../../../core/services/map.service';
import {Observable, BehaviorSubject} from 'rxjs';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';

import {DataSource} from '@angular/cdk/collections';

let maps: any[] = [];






import { Race } from '../../../models/race.model';
import { TimeService } from '../../../time.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  displayedColumns = ['_id', 'raceId', 'gpx'];
  dataSource = new MatTableDataSource<Race>(maps);
  loading = false;

  totalMaps: any;

  constructor(private raceService: RaceService, private mapService: MapService) {
    this.updateMaps();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  ngOnInit() {
  }

  updateMaps() {
    this.loading = true;
    this.mapService.getAll()
      .subscribe((currentMaps: any) => {
        this.loading = false;
        maps = currentMaps;
        this.totalMaps = maps;
        this.dataSource = new MatTableDataSource<Race>(maps);    
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

}
