import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { filter, Observable, Subject, take, takeUntil } from 'rxjs';
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
import { Portfolio } from '../../core/models/product.model';
import { WithdrawalHistory, WithdrawalRequest } from '../../core/models/withdrawal.model';
import { DepositRequest, DepositResponse } from '../../core/models/deposit.model';
import { InvestmentService, CreateInvestmentRequest } from '../../core/services/investment.service';
import { CsvExportService } from '../../core/services/csv-export.service';

import { DashboardShellComponent } from './dashboard-shell.component';
import { StatsCardsComponent } from './stats-cards.component';
import { StartInvestingComponent } from './start-investing.component';
import { ProductsTableComponent } from '../forms/products-table.component';
import { DepositFormComponent } from '../forms/deposit-form.component';
import { WithdrawalFormComponent } from '../forms/withdrawal-form.component';
import { DepositHistoryComponent } from '../tables/deposit-history.component';
import { WithdrawalHistoryComponent } from '../tables/withdrawal-history.component';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        DashboardShellComponent,
        StatsCardsComponent,
        StartInvestingComponent,
        ProductsTableComponent,
        DepositFormComponent,
        WithdrawalFormComponent,
        DepositHistoryComponent,
        WithdrawalHistoryComponent
    ],
    template: `
        
        <app-dashboard-shell [investor$]="investor$" [onLogout]="onLogout.bind(this)">
            <br>
            <!-- Stats Cards - ALWAYS VISIBLE -->
            <app-stats-cards [portfolio$]="portfolio$" [investor$]="investor$"></app-stats-cards>

            <br>
            <!-- Loading -->
            <div *ngIf="portfolioLoading$ | async" class="flex justify-center py-16">
                <div class="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-black"></div>
            </div>

            <!-- NO PORTFOLIO: Show "Start Investing" -->
            <app-start-investing
                    *ngIf="(portfolio$ | async) === null && !(portfolioLoading$ | async)"
                    [creatingInvestment]="creatingInvestment"
                    [investmentError]="investmentError"
                    (createInvestment)="onCreateInvestment($event)">
            </app-start-investing>

            <!-- PORTFOLIO EXISTS: Full Dashboard -->
            <ng-container *ngIf="portfolio$ | async as portfolio">
                <!-- Products Table -->
                <app-products-table
                        [portfolio]="portfolio"
                        [creatingInvestment]="creatingInvestment"
                        (addProduct)="onCreateInvestment($event)">
                </app-products-table>

                <!-- Two Column Layout: Deposit & Withdrawal Forms -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <app-deposit-form
                            [portfolio]="portfolio"
                            [depositSuccess$]="depositSuccess$"
                            [depositError$]="depositError$"
                            [depositLoading$]="depositLoading$"
                            (deposit)="onDeposit($event)">
                    </app-deposit-form>

                    <app-withdrawal-form
                            [portfolio]="portfolio"
                            [withdrawalSuccess$]="withdrawalSuccess$"
                            [withdrawalError$]="withdrawalError$"
                            [withdrawalLoading$]="withdrawalLoading$"
                            (withdraw)="onWithdrawal($event)">
                    </app-withdrawal-form>
                </div>

                <!-- History Tables -->
                <div class="space-y-8">
                    <app-deposit-history [depositHistory$]="depositHistory$"></app-deposit-history>
                    <br>
                    <app-withdrawal-history
                            [withdrawalHistory$]="history$"
                            (downloadCsv)="downloadCsv(portfolio.investorId)">
                    </app-withdrawal-history>
                </div>
            </ng-container>
        </app-dashboard-shell>
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

    // Deposit
    depositHistory$: Observable<DepositResponse[]>;
    depositSuccess$: Observable<boolean>;
    depositError$: Observable<string | null>;
    depositLoading$: Observable<boolean>;

    // New Investment
    creatingInvestment = false;
    investmentError: string | null = null;

    @ViewChild(StartInvestingComponent) startInvestingRef?: StartInvestingComponent;
    @ViewChild(ProductsTableComponent) productsTableRef?: ProductsTableComponent;
    @ViewChild(DepositFormComponent) depositFormRef?: DepositFormComponent;
    @ViewChild(WithdrawalFormComponent) withdrawalFormRef?: WithdrawalFormComponent;

    private destroy$ = new Subject<void>();
    currentInvestorId: number | null = null;

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

    ngOnInit() {
        this.investor$.pipe(takeUntil(this.destroy$)).subscribe(investor => {
            if (investor?.id) {
                this.currentInvestorId = investor.id;
                this.store.dispatch(loadPortfolio({ investorId: investor.id }));
                this.store.dispatch(loadWithdrawalHistory({ investorId: investor.id }));
                this.store.dispatch(loadDepositHistory({ investorId: investor.id }));
            }
        });

        this.withdrawalSuccess$.pipe(takeUntil(this.destroy$)).subscribe(success => {
            if (success) {
                setTimeout(() => this.store.dispatch(clearWithdrawalState()), 3000);
                this.refreshData();
                this.withdrawalFormRef?.resetForm();
            }
        });

        this.depositSuccess$.pipe(takeUntil(this.destroy$)).subscribe(success => {
            if (success) {
                setTimeout(() => this.store.dispatch(clearDepositState()), 3000);
                this.refreshData();
                this.depositFormRef?.resetForm();
            }
        });
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

    onCreateInvestment(event: { productName: string; productType: string; initialDeposit: number }) {
        this.investor$.pipe(takeUntil(this.destroy$)).subscribe(investor => {
            if (!investor?.id) return;

            this.creatingInvestment = true;
            this.investmentError = null;

            const request: CreateInvestmentRequest = {
                investorId: investor.id,
                productName: event.productName,
                productType: event.productType,
                initialDeposit: event.initialDeposit
            };

            this.investmentService.createInvestment(request).subscribe({
                next: (response: any) => {
                    this.creatingInvestment = false;
                    this.startInvestingRef?.onSuccess();
                    this.productsTableRef?.onSuccess();
                    this.refreshData();
                },
                error: (err) => {
                    this.creatingInvestment = false;
                    this.investmentError = err.error?.message || err.error?.error || err.message || 'Failed to create investment. Please try again.';
                }
            });
        });
    }

    onDeposit(event: { investmentId: number; amount: number }) {
        this.store.select(selectInvestor).pipe(
            take(1),
            filter((inv): inv is Investor => !!inv?.id)
        ).subscribe(investor => {
            const investorId = investor.id;
            const request: DepositRequest = {
                investmentId: event.investmentId,
                amount: event.amount
            };
            this.store.dispatch(createDeposit({ request, investorId }));
            setTimeout(() => {
                this.store.dispatch(loadDepositHistory({ investorId }));
            }, 500);
        });
    }

    onWithdrawal(event: { investmentId: number; amount: number }) {
        this.store.select(selectInvestor).pipe(
            take(1),
            filter((inv): inv is Investor => !!inv?.id)
        ).subscribe(investor => {
            const investorId = investor.id;

            const request: WithdrawalRequest = {
                investmentId: event.investmentId,
                amount: event.amount
            };

            this.store.dispatch(createWithdrawal({ request, investorId }));

            setTimeout(() => {
                this.store.dispatch(loadWithdrawalHistory({ investorId }));
            }, 500);
        });
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
}