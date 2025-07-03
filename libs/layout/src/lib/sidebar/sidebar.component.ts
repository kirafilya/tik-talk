import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {NgForOf} from '@angular/common';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {ImgUrlPipe, SvgIconComponent} from '@tt/common-ui';
import {SubscriberCardComponent} from './subscriber-card/subscriber-card.component';
import {Store} from '@ngrx/store';
import {profileActions, selectedMeProfile, selectedSubscribersShortList} from '@tt/profile';
import {AuthService, ChatsService, ProfileService} from '@tt/data-access';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {isChatWSError} from '../../../../data-access/src/lib/chats/interfaces/type-guards';
import {firstValueFrom, Subscription, timer} from 'rxjs';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    SvgIconComponent,
    NgForOf,
    RouterLink,
    SubscriberCardComponent,
    ImgUrlPipe,
    RouterLinkActive,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  store = inject(Store);
  chatService = inject(ChatsService);
  destroyRef = inject(DestroyRef);
  profileService = inject(ProfileService);
  #authService = inject(AuthService);

  subscribers = this.store.selectSignal(selectedSubscribersShortList);
  me = this.store.selectSignal(selectedMeProfile);
  countUnread = this.chatService.countUnreadMessages;

  wsSubscribe!: Subscription;

  menuItems = [
    {
      label: 'Моя страница',
      icon: 'home',
      link: 'profile/me',
    },
    {
      label: 'Чаты',
      icon: 'chat',
      link: 'chats',
    },
    {
      label: 'Поиск',
      icon: 'find',
      link: 'search',
    },
  ];

  ngOnInit() {
    this.store.dispatch(profileActions.myProfileGet())
    this.store.dispatch(profileActions.getSubscribersShortList({amountSlice: 5}))

    this.wsSubscribe = this.chatService.connectWS()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({
        next: (message) => {
          if (isChatWSError(message)) {
            this.reconnect();
          }
        },
        error: (err) => {
          console.error('Ошибка WebSocket:', err);
          this.reconnect();
        },
        complete: () => {
          console.log('WebSocket соединение закрыто');
          // Можно тоже попытаться переподключиться
          this.reconnect();
        }
      }))
  }
//зачем нам в компоненте еще одно соединение провеписывать в сервисе есть же
  connectWs() {
    this.wsSubscribe?.unsubscribe();
    this.wsSubscribe = this.chatService
      .connectWS()
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((message) => {
        if (isChatWSError(message)) {
          console.log('неверный токен');
          this.reconnect();
        }
      })
  }

  async reconnect() {
  // await firstValueFrom(this.profileService.getMe());
  await firstValueFrom(this.#authService.refreshAuthToken());
  await firstValueFrom(timer(2000));
  this.connectWs()
  }
}
