import {UserService} from '../../../core/services/user.service';
import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {Observable, BehaviorSubject} from 'rxjs';
import {MatPaginator, MatTableDataSource, MatSort} from '@angular/material';

import {DataSource} from '@angular/cdk/collections';

let users: any[] = [];






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
    this.userService.export()
      .subscribe((data: any) => {
        this.loading = false;
        this.exportedUrl = data.url;
        window.location.href = this.exportedUrl;
      });
  }

}
