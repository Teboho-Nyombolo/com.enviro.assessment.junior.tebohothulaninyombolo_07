import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { WithdrawalHistory } from '../../core/models/withdrawal.model';

@Component({
    selector: 'app-withdrawal-history',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div class="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
        <h2 class="text-base font-bold text-black">Withdrawal History</h2>
        <button (click)="onDownloadCsv()"
                class="px-4 py-2 text-sm font-medium text-gray-500 hover:text-black
                       hover:bg-gray-50 rounded-lg transition-all duration-200 flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          Export CSV
        </button>
      </div>
      <div *ngIf="withdrawalHistory$ | async as history">
        <div *ngIf="history.length === 0" class="text-center py-12 text-gray-300">
          <svg class="w-12 h-12 mx-auto mb-3 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
          <p class="text-sm">No withdrawals yet</p>
        </div>
        <div *ngIf="history.length > 0" class="overflow-x-auto">
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
              <tr *ngFor="let item of history; let last = last"
                  class="hover:bg-gray-50/50 transition-colors duration-150"
                  [class.border-b]="!last" [class.border-gray-50]="!last">
                <td class="py-4 px-6 font-semibold text-black">{{ item.investmentName }}</td>
                <td class="py-4 px-6 text-right font-semibold text-black">R {{ item.amount | number:'1.2-2' }}</td>
                <td class="py-4 px-6 text-gray-400 text-sm">{{ item.withdrawalDate | date:'mediumDate' }}</td>
                <td class="py-4 px-6">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                        [class]="getStatusClass(item.status)">
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
export class WithdrawalHistoryComponent {
    @Input() withdrawalHistory$!: Observable<WithdrawalHistory[]>;
    @Output() downloadCsv = new EventEmitter<void>();

    onDownloadCsv() {
        this.downloadCsv.emit();
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'COMPLETED': return 'bg-black text-white';
            case 'PENDING': return 'bg-gray-100 text-gray-500';
            case 'FAILED': return 'bg-gray-100 text-gray-400 line-through';
            default: return 'bg-gray-100 text-gray-500';
        }
    }
}