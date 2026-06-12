import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { authReducer } from './store/auth/auth.reducer';
import { portfolioReducer } from './store/portfolio/portfolio.reducer';
import { withdrawalReducer } from './store/withdrawal/withdrawal.reducer';
import { depositReducer } from './store/deposit/deposit.reducer';
import { AuthEffects } from './store/auth/auth.effects';
import { PortfolioEffects } from './store/portfolio/portfolio.effects';
import { WithdrawalEffects } from './store/withdrawal/withdrawal.effects';
import { DepositEffects } from './store/deposit/deposit.effects';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideStore({
      auth: authReducer,
      portfolio: portfolioReducer,
      withdrawal: withdrawalReducer,
      deposit: depositReducer
    }),
    provideEffects([AuthEffects, PortfolioEffects, WithdrawalEffects, DepositEffects]),
    provideStoreDevtools({ maxAge: 25 })
  ]
};
