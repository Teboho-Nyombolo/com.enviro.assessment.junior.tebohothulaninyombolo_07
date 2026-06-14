import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-start-investing',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="space-y-8">
      <!-- Start Investing Card -->
      <div class="bg-gradient-to-br from-black to-gray-800 rounded-2xl p-8 text-white text-center shadow-xl shadow-black/20">
        <div class="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
        </div>
        <h2 class="text-2xl font-bold mb-2">Start Your Investment Journey</h2>
        <p class="text-white/60 mb-6 max-w-md mx-auto">Create your first investment product and make an initial deposit to begin building your portfolio.</p>
        <button (click)="showInvestmentForm = true"
                class="px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-gray-100 active:scale-[0.98] transition-all duration-200">
          Create First Investment
        </button>
      </div>

      <!-- Investment Creation Form -->
      <div *ngIf="showInvestmentForm" class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div class="px-6 py-5 border-b border-gray-50">
          <h2 class="text-base font-bold text-black">Create Your First Investment</h2>
        </div>
        <div class="p-6">
          <form #firstInvestForm="ngForm" (ngSubmit)="onSubmit()" class="space-y-5">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Product Name</label>
                <input type="text" [(ngModel)]="newProductName" name="productName" required
                       class="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-black placeholder-gray-300
                              focus:ring-2 focus:ring-black focus:bg-white transition-all duration-200"
                       placeholder="e.g., My Retirement Fund">
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Product Type</label>
                <select [(ngModel)]="newProductType" name="productType" required
                        class="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-black
                               focus:ring-2 focus:ring-black focus:bg-white transition-all duration-200 appearance-none cursor-pointer">
                  <option value="" disabled selected>Select type...</option>
                  <option value="RETIREMENT">Retirement</option>
                  <option value="SAVINGS">Savings</option>
                  <option value="INVESTMENT">Investment</option>
                </select>
              </div>
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Initial Deposit (R)</label>
              <input type="number" [(ngModel)]="newInitialDeposit" name="initialDeposit" required
                     min="100" step="0.01"
                     class="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-black placeholder-gray-300
                            focus:ring-2 focus:ring-black focus:bg-white transition-all duration-200"
                     placeholder="Minimum R 100">
            </div>

            <div *ngIf="newProductType" class="p-4 bg-gray-50 rounded-xl text-sm space-y-2">
              <div class="flex items-start gap-2">
                <span class="text-gray-400">Type:</span>
                <span class="font-medium text-black">{{ newProductType }}</span>
              </div>
              <div *ngIf="newProductType === 'RETIREMENT'" class="text-amber-600 text-xs font-medium">
                ⚠ Retirement products are only available for withdrawal after age 65
              </div>
            </div>

            <div class="flex gap-3">
              <button type="button" (click)="cancel()"
                      class="flex-1 px-4 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200">
                Cancel
              </button>
              <button type="submit" [disabled]="!firstInvestForm.form.valid || creatingInvestment"
                      class="flex-1 px-4 py-3 bg-black text-white rounded-xl font-semibold
                             hover:bg-gray-900 active:scale-[0.98] transition-all duration-200
                             disabled:opacity-30 disabled:cursor-not-allowed disabled:active:scale-100">
                <span *ngIf="creatingInvestment">Creating...</span>
                <span *ngIf="!creatingInvestment">Create & Deposit</span>
              </button>
            </div>

            <div *ngIf="investmentError"
                 class="p-4 bg-red-50 rounded-xl text-red-500 text-sm font-medium text-center">
              ✕ {{ investmentError }}
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class StartInvestingComponent {
    @Input() creatingInvestment = false;
    @Input() investmentError: string | null = null;
    @Output() createInvestment = new EventEmitter<{ productName: string; productType: string; initialDeposit: number }>();

    showInvestmentForm = false;
    newProductName = '';
    newProductType = '';
    newInitialDeposit: number = 0;

    onSubmit() {
        if (!this.newProductName || !this.newProductType || this.newInitialDeposit <= 0) return;

        this.createInvestment.emit({
            productName: this.newProductName,
            productType: this.newProductType,
            initialDeposit: this.newInitialDeposit
        });
    }

    cancel() {
        this.showInvestmentForm = false;
        this.resetForm();
    }

    resetForm() {
        this.newProductName = '';
        this.newProductType = '';
        this.newInitialDeposit = 0;
    }

    onSuccess() {
        this.showInvestmentForm = false;
        this.resetForm();
    }
}