import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {FileItem, FileUploader, ParsedResponseHeaders} from 'ng2-file-upload';
import { MatDialog } from '@angular/material';

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
        this.change.emit(item);        
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
    const dialogRef = this.matDialog.open(this.dialog);

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.change.emit(data);
      }
    });
  }
}
