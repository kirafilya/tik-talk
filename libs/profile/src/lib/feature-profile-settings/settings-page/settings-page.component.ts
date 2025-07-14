import {ChangeDetectionStrategy, Component, effect, inject, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, ReactiveFormsModule, ValidatorFn, Validators,} from '@angular/forms';
import {firstValueFrom} from 'rxjs';
import {NameValidator} from './name.validator';
import {AvatarUploadComponent} from '../../ui/avatar-upload/avatar-upload.component';
import {ProfileHeaderComponent} from '../../ui/profile-header/profile-header.component';
import {ProfileService} from '@tt/data-access';
import {Store} from '@ngrx/store';
import {AddressInputComponent, StackInputComponent} from '@tt/common-ui';
import {selectedMeProfile} from '../../../../../data-access/src/lib/profile/store/selector';
import {profileActions} from '../../../../../data-access/src/lib/profile/store/actions';

function validateStartWith(forhiddenLetter: string): ValidatorFn {
  return (control: AbstractControl) => {
    return control.value.startsWith(forhiddenLetter)
      ? { startsWith: `${forhiddenLetter} - последняя буква алфавита` }
      : null;
  };
}

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [ReactiveFormsModule, ProfileHeaderComponent, AvatarUploadComponent, StackInputComponent, AddressInputComponent],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsPageComponent {
  profileService = inject(ProfileService);
  store = inject(Store);
  nameValidator = inject(NameValidator);
  me = this.store.selectSignal(selectedMeProfile);
  fb = inject(FormBuilder);

  @ViewChild(AvatarUploadComponent) avatarUploader!: AvatarUploadComponent;

  form = this.fb.group({
    firstName: ['', [Validators.required, validateStartWith('с')]],
    lastName: ['', Validators.required],
    username: [{ value: '', disabled: true }],
    description: ['', Validators.minLength(10)],
    stack: [''
      // {value: '', disabled: true}
    ],
    city: [null]
  });

  constructor() {
    effect(() => {
      //@ts-ignore
      this.form.patchValue({
        ...this.me()
      });
    });
  }



  async onSave() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    if (this.form.invalid) return;

    if (this.avatarUploader.avatar) {
      await firstValueFrom(
        this.profileService.uploadAvatar(this.avatarUploader.avatar)
      );
    }

    await firstValueFrom(
      //@ts-ignore
      this.profileService.patchProfile({
        ...this.form.value
      })
    );

    this.store.dispatch(profileActions.myProfileGet())

  }
}
