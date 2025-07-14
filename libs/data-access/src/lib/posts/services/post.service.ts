import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, switchMap} from 'rxjs';
import {Comment} from '@angular/compiler';
import {CommentCreateDTO, Post, PostCreateDTO} from '../interfaces/postCreateDTO';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private http = inject(HttpClient);
  baseApiUrl = 'https://icherniakov.ru/yt-course/';


  createPost(post: PostCreateDTO) {
    return this.http.post<Post>(`${this.baseApiUrl}post/`, post).pipe(
      switchMap(() => {
        return this.fetchPost();
      })
    );
  }

  fetchPost() {
    return this.http.get<Post[]>(`${this.baseApiUrl}post/`)
  }

  getPostsByUserId(userId: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseApiUrl}post/`, {
      params: { user_id: userId }
    });
  }


  createComment(comment: CommentCreateDTO) {
    return this.http.post<Comment>(`${this.baseApiUrl}comment/`, comment)
      .pipe(
      switchMap(() => {
        return this.fetchPost();
      })
    );
  }

  // getCommentsByPostId(postId: number) {
  //   return this.http
  //     .get<Post>(`${this.baseApiUrl}post/${postId}`)
  //     .pipe(map((res) => res.comments));
  // }
}
