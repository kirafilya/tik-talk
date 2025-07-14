import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {AsyncPipe} from '@angular/common';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {combineLatest, map, Observable, startWith} from 'rxjs';
import {ChatsBtnComponent} from '../chats-btn/chats-btn.component';
import {ChatsService, LastMessageRes} from '@tt/data-access';
import {toObservable} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-chats-list',
  imports: [
    ChatsBtnComponent,
    ReactiveFormsModule,
    AsyncPipe,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './chats-list.component.html',
  styleUrl: './chats-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ChatsListComponent {
  private chatsService = inject(ChatsService);

  filterChatsControl = new FormControl('', Validators.required);

  unreadMapMessages = this.chatsService.countUnreadMessagesOneUser;

  chats$: Observable<LastMessageRes[]> = combineLatest([
    this.chatsService.getMyChats(),
    this.filterChatsControl.valueChanges.pipe(startWith('')),
    toObservable(this.unreadMapMessages)
  ]).pipe(
    map(([chats, filter, unreadMap]) => {

      const filtered = chats.filter(chat =>
        `${chat.userFrom.firstName} ${chat.userFrom.lastName}`
          .toLowerCase()
          .includes(filter?.toLowerCase() ?? '')
      );

      const result = filtered.map(chat => (
        {
          ...chat,
          countUnread: unreadMap.get(chat.id) ?? 0
        }
      ));

      return result;
    })
  );
}
