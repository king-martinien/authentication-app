import { Component, inject, OnInit, signal } from '@angular/core';
import { DashboardService } from './service/dashboard/dashboard.service';
import { NgClass, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgClass,
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private readonly _dashboardService: DashboardService = inject(DashboardService);

  testResponse = signal<string>('');
  isNavbarOpen = this._dashboardService.isNavbarOpen;

  ngOnInit() {
    this.test();
  }

  toggleNavbar() {
    this._dashboardService.toggleNavbar();
  }

  test() {
    return this._dashboardService.test().subscribe({
      next: res => {
        this.testResponse.set(res.response);
      },
    });
  }
}
