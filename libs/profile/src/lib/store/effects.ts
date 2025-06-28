import {inject, Injectable} from '@angular/core';
import {Pageble, ProfileService} from '@tt/data-access';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {profileActions} from './actions';
import {map, switchMap} from 'rxjs';
import {Profile} from '@tt/interfaces/profile';

@Injectable({
  providedIn: 'root'
})

export class ProfileEffects {
  profileService = inject(ProfileService)
  actions$ = inject(Actions)

  filterProfiles = createEffect(() => {
    return this.actions$.pipe(
      ofType(profileActions.filterEvents),
      switchMap(({filters}) => {
        return this.profileService.filterProfiles(filters)
      }),
      map((profile: Pageble<Profile>) => profileActions.profilesLoaded({profiles: profile.items}))
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
