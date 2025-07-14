import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {debounceTime, startWith} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {profileActions, ProfileService, selectedFilters} from '@tt/data-access';
import {Store} from '@ngrx/store';

@Component({
  selector: 'app-profile-filters',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './profile-filters.component.html',
  styleUrl: './profile-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileFiltersComponent implements OnInit {
  fb = inject(FormBuilder);
  profileService = inject(ProfileService);
  store = inject(Store);
  destroyRef = inject(DestroyRef);

  filter = this.store.selectSignal(selectedFilters);

  searchForm = this.fb.group({
    firstName: [this.filter().profileFilters?.['firstName'] || ''],
    lastName: [this.filter().profileFilters?.['lastName'] || ''],
    username: [this.filter().profileFilters?.['username'] || ''],
    stack: [this.filter().profileFilters?.['stack'] || ''],
  });



  ngOnInit(): void {

    this.searchForm.valueChanges
      .pipe(
        startWith({}),
        debounceTime(300),
        // switchMap((formValue) => {
          // return this.profileService.filterProfiles(formValue)
        // }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(formValue => {
        this.store.dispatch(profileActions.filterEvents({filters: formValue}))
      });
  }
}
