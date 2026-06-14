import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { DepositResponse } from '../../core/models/deposit.model';

@Component({
    selector: 'app-deposit-history',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div class="px-6 py-5 border-b border-gray-50">
        <h2 class="text-base font-bold text-black">Deposit History</h2>
      </div>
      <div *ngIf="depositHistory$ | async as depositHistory">
        <div *ngIf="depositHistory.length === 0" class="text-center py-12 text-gray-300">
          <svg class="w-12 h-12 mx-auto mb-3 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          <p class="text-sm">No deposits yet</p>
        </div>
        <div *ngIf="depositHistory.length > 0" class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-50">
                <th class="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Product</th>
                <th class="text-right py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
                <th class="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                <th class="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of depositHistory; let last = last"
                  class="hover:bg-gray-50/50 transition-colors duration-150"
                  [class.border-b]="!last" [class.border-gray-50]="!last">
                <td class="py-4 px-6 font-semibold text-black">{{ item.investmentName }}</td>
                <td class="py-4 px-6 text-right font-semibold text-black">R {{ item.amount | number:'1.2-2' }}</td>
                <td class="py-4 px-6 text-gray-400 text-sm">{{ item.depositDate | date:'mediumDate' }}</td>
                <td class="py-4 px-6">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-black text-white">
                    {{ item.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class DepositHistoryComponent {
    @Input() depositHistory$!: Observable<DepositResponse[]>;
}