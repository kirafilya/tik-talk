import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ProfileCardComponent, ProfileFiltersComponent} from '@tt/profile';
import {Store} from '@ngrx/store';
import {InfiniteScrollTriggerComponent} from '@tt/common-ui';
import {profileActions, selectedProfiles} from '@tt/data-access';


@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [ProfileCardComponent, ProfileFiltersComponent, RouterLink, InfiniteScrollTriggerComponent],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchPageComponent  {
  store = inject(Store);

  profiles = this.store.selectSignal(selectedProfiles);

  timeToFetch() {
    this.store.dispatch(profileActions.setPage({}));
  }

}
