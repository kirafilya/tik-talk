import {AfterViewInit, Component, ElementRef, inject, Input, OnInit, Renderer2,} from '@angular/core';
import {debounceTime, fromEvent} from 'rxjs';
import {PostInputComponent} from '../../ui';
import {Profile} from '@tt/interfaces/profile';
import {PostCreateDTO} from '@tt/data-access';
import {Store} from '@ngrx/store';
import {selectedPosts} from '../../store/selector';
import {postsActions} from '../../store/actions';
import {PostComponent} from '../post/post.component';
import {selectedMeProfile} from '@tt/profile';

@Component({
  selector: 'app-post-feed',
  standalone: true,
  imports: [PostInputComponent, PostComponent],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss',
})
export class PostFeedComponent implements AfterViewInit, OnInit {
  @Input() profile!: Profile;

  store = inject(Store);
  hostElement = inject(ElementRef);

  feed = this.store.selectSignal(selectedPosts)
  me = this.store.selectSignal(selectedMeProfile);

  r2 = inject(Renderer2);


  onCreatePost(post: PostCreateDTO): void {
    this.store.dispatch(postsActions.postCreate({post}))
  }

  ngOnInit(){

    this.store.dispatch(postsActions.postsGet())
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
