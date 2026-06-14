import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Investor } from '../../core/models/investor.model';

@Component({
    selector: 'app-dashboard-shell',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="min-h-screen bg-white">
      <!-- Navbar -->
      <nav class="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 bg-black rounded-xl flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <span class="font-bold text-lg text-black tracking-tight">Enviro365</span>
          </div>
          <div class="flex items-center gap-4">
            <span *ngIf="investor$ | async as investor" class="text-sm text-gray-400 font-medium">
              {{ investor.firstName }} {{ investor.lastName }}
            </span>
            <button (click)="onLogout()"
                    class="px-4 py-2 text-sm font-medium text-gray-500 hover:text-black
                           hover:bg-gray-50 rounded-lg transition-all duration-200">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div class="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <!-- Welcome -->
        <div *ngIf="investor$ | async as investor" class="space-y-1">
          <h1 class="text-3xl font-bold text-black tracking-tight">Welcome back, {{ investor.firstName }}</h1>
          <p class="text-gray-400">Manage your portfolio, deposits, and withdrawals</p>
        </div>

        <ng-content></ng-content>
      </div>
    </div>
  `
})
export class DashboardShellComponent {
    @Input() investor$!: Observable<Investor | null>;
    @Input() onLogout!: () => void;
}