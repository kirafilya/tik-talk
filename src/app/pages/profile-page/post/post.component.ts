import {Component, inject, input, OnInit, signal} from '@angular/core';
import {AvatarCircleComponent} from '../../../common-ui/avatar-circle/avatar-circle.component';
import {FormsModule} from '@angular/forms';
import {SvgIconComponent} from '../../../common-ui/svg-icon/svg-icon.component';
import {CommentCreateDTO, Post, PostComment} from '../../../helpers/interfaces/postCreateDTO';
import {PostInputComponent} from '../post-input/post-input.component';
import {CommentComponent} from './comment/comment.component';
import {PostService} from '../../../data/services/post.service';
import {take} from 'rxjs';
import {TimeAgoPipe} from '../../../helpers/Pipes/timeAgo.pipe';
import {ProfileService} from '../../../data/services/profile.service';

@Component({
  selector: 'app-post',
  imports: [
    AvatarCircleComponent,
    FormsModule,
    SvgIconComponent,
    PostInputComponent,
    CommentComponent,
    TimeAgoPipe
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent implements OnInit {
  post = input<Post>();
  me = inject(ProfileService).me();


  comments = signal<PostComment[]>([]);
  postService = inject(PostService);


  ngOnInit() {
    this.comments.set(this.post()!.comments);
  }




  onCreateComment(comment: CommentCreateDTO) {
    console.log(comment);
    this.postService.createComment(comment)
      .pipe(
        take(1)
      ).subscribe(() => {
      this.postService.getCommentsByPostId(this.post()!.id)
        .pipe(
          take(1)
        ).subscribe((commentsOnePost) => {
          this.comments.set(commentsOnePost);
      })
    });
  }
}
