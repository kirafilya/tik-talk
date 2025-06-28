import {Component, inject, input} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {TimeAgoPipe} from '../../pipes/timeAgo.pipe';
import {CommentComponent} from '../../ui/comment/comment.component';
import {PostInputComponent} from '../../ui/post-input/post-input.component';
import {AvatarCircleComponent, SvgIconComponent} from '@tt/common-ui';
import {CommentCreateDTO, Post, PostComment} from '@tt/data-access';
import {Store} from '@ngrx/store';
import {Profile} from '@tt/interfaces/profile';
import {postsActions} from '../../store/actions';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    AvatarCircleComponent,
    FormsModule,
    SvgIconComponent,
    PostInputComponent,
    CommentComponent,
    TimeAgoPipe,
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
})
export class PostComponent {
  post = input<Post>();
  comments = input<PostComment[]>();
  me = input<Profile>();
  // comments = signal<PostComment[]>([])

  store = inject(Store);

  // comments = signal<PostComment[]>([]);
  // postService = inject(PostService);


  // ngOnInit() {
  //   // this.comments.set(this.post()!.comments);
  //   // this.store.dispatch(postsActions.commentsGetByPostId({postId: this.post().id}))
  //   this.comments.set(this.post()!.comments)
  // }

  onCreateComment(comment: CommentCreateDTO) {
    this.store.dispatch(postsActions.commentCreate({comment: comment}));
    // this.postService
    //   .createComment(comment)
    //   .pipe(take(1))
    //   .subscribe(() => {
    //     this.postService
    //       .getCommentsByPostId(this.post()!.id)
    //       .pipe(take(1))
    //       .subscribe((commentsOnePost) => {
    //         this.comments.set(commentsOnePost);
    //       });
    //   });
  }
}
