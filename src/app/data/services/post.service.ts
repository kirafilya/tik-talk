import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommentCreateDTO, Post, PostCreateDTO} from '../../helpers/interfaces/postCreateDTO';
import {map, switchMap, tap} from 'rxjs';
import {Comment} from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})

export class PostService {
  private http = inject(HttpClient);
  baseApiUrl = 'https://icherniakov.ru/yt-course/';

  posts = signal<Post[]>([])

  createPost(post: PostCreateDTO) {
    return this.http.post<Post>(`${this.baseApiUrl}post/`, post)
      .pipe(
        switchMap(() => {
          return this.featchPost()
        })
      )
  }

  featchPost() {
    return this.http.get<Post[]>(`${this.baseApiUrl}post/`)
      .pipe(
        tap(res => {
            return this.posts.set(res)
          }
        )
      )
  }

  // Аналогично, но промис
  // async featchPost(): Promise<void> {
  //   const posts = await this.http.get<Post[]>(`${this.baseApiUrl}post/`).toPromise();
  //   if (posts) {
  //     this.posts.set(posts);
  //   }
  // }

  createComment(comment: CommentCreateDTO) {
    return this.http.post<Comment>(`${this.baseApiUrl}comment/`, comment).pipe(
      switchMap(() => {
        return this.featchPost()
      })
    )
  }

  getCommentsByPostId(postId: number) {
    return this.http.get<Post>(`${this.baseApiUrl}post/${postId}`)
      .pipe(
        map(res => res.comments),
      )
  }

}
