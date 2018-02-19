import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {FileItem, FileUploader, ParsedResponseHeaders} from 'ng2-file-upload';
import { MatDialog } from '@angular/material';
import { CreateRaceDialogComponent } from './create-race-dialog/create-race-dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class AppHeaderComponent implements OnInit {

  @Input() title: string;
  @Input() icon: string;
  @Input() search: boolean;
  @Input() headerColor: string;
  @Input() create: any;
  @Input() import: any;
  @Input() dialog: any;

  @Output('update')
  change: EventEmitter<any> = new EventEmitter<any>();

  uploaderImportFile: FileUploader;

  constructor(private matDialog: MatDialog) { }

  ngOnInit() {
    if (this.import) {
      this.uploaderImportFile = new FileUploader({url: `api/${this.import}/import`});
      this.uploaderImportFile.onSuccessItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
        this.change.emit(response);        
      };
    }
  }

  importFile() {
    this.uploaderImportFile.setOptions({url: `api/${this.import}/import`});
    setTimeout(() => {
      this.uploaderImportFile.uploadAll();
    });
  }

  openDialog() {
    const component = this.getDialogComponent();

    const dialogRef = this.matDialog.open(component);

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.change.emit(data);
      }
    });
  }

  getDialogComponent() {
    switch (this.dialog) {
      case 'CreateRace':
        return CreateRaceDialogComponent;
    
      default:
        break;
    }
  }
}
