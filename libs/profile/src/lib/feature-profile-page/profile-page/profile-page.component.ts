import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {AsyncPipe} from '@angular/common';
import {ImgUrlPipe, SvgIconComponent} from '@tt/common-ui';
import {ProfileHeaderComponent} from '../../ui/profile-header/profile-header.component';
import {PostFeedComponent, postsActions} from '@tt/posts';
import {Store} from '@ngrx/store';
import {switchMap} from 'rxjs';
import {profileActions, selectedMeProfile, selectedProfileId, selectedSubscribersShortList} from '@tt/data-access';

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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfilePageComponent implements OnInit {
  route = inject(ActivatedRoute);
  store = inject(Store);
  router = inject(Router);

  isMyPage = signal<boolean>(false);

  subscribers = this.store.selectSignal(selectedSubscribersShortList);
  me = this.store.selectSignal(selectedMeProfile);

  profile$ = this.route.params.pipe(
    switchMap(({ id }) => {

      if (id === 'me') {
        this.isMyPage.set(id === 'me' || id === this.me()?.id);
        this.store.dispatch(postsActions.postsMyGet())
        return this.store.select(selectedMeProfile)
      } else {
        this.store.dispatch(profileActions.getAccountId({id: id}));
        this.store.dispatch(postsActions.postsGet({userId: id}))
        return this.store.select(selectedProfileId);
      }


    })
  );


  async sendMessage(userId: number) {
    this.router.navigate(['/chats', 'new'], { queryParams: { userId} } );
  }


  ngOnInit() {
    this.store.dispatch(profileActions.getSubscribersShortList({amountSlice: 5}))
  }
}
