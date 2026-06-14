import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { Portfolio, Product } from '../../core/models/product.model';

@Component({
    selector: 'app-deposit-form',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
        <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div class="px-6 py-5 border-b border-gray-50">
                <h2 class="text-base font-bold text-black">Make a Deposit</h2>
            </div>
            <div class="p-6">
                <form #depositForm="ngForm" (ngSubmit)="onSubmit()" class="space-y-5">
                    <div>
                        <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Select Product</label>
                        <select [(ngModel)]="selectedDepositProduct"
                                name="depositProduct"
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
                        <input type="number" [(ngModel)]="depositAmount" name="depositAmount"
                               min="0.01" step="0.01"
                               class="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-black placeholder-gray-300 focus:ring-2 focus:ring-black focus:bg-white transition-all duration-200"
                               placeholder="0.00">
                    </div>

                    <button type="submit"
                            [disabled]="!depositProductId || depositAmount <= 0 || (depositLoading$ | async)"
                            class="w-full px-4 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-900 active:scale-[0.98] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:active:scale-100 shadow-lg shadow-black/10">
                        <span *ngIf="depositLoading$ | async">Processing...</span>
                        <span *ngIf="!(depositLoading$ | async)">Deposit Funds</span>
                    </button>

                    <div *ngIf="depositSuccess$ | async"
                         class="p-4 bg-green-50 rounded-xl text-green-600 text-sm font-medium text-center">
                        ✓ Deposit successful
                    </div>

                    <div *ngIf="depositError$ | async as error"
                         class="p-4 bg-red-50 rounded-xl text-red-500 text-sm font-medium text-center">
                        ✕ {{ error }}
                    </div>
                </form>
            </div>
        </div>
    `
})
export class DepositFormComponent {
    @Input() portfolio!: Portfolio;
    @Input() depositSuccess$!: Observable<boolean>;
    @Input() depositError$!: Observable<string | null>;
    @Input() depositLoading$!: Observable<boolean>;
    @Output() deposit = new EventEmitter<{ investmentId: number; amount: number }>();

    depositProductId: number | null = null;
    depositAmount: number = 0;
    selectedDepositProduct: Product | null = null;

    onProductChange(product: Product | null) {
        if (product) {
            const id = product.id ?? product.productId ?? (product as any)['product-id'];
            this.depositProductId = id;
            this.selectedDepositProduct = product;
        } else {
            this.depositProductId = null;
            this.selectedDepositProduct = null;
        }
    }

    onSubmit() {
        if (!this.depositProductId || this.depositAmount <= 0) return;
        this.deposit.emit({ investmentId: this.depositProductId, amount: this.depositAmount });
    }

    resetForm() {
        this.depositProductId = null;
        this.depositAmount = 0;
        this.selectedDepositProduct = null;
    }
}