import {Component, inject, input} from '@angular/core';
import {ChatMessageComponent} from './chat-workspace-message/chat-message.component';
import {MessageInputComponent} from '../../../../common-ui/message-input/message-input.component';
import {ChatsService} from '../../../../data/services/chats.service';
import {firstValueFrom} from 'rxjs';
import {Chat} from '../../../../helpers/interfaces/chats';

@Component({
  selector: 'app-chat-workspace-messages-wrapper',
  imports: [
    ChatMessageComponent,
    MessageInputComponent
  ],
  templateUrl: './chat-workspace-messages-wrapper.component.html',
  styleUrl: './chat-workspace-messages-wrapper.component.scss'
})
export class ChatWorkspaceMessagesWrapperComponent{
  chatsService = inject(ChatsService);

  chat = input.required<Chat>();
  messages = this.chatsService.activeChatMessages


  async onSendMessage(textMessage: string) {
    await firstValueFrom(this.chatsService.sendMessage(this.chat().id, textMessage))

    await firstValueFrom(this.chatsService.getChatById(this.chat().id))
  }


}
