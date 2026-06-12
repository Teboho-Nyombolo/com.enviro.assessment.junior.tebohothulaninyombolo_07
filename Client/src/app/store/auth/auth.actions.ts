import { createAction, props } from '@ngrx/store';
import { Investor } from '../../core/models/investor.model';

export const login = createAction('[Auth] Login', props<{ request: any }>());
export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ investor: Investor; token: string }>()
);
export const loginFailure = createAction('[Auth] Login Failure', props<{ error: string }>());

export const register = createAction('[Auth] Register', props<{ request: any }>());
export const registerSuccess = createAction(
  '[Auth] Register Success',
  props<{ investor: Investor; token: string }>()
);
export const registerFailure = createAction('[Auth] Register Failure', props<{ error: string }>());

export const logout = createAction('[Auth] Logout');
