import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {AvatarCircleComponent} from '@tt/common-ui';
import {Profile} from '@tt/data-access';

@Component({
  selector: 'app-profile-card',
  imports: [AvatarCircleComponent],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileCardComponent {
  @Input() profile!: Profile;
}
