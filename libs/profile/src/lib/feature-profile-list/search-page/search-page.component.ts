import {Component, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ProfileCardComponent, ProfileFiltersComponent, selectedProfiles} from '@tt/profile';
import {Store} from '@ngrx/store';


@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [ProfileCardComponent, ProfileFiltersComponent, RouterLink],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
})
export class SearchPageComponent  {
  store = inject(Store);

  profiles = this.store.selectSignal(selectedProfiles);

}
