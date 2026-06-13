import { createReducer, on } from '@ngrx/store';
import * as WithdrawalActions from './withdrawal.actions';
import { WithdrawalResponse, WithdrawalHistory } from '../../core/models/withdrawal.model';

export interface WithdrawalState {
  lastWithdrawal: WithdrawalResponse | null;
  history: WithdrawalHistory[];
  loading: boolean;
  success: boolean;
  error: string | null;
}

export const initialState: WithdrawalState = {
  lastWithdrawal: null,
  history: [],
  loading: false,
  success: false,
  error: null
};

export const withdrawalReducer = createReducer(
  initialState,
  on(WithdrawalActions.createWithdrawal, WithdrawalActions.loadWithdrawalHistory, state => ({
    ...state, loading: true, error: null, success: false
  })),
    on(WithdrawalActions.createWithdrawalSuccess, (state, { response }) => ({
        ...state,
        lastWithdrawal: response,
        history: [{
            ...response,
            productId: response.investmentId ,
            productName: response.investmentName ,
            createdAt: new Date().toISOString()
        } as WithdrawalHistory, ...state.history],
        loading: false,
        success: true,
        error: null
    })),

  on(WithdrawalActions.createWithdrawalFailure, (state, { error }) => ({
    ...state, loading: false, success: false, error
  })),
  on(WithdrawalActions.loadWithdrawalHistorySuccess, (state, { history }) => ({
    ...state, history, loading: false
  })),
  on(WithdrawalActions.loadWithdrawalHistoryFailure, (state, { error }) => ({
    ...state, loading: false, error
  })),
  on(WithdrawalActions.clearWithdrawalState, () => initialState)
);
