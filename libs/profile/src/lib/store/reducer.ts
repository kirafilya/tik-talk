import {Profile} from '@tt/interfaces/profile';
import {createFeature, createReducer, on} from '@ngrx/store';
import {profileActions} from './actions';

export interface ProfileState {
  profiles: Profile[],
  profileFilters: Record<string, any>,
  me:  Profile | null,
  profileId: Profile | null,
  subscribersShortList: Profile[],
}

export const initialState: ProfileState = {
  profiles: [],
  profileFilters: {},
  me: null,
  profileId: null,
  subscribersShortList: [],
}


export const profileFeature = createFeature({
  name: 'profileFeature',
  reducer: createReducer(
    initialState,
    on(profileActions.profilesLoaded, (state, payload) => {
      return {
        ...state,
        profiles: payload.profiles,
      }
    }),

    on(profileActions.filterEvents, (state, payload) => {
      return {
        ...state,
        profileFilters: payload.filters,
      }
    }),

    on(profileActions.myProfileLoaded, (state, payload) => {
      return {
        ...state,
        me: payload.me,
      };
    }),

    on(profileActions.profileIdLoaded, (state, payload) => {
      return {
        ...state,
        profileId: payload.profile,
      };
    }),

    on(profileActions.subscribersShortListLoaded, (state, {subscribers}) => {
      return {
        ...state,
        subscribersShortList: subscribers,
      }
    })

  )
})
