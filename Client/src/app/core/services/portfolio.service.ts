import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponseModel } from '../models/api-response.model';
import { Portfolio } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class PortfolioService {
  private readonly API_URL = 'http://localhost:8080/api/portfolios';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || ''}`
    });
  }

  getPortfolio(investorId: number): Observable<ApiResponseModel<Portfolio>> {
    return this.http.get<ApiResponseModel<Portfolio>>(
      `${this.API_URL}/${investorId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  getMyPortfolio(): Observable<ApiResponseModel<Portfolio>> {
    return this.http.get<ApiResponseModel<Portfolio>>(
      `${this.API_URL}/me`,
      { headers: this.getAuthHeaders() }
    );
  }
}
