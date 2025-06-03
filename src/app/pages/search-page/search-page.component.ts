import {Component, inject} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {ProfileCardComponent} from '../../common-ui/profile-card/profile-card.component';
import {ProfileService} from '../../data/services/profile.service';

@Component({
  selector: 'app-search-page',
  imports: [
    AsyncPipe,
    ProfileCardComponent
  ],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss'
})
export class  SearchPageComponent {
  profileService = inject(ProfileService);

  profiles$ = this.profileService.getTestAccount();

}
