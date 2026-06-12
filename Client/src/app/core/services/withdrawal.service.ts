import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponseModel } from '../models/api-response.model';
import { WithdrawalRequest, WithdrawalResponse, WithdrawalHistory } from '../models/withdrawal.model';

@Injectable({ providedIn: 'root' })
export class WithdrawalService {
  private readonly API_URL = 'http://localhost:8080/api/withdrawals';

  constructor(private http: HttpClient) {}

  createWithdrawal(request: WithdrawalRequest): Observable<ApiResponseModel<WithdrawalResponse>> {
    return this.http.post<ApiResponseModel<WithdrawalResponse>>(this.API_URL, request);
  }

  getHistory(investorId: number): Observable<ApiResponseModel<WithdrawalHistory[]>> {
    return this.http.get<ApiResponseModel<WithdrawalHistory[]>>(`${this.API_URL}/history/${investorId}`);
  }
}
