import {
  AfterViewChecked,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  input,
  OnChanges,
  Output,
  signal,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {MessageDateGroupComponent} from '../../chats-list/message-date-group/message-date-group.component';
import {Chat, Message} from '../../../../../../data-access/src/lib/chats/interfaces/chats';
import {ChatsService} from '../../../../../../data-access/src/lib/chats/services/chats.service';
import {MessageInputComponent} from '../../../ui/message-input/message-input.component';
import {ChatMessageComponent} from './chat-workspace-message/chat-message.component';

@Component({
  selector: 'app-chat-workspace-messages-wrapper',
  imports: [
    ChatMessageComponent,
    MessageInputComponent,
    MessageDateGroupComponent,
  ],
  templateUrl: './chat-workspace-messages-wrapper.component.html',
  styleUrl: './chat-workspace-messages-wrapper.component.scss',
})
export class ChatWorkspaceMessagesWrapperComponent implements OnChanges, AfterViewChecked {
  chatsService = inject(ChatsService);
  @ViewChild('scrollToBottom') scrollToBottom!: ElementRef;

  @Output() sendMessage = new EventEmitter();
  @Input() messages: Message[] = [];
  chat = input.required<Chat>();

  dateAndMessages = signal<{ date: string; messages: Message[] }[]>([]);


  ngOnChanges(changes: SimpleChanges) {
    if (changes['messages']) {
      this.dateAndMessages.set(this.groupMessage(this.messages));
    }
    this.scrollBottom();
  }

  ngAfterViewChecked() {
    this.scrollBottom();
  }

  async onSendMessage(textMessage: string) {
    this.chatsService.wsAdapter.sendMessage(
      textMessage,
      this.chat().id)

    // await firstValueFrom(
    //   this.chatsService.getChatById(this.chat().id)
    // );
    this.scrollBottom();
  }

  private scrollBottom() {
    if (this.scrollToBottom) {
      this.scrollToBottom.nativeElement.scrollTop =
        this.scrollToBottom.nativeElement.scrollHeight;
    }
  }


  groupMessage(
    messagesAll: Message[]
  ): { date: string; messages: Message[] }[] {
    const result: { date: string; messages: Message[] }[] = [];

    for (const message of messagesAll) {
      const date = message.createdAt.slice(0, 10);

      // Ищем уже существующую группу по дате
      const existingGroup = result.find((group) => group.date === date);

      if (existingGroup) {
        existingGroup.messages.push(message);
      } else {
        result.push({
          date,
          messages: [message],
        });
      }
    }

    return result;
  }
}
