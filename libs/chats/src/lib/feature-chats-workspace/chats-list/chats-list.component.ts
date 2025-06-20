import {Component, inject} from '@angular/core';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {AsyncPipe} from '@angular/common';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {map, Observable, startWith, switchMap} from 'rxjs';
import {ChatsBtnComponent} from '../chats-btn/chats-btn.component';
import {ChatsService} from '../../../../../data-access/src/lib/chats/services/chats.service';
import {LastMessageRes} from '../../../../../data-access/src/lib/chats/interfaces/chats';

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
})
export class ChatsListComponent {
  chatsService: ChatsService = inject(ChatsService);

  filterChatsControl = new FormControl('', Validators.required);

  chats$: Observable<LastMessageRes[]> = this.chatsService.getMyChats().pipe(
    switchMap((chats: LastMessageRes[]) => {
      return this.filterChatsControl.valueChanges.pipe(
        startWith(''), //тут стартовая инфа в фильтре, чтобы показались все чаты без фильтра
        map((inputValue) => {
          return chats.filter((chat: LastMessageRes) => {
            return `${chat.userFrom.firstName} ${chat.userFrom.lastName}`
              .toLowerCase()
              .includes(inputValue?.toLowerCase() ?? '');
          });
        })
      );
    })
  );
}
