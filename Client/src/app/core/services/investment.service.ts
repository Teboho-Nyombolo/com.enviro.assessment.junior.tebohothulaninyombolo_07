import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponseModel } from '../models/api-response.model';
import { Portfolio } from '../models/product.model';

export interface CreateInvestmentRequest {
  investorId: number;
  productName: string;
  productType: string;
  initialDeposit: number;
}

@Injectable({ providedIn: 'root' })
export class InvestmentService {
  private apiUrl = 'http://localhost:8080/api/investments';

  constructor(private http: HttpClient) {}

  getInvestments() {
    return this.http.get(this.apiUrl); // interceptor adds Basic header
  }

  createInvestment(investment: any) {
    return this.http.post(this.apiUrl, investment);
  }
}
