import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth/auth.service';
import { LoginCredentials } from '../../model/loginCredentials.interface';
import { LoaderComponent } from '../../../shared/loader/loader.component';

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
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  private readonly _formBuilder: FormBuilder = inject(FormBuilder);
  private readonly _authService: AuthService = inject(AuthService);
  private readonly _router: Router = inject(Router);

  loginForm!: FormGroup;
  isPasswordToggled: WritableSignal<boolean> = signal(false);
  isFormSubmitted: WritableSignal<boolean> = signal(false);
  isLoading: WritableSignal<boolean> = signal(false);

  ngOnInit() {
    this.loginForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  togglePasswordVisibility() {
    this.isPasswordToggled.update((value) => !value);
  }

  handleSubmit() {
    this.isFormSubmitted.set(true);

    if (this.loginForm.valid) {

      this.isLoading.set(true);
      this.loginForm.disable();
      this._authService.login(this.loginForm.value as LoginCredentials).subscribe({
        next: (user) => {
          this.isLoading.set(false);
          this._router.navigate(['/dashboard']).then(r => r);
        },
        error: err => {
          console.log('ERROR WHEN LOGIN : ', err);
          this.isLoading.set(false);
          this.loginForm.enable();
        },
      });
    }
  }

}
