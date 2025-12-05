import { Injectable } from '@angular/core';

export interface Company {
  id: string;
  companyName: string;
  email: string;
  fullName: string;
  bankName: string;
  country: string;
  created: string;
}

@Injectable({
  providedIn: 'root'
})
export class DemoDataService {
  
  private demoCompany: Company = {
    id: 'company-demo-001',
    companyName: 'Demo Company',
    email: 'demo@democompany.com',
    fullName: 'Demo User',
    bankName: 'State Bank of India',
    country: 'India',
    created: new Date().toISOString()
  };

  constructor() {}

  /**
   * Get demo company object
   */
  getDemoCompany(): Company {
    return JSON.parse(JSON.stringify(this.demoCompany));
  }

  /**
   * Initialize demo company in localStorage if no companies exist
   */
  initializeDemoCompany(): void {
    try {
      const saved = localStorage.getItem('companies');
      
      // If no companies exist, create demo company
      if (!saved) {
        const companies = [this.getDemoCompany()];
        localStorage.setItem('companies', JSON.stringify(companies));
        localStorage.setItem('currentCompany', JSON.stringify(this.getDemoCompany()));
      }
    } catch (err) {
      console.error('Error initializing demo company:', err);
    }
  }

  /**
   * Get demo company as JSON string
   */
  getDemoCompanyJSON(): string {
    return JSON.stringify(this.demoCompany, null, 2);
  }

  /**
   * Reset to demo company (clear all and reload demo)
   */
  resetToDemoCompany(): void {
    try {
      const demoCompany = this.getDemoCompany();
      localStorage.setItem('companies', JSON.stringify([demoCompany]));
      localStorage.setItem('currentCompany', JSON.stringify(demoCompany));
      
      // Clear all mock data to start fresh
      localStorage.removeItem('purchaseItems');
      localStorage.removeItem('purchaseSuppliers');
      localStorage.removeItem('purchaseInvoices');
      localStorage.removeItem('purchasePayments');
      localStorage.removeItem('salesQuotes');
      localStorage.removeItem('salesInvoices');
      localStorage.removeItem('salesCustomers');
      localStorage.removeItem('salesItems');
      localStorage.removeItem('getStartedItems');
    } catch (err) {
      console.error('Error resetting to demo company:', err);
    }
  }
}
