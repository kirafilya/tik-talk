import {Component, inject, signal} from '@angular/core';
import {ProfileHeaderComponent} from '../../common-ui/profile-header/profile-header.component';
import {ProfileService} from '../../data/services/profile.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {firstValueFrom, switchMap} from 'rxjs';
import {toObservable} from '@angular/core/rxjs-interop';
import {AsyncPipe} from '@angular/common';
import {SvgIconComponent} from '../../common-ui/svg-icon/svg-icon.component';
import {PostFeedComponent} from './post-feed/post-feed.component';
import {ImgUrlPipe} from '../../helpers/Pipes/img-url.pipe';
import {ChatsService} from '../../data/services/chats.service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    ProfileHeaderComponent,
    AsyncPipe,
    SvgIconComponent,
    RouterLink,
    PostFeedComponent,
    ImgUrlPipe
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent {
  profileService: ProfileService = inject(ProfileService);
  chatsService: ChatsService = inject(ChatsService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  isMyPage = signal<boolean>(false)

  subscribers$ = this.profileService.getSubscribersShortList(5);
  me$ = toObservable(this.profileService.me);

  profile$ = this.route.params
    .pipe(
      switchMap(({id}) => {
        this.isMyPage.set(id === 'me' || id === this.profileService.me()?.id);
        if (id === 'me') return this.me$;

        return this.profileService.getAccount(id);
      }
    )
  );

  async sendMessage(userId: number) {
    firstValueFrom(this.chatsService.createChats(userId))
      .then((res) => {
        this.router.navigate([`/chats`, res.id]);
      })
  }
}
