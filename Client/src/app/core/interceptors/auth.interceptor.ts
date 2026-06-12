// auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAuthToken } from '../../store/auth/auth.selectors';
import { switchMap, take } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);

  console.log('🔵 Interceptor - URL:', req.url);

  // Skip auth endpoints
  if (req.url.includes('/api/auth/')) {
    console.log('🔵 Skipping auth endpoint');
    return next(req);
  }

  // Get token from store
  return store.select(selectAuthToken).pipe(
    take(1),
    switchMap(token => {
      console.log('🔵 Token from store:', token);

      if (token) {
        // Important: Send the token directly (not with 'Bearer ' prefix if your backend expects raw token)
        const clonedReq = req.clone({
          setHeaders: {
            'Authorization': token,  // Just the UUID token
            'Content-Type': 'application/json'
          }
        });
        console.log('🔵 Added Authorization header:', token.substring(0, 20) + '...');
        return next(clonedReq);
      }

      console.warn('🔵 No token found in store');
      return next(req);
    })
  );
};
