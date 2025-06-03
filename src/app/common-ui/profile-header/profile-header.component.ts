import {Component, input} from '@angular/core';
import {ImgUrlPipe} from '../../helpers/Pipes/img-url.pipe';
import {Profile} from '../../helpers/interfaces/profile';

@Component({
  selector: 'app-profile-header',
  imports: [
    ImgUrlPipe
  ],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.scss'
})
export class ProfileHeaderComponent {
  profile= input<Profile>();

}
