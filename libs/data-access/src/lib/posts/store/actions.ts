import {createActionGroup, emptyProps, props} from '@ngrx/store';
import {CommentCreateDTO, Post, PostCreateDTO} from '@tt/data-access';

export const postsActions = createActionGroup({
  source: 'posts',
  events: {
    'posts get': props<{userId: number}>(),
    'posts my get': emptyProps(),

    'posts loaded': props<{posts: Post[]}>(),
    'post create': props<{post: PostCreateDTO}>(),

    'comment create': props<{comment: CommentCreateDTO}>(),
    // 'comments get by postId': props<{postId: number}>(),
    // 'comments loaded': props<{comments: PostComment[] | undefined}>(),
  }
})
