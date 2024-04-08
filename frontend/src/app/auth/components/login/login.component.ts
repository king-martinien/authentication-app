import { Component, inject, signal, WritableSignal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth/auth.service';
import { LoaderComponent } from '../../../shared/loader/loader.component';
import { AuthForm } from '../../interfaces/authForm.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    NgOptimizedImage,
    ReactiveFormsModule,
    NgClass,
    LoaderComponent,
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private readonly _formBuilder: FormBuilder = inject(FormBuilder);
  private readonly _authService: AuthService = inject(AuthService);
  private readonly _router: Router = inject(Router);

  isPasswordToggled: WritableSignal<boolean> = signal(false);
  isFormSubmitted: WritableSignal<boolean> = signal(false);
  isLoading: WritableSignal<boolean> = signal(false);
  loginForm: FormGroup<AuthForm> = this._formBuilder.nonNullable.group<AuthForm>({
    email: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl<string>('', { nonNullable: true }),
  });


  get f() {
    return this.loginForm.controls;
  }

  togglePasswordVisibility() {
    this.isPasswordToggled.update((value) => !value);
  }

  handleSubmit() {
    const loginRawForm = this.loginForm.getRawValue();
    this.isFormSubmitted.set(true);

    if (this.loginForm.valid) {

      this.isLoading.set(true);
      this.loginForm.disable();
      this._authService.login(loginRawForm).subscribe({
        next: () => {
          this.isLoading.set(false);
          this._router.navigate(['/dashboard']).then(r => r);
        },
        error: () => {
          this.isLoading.set(false);
          this.loginForm.enable();
        },
      });
    }
  }

}
