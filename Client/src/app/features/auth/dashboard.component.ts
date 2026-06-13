import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

import { logout } from '../../store/auth/auth.actions';
import { selectInvestor } from '../../store/auth/auth.selectors';
import { selectPortfolio, selectPortfolioLoading } from '../../store/portfolio/portfolio.selectors';
import { loadPortfolio } from '../../store/portfolio/portfolio.actions';
import { createWithdrawal, loadWithdrawalHistory, clearWithdrawalState } from '../../store/withdrawal/withdrawal.actions';
import { selectWithdrawalHistory, selectWithdrawalSuccess, selectWithdrawalError, selectWithdrawalLoading } from '../../store/withdrawal/withdrawal.selectors';
import { createDeposit, loadDepositHistory, clearDepositState } from '../../store/deposit/deposit.actions';
import { selectDepositHistory, selectDepositSuccess, selectDepositError, selectDepositLoading } from '../../store/deposit/deposit.selectors';
import { Investor } from '../../core/models/investor.model';
import { Portfolio, Product } from '../../core/models/product.model';
import {WithdrawalHistory, WithdrawalRequest} from '../../core/models/withdrawal.model';
import {DepositRequest, DepositResponse} from '../../core/models/deposit.model';
import { InvestmentService, CreateInvestmentRequest } from '../../core/services/investment.service';
import { CsvExportService } from '../../core/services/csv-export.service';
import {tap} from "rxjs/operators";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

        <!-- Stats Cards - ALWAYS VISIBLE -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div class="bg-black rounded-2xl p-6 text-white shadow-xl shadow-black/10">
            <p class="text-white/60 text-xs font-semibold uppercase tracking-wider">Total Balance</p>
              <p class="text-3xl font-bold mt-3 tracking-tight">
                  <ng-container *ngIf="portfolio$ | async as portfolio">
                      R {{ (portfolio.totalBalance || 0) | number:'1.2-2' }}
                  </ng-container>
              </p>
            <p class="text-white/40 text-xs mt-2">All products combined</p>
          </div>
          <div class="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <p class="text-gray-400 text-xs font-semibold uppercase tracking-wider">Available for Withdrawal</p>
            <p class="text-3xl font-bold text-black mt-3 tracking-tight">
                <ng-container *ngIf="portfolio$ | async as portfolio">
                    R {{ (portfolio.totalAvailableForWithdrawal || 0) | number:'1.2-2' }}
                </ng-container>
            </p>
            <p class="text-gray-300 text-xs mt-2">90% of total balance</p>
          </div>
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

        <!-- Loading -->
        <div *ngIf="portfolioLoading$ | async" class="flex justify-center py-16">
          <div class="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-black"></div>
        </div>

        <!-- NO PORTFOLIO: Show "Start Investing" -->
        <div *ngIf="(portfolio$ | async) === null && !(portfolioLoading$ | async)" class="space-y-8">

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
              <form #firstInvestForm="ngForm" (ngSubmit)="onCreateInvestment()" class="space-y-5">
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
                  <button type="button" (click)="showInvestmentForm = false"
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

        <!-- PORTFOLIO EXISTS: Full Dashboard -->
        <div *ngIf="portfolio$ | async as portfolio" class="space-y-8">

          <!-- Products Table -->
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
              <form #addProductForm="ngForm" (ngSubmit)="onCreateInvestment()" class="space-y-4">
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

          <!-- Two Column Layout: Deposit & Withdrawal -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">

            <!-- Deposit Form -->
            <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div class="px-6 py-5 border-b border-gray-50">
                <h2 class="text-base font-bold text-black">Make a Deposit</h2>
              </div>
              <div class="p-6">
                <form #depositForm="ngForm" (ngSubmit)="onDepositSubmit()" class="space-y-5">
                <div>
                    <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Select Product</label>
                    <select [(ngModel)]="selectedDepositProduct"
                            name="depositProduct"
                            (ngModelChange)="onDepositProductChange($event)"
                            class="...">
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

            <!-- Withdrawal Form -->
            <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div class="px-6 py-5 border-b border-gray-50">
                <h2 class="text-base font-bold text-black">Submit Withdrawal</h2>
              </div>
              <div class="p-6">
                <form #withdrawalForm="ngForm" (ngSubmit)="onWithdrawalSubmit()" class="space-y-5">
                  <div>
                    <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Select Product</label>
                    <select [(ngModel)]="selectedWithdrawalProduct"
                            name="withdrawalProduct"
                            (ngModelChange)="onWithdrawalProductChange($event)"
                            class="...">
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

          </div>  <!-- ← THIS WAS MISSING! Closes the grid container -->


          <!-- Deposit History -->
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
                    <td class="py-4 px-6 font-semibold text-black">{{ item.productName }}</td>
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

          <!-- Withdrawal History -->
          <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div class="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
              <h2 class="text-base font-bold text-black">Withdrawal History</h2>
              <button (click)="downloadCsv(portfolio.investorId)"
                      class="px-4 py-2 text-sm font-medium text-gray-500 hover:text-black
                             hover:bg-gray-50 rounded-lg transition-all duration-200 flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                Export CSV
              </button>
            </div>
            <div *ngIf="history$ | async as history">
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
                    <td class="py-4 px-6 font-semibold text-black">{{ item.productName }}</td>
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

        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit, OnDestroy {
  investor$: Observable<Investor | null>;
  portfolio$: Observable<Portfolio | null>;
  portfolioLoading$: Observable<boolean>;

  // Withdrawal
  history$: Observable<WithdrawalHistory[]>;
  withdrawalSuccess$: Observable<boolean>;
  withdrawalError$: Observable<string | null>;
  withdrawalLoading$: Observable<boolean>;
  selectedProductId: number | null = null;
  withdrawalAmount: number = 0;
  selectedProduct: Product | null = null;

  // Deposit
  depositHistory$: Observable<DepositResponse[]>;
  depositSuccess$: Observable<boolean>;
  depositError$: Observable<string | null>;
  depositLoading$: Observable<boolean>;
  depositProductId: number | null = null;
  depositAmount: number = 0;
  selectedDepositProduct: Product | null = null;

  // New Investment
  showInvestmentForm = false;
  showNewInvestmentForm = false;
  newProductName = '';
  newProductType = '';
  newInitialDeposit: number = 0;
  creatingInvestment = false;
  investmentError: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private store: Store,
    private router: Router,
    private csvExportService: CsvExportService,
    private investmentService: InvestmentService
  ) {
    this.investor$ = this.store.select(selectInvestor);
    this.portfolio$ = this.store.select(selectPortfolio);
    this.portfolioLoading$ = this.store.select(selectPortfolioLoading);

    this.history$ = this.store.select(selectWithdrawalHistory);
    this.withdrawalSuccess$ = this.store.select(selectWithdrawalSuccess);
    this.withdrawalError$ = this.store.select(selectWithdrawalError);
    this.withdrawalLoading$ = this.store.select(selectWithdrawalLoading);

    this.depositHistory$ = this.store.select(selectDepositHistory);
    this.depositSuccess$ = this.store.select(selectDepositSuccess);
    this.depositError$ = this.store.select(selectDepositError);
    this.depositLoading$ = this.store.select(selectDepositLoading);
  }

  currentInvestorId: number | null = null;

  ngOnInit() {
    this.investor$.pipe(takeUntil(this.destroy$)).subscribe(investor => {
      if (investor?.id) {

        this.currentInvestorId = investor.id;
        console.log('Investor loaded with ID:', this.currentInvestorId);

        this.store.dispatch(loadPortfolio({ investorId: investor.id }));
        this.store.dispatch(loadWithdrawalHistory({ investorId: investor.id }));
        this.store.dispatch(loadDepositHistory({ investorId: investor.id }));
      }
    });

      this.portfolio$.pipe(
          takeUntil(this.destroy$),
          tap(p => console.log('Template portfolio$ emission:', p?.totalBalance, typeof p?.totalBalance))
      ).subscribe();

    this.withdrawalSuccess$.pipe(takeUntil(this.destroy$)).subscribe(success => {
      if (success) {
        setTimeout(() => this.store.dispatch(clearWithdrawalState()), 3000);
        this.refreshData();
        this.resetWithdrawalForm();
      }
    });

    this.depositSuccess$.pipe(takeUntil(this.destroy$)).subscribe(success => {
      if (success) {
        setTimeout(() => this.store.dispatch(clearDepositState()), 3000);
        this.refreshData();
        this.resetDepositForm();
      }
    });
  }

    getFormattedBalance(portfolio: Portfolio | null): string {
        const balance = portfolio?.totalBalance ?? 0;
        return new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR',
            minimumFractionDigits: 2
        }).format(balance);
    }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  refreshData() {
    this.investor$.pipe(takeUntil(this.destroy$)).subscribe(i => {
      if (i?.id) {
        this.store.dispatch(loadPortfolio({ investorId: i.id }));
        this.store.dispatch(loadWithdrawalHistory({ investorId: i.id }));
        this.store.dispatch(loadDepositHistory({ investorId: i.id }));
      }
    });
  }

  toggleAddProduct() {
    this.showNewInvestmentForm = !this.showNewInvestmentForm;
    if (!this.showNewInvestmentForm) {
      this.newProductName = '';
      this.newProductType = '';
      this.newInitialDeposit = 0;
    }
  }

  onCreateInvestment() {
    if (!this.newProductName || !this.newProductType || this.newInitialDeposit <= 0) return;

    this.investor$.pipe(takeUntil(this.destroy$)).subscribe(investor => {
      console.log('Investor from store:', investor);  // DEBUG
      console.log('Investor ID from store:', investor?.id);  // DEBUG
      console.log('Token in localStorage:', localStorage.getItem('auth_token'));  // DEBUG

      if (!investor?.id) return;

      this.creatingInvestment = true;
      this.investmentError = null;

      const request: CreateInvestmentRequest = {
        investorId: investor.id,
        productName: this.newProductName,
        productType: this.newProductType,
        initialDeposit: this.newInitialDeposit
      };

      this.investmentService.createInvestment(request).subscribe({
        next: (response: any) => {
          console.log('Investment success:', response);
          this.creatingInvestment = false;
          this.showInvestmentForm = false;
          this.showNewInvestmentForm = false;
          this.newProductName = '';
          this.newProductType = '';
          this.newInitialDeposit = 0;
          this.refreshData();
        },
        error: (err) => {
          console.error('Investment error:', err);
          console.error('Error status:', err.status);
          console.error('Error body:', err.error);
          console.error('Error message:', err.message);

          this.creatingInvestment = false;
          // Show detailed error
          this.investmentError = err.error?.message || err.error?.error || err.message || 'Failed to create investment. Please try again.';
        }
      });
    });
  }


  onDepositProductChange(product: Product | null) {
    console.log('Full product object:', product);
    console.log('Product keys:', product ? Object.keys(product) : 'null');
    console.log('Product ID:', product?.id);
    console.log('Product _id:', product?.id);
    console.log('Product productId:', product?.id);

    if (product) {
      // Try different possible ID properties
      const id = product.id ?? product.id ?? product.productId ?? (product as any)['product-id'];
      this.depositProductId = id;
      this.selectedDepositProduct = product;
      console.log('Selected deposit product ID:', this.depositProductId);
    } else {
      this.depositProductId = null;
      this.selectedDepositProduct = null;
    }
  }

  selectedWithdrawalProduct: Product | null = null;

  onWithdrawalProductChange(product: Product | null) {
    console.log('Full product object:', product);
    console.log('Product keys:', product ? Object.keys(product) : 'null');

    if (product) {
      const id = product.id ?? product.id ?? product.productId ?? (product as any)['product-id'];
      this.selectedProductId = id;
      this.selectedProduct = product;
      console.log('Selected withdrawal product ID:', this.selectedProductId);
    } else {
      this.selectedProductId = null;
      this.selectedProduct = null;
    }
  }

  onDepositSubmit() {
    console.log('Deposit submit - currentInvestorId:', this.currentInvestorId);

    if (!this.currentInvestorId) {
      console.error('No investor ID available for deposit');
      return;
    }
    if (!this.depositProductId || this.depositAmount <= 0) {
      console.error('Invalid deposit data:', {
        productId: this.depositProductId,
        amount: this.depositAmount
      });
      return;
    }

    const request: DepositRequest = {
      investmentId: this.depositProductId,
      amount: this.depositAmount
    };

    const investorId = this.currentInvestorId;

    this.store.dispatch(createDeposit({ request, investorId }));

    // Reload history after deposit
    setTimeout(() => {
      console.log('Reloading deposit history for investor:', investorId);
      this.store.dispatch(loadDepositHistory({ investorId }));
    }, 500);
  }

  onWithdrawalSubmit() {
    console.log('Withdrawal submit - currentInvestorId:', this.currentInvestorId);

    if (!this.currentInvestorId) {
      console.error('No investor ID available for withdrawal');
      return;
    }
    if (!this.selectedProductId || this.withdrawalAmount <= 0) {
      console.error('Invalid withdrawal data:', {
        productId: this.selectedProductId,
        amount: this.withdrawalAmount
      });
      return;
    }

    const request: WithdrawalRequest = {
      investmentId: this.selectedProductId,
      amount: this.withdrawalAmount
    };

    const investorId = this.currentInvestorId;

    this.store.dispatch(createWithdrawal({ request, investorId }));

    // Reload history after withdrawal
    setTimeout(() => {
      console.log('Reloading withdrawal history for investor:', investorId);
      this.store.dispatch(loadWithdrawalHistory({ investorId }));
    }, 500);
  }


  downloadCsv(investorId: number) {
    this.csvExportService.downloadCsv({ investorId }).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `withdrawal-statements-${investorId}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    });
  }

  onLogout() {
    this.store.dispatch(logout());
    this.router.navigate(['/login']);
  }

  resetWithdrawalForm() {
    this.selectedProductId = null;
    this.withdrawalAmount = 0;
    this.selectedProduct = null;
  }

  resetDepositForm() {
    this.depositProductId = null;
    this.depositAmount = 0;
    this.selectedDepositProduct = null;
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
