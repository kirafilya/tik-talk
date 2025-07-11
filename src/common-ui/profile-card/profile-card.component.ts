import {Component, Input} from '@angular/core';
import {Profile} from '../../interfaces/profile';
import {ImgUrlPipe} from '../../Pipes/img-url.pipe';

@Component({
  selector: 'app-profile-card',
  imports: [
    ImgUrlPipe
  ],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.scss'
})
export class ProfileCardComponent {
  @Input() profile!: Profile;
}
