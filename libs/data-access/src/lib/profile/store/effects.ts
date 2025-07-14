import {inject, Injectable} from '@angular/core';
import {Pageble, Profile, ProfileService} from '@tt/data-access';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {profileActions} from './actions';
import {map, switchMap, withLatestFrom} from 'rxjs';
import {Store} from '@ngrx/store';
import {selectedFilters, selectedProfilesPegiable} from './selector';

@Injectable({
  providedIn: 'root'
})

export class ProfileEffects {
  profileService = inject(ProfileService)
  actions$ = inject(Actions)
  store = inject(Store)

  filterProfiles = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        profileActions.filterEvents,
        profileActions.setPage
      ),
      withLatestFrom(
        this.store.select(selectedProfilesPegiable),
        this.store.select(selectedFilters),
      ),
      switchMap(([_, filters, pageable ]) => {
        return this.profileService.filterProfiles({
          ...pageable,
          ...filters})
      }),
      map((profile: Pageble<Profile>) =>
        profileActions.profilesLoaded({profiles: profile.items}))
    )
  })

  getMyProfile = createEffect(() => {
    return this.actions$.pipe(
      ofType(profileActions.myProfileGet),
      switchMap(() => {
        return this.profileService.getMe()
      }),
      map((profile: Profile) => profileActions.myProfileLoaded({me: profile}))
    )
  })

  getAccountId = createEffect(() => {
    return this.actions$.pipe(
      ofType(profileActions.getAccountId),
      switchMap(({id}) => {
        return this.profileService.getAccount(id)
      }),
      map(profile => profileActions.profileIdLoaded({profile: profile}))
    )
  })

  getSubscribersShortList = createEffect(() => {
    return this.actions$.pipe(
      ofType(profileActions.getSubscribersShortList),
      switchMap(({amountSlice}) => {
        return this.profileService.getSubscribersShortList(amountSlice)
      }),
      map(profile => {
       return profileActions.subscribersShortListLoaded({subscribers: profile})
      })
    )
  })

}
