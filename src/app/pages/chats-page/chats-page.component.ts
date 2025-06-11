import {Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ChatsListComponent} from './chats-list/chats-list.component';
import {ProfileService} from '../../data/services/profile.service';

@Component({
  selector: 'app-chats-page',
  imports: [
    RouterOutlet,
    ChatsListComponent
  ],
  templateUrl: './chats-page.component.html',
  styleUrl: './chats-page.component.scss'
})
export class ChatsPageComponent {

  profileService = inject(ProfileService)
}
