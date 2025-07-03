import {Component, inject, input, OnInit, signal} from '@angular/core';
import {AvatarCircleComponent} from '@tt/common-ui';
import {ChatsService, LastMessageRes} from '@tt/data-access';

@Component({
  selector: 'button[chats]',
  imports: [AvatarCircleComponent],
  templateUrl: './chats-btn.component.html',
  styleUrl: './chats-btn.component.scss',
})
export class ChatsBtnComponent implements OnInit {
  chat = input<LastMessageRes>();
  unreadMessages = signal<number>(0)
  chatsService = inject(ChatsService);

  ngOnInit() {
    this.unreadMessages.set(this.chatsService.countUnreadMessages())
  }
}
