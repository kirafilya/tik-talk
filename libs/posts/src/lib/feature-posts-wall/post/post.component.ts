import {Component, inject, input, OnInit, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {take} from 'rxjs';
import {TimeAgoPipe} from '../../pipes/timeAgo.pipe';
import {CommentComponent} from '../../ui/comment/comment.component';
import {PostInputComponent} from '../../ui/post-input/post-input.component';
import {AvatarCircleComponent, SvgIconComponent} from '@tt/common-ui';
import {CommentCreateDTO, GlobalStoreService, Post, PostComment, PostService} from '@tt/data-access';

@Component({
  selector: 'app-post',
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
export class PostComponent implements OnInit {
  post = input<Post>();
  me = inject(GlobalStoreService).me();

  comments = signal<PostComment[]>([]);
  postService = inject(PostService);

  ngOnInit() {
    this.comments.set(this.post()!.comments);
  }

  onCreateComment(comment: CommentCreateDTO) {
    console.log(comment);
    this.postService
      .createComment(comment)
      .pipe(take(1))
      .subscribe(() => {
        this.postService
          .getCommentsByPostId(this.post()!.id)
          .pipe(take(1))
          .subscribe((commentsOnePost) => {
            this.comments.set(commentsOnePost);
          });
      });
  }
}
