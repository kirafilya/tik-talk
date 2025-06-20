import {Component, inject, signal} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {switchMap} from 'rxjs';
import {toObservable} from '@angular/core/rxjs-interop';
import {AsyncPipe} from '@angular/common';
import {ImgUrlPipe, SvgIconComponent} from '@tt/common-ui';
import {ProfileHeaderComponent} from '../../ui/profile-header/profile-header.component';
import {PostFeedComponent} from '@tt/posts';
import {ProfileService} from '@tt/data-access';


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
  styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent {
  profileService: ProfileService = inject(ProfileService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  isMyPage = signal<boolean>(false);

  subscribers$ = this.profileService.getSubscribersShortList(5);
  me$ = toObservable(this.profileService.me);

  profile$ = this.route.params.pipe(
    switchMap(({ id }) => {
      this.isMyPage.set(id === 'me' || id === this.profileService.me()?.id);
      if (id === 'me') return this.me$;

      console.log(this.profileService.getAccount(id))
      return this.profileService.getAccount(id);
    })
  );

  async sendMessage(userId: number) {
    this.router.navigate(['/chats', 'new'], { queryParams: { userId} } );
  }
}
