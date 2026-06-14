import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { Portfolio, Product } from '../../core/models/product.model';

@Component({
    selector: 'app-withdrawal-form',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
        <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div class="px-6 py-5 border-b border-gray-50">
                <h2 class="text-base font-bold text-black">Submit Withdrawal</h2>
            </div>
            <div class="p-6">
                <form #withdrawalForm="ngForm" (ngSubmit)="onSubmit()" class="space-y-5">
                    <div>
                        <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Select Product</label>
                        <select [(ngModel)]="selectedWithdrawalProduct"
                                name="withdrawalProduct"
                                (ngModelChange)="onProductChange($event)"
                                class="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-black focus:ring-2 focus:ring-black focus:bg-white transition-all duration-200 appearance-none cursor-pointer">
                            <option [ngValue]="null" disabled selected>Select product...</option>
                            <option *ngFor="let p of portfolio.products" [ngValue]="p">
                                {{ p.productName }} ({{ p.productType }}) - R {{ p.currentBalance | number:'1.2-2' }}
                            </option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Amount (R)</label>
                        <input type="number" [(ngModel)]="withdrawalAmount" name="withdrawalAmount"
                               min="0.01" [max]="selectedProduct?.maxWithdrawalAmount ?? null" step="0.01"
                               class="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-black placeholder-gray-300 focus:ring-2 focus:ring-black focus:bg-white transition-all duration-200"
                               placeholder="0.00">
                    </div>

                    <button type="submit"
                            [disabled]="!selectedProductId || withdrawalAmount <= 0 || (withdrawalLoading$ | async)"
                            class="w-full px-4 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-900 active:scale-[0.98] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:active:scale-100 shadow-lg shadow-black/10">
                        <span *ngIf="withdrawalLoading$ | async">Processing...</span>
                        <span *ngIf="!(withdrawalLoading$ | async)">Withdraw Funds</span>
                    </button>

                    <div *ngIf="selectedProduct" class="p-4 bg-gray-50 rounded-xl text-sm space-y-1">
                        <div class="flex justify-between">
                            <span class="text-gray-400">Type</span>
                            <span class="font-medium text-black">{{ selectedProduct.productType }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-400">Available</span>
                            <span class="font-medium text-black">R {{ selectedProduct.maxWithdrawalAmount | number:'1.2-2' }}</span>
                        </div>
                        <div *ngIf="selectedProduct.productType === 'RETIREMENT' && portfolio.age <= 65"
                             class="pt-2 mt-2 border-t border-gray-200 text-amber-600 font-medium text-xs">
                            ⚠ Retirement withdrawals only allowed for investors over 65
                        </div>
                    </div>

                    <div *ngIf="withdrawalSuccess$ | async"
                         class="p-4 bg-green-50 rounded-xl text-green-600 text-sm font-medium text-center">
                        ✓ Withdrawal submitted successfully
                    </div>
                    <div *ngIf="withdrawalError$ | async as error"
                         class="p-4 bg-red-50 rounded-xl text-red-500 text-sm font-medium text-center">
                        ✕ {{ error }}
                    </div>
                </form>
            </div>
        </div>
    `
})
export class WithdrawalFormComponent {
    @Input() portfolio!: Portfolio;
    @Input() withdrawalSuccess$!: Observable<boolean>;
    @Input() withdrawalError$!: Observable<string | null>;
    @Input() withdrawalLoading$!: Observable<boolean>;
    @Output() withdraw = new EventEmitter<{ investmentId: number; amount: number }>();

    selectedProductId: number | null = null;
    withdrawalAmount: number = 0;
    selectedProduct: Product | null = null;
    selectedWithdrawalProduct: Product | null = null;

    onProductChange(product: Product | null) {
        if (product) {
            const id = product.id ?? product.productId ?? (product as any)['product-id'];
            this.selectedProductId = id;
            this.selectedProduct = product;
        } else {
            this.selectedProductId = null;
            this.selectedProduct = null;
        }
    }

    onSubmit() {
        if (!this.selectedProductId || this.withdrawalAmount <= 0) return;
        this.withdraw.emit({ investmentId: this.selectedProductId, amount: this.withdrawalAmount });
    }

    resetForm() {
        this.selectedProductId = null;
        this.withdrawalAmount = 0;
        this.selectedProduct = null;
        this.selectedWithdrawalProduct = null;
    }
}