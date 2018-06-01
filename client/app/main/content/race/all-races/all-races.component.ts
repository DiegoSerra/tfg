import { Component, OnInit } from '@angular/core';

import {RaceService} from '../../../../core/services/race.service';
import {Race} from '../../../../models/race.model';
import {MatDialog} from '@angular/material';
import {DeleteRaceDialogComponent} from './delete-race-dialog/delete-race-dialog.component';
import {ActivatedRoute} from '@angular/router';
import {ReactiveAccountDialogComponent} from './reactive-account-dialog/reactive-account-dialog.component';

@Component({
  selector: 'app-all-races',
  templateUrl: './all-races.component.html',
  styleUrls: ['./all-races.component.scss']
})
export class AllRacesComponent implements OnInit {

  races: Race[] = [];

  loading = false;

  constructor(
    private raceService: RaceService,
    public dialog: MatDialog,
    private route: ActivatedRoute
  ) { 
    this.route.queryParams
      .subscribe(_params => {
        if (_params['reactive']) {
          this.dialog.open(ReactiveAccountDialogComponent, {
            width: '420px',
            data: {params: _params},
            disableClose: true
          });
        }
      });
  }

  ngOnInit() {
    this.updateRaces();
  }

  updateRaces() {
    this.loading = true;
    this.raceService.all()
      .subscribe((races: any) => {
        this.races = races;
        this.loading = false;
      });
  }

  openDeleteRaceDialog(race) {
    const dialogRef = this.dialog.open(DeleteRaceDialogComponent, {
      data: {race}
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {  
        this.raceService.remove(race._id)
          .subscribe(races => {
            this.updateRaces();
          });
      }
    });
  }

}
