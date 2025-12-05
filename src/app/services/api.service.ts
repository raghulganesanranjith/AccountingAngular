import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  status: string;
  message: string;
  token: string;
  user: {
    username: string;
  };
}

interface Company {
  id: string;
  companyName: string;
  email: string;
  fullName: string;
  bankName: string;
  country: string;
  created: string;
}

interface CompanyResponse {
  status: string;
  message: string;
  company?: Company;
}

interface CreateCompanyRequest {
  companyName: string;
  email: string;
  fullName: string;
  bankName: string;
  country: string;
}

interface CreateCompanyResponse {
  status: string;
  message: string;
  companyName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  /**
   * POST /api/login
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    const mockResponse: LoginResponse = {
      status: 'success',
      message: 'Login successful',
      token: 'fake-api-token',
      user: {
        username: credentials.username
      }
    };
    return of(mockResponse).pipe(delay(1000));
  }

  /**
   * GET /api/getcompany
   */
  getCompany(): Observable<CompanyResponse> {
    const mockDemoCompany: Company = {
      id: 'company-demo-001',
      companyName: 'Demo Company',
      email: 'demo@democompany.com',
      fullName: 'Demo User',
      bankName: 'State Bank of India',
      country: 'India',
      created: new Date().toISOString()
    };

    const mockResponse: CompanyResponse = {
      status: 'success',
      message: 'Demo company retrieved',
      company: mockDemoCompany
    };
    return of(mockResponse).pipe(delay(1000));
  }

  /**
   * POST /api/createcompany
   */
  createCompany(companyData: CreateCompanyRequest): Observable<CreateCompanyResponse> {
    const mockResponse: CreateCompanyResponse = {
      status: 'success',
      message: 'Registered successfully',
      companyName: companyData.companyName
    };
    return of(mockResponse).pipe(delay(1000));
  }
}
