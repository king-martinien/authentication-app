import { Component, inject, OnInit, signal } from '@angular/core';
import { DashboardService } from './service/dashboard/dashboard.service';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NgOptimizedImage,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private readonly _dashboardService: DashboardService = inject(DashboardService);

  testResponse = signal<string>('');

  ngOnInit() {
    this.test();
  }

  test() {
    return this._dashboardService.test().subscribe({
      next: res => {
        this.testResponse.set(res.response);
      },
    });
  }
}
