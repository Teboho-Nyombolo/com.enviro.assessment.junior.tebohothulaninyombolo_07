import { createAction, props } from '@ngrx/store';
import { Portfolio } from '../../core/models/product.model';

export const loadPortfolio = createAction('[Portfolio] Load', props<{ investorId: number }>());
export const loadPortfolioSuccess = createAction('[Portfolio] Load Success', props<{ portfolio: Portfolio }>());
export const loadPortfolioFailure = createAction('[Portfolio] Load Failure', props<{ error: string }>());
