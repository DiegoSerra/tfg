import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';


@Component({
  selector: 'app-delete-race-dialog',
  templateUrl: './delete-race-dialog.component.html',
  styleUrls: ['./delete-race-dialog.component.scss']
})
export class DeleteRaceDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DeleteRaceDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
  }

}
