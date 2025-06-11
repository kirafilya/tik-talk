import {Component, input} from '@angular/core';
import {AvatarCircleComponent} from '../../../common-ui/avatar-circle/avatar-circle.component';
import {LastMessageRes} from '../../../helpers/interfaces/chats';

@Component({
  selector: 'button[chats]',
  imports: [
    AvatarCircleComponent
  ],
  templateUrl: './chats-btn.component.html',
  styleUrl: './chats-btn.component.scss'
})
export class ChatsBtnComponent{
  chat = input<LastMessageRes>();

}
