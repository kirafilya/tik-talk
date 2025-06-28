import {inject, Injectable} from '@angular/core';
import {PostService} from '@tt/data-access';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {postsActions} from './actions';
import {map, switchMap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PostsEffects {
  postService = inject(PostService);
  actions$ = inject(Actions);

  fetchPost = createEffect(() => {
    return this.actions$.pipe(
      ofType(postsActions.postsGet),
      switchMap(() => {
        return this.postService.fetchPost()
      }),
      map(posts => postsActions.postsLoaded({posts: posts}))
    )
  })

  createPost = createEffect(() => {
    return this.actions$.pipe(
      ofType(postsActions.postCreate),
      switchMap(({post}) => {
        return this.postService.createPost(post)
      }),
      map(posts => postsActions.postsLoaded({posts: posts}))
    )
  })

  createComment = createEffect(() => {
    return this.actions$.pipe(
      ofType(postsActions.commentCreate),
      switchMap(({comment}) => {
        return this.postService.createComment(comment)
      }),
      map(posts => postsActions.postsLoaded({posts: posts}))
    )
  })

  // getCommentsByPostId = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(postsActions.commentsGetByPostId),
  //     switchMap(({postId}) => {
  //       return this.postService.getCommentsByPostId(postId)
  //     }),
  //     map(comments => postsActions.commentsLoaded({comments: comments}))
  //   )
  // })

}
