import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {UsersListComponent} from '../pages/users-list/users-list.component';

@Component({
  selector: 'app-root',
  imports: [UsersListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'TikTalk';
}
