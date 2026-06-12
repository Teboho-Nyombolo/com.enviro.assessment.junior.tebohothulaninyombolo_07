import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import * as DepositActions from './deposit.actions';
import { DepositService } from '../../core/services/deposit.service';

@Injectable()
export class DepositEffects {
  private actions$ = inject(Actions);
  private depositService = inject(DepositService);

  createDeposit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DepositActions.createDeposit),
      mergeMap(({ request }) =>
        this.depositService.createDeposit(request).pipe(
          map(response => DepositActions.createDepositSuccess({ response: response.data })),
          catchError(error => of(DepositActions.createDepositFailure({
            error: error.error?.message || 'Deposit failed'
          })))
        )
      )
    )
  );

  // ADD THIS EFFECT: Reload history after deposit success
  reloadHistoryAfterDeposit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DepositActions.createDepositSuccess),
      map(({ response }) => DepositActions.loadDepositHistory({
        investorId: response.investorId
      }))
    )
  );

  loadHistory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DepositActions.loadDepositHistory),
      mergeMap(({ investorId }) =>
        this.depositService.getDepositHistory(investorId).pipe(
          map(response => DepositActions.loadDepositHistorySuccess({ history: response.data })),
          catchError(error => of(DepositActions.loadDepositHistoryFailure({
            error: error.error?.message || 'Failed to load history'
          })))
        )
      )
    )
  );
}
