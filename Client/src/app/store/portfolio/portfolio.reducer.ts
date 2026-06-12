import { createReducer, on } from '@ngrx/store';
import * as PortfolioActions from './portfolio.actions';
import { Portfolio } from '../../core/models/product.model';

export interface PortfolioState {
  portfolio: Portfolio | null;
  loading: boolean;
  error: string | null;
}

export const initialState: PortfolioState = {
  portfolio: null,
  loading: false,
  error: null
};

export const portfolioReducer = createReducer(
  initialState,
  on(PortfolioActions.loadPortfolio, state => ({ ...state, loading: true, error: null })),
  on(PortfolioActions.loadPortfolioSuccess, (state, { portfolio }) => ({
    ...state, portfolio, loading: false
  })),
  on(PortfolioActions.loadPortfolioFailure, (state, { error }) => ({
    ...state, loading: false, error
  }))
);
