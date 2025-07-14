import {ChangeDetectionStrategy, Component, HostBinding, input} from '@angular/core';
import {DatePipe} from '@angular/common';
import {AvatarCircleComponent} from '@tt/common-ui';
import {Message} from '@tt/data-access';

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [AvatarCircleComponent, DatePipe],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatMessageComponent {
  message = input.required<Message>();

  @HostBinding('class')
  get hostClasses(): string {
    return this.message().isMine ? 'is-mine' : '';
  }
}
