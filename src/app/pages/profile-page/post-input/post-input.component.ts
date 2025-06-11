import {Component, EventEmitter, HostBinding, inject, Input, input, Output, Renderer2} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SvgIconComponent} from '../../../common-ui/svg-icon/svg-icon.component';
import {AvatarCircleComponent} from '../../../common-ui/avatar-circle/avatar-circle.component';
import {Profile} from '../../../helpers/interfaces/profile';
import {CommentCreateDTO, PostCreateDTO} from '../../../helpers/interfaces/postCreateDTO';

@Component({
  selector: 'app-post-input',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SvgIconComponent,
    AvatarCircleComponent
  ],
  templateUrl: './post-input.component.html',
  styleUrl: './post-input.component.scss'
})
export class PostInputComponent {
  @Input() profile : Profile | null = null;
  @Output() createdPost = new EventEmitter<PostCreateDTO>();
  @Output() createdComment = new EventEmitter<CommentCreateDTO>();

  r2 = inject(Renderer2);

  isCommentInput = input(false);
  postId = input<number>(0);


  @HostBinding('class')
  get isComment() {
    return {
      'comment': this.isCommentInput()
    }
  }

  postText = '';

  onTextAreaInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;

    this.r2.setStyle(textarea, 'height', 'auto');
    this.r2.setStyle(textarea, 'height', textarea.scrollHeight + 'px');
  }

  onClick() {
    if (!this.postText) return;

    if (this.isCommentInput()) {
      this.createdComment.emit({
        text: this.postText,
        authorId: this.profile!.id,
        postId: this.postId()
      })
      this.postText = '';
      return;
    }

    this.createdPost.emit({
      title: "Lalala",
      content: this.postText,
      authorId: this.profile!.id
    })
    this.postText = '';
    return;
  }
}

  // onCreatePost() {
  //   if (!this.postText) return;
  //
  //   if (this.isCommentInput()) {
  //     firstValueFrom(
  //       this.postService.createComment({
  //         text: this.postText,
  //         authorId: this.me()!.id,
  //         postId: this.postId()
  //       })
  //     ).then(() => {
  //       this.postText = '';
  //       this.created.emit();
  //     })
  //     return;
  //   }
  //
  //   firstValueFrom(
  //     this.postService.createPost({
  //       title: "Lalala",
  //       content: this.postText,
  //       authorId: this.me()!.id
  //     })
  //   ).then(() => {
  //     this.postText = '';
  //   })
  // }

