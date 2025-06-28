import {Component, inject, OnInit} from '@angular/core';
import {NgForOf} from '@angular/common';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {ImgUrlPipe, SvgIconComponent} from '@tt/common-ui';
import {SubscriberCardComponent} from './subscriber-card/subscriber-card.component';
import {Store} from '@ngrx/store';
import {profileActions, selectedMeProfile, selectedSubscribersShortList} from '@tt/profile';


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

  subscribers = this.store.selectSignal(selectedSubscribersShortList);
  me = this.store.selectSignal(selectedMeProfile);

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
  }
}
