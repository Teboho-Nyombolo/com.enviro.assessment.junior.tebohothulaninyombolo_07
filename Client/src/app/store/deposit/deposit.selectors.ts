import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DepositState } from './deposit.reducer';

export const selectDepositState = createFeatureSelector<DepositState>('deposit');
export const selectLastDeposit = createSelector(selectDepositState, state => state.lastDeposit);
export const selectDepositHistory = createSelector(selectDepositState, state => state.history);
export const selectDepositLoading = createSelector(selectDepositState, state => state.loading);
export const selectDepositSuccess = createSelector(selectDepositState, state => state.success);
export const selectDepositError = createSelector(selectDepositState, state => state.error);
