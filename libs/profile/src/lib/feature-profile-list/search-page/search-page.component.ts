import {Component, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ProfileCardComponent, ProfileFiltersComponent} from '@tt/profile';
import {ProfileService} from '@tt/data-access';


@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [ProfileCardComponent, ProfileFiltersComponent, RouterLink],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
})
export class SearchPageComponent  {
  profileService = inject(ProfileService);

  profiles = this.profileService.filteredProfiles;

}
