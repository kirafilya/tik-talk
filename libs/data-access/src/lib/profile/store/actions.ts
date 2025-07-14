import {createActionGroup, emptyProps, props} from '@ngrx/store';
import {Profile} from '@tt/data-access';

export const profileActions = createActionGroup({
  source: 'profile',
  events: {
    'filter events': props<{filters: Record<string, any>}>(),
    'set page': props<{page? : number}>(),
    'profiles loaded': props<{profiles: Profile[]}>(),

    'myProfile get': emptyProps(),
    'myProfile loaded': props<{me: Profile}>(),

    'get account Id': props<{id: string}>(),
    'profile id loaded': props<{profile: Profile}>(),

    'get subscribers short list': props<{amountSlice: number}>(),
    'subscribers short list loaded': props<{subscribers: Profile[]}>(),
  }
})
