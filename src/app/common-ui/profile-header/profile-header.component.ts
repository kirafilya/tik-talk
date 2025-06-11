import {Component, input} from '@angular/core';
import {Profile} from '../../helpers/interfaces/profile';
import {AvatarCircleComponent} from '../avatar-circle/avatar-circle.component';

@Component({
  selector: 'app-profile-header',
  imports: [
    AvatarCircleComponent
  ],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.scss'
})
export class ProfileHeaderComponent {
  profile= input<Profile>();
}
