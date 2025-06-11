import {AfterViewInit, Component, ElementRef, inject, Input, OnInit, Renderer2} from '@angular/core';
import {PostInputComponent} from '../post-input/post-input.component';
import {PostComponent} from '../post/post.component';
import {PostService} from '../../../data/services/post.service';
import {debounceTime, firstValueFrom, fromEvent, take} from 'rxjs';
import {ProfileService} from '../../../data/services/profile.service';
import {Post, PostCreateDTO} from '../../../helpers/interfaces/postCreateDTO';
import {Profile} from '../../../helpers/interfaces/profile';

@Component({
  selector: 'app-post-feed',
  imports: [
    PostInputComponent,
    PostComponent
  ],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss'
})
export class PostFeedComponent implements AfterViewInit, OnInit {
  @Input() profile!: Profile;

  postService = inject(PostService);
  hostElement = inject(ElementRef);

  feed = this.postService.posts;
  me = inject(ProfileService).me();

  r2 = inject(Renderer2);

  // вынесла в онинит
  // loadPosts() {
  //   firstValueFrom(this.postService.featchPost())
  //     .then((posts: Post[]) => {
  //       this.feed.set(posts);
  //     })
  // }


  onCreatePost(post: PostCreateDTO): void {
    this.postService.createPost(post).pipe(
      take(1)
    ).subscribe();
  }


  ngOnInit(): void {

    //Все записи внизу аналогичны
    // firstValueFrom(this.postService.featchPost())

    // this.postService.featchPost().subscribe(posts => {
    //   console.log('POSTS FROM SERVER', posts);

      firstValueFrom(this.postService.featchPost())
        .then((posts: Post[]) => {
          this.feed.set(posts);
          console.log(posts);
    });
  }

  // Аналогично, но промис
  // async ngOnInit(): Promise<void> {
  //   await this.postService.featchPost();
  // }


// @HostListener('window:resize')
  // onWindowResize() {
  //   this.resizeFeed();
  // }

  // @HostListener('window: click', ['$event'])
  // onWindowClick() {
  //
  //   console.log(this.profile);
  // }
  ngAfterViewInit(): void {
    this.resizeFeed();

    fromEvent(window, 'resize')
      .pipe(
        debounceTime(200)
      )
      .subscribe(() => {
        this.resizeFeed();
      });

    // window.addEventListener('click', (event: MouseEvent) => {
    //   console.log(this.profile);
    // });

  }

  resizeFeed() { //тут мы задаем стили и местоположение элементу
    const {top} = this.hostElement.nativeElement.getBoundingClientRect();

    const height = window.innerHeight - top - 24 - 24;
    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }

}
