import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  Input,
  Renderer2,
  Signal,
} from '@angular/core';
import {debounceTime, fromEvent} from 'rxjs';
import {PostInputComponent} from '../../ui';
import {Post, PostCreateDTO, postsActions, Profile, selectedPosts} from '@tt/data-access';
import {Store} from '@ngrx/store';
import {PostComponent} from '../post/post.component';

@Component({
  selector: 'app-post-feed',
  standalone: true,
  imports: [PostInputComponent, PostComponent],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostFeedComponent implements AfterViewInit {
  @Input() profile!: Profile;
  me = input<Profile>();

  hostElement = inject(ElementRef);
  store = inject(Store);

  feed: Signal<Post[] | []> = this.store.selectSignal(selectedPosts);


  r2 = inject(Renderer2);


  onCreatePost(post: PostCreateDTO): void {
    this.store.dispatch(postsActions.postCreate({post}))
  }



  ngAfterViewInit(): void {
    this.resizeFeed();

    fromEvent(window, 'resize')
      .pipe(debounceTime(200))
      .subscribe(() => {
        this.resizeFeed();
      });

  }

  resizeFeed() {
    const { top } = this.hostElement.nativeElement.getBoundingClientRect();

    const height = window.innerHeight - top - 24 - 24;
    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }
}
