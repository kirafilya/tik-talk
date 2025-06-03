import {Component, Input} from '@angular/core';
import {Profile} from '../../../helpers/interfaces/profile';
import {ImgUrlPipe} from '../../../helpers/Pipes/img-url.pipe';

@Component({
  selector: 'app-subscriber-card',
  imports: [
    ImgUrlPipe
  ],
  templateUrl: './subscriber-card.component.html',
  styleUrl: './subscriber-card.component.scss'
})
export class SubscriberCardComponent {
  @Input() profile!: Profile;
}
