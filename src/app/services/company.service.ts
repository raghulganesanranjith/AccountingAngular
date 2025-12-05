import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Company {
  id: number;
  name: string;
  fullName?: string;
  email: string;
  country: string;
  currency: string;
  bankName?: string;
  coa?: string;
  fiscalStart?: string;
  fiscalEnd?: string;
  logoDataUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class CompanyService {
  private _list = new BehaviorSubject<Company[]>([]);

  companies$ = this._list.asObservable();

  constructor() {
    // Load from localStorage only if window exists (browser)
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('companies');
      this._list.next(data ? JSON.parse(data) : []);
    }
  }

  getAll(): Company[] {
    return this._list.value;
  }

  add(company: Company) {
    company.id = Math.max(0, ...this._list.value.map(c => c.id)) + 1;
    const updated = [...this._list.value, company];
    this._list.next(updated);

    // Save to localStorage only if window exists
    if (typeof window !== 'undefined') {
      localStorage.setItem('companies', JSON.stringify(updated));
    }
  }
}
