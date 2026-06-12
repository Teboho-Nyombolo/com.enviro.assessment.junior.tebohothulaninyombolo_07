import { createReducer, on } from '@ngrx/store';
import * as DepositActions from './deposit.actions';
import { DepositResponse } from '../../core/models/deposit.model';

export interface DepositState {
  lastDeposit: DepositResponse | null;
  history: DepositResponse[];
  loading: boolean;
  success: boolean;
  error: string | null;
}

export const initialState: DepositState = {
  lastDeposit: null,
  history: [],
  loading: false,
  success: false,
  error: null
};

export const depositReducer = createReducer(
  initialState,
  on(DepositActions.createDeposit, DepositActions.loadDepositHistory, state => ({
    ...state, loading: true, error: null, success: false
  })),
  on(DepositActions.createDepositSuccess, (state, { response }) => ({
    ...state,
    lastDeposit: response,
    history: [response, ...state.history],
    loading: false,
    success: true,
    error: null
  })),
  on(DepositActions.createDepositFailure, (state, { error }) => ({
    ...state, loading: false, success: false, error
  })),
  on(DepositActions.loadDepositHistorySuccess, (state, { history }) => ({
    ...state, history, loading: false
  })),
  on(DepositActions.loadDepositHistoryFailure, (state, { error }) => ({
    ...state, loading: false, error
  })),
  on(DepositActions.clearDepositState, () => initialState)
);
