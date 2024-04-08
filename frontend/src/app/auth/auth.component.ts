import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    RouterOutlet,
    NgOptimizedImage,
  ],
  templateUrl: './auth.component.html',
})
export class AuthComponent {
}
