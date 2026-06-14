import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Portfolio } from '../../core/models/product.model';
import { Investor } from '../../core/models/investor.model';

@Component({
    selector: 'app-stats-cards',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
      <!-- Total Balance -->
      <div class="bg-black rounded-2xl p-6 text-white shadow-xl shadow-black/10">
        <p class="text-white/60 text-xs font-semibold uppercase tracking-wider">Total Balance</p>
        <p class="text-3xl font-bold mt-3 tracking-tight">
          <ng-container *ngIf="portfolio$ | async as portfolio">
            R {{ (portfolio.totalBalance || 0) | number:'1.2-2' }}
          </ng-container>
        </p>
        <p class="text-white/40 text-xs mt-2">All products combined</p>
      </div>

      <!-- Available for Withdrawal -->
      <div class="bg-gray-50 rounded-2xl p-6 border border-gray-100">
        <p class="text-gray-400 text-xs font-semibold uppercase tracking-wider">Available for Withdrawal</p>
        <p class="text-3xl font-bold text-black mt-3 tracking-tight">
          <ng-container *ngIf="portfolio$ | async as portfolio">
            R {{ (portfolio.totalAvailableForWithdrawal || 0) | number:'1.2-2' }}
          </ng-container>
        </p>
        <p class="text-gray-300 text-xs mt-2">90% of total balance</p>
      </div>

      <!-- Investor Age -->
      <div class="bg-gray-50 rounded-2xl p-6 border border-gray-100">
        <p class="text-gray-400 text-xs font-semibold uppercase tracking-wider">Investor Age</p>
        <p class="text-3xl font-bold text-black mt-3 tracking-tight">
          {{ (portfolio$ | async)?.age ?? (investor$ | async)?.age ?? 0 }} years
        </p>
        <p class="text-xs mt-2 font-medium"
           [class]="((portfolio$ | async)?.age ?? (investor$ | async)?.age ?? 0) > 65 ? 'text-green-500' : 'text-amber-500'">
          {{ ((portfolio$ | async)?.age ?? (investor$ | async)?.age ?? 0) > 65 ? '✓ Retirement eligible' : 'Retirement at 65+' }}
        </p>
      </div>
    </div>
  `
})
export class StatsCardsComponent {
    @Input() portfolio$!: Observable<Portfolio | null>;
    @Input() investor$!: Observable<Investor | null>;
}