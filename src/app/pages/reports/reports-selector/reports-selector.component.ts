import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface ReportOption {
  title: string;
  description: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-reports-selector',
  templateUrl: './reports-selector.component.html',
  styleUrls: ['./reports-selector.component.css']
})
export class ReportsSelectorComponent {
  reports: ReportOption[] = [
    {
      title: 'General Ledger',
      description: 'View all ledger entries with filters',
      icon: 'fas fa-book',
      route: '/reports/general-ledger'
    },
    {
      title: 'Profit & Loss',
      description: 'Analyze revenue and expenses',
      icon: 'fas fa-chart-line',
      route: '/reports/profit-loss'
    },
    {
      title: 'Balance Sheet',
      description: 'View assets, liabilities, and equity',
      icon: 'fas fa-balance-scale',
      route: '/reports/balance-sheet'
    },
    {
      title: 'Trial Balance',
      description: 'Check account balances and totals',
      icon: 'fas fa-list-check',
      route: '/reports/trial-balance'
    }
  ];

  constructor(private router: Router) {}

  navigateToReport(route: string): void {
    this.router.navigate([route]);
  }
}
