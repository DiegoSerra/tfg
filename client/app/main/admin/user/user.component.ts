import {UserService} from '../../../core/services/user.service';
import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {MatPaginator} from '@angular/material';
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

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  displayedColumns = ['name', 'email', 'provider', 'role', 'createdOn'];
  dataSource: UserDataSource | null;
  loading = false;

  exportedUrl: string;
  totalUsers: any;

  checkboxGroup: FormGroup;

  constructor(private userService: UserService, private formBuilder: FormBuilder) {
    this.updateUsers();
  }


  ngOnInit() {
    this.checkboxGroup = this.formBuilder.group({
      activeUsers: [true],
      deactiveUsers: [true]
    });

    this.checkboxGroup.valueChanges.subscribe((data) => {
      this.dataSource.checkbox = data;
      this.totalUsers = users.filter(
        (user) =>
          ((user.active || user.active === undefined) && data.activeUsers) ||
          (!user.active && data.deactiveUsers && user.active !== undefined)
      );
    });
  }

  updateUsers() {
    this.loading = true;
    this.userService.all()
      .subscribe(currentUsers => {
        this.loading = false;
        users = currentUsers;
        this.totalUsers = users;
        this.dataSource = new UserDataSource(this.paginator);
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

export class UserDataSource extends DataSource<any> {
  _filterChange = new BehaviorSubject('');
  _checkBoxChange = new BehaviorSubject('');

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  get checkbox(): any {
    return this._checkBoxChange.value;
  }

  set checkbox(filter: any) {
    this._checkBoxChange.next(filter);
  }

  constructor(private _paginator: MatPaginator) {
    super();
  }

  connect(): Observable<any[]> {
    return Observable
      .merge(users, this._paginator.page, this._filterChange, this._checkBoxChange)
      .map(() => {
        const startIndex = this._paginator.pageIndex * this._paginator.pageSize;

        let data = users.slice().filter((item: any) => {
          const searchStr = (item.name || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          return searchStr.indexOf((this.filter || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')) !== -1;
        });

        if (this.checkbox) {
          data = users.slice().filter(
            (user) =>
              (((user.active || user.active === undefined) && this.checkbox.activeUsers) ||
              (!user.active && this.checkbox.deactiveUsers && user.active !== undefined))
          );
        }

        data = data.splice(startIndex, this._paginator.pageSize);

        return data;
      });
  }

  disconnect() {
  }
}
