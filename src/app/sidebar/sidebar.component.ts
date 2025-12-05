import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface MenuItem {
  label: string;
  route?: string;
  active: boolean;
  children?: MenuItem[];
  expanded?: boolean;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: MenuItem[] = [
    { label: 'Get Started', route: '/get-started', active: true },
    { label: 'Dashboard', route: '/dashboard-main', active: false },
    {
      label: 'Sales',
      active: false,
      expanded: false,
      children: [
        { label: 'Quotes', route: '/sales/quotes', active: false },
        { label: 'Invoices', route: '/sales/invoices', active: false },
        { label: 'Payments', route: '/sales/payments', active: false },
        { label: 'Customers', route: '/sales/customers', active: false },
        { label: 'Items', route: '/sales/items', active: false }
      ]
    },
    {
      label: 'Purchase',
      active: false,
      expanded: false,
      children: [
        { label: 'Purchase Invoices', route: '/purchase/invoices', active: false },
        { label: 'Purchase Payments', route: '/purchase/payments', active: false },
        { label: 'Suppliers', route: '/purchase/suppliers', active: false },
        { label: 'Purchase Items', route: '/purchase/items', active: false }
      ]
    },
    {
      label: 'Reports',
      active: false,
      expanded: false,
      children: [
        { label: 'General Ledger', route: '/reports/general-ledger', active: false },
        { label: 'Profit & Loss', route: '/reports/profit-loss', active: false },
        { label: 'Balance Sheet', route: '/reports/balance-sheet', active: false },
        { label: 'Trial Balance', route: '/reports/trial-balance', active: false }
      ]
    },
    {
      label: 'Setup',
      route: '/setup',
      active: false,
      expanded: false,
      children: [
        { label: 'Chart of Accounts', route: '/setup/chart-of-accounts', active: false },
        { label: 'Tax Templates', route: '/setup/tax-templates', active: false },
        { label: 'Import Wizard', route: '/setup/import-wizard', active: false },
        { label: 'Print Templates', route: '/setup/print-templates', active: false },
        { label: 'Settings', route: '/setup/settings', active: false }
      ]
    },
    {
      label: 'Common',
      active: false,
      expanded: false,
      children: [
        { label: 'Journal Entry', route: '/common/journal-entry', active: false },
        { label: 'Party', route: '/common/party', active: false },
        { label: 'Items', route: '/common/items', active: false }
      ]
    }
  ];
  currentRoute = '';

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.updateActiveMenu();
    });
  }

  ngOnInit(): void {
    this.updateActiveMenu();
  }

  updateActiveMenu(): void {
    this.currentRoute = this.router.url;
    this.updateMenuItemsActive(this.menuItems);
  }

  updateMenuItemsActive(items: MenuItem[]): void {
    items.forEach(item => {
      if (item.route) {
        item.active = item.route === this.currentRoute;
      } else if (item.children) {
        // Check if any child is active
        item.active = item.children.some(child => {
          const isActive = child.route === this.currentRoute;
          if (isActive) {
            item.expanded = true; // Auto-expand parent if child is active
          }
          return isActive;
        });
      }
      
      if (item.children) {
        this.updateMenuItemsActive(item.children);
      }
    });
  }

  toggleExpand(item: MenuItem): void {
    if (item.children) {
      item.expanded = !item.expanded;
    }
  }

  onItemClick(item: MenuItem): void {
    if (item.children) {
      this.toggleExpand(item);
    } else if (item.route) {
      this.router.navigate([item.route]);
    }
  }

  onParentLabelClick(item: MenuItem): void {
    if (item.route) {
      this.router.navigate([item.route]);
    }
  }
}
