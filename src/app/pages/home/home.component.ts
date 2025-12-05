import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Subject, interval } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';

interface Company {
  id: string;
  companyName: string;
  email: string;
  fullName: string;
  bankName: string;
  country: string;
  created: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  companies: Company[] = [];
  currentCompany: Company | null = null;
  hasCompanies = false;
  private destroy$ = new Subject<void>();
  private storageChange$ = new Subject<void>();

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.initializeDemoCompany();
    this.loadCompanies();
    this.setupStorageListener();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.storageChange$.complete();
  }

  // Setup real-time listener for storage changes
  private setupStorageListener(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Listen for storage changes
    window.addEventListener('storage', () => {
      this.loadCompanies();
    });

    // Also poll for changes every 500ms for immediate reactivity
    this.storageChange$
      .pipe(
        debounceTime(300),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.loadCompanies();
      });

    // Poll localStorage for changes
    interval(500)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.storageChange$.next();
      });
  }

  // ---- MOCK DEMO COMPANY START (generateDemoCompany) ----
  private initializeDemoCompany(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return; // Skip on server-side
    }

    try {
      const mockDemoCompanies: Company[] = [
        {
          id: 'company-demo-001',
          companyName: 'Demo Company',
          email: 'demo@democompany.com',
          fullName: 'Demo User',
          bankName: 'State Bank of India',
          country: 'India',
          created: new Date().toISOString()
        },
        {
          id: 'company-demo-002',
          companyName: 'Tech Solutions Ltd',
          email: 'info@techsolutions.com',
          fullName: 'John Smith',
          bankName: 'HDFC Bank',
          country: 'India',
          created: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'company-demo-003',
          companyName: 'Global',
          email: 'contact@globalent.com',
          fullName: 'Sarah Johnson',
          bankName: 'ICICI Bank',
          country: 'USA',
          created: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      
      // Always reinitialize (no cache check) - updates instantly for testing
      localStorage.setItem('companies', JSON.stringify(mockDemoCompanies));
      localStorage.setItem('currentCompany', JSON.stringify(mockDemoCompanies[0]));
      this.triggerStorageChange();
    } catch (err) {
      console.error('Error initializing demo company:', err);
    }
  }
  // ---- MOCK DEMO COMPANY END ----

  loadCompanies(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return; // Skip on server-side
    }

    try {
      const saved = localStorage.getItem('companies');
      if (saved) {
        this.companies = JSON.parse(saved);
        this.hasCompanies = this.companies.length > 0;
      } else {
        this.companies = [];
        this.hasCompanies = false;
      }

      // Load current company
      const current = localStorage.getItem('currentCompany');
      if (current) {
        this.currentCompany = JSON.parse(current);
      }
    } catch (err) {
      console.error('Error loading companies:', err);
      this.companies = [];
      this.hasCompanies = false;
    }
  }

  private triggerStorageChange(): void {
    this.storageChange$.next();
  }

  openCompany(company: Company): void {
    localStorage.setItem('currentCompany', JSON.stringify(company));
    this.currentCompany = company;
    this.triggerStorageChange();
    this.router.navigate(['/sidebar']);
  }

  createNewCompany(): void {
    this.router.navigate(['/setup-wizard']);
  }

  deleteCompany(company: Company, event: Event): void {
    event.stopPropagation();
    
    if (confirm(`Are you sure you want to delete "${company.companyName}"?`)) {
      try {
        this.companies = this.companies.filter(c => c.id !== company.id);
        localStorage.setItem('companies', JSON.stringify(this.companies));
        this.triggerStorageChange();
        this.hasCompanies = this.companies.length > 0;

        if (this.currentCompany?.id === company.id) {
          if (this.companies.length > 0) {
            this.currentCompany = this.companies[0];
            localStorage.setItem('currentCompany', JSON.stringify(this.currentCompany));
          } else {
            this.currentCompany = null;
            localStorage.removeItem('currentCompany');
          }
        }
        this.triggerStorageChange();
      } catch (err) {
        console.error('Error deleting company:', err);
      }
    }
  }

  trackByCompanyId(index: number, company: Company): string {
    return company.id;
  }
}
