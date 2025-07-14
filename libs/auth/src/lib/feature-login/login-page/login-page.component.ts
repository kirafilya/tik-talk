import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators,} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '@tt/data-access';
import {TtInputComponent} from '../../../../../common-ui/src/lib/components/tt-input/tt-input.component';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, TtInputComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPageComponent {
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);

  isPasswordVisible = signal<boolean>(false);

  form: FormGroup = new FormGroup({
    username: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required),
  });

  onSubmit() {
    if (this.form.valid) {
      //@ts-ignores
      this.authService.login(this.form.value).subscribe(() => {
        this.router.navigate(['/chats/']);
      });
    }
  }
}
