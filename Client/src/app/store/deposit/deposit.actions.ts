import { createAction, props } from '@ngrx/store';
import { DepositRequest, DepositResponse } from '../../core/models/deposit.model';

export const createDeposit = createAction(
  '[Deposit] Create',
  props<{ request: DepositRequest; investorId: number }>()
);
export const createDepositSuccess = createAction('[Deposit] Create Success', props<{ response: DepositResponse }>());
export const createDepositFailure = createAction('[Deposit] Create Failure', props<{ error: string }>());

export const loadDepositHistory = createAction('[Deposit] Load History', props<{ investorId: number }>());
export const loadDepositHistorySuccess = createAction('[Deposit] Load History Success', props<{ history: DepositResponse[] }>());
export const loadDepositHistoryFailure = createAction('[Deposit] Load History Failure', props<{ error: string }>());

export const clearDepositState = createAction('[Deposit] Clear State');
