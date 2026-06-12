import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PortfolioState } from './portfolio.reducer';

export const selectPortfolioState = createFeatureSelector<PortfolioState>('portfolio');
export const selectPortfolio = createSelector(selectPortfolioState, state => state.portfolio);
export const selectPortfolioLoading = createSelector(selectPortfolioState, state => state.loading);
export const selectPortfolioError = createSelector(selectPortfolioState, state => state.error);
export const selectTotalBalance = createSelector(selectPortfolio, p => p?.totalBalance ?? 0);
export const selectProducts = createSelector(selectPortfolio, p => p?.products ?? []);
