import {Observable} from 'rxjs';
import {ApiResponseModel} from '../models/api-response.model';
import {Investor, RegisterRequest} from '../models/investor.model';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    // Call your actual login endpoint
    return this.http.post(`${this.API_URL}/auth/login`, { email, password });
  }

  register(request: RegisterRequest): Observable<ApiResponseModel<Investor>> {
    return this.http.post<ApiResponseModel<Investor>>(`${this.API_URL}/auth/register`, request);
  }
}
