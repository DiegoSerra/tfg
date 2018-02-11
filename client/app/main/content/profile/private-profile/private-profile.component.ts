import {Component, OnInit} from '@angular/core';
import {User} from '../../../../models/user.model';
import {UserService} from '../../../../core/services/user.service';
import {FileItem, FileUploader, ParsedResponseHeaders} from 'ng2-file-upload';

@Component({
  selector: 'app-profile',
  templateUrl: './private-profile.component.html',
  styleUrls: ['./private-profile.component.scss']
})
export class PrivateProfileComponent implements OnInit {
  user: User;

  uploaderProfileImage: FileUploader;
  loadingProfileImage = false;

  constructor(private userService: UserService) {
    userService.user$.subscribe((user: User) => {
      this.user = user;
    });
  }

  ngOnInit() {
    this.uploaderProfileImage = new FileUploader({url: '/api/me/uploadProfileImage'});
    this.uploaderProfileImage.onSuccessItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      this.loadingProfileImage = false;
      this.userService.me();
    };
  }

  changeProfileImage() {
    this.loadingProfileImage = true;
    setTimeout(() => {
      this.uploaderProfileImage.uploadAll();
    });
  }

}
