import {createSelector} from '@ngrx/store';
import {profileFeature} from './reducer';
import {Profile} from '@tt/data-access';

export const selectedProfiles = createSelector(
  profileFeature.selectProfiles,
  (profiles) => profiles
)

export const selectedProfilesPegiable = createSelector(
  profileFeature.selectProfileFeatureState,
  (state) => {
    return {
      page: state.page,
        size: state.size
    }
  }
)

export const selectedFilters = createSelector(
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
