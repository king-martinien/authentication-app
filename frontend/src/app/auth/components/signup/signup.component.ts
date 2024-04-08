import { Component, inject, signal, WritableSignal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { JsonPipe, NgClass, NgOptimizedImage } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoaderComponent } from '../../../shared/loader/loader.component';
import { AuthService } from '../../service/auth/auth.service';
import { AuthForm } from '../../interfaces/authForm.interface';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    RouterLink,
    NgOptimizedImage,
    ReactiveFormsModule,
    NgClass,
    JsonPipe,
    LoaderComponent,
  ],
  templateUrl: './signup.component.html',
})
export class SignupComponent {
  private readonly _formBuilder: FormBuilder = inject(FormBuilder);
  private readonly _authService: AuthService = inject(AuthService);
  private readonly _router: Router = inject(Router);

  isPasswordToggled: WritableSignal<boolean> = signal(false);
  isFormSubmitted: WritableSignal<boolean> = signal(false);
  isLoading: WritableSignal<boolean> = signal(false);
  signupForm: FormGroup<AuthForm> = this._formBuilder.nonNullable.group<AuthForm>({
    fullname: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(4)],
    }),
    email: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,20}$')],
    }),
  });

  get f() {
    return this.signupForm.controls;
  }

  togglePasswordVisibility() {
    this.isPasswordToggled.set(!this.isPasswordToggled());
  }

  handleSubmit() {
    this.isFormSubmitted.set(true);

    if (this.signupForm.valid) {
      const signupRawForm = this.signupForm.getRawValue();

      this.isLoading.set(true);
      this.signupForm.disable();

      this._authService.signUp(signupRawForm).subscribe({
        next: () => {
          this.isLoading.set(false);
          this._router.navigate(['/auth/login']).then(r => r);
        },
        error: () => {
          this.isLoading.set(false);
          this.signupForm.enable();
        },
      });

    }
  }

  handleGoogleSignin() {
    console.log('calling handle...');
    return this._authService.googleSignin();
  }
}
