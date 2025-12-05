import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface SalesOption {
  title: string;
  description: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sales-items',
  templateUrl: './sales-items.component.html',
  styleUrls: ['./sales-items.component.css']
})
export class SalesItemsComponent {
  salesItems: SalesOption[] = [
    {
      title: 'Sales Quotes',
      description: 'Create and manage sales quotations',
      icon: 'fas fa-file-alt',
      route: '/sales/quotes'
    },
    {
      title: 'Sales Invoices',
      description: 'Issue and track sales invoices',
      icon: 'fas fa-receipt',
      route: '/sales/invoices'
    },
    {
      title: 'Sales Payments',
      description: 'Record and manage payment receipts',
      icon: 'fas fa-credit-card',
      route: '/sales/payments'
    },
    {
      title: 'Customers',
      description: 'Manage customer information and details',
      icon: 'fas fa-users',
      route: '/sales/customers'
    },
    {
      title: 'Sales Items',
      description: 'Manage products and inventory items',
      icon: 'fas fa-box',
      route: '/sales/items'
    }
  ];

  constructor(private router: Router) {}

  navigateToSales(route: string): void {
    this.router.navigate([route]);
  }
}
