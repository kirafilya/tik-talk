import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {debounceTime, startWith, switchMap} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ProfileService} from '@tt/data-access';

@Component({
  selector: 'app-profile-filters',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './profile-filters.component.html',
  styleUrl: './profile-filters.component.scss',
})
export class ProfileFiltersComponent implements OnInit {
  fb = inject(FormBuilder);
  profileService = inject(ProfileService);
  destroyRef = inject(DestroyRef);

  searchForm = this.fb.group({
    firstName: [''],
    lastName: [''],
    username: [''],
    stack: [''],
  });

  ngOnInit(): void {
    this.searchForm.valueChanges
      .pipe(
        startWith({}),
        debounceTime(300),
        switchMap((formValue) => this.profileService.filterProfiles(formValue)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
}
