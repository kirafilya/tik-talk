import {Component, effect, inject, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, ReactiveFormsModule, ValidatorFn, Validators,} from '@angular/forms';
import {firstValueFrom} from 'rxjs';
import {NameValidator} from './name.validator';
import {AvatarUploadComponent} from '../../ui/avatar-upload/avatar-upload.component';
import {ProfileHeaderComponent} from '../../ui/profile-header/profile-header.component';
import {ProfileService} from '@tt/data-access';

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
  imports: [ReactiveFormsModule, ProfileHeaderComponent, AvatarUploadComponent],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss',
})
export class SettingsPageComponent {
  profileService = inject(ProfileService);
  nameValidator = inject(NameValidator);
  me = this.profileService.me;
  fb = inject(FormBuilder);

  @ViewChild(AvatarUploadComponent) avatarUploader!: AvatarUploadComponent;

  form = this.fb.group({
    firstName: ['', [Validators.required, validateStartWith('с')]],
    lastName: ['', Validators.required],
    username: [{ value: '', disabled: true }],
    city: [
      '',
      {
        validators: [Validators.required],
        asyncValidators: [this.nameValidator.validate.bind(this.nameValidator)],
        updateOn: 'blur',
      },
    ],
    description: ['', Validators.minLength(10)],
    stack: [''],
  });

  constructor() {
    effect(() => {
      //@ts-ignore
      this.form.patchValue({
        ...this.profileService.me(),
        //@ts-ignore
        stack: this.mergeStack(this.profileService.me()?.stack),
      });
    });
  }

  onSave() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    if (this.form.invalid) return;

    firstValueFrom(
      //@ts-ignore
      this.profileService.patchProfile({
        ...this.form.value,
        stack: this.splitStack(this.form.value.stack),
      })
    );

    if (this.avatarUploader.avatar) {
      firstValueFrom(
        this.profileService.uploadAvatar(this.avatarUploader.avatar)
      );
    }
  }

  splitStack(stack: string | null | string[] | undefined) {
    if (!stack) return [];
    if (Array.isArray(stack)) return stack;

    return stack.split(',');
  }

  mergeStack(stack: string | null | string[] | undefined) {
    if (!stack) return '';
    if (Array.isArray(stack)) return stack.join(',');

    return stack;
  }
}
