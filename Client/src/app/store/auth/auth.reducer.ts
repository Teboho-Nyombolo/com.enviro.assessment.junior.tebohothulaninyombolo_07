import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { Investor } from '../../core/models/investor.model';

export interface AuthState {
  investor: Investor | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  investor: null,
  token: null,
  loading: false,
  error: null
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.login, AuthActions.register, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AuthActions.loginSuccess, AuthActions.registerSuccess, (state, { investor, token }) => ({
    ...state,
    investor,
    token,
    loading: false,
    error: null
  })),
  on(AuthActions.loginSuccess, (state, { investor, token }) => ({
    ...state,
    investor,
    token,
    isAuthenticated: true
  })),
  on(AuthActions.loginFailure, AuthActions.registerFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(AuthActions.logout, () => initialState)
);
