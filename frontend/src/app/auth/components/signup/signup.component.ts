import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { JsonPipe, NgClass, NgOptimizedImage } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoaderComponent } from '../../../shared/loader/loader.component';
import { AuthService } from '../../service/auth/auth.service';
import { User } from '../../model/user.interface';

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
  styleUrl: './signup.component.scss',
})
export class SignupComponent implements OnInit {
  private readonly _formBuilder: FormBuilder = inject(FormBuilder);
  private readonly _authService: AuthService = inject(AuthService);
  private readonly _router: Router = inject(Router);

  signupForm!: FormGroup;
  isPasswordToggled: WritableSignal<boolean> = signal(false);
  isFormSubmitted: WritableSignal<boolean> = signal(false);
  isLoading: WritableSignal<boolean> = signal(false);

  ngOnInit(): void {
    this.signupForm = this._formBuilder.group({
      fullname: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,20}$')]],
    });
  }

  get f() {
    return this.signupForm.controls;
  }

  togglePasswordVisibility() {
    this.isPasswordToggled.set(!this.isPasswordToggled());
  }

  handleSubmit() {
    this.isFormSubmitted.set(true);

    if (this.signupForm.valid) {

      this.isLoading.set(true);
      this.signupForm.disable();

      this._authService.signUp(this.signupForm.value as User).subscribe({
        next: (user) => {
          console.log('User created successfully : ', user);
          this.isLoading.set(false);
          this._router.navigate(['/auth/login']).then(r => r);
        },
        error: (err) => {
          console.log('error : ', err);
          this.isLoading.set(false);
          this.signupForm.enable();
        },
      });

    }
  }
}
