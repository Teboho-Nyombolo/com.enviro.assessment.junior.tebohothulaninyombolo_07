// auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAuthToken } from '../../store/auth/auth.selectors';
import { switchMap, take } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);

  if (req.url.includes('/api/auth/')) {
    return next(req);
  }

  return store.select(selectAuthToken).pipe(
    take(1),
    switchMap(token => {

      if (token) {
        const clonedReq = req.clone({
          setHeaders: {
            'Authorization': token,
            'Content-Type': 'application/json'
          }
        });
        return next(clonedReq);
      }
      return next(req);
    })
  );
};
