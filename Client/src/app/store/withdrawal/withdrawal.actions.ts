import { createAction, props } from '@ngrx/store';
import { WithdrawalRequest, WithdrawalResponse, WithdrawalHistory } from '../../core/models/withdrawal.model';

export const createWithdrawal = createAction(
  '[Withdrawal] Create',
  props<{ request: WithdrawalRequest; investorId: number }>()
);export const createWithdrawalSuccess = createAction('[Withdrawal] Create Success', props<{ response: WithdrawalResponse }>());
export const createWithdrawalFailure = createAction('[Withdrawal] Create Failure', props<{ error: string }>());

export const loadWithdrawalHistory = createAction('[Withdrawal] Load History', props<{ investorId: number }>());
export const loadWithdrawalHistorySuccess = createAction('[Withdrawal] Load History Success', props<{ history: WithdrawalHistory[] }>());
export const loadWithdrawalHistoryFailure = createAction('[Withdrawal] Load History Failure', props<{ error: string }>());

export const clearWithdrawalState = createAction('[Withdrawal] Clear State');
