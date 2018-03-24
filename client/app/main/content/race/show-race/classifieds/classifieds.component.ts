import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

let runners: any[] = [];

@Component({
  selector: 'app-classifieds',
  templateUrl: './classifieds.component.html',
  styleUrls: ['./classifieds.component.scss']
})
export class ClassifiedsComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @Input() race: any;

  displayedColumns = ['position', 'runnerName', 'time', 'rhythm'];
  dataSource = new MatTableDataSource<any>(runners);

  loading = false;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.updateRunners();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  updateRunners() {
    this.loading = true;
    runners = this.race.results;
    this.dataSource = new MatTableDataSource<any>(runners);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.loading = false;
  }

}
