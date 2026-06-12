import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import * as WithdrawalActions from './withdrawal.actions';
import { WithdrawalService } from '../../core/services/withdrawal.service';

@Injectable()
export class WithdrawalEffects {
  private actions$ = inject(Actions);
  private withdrawalService = inject(WithdrawalService);

  createWithdrawal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WithdrawalActions.createWithdrawal),
      mergeMap(({ request }) =>
        this.withdrawalService.createWithdrawal(request).pipe(
          map(response => WithdrawalActions.createWithdrawalSuccess({ response: response.data })),
          catchError(error => of(WithdrawalActions.createWithdrawalFailure({
            error: error.error?.message || 'Withdrawal failed'
          })))
        )
      )
    )
  );

  reloadHistoryAfterWithdrawal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WithdrawalActions.createWithdrawalSuccess),
      map(({ response }) => WithdrawalActions.loadWithdrawalHistory({
        investorId: response.investorId
      }))
    )
  );

  loadHistory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WithdrawalActions.loadWithdrawalHistory),
      mergeMap(({ investorId }) =>
        this.withdrawalService.getHistory(investorId).pipe(
          map(response => WithdrawalActions.loadWithdrawalHistorySuccess({ history: response.data })),
          catchError(error => of(WithdrawalActions.loadWithdrawalHistoryFailure({
            error: error.error?.message || 'Failed to load history'
          })))
        )
      )
    )
  );
}
