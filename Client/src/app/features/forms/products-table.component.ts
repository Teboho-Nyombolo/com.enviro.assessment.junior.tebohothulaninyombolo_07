import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Portfolio } from '../../core/models/product.model';

@Component({
    selector: 'app-products-table',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div class="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
        <h2 class="text-base font-bold text-black">Your Products</h2>
        <button (click)="toggleAddProduct()"
                class="px-3 py-1.5 text-xs font-medium bg-black text-white rounded-lg hover:bg-gray-800 transition-all">
          + Add Product
        </button>
      </div>

      <!-- Add Another Product Inline -->
      <div *ngIf="showNewInvestmentForm" class="p-6 border-b border-gray-50 bg-gray-50/50">
        <form #addProductForm="ngForm" (ngSubmit)="onAddProduct()" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" [(ngModel)]="newProductName" name="addProductName" required
                   placeholder="Product name"
                   class="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm">
            <select [(ngModel)]="newProductType" name="addProductType" required
                    class="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm">
              <option value="" disabled selected>Type...</option>
              <option value="RETIREMENT">Retirement</option>
              <option value="SAVINGS">Savings</option>
              <option value="INVESTMENT">Investment</option>
            </select>
            <div class="flex gap-2">
              <input type="number" [(ngModel)]="newInitialDeposit" name="addInitialDeposit" required
                     min="100" step="0.01" placeholder="Amount (R)"
                     class="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm">
              <button type="submit" [disabled]="!addProductForm.form.valid || creatingInvestment"
                      class="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800">
                Add
              </button>
            </div>
          </div>
        </form>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-50">
              <th class="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Product</th>
              <th class="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</th>
              <th class="text-right py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Balance</th>
              <th class="text-right py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Max Withdrawal</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let product of portfolio.products; let last = last"
                class="hover:bg-gray-50/50 transition-colors duration-150"
                [class.border-b]="!last" [class.border-gray-50]="!last">
              <td class="py-4 px-6">
                <span class="font-semibold text-black">{{ product.productName }}</span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                  {{ product.productType }}
                </span>
              </td>
              <td class="py-4 px-6 text-right font-semibold text-black">
                R {{ product.currentBalance | number:'1.2-2' }}
              </td>
              <td class="py-4 px-6 text-right text-gray-400">
                R {{ product.maxWithdrawalAmount | number:'1.2-2' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class ProductsTableComponent {
    @Input() portfolio!: Portfolio;
    @Input() creatingInvestment = false;
    @Output() addProduct = new EventEmitter<{ productName: string; productType: string; initialDeposit: number }>();

    showNewInvestmentForm = false;
    newProductName = '';
    newProductType = '';
    newInitialDeposit: number = 0;

    toggleAddProduct() {
        this.showNewInvestmentForm = !this.showNewInvestmentForm;
        if (!this.showNewInvestmentForm) {
            this.resetForm();
        }
    }

    onAddProduct() {
        if (!this.newProductName || !this.newProductType || this.newInitialDeposit <= 0) return;

        this.addProduct.emit({
            productName: this.newProductName,
            productType: this.newProductType,
            initialDeposit: this.newInitialDeposit
        });
    }

    onSuccess() {
        this.showNewInvestmentForm = false;
        this.resetForm();
    }

    private resetForm() {
        this.newProductName = '';
        this.newProductType = '';
        this.newInitialDeposit = 0;
    }
}