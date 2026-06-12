import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';
import * as AuthActions from './auth.actions';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(({ request }) =>
        this.authService.login(request.email, request.password).pipe(
          map(response => {
            console.log('📝 Login response:', response);

            const investor = response.data;
            const token = investor.token || '';

            console.log('📝 Token received:', token);

            if (token) {
              localStorage.setItem('auth_token', token);
              console.log('📝 Token saved to localStorage');
            }

            return AuthActions.loginSuccess({ investor, token });
          }),
          catchError(error => {
            console.error('📝 Login error:', error);
            return of(AuthActions.loginFailure({
              error: error.error?.message || 'Login failed.'
            }));
          })
        )
      )
    )
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      mergeMap(({ request }) =>
        this.authService.register(request).pipe(
          map(response => {
            const investor = response.data;
            const token = investor.token || '';

            if (token) {
              localStorage.setItem('auth_token', token);
            }

            return AuthActions.registerSuccess({ investor, token });
          }),
          catchError(error => of(AuthActions.registerFailure({
            error: error.error?.message || 'Registration failed. Email may already exist.'
          })))
        )
      )
    )
  );

  authSuccess$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess, AuthActions.registerSuccess),
        tap(() => this.router.navigate(['/dashboard']))
      ),
    { dispatch: false }
  );
}
