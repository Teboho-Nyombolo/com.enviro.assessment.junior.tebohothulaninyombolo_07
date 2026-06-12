import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { login, register } from '../../store/auth/auth.actions';
import { selectAuthLoading, selectAuthError } from '../../store/auth/auth.selectors';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-white">
      <div class="w-full max-w-md px-8">
        <!-- Logo -->
        <div class="text-center mb-10">
          <div class="w-14 h-14 bg-black rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-black tracking-tight">Enviro365 Investments</h1>
          <p class="text-gray-400 mt-2 text-sm">{{ isLoginMode ? 'Sign in to your account' : 'Create your account' }}</p>
        </div>

        <form (ngSubmit)="onSubmit()" class="space-y-5">
          <!-- Name fields (register only) -->
          <div *ngIf="!isLoginMode" class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">First Name</label>
              <input type="text" [(ngModel)]="firstName" name="firstName" required
                     class="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-black placeholder-gray-300
                            focus:ring-2 focus:ring-black focus:bg-white transition-all duration-200"
                     placeholder="John">
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Last Name</label>
              <input type="text" [(ngModel)]="lastName" name="lastName" required
                     class="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-black placeholder-gray-300
                            focus:ring-2 focus:ring-black focus:bg-white transition-all duration-200"
                     placeholder="Doe">
            </div>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Email</label>
            <input type="email" [(ngModel)]="email" name="email" required
                   class="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-black placeholder-gray-300
                          focus:ring-2 focus:ring-black focus:bg-white transition-all duration-200"
                   placeholder="you@example.com">
          </div>

          <!-- Password -->
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Password</label>
            <input type="password" [(ngModel)]="password" name="password" required minlength="6"
                   class="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-black placeholder-gray-300
                          focus:ring-2 focus:ring-black focus:bg-white transition-all duration-200"
                   placeholder="••••••••">
          </div>

          <!-- Date of Birth (register only) -->
          <div *ngIf="!isLoginMode">
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Date of Birth</label>
            <input type="date" [(ngModel)]="dateOfBirth" name="dateOfBirth" required
                   class="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-black
                          focus:ring-2 focus:ring-black focus:bg-white transition-all duration-200">
          </div>

          <!-- Error -->
          <div *ngIf="error$ | async as error"
               class="p-4 bg-red-50 rounded-xl text-red-500 text-sm text-center font-medium">
            {{ error }}
          </div>

          <!-- Submit -->
          <button type="submit" [disabled]="loading$ | async"
                  class="w-full px-4 py-3.5 bg-black text-white rounded-xl font-semibold
                         hover:bg-gray-900 active:scale-[0.98] transition-all duration-200
                         disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100
                         flex items-center justify-center gap-2 shadow-lg shadow-black/10">
            <svg *ngIf="loading$ | async" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            <span>{{ isLoginMode ? 'Sign In' : 'Create Account' }}</span>
          </button>
        </form>

        <!-- Toggle -->
        <div class="mt-8 text-center">
          <button (click)="switchMode()"
                  class="text-gray-400 hover:text-black text-sm font-medium transition-colors duration-200">
            {{ isLoginMode ? 'Need an account? Register' : 'Already have an account? Sign In' }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class AuthComponent {
  isLoginMode = true;
  email = '';
  password = '';
  firstName = '';
  lastName = '';
  dateOfBirth = '';

  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(private store: Store) {
    this.loading$ = this.store.select(selectAuthLoading);
    this.error$ = this.store.select(selectAuthError);
  }

  onSubmit() {
    if (this.isLoginMode) {
      this.store.dispatch(login({ request: { email: this.email, password: this.password } }));
    } else {
      this.store.dispatch(register({
        request: {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          password: this.password,
          dateOfBirth: this.dateOfBirth
        }
      }));
    }
  }

  switchMode() {
    this.isLoginMode = !this.isLoginMode;
  }
}
