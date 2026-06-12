import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CsvExportRequest } from '../models/withdrawal.model';

@Injectable({ providedIn: 'root' })
export class CsvExportService {
  private readonly API_URL = 'http://localhost:8080/api/export';

  constructor(private http: HttpClient) {}

  downloadCsv(request: CsvExportRequest): Observable<Blob> {
    return this.http.post(`${this.API_URL}/csv`, request, { responseType: 'blob' });
  }
}
