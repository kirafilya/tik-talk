import {createFeature, createReducer, on} from '@ngrx/store';
import {postsActions} from './actions';
import {Post} from '@tt/data-access';

export interface PostsState {
  posts: Post[]
  // commentsPostById: PostComment[]
}

export const initialState: PostsState = {
  posts: [],
  // commentsPostById: []
}

export const postsFeature = createFeature({
  name: 'postsFeature',
  reducer: createReducer(
    initialState,

    on(postsActions.postsLoaded, (state, payload) => {
      return {
        ...state,
        posts: payload.posts,
      }
    })

    // on(postsActions.commentsLoaded, (state, payload) => {
    //   return {
    //     ...state,
    //     commentsPostById: payload.comments ?? [],
    //   }
    // })

  )
})
