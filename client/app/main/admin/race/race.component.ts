import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {RaceService} from '../../../core/services/race.service';
import {Observable} from 'rxjs/Observable';
import {MatPaginator} from '@angular/material';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import {DataSource} from '@angular/cdk/collections';

let races: any[] = [];
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/merge';

@Component({
  selector: 'app-race',
  templateUrl: './race.component.html',
  styleUrls: ['./race.component.scss']
})
export class RaceComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('filter') filter: ElementRef;
  
  displayedColumns = ['name', 'createdBy', 'when', 'participants', 'actions'];
  dataSource: RaceDataSource | null;
  loading = false;

  totalRaces: any;

  constructor(private raceService: RaceService) {
    this.updateRaces();
  }


  ngOnInit() {
  }

  updateRaces() {
    this.loading = true;
    this.raceService.getAll()
      .subscribe(currentRaces => {
        this.loading = false;
        races = currentRaces;
        this.totalRaces = races;
        this.dataSource = new RaceDataSource(this.paginator);
        Observable.fromEvent(this.filter.nativeElement, 'keyup')
          .debounceTime(150)
          .distinctUntilChanged()
          .subscribe(() => {
            if (!this.dataSource) {
              return;
            }
            this.dataSource.filter = this.filter.nativeElement.value;
          });
      });
  }

  dataChange(event) {
    this.updateRaces();
  }

}

export class RaceDataSource extends DataSource<any> {
  _filterChange = new BehaviorSubject('');

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  constructor(private _paginator: MatPaginator) {
    super();
  }

  connect(): Observable<any[]> {
    return Observable
      .merge(races, this._paginator.page, this._filterChange)
      .map(() => {
        const startIndex = this._paginator.pageIndex * this._paginator.pageSize;

        let data = races.slice().filter((item: any) => {
          const searchStr = (item.name || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          return searchStr.indexOf((this.filter || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')) !== -1;
        });

        data = data.splice(startIndex, this._paginator.pageSize);

        return data;
      });
  }

  disconnect() {
  }
}
