import {createSelector} from '@ngrx/store';
import {profileFeature} from './reducer';
import {Profile} from '@tt/interfaces/profile';

export const selectedProfiles = createSelector(
  profileFeature.selectProfiles,
  (profiles) => profiles
)

export const filtersSelector = createSelector(
  profileFeature.selectProfileFeatureState,
  (profileFilters) => profileFilters
)

export const selectedMeProfile = createSelector(
  profileFeature.selectMe,
  (me: Profile | null) => me
)

export const selectedProfileId = createSelector(
  profileFeature.selectProfileId,
  (profileId: Profile | null) => profileId
)

export const selectedSubscribersShortList = createSelector(
  profileFeature.selectSubscribersShortList,
  (subscribers) => {
    return subscribers
  }
)
