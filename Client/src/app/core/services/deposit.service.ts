import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponseModel } from '../models/api-response.model';
import { DepositRequest, DepositResponse } from '../models/deposit.model';

@Injectable({ providedIn: 'root' })
export class DepositService {
  private readonly API_URL = 'http://localhost:8080/api/deposits';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  createDeposit(request: DepositRequest): Observable<ApiResponseModel<DepositResponse>> {
    return this.http.post<ApiResponseModel<DepositResponse>>(
      this.API_URL,
      request,
      { headers: this.getAuthHeaders() }
    );
  }

  getDepositHistory(investorId: number): Observable<ApiResponseModel<DepositResponse[]>> {
    return this.http.get<ApiResponseModel<DepositResponse[]>>(
      `${this.API_URL}/history/${investorId}`,
      { headers: this.getAuthHeaders() }
    );
  }
}
