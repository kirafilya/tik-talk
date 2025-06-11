import {Component, inject} from '@angular/core';
import {ChatsBtnComponent} from '../chats-btn/chats-btn.component';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {ChatsService} from '../../../data/services/chats.service';
import {AsyncPipe} from '@angular/common';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {map, startWith, switchMap} from 'rxjs';

@Component({
  selector: 'app-chats-list',
  imports: [
    ChatsBtnComponent,
    ReactiveFormsModule,
    AsyncPipe,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './chats-list.component.html',
  styleUrl: './chats-list.component.scss'
})
export class ChatsListComponent {
  chatsService = inject(ChatsService);

  filterChatsControl = new FormControl('', Validators.required);

  chats$ = this.chatsService.getMyChats().pipe(
    switchMap((chats) => {
      return this.filterChatsControl.valueChanges
        .pipe(
          startWith(''), //тут стартовая инфа в фильтре, чтобы показались все чаты без фильтра
          map(inputValue => {
            return chats.filter(chat => {
              return `${chat.userFrom.firstName} ${chat.userFrom.lastName}`
                .toLowerCase()
                .includes((inputValue ?? '').toLowerCase()) ;
            });
          })
        )
    }),
  );
}
