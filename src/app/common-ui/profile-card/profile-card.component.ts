import {Component, Input} from '@angular/core';
import {Profile} from '../../helpers/interfaces/profile';
import {AvatarCircleComponent} from '../avatar-circle/avatar-circle.component';

@Component({
  selector: 'app-profile-card',
  imports: [
    AvatarCircleComponent
  ],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.scss'
})
export class ProfileCardComponent {
  @Input() profile!: Profile;

}
