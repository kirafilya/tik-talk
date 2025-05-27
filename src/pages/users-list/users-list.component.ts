import {Component, inject, OnInit} from '@angular/core';
import {ProfileCardComponent} from '../../common-ui/profile-card/profile-card.component';
import {ProfileService} from '../../data/services/profile.service';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-users-list',
  imports: [
    ProfileCardComponent,
    AsyncPipe
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent {
  profileService = inject(ProfileService);

  profiles$ = this.profileService.getTestAccount();

}
