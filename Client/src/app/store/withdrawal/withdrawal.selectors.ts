import { createFeatureSelector, createSelector } from '@ngrx/store';
import { WithdrawalState } from './withdrawal.reducer';

export const selectWithdrawalState = createFeatureSelector<WithdrawalState>('withdrawal');
export const selectWithdrawalHistory = createSelector(selectWithdrawalState, state => state.history);
export const selectLastWithdrawal = createSelector(selectWithdrawalState, state => state.lastWithdrawal);
export const selectWithdrawalLoading = createSelector(selectWithdrawalState, state => state.loading);
export const selectWithdrawalSuccess = createSelector(selectWithdrawalState, state => state.success);
export const selectWithdrawalError = createSelector(selectWithdrawalState, state => state.error);
