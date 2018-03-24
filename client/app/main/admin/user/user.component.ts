import {UserService} from '../../../core/services/user.service';
import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {MatPaginator, MatTableDataSource, MatSort} from '@angular/material';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import {DataSource} from '@angular/cdk/collections';

let users: any[] = [];
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/merge';
import { FormGroup, FormBuilder } from '@angular/forms';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  displayedColumns = ['name', 'email', 'provider', 'role', 'createdOn'];
  dataSource = new MatTableDataSource<User>(users);
  loading = false;

  exportedUrl: string;
  totalUsers: any;

  checkboxGroup: FormGroup;

  constructor(private userService: UserService, private formBuilder: FormBuilder) {
    this.updateUsers();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  ngOnInit() {
    this.checkboxGroup = this.formBuilder.group({
      activeUsers: [true],
      deactiveUsers: [true]
    });

    this.checkboxGroup.valueChanges.subscribe((data) => {
      this.dataSource.data = users.filter(
        (user) =>
          ((user.active || user.active === undefined) && data.activeUsers) ||
          (!user.active && data.deactiveUsers && user.active !== undefined)
      );
    });
  }

  updateUsers() {
    this.loading = true;
    this.userService.all()
      .subscribe((currentUsers: any) => {
        this.loading = false;
        users = currentUsers;
        this.totalUsers = users;
        this.dataSource = new MatTableDataSource<User>(users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  exportFile() {
    delete this.exportedUrl;
    this.loading = true;
    this.userService.exportExternalUsers()
      .subscribe(data => {
        this.loading = false;
        this.exportedUrl = data.json().url;
        window.location.href = this.exportedUrl;
      });
  }

}