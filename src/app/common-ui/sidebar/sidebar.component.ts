import {Component, inject, OnInit} from '@angular/core';
import {SvgIconComponent} from '../svg-icon/svg-icon.component';
import {AsyncPipe, NgForOf} from '@angular/common';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {SubscriberCardComponent} from './subscriber-card/subscriber-card.component';
import {ProfileService} from '../../data/services/profile.service';
import {firstValueFrom, map, Observable} from 'rxjs';
import {Profile} from '../../helpers/interfaces/profile';
import {ImgUrlPipe} from '../../helpers/Pipes/img-url.pipe';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    SvgIconComponent,
    NgForOf,
    RouterLink,
    SubscriberCardComponent,
    AsyncPipe,
    ImgUrlPipe,
    RouterLinkActive
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {

  profileService: ProfileService = inject(ProfileService);
  subscribers$: Observable<Profile[]> = this.profileService.getSubscribersShortList()
    .pipe(
      map(subscribers => subscribers)
    );

  me = this.profileService.me;

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
    }
  ]

  ngOnInit() {
    firstValueFrom(this.profileService.getMe())
  }

}
