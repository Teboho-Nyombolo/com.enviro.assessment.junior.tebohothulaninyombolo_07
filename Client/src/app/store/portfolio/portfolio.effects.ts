import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import * as PortfolioActions from './portfolio.actions';
import { PortfolioService } from '../../core/services/portfolio.service';

@Injectable()
export class PortfolioEffects {
  private actions$ = inject(Actions);
  private portfolioService = inject(PortfolioService);  // Use service, not HttpClient

  loadPortfolio$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PortfolioActions.loadPortfolio),
      mergeMap(({ investorId }) =>
        this.portfolioService.getPortfolio(investorId).pipe(
          map(response => PortfolioActions.loadPortfolioSuccess({ portfolio: response.data })),
          catchError(error => of(PortfolioActions.loadPortfolioFailure({
            error: error.error?.message || 'Failed to load portfolio'
          })))
        )
      )
    )
  );
}
