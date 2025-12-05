import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface GetStartedItem {
  key: string;
  label: string;
  icon: string;
  description: string;
  fieldname: string;
  completed?: boolean;
  action?: () => void;
  documentation?: string;
}

interface GetStartedSection {
  label: string;
  items: GetStartedItem[];
  progress?: number;
}

@Component({
  selector: 'app-getstarted',
  templateUrl: './getstarted.component.html',
  styleUrls: ['./getstarted.component.css']
})
export class GetStartedComponent implements OnInit {
  sections: GetStartedSection[] = [];
  overallProgress = 0;
  activeCard: string | null = null;

  private iconMap: Record<string, string> = {
    'general': 'fas fa-building',
    'invoice': 'fas fa-print',
    'system': 'fas fa-cogs',
    'review-ac': 'fas fa-list',
    'opening-ac': 'fas fa-book',
    'percentage': 'fas fa-percent',
    'item': 'fas fa-cube',
    'customer': 'fas fa-user',
    'sales-invoice': 'fas fa-file-invoice-dollar',
    'supplier': 'fas fa-handshake',
    'purchase-invoice': 'fas fa-receipt'
  };

  private completedItems = new Set<string>();

  constructor(private router: Router) {
    this.initializeSections();
  }

  ngOnInit(): void {
    this.loadCompletedItems();
    this.calculateProgress();
  }

  private initializeSections(): void {
    this.sections = [
      {
        label: 'Organisation',
        items: [
          {
            key: 'General',
            label: 'General',
            icon: this.iconMap['general'],
            description: 'Set up your company information, email, country and fiscal year',
            fieldname: 'companySetup',
            completed: false,
            action: () => this.router.navigate(['/setup/settings'])
          },
          {
            key: 'Print',
            label: 'Print',
            icon: this.iconMap['invoice'],
            description: 'Customize your invoices by adding a logo and address details',
            fieldname: 'printSetup',
            completed: false,
            action: () => this.router.navigate(['/setup/print-templates'])
          },
          {
            key: 'System',
            label: 'System',
            icon: this.iconMap['system'],
            description: 'Setup system defaults like date format and display precision',
            fieldname: 'systemSetup',
            completed: false,
            action: () => this.router.navigate(['/setup/settings'])
          }
        ]
      },
      {
        label: 'Accounts',
        items: [
          {
            key: 'Review Accounts',
            label: 'Review Accounts',
            icon: this.iconMap['review-ac'],
            description: 'Review your chart of accounts, add any account or tax heads as needed',
            fieldname: 'chartOfAccountsReviewed',
            completed: false,
            action: () => this.router.navigate(['/setup/chart-of-accounts']),
            documentation: 'https://docs.frappe.io/books/chart-of-accounts'
          },
          {
            key: 'Opening Balances',
            label: 'Opening Balances',
            icon: this.iconMap['opening-ac'],
            description: 'Set up your opening balances before performing any accounting entries',
            fieldname: 'openingBalanceChecked',
            completed: false,
            documentation: 'https://docs.frappe.io/books/setup-opening-balances'
          },
          {
            key: 'Add Taxes',
            label: 'Add Taxes',
            icon: this.iconMap['percentage'],
            description: 'Set up your tax templates for your sales or purchase transactions',
            fieldname: 'taxesAdded',
            completed: false,
            action: () => this.router.navigate(['/setup/tax-templates']),
            documentation: 'https://docs.frappe.io/books/create-initial-entries#add-taxes'
          }
        ]
      },
      {
        label: 'Sales',
        items: [
          {
            key: 'Add sales',
            label: 'Add Items',
            icon: this.iconMap['item'],
            description: 'Add products or services that you sell to your customers',
            fieldname: 'salesItemCreated',
            completed: false,
            action: () => this.router.navigate(['/setup/sales-items-management']),
            documentation: 'https://docs.frappe.io/books/create-initial-entries#add-sales-items'
          },
          {
            key: 'Add Customers',
            label: 'Add Customers',
            icon: this.iconMap['customer'],
            description: 'Add a few customers to create your first sales invoice',
            fieldname: 'customerCreated',
            completed: false,
            action: () => this.router.navigate(['/setup/customers']),
            documentation: 'https://docs.frappe.io/books/create-initial-entries#add-customers'
          },
          {
            key: 'Create Sales Invoice',
            label: 'Create Sales Invoice',
            icon: this.iconMap['sales-invoice'],
            description: 'Create your first sales invoice for the created customer',
            fieldname: 'invoiceCreated',
            completed: false,
            action: () => this.router.navigate(['/sales/invoices']),
            documentation: 'https://docs.frappe.io/books/sales-invoices'
          }
        ]
      },
      {
        label: 'Purchase',
        items: [
          {
            key: 'Add Purchase Items',
            label: 'Add Items',
            icon: this.iconMap['item'],
            description: 'Add products or services that you buy from your suppliers',
            fieldname: 'purchaseItemCreated',
            completed: false,
            action: () => this.router.navigate(['/purchase/items']),
            documentation: 'https://docs.frappe.io/books/create-initial-entries#add-purchase-items'
          },
          {
            key: 'Add Suppliers',
            label: 'Add Suppliers',
            icon: this.iconMap['supplier'],
            description: 'Add a few suppliers to create your first purchase bill',
            fieldname: 'supplierCreated',
            completed: false,
            action: () => this.router.navigate(['/purchase/suppliers']),
            documentation: 'https://docs.frappe.io/books/create-initial-entries#add-suppliers'
          },
          {
            key: 'Create Purchase Invoice',
            label: 'Create Purchase Invoice',
            icon: this.iconMap['purchase-invoice'],
            description: 'Create your first purchase invoice from the created supplier',
            fieldname: 'billCreated',
            completed: false,
            action: () => this.router.navigate(['/purchase/invoices']),
            documentation: 'https://docs.frappe.io/books/purchase-invoices#creating-purchase-invoices'
          }
        ]
      }
    ];
  }

  loadCompletedItems(): void {
    const saved = localStorage.getItem('getStartedItems');
    if (saved) {
      try {
        const savedArray = JSON.parse(saved);
        this.completedItems = new Set(savedArray);
        // Update completed flag on items
        this.sections.forEach(section => {
          section.items.forEach(item => {
            item.completed = this.completedItems.has(item.fieldname);
          });
        });
      } catch (e) {
        console.error('Error loading completed items:', e);
      }
    }
  }

  saveCompletedItems(): void {
    localStorage.setItem('getStartedItems', JSON.stringify(Array.from(this.completedItems)));
  }

  toggleItemCompletion(item: GetStartedItem): void {
    item.completed = !item.completed;
    if (item.completed) {
      this.completedItems.add(item.fieldname);
    } else {
      this.completedItems.delete(item.fieldname);
    }
    this.saveCompletedItems();
    this.calculateProgress();
  }

  executeAction(item: GetStartedItem): void {
    if (item.action) {
      item.action();
    }
    this.markAsCompleted(item);
  }

  markAsCompleted(item: GetStartedItem): void {
    if (!item.completed) {
      item.completed = true;
      this.completedItems.add(item.fieldname);
      this.saveCompletedItems();
      this.calculateProgress();
    }
  }

  openDocumentation(url: string | undefined): void {
    if (url) {
      window.open(url, '_blank');
    }
  }

  private calculateProgress(): void {
    const totalItems = this.sections.reduce((sum, section) => sum + section.items.length, 0);
    const completedItemsCount = this.completedItems.size;
    this.overallProgress = totalItems > 0 ? Math.round((completedItemsCount / totalItems) * 100) : 0;

    // Calculate section progress
    this.sections.forEach(section => {
      const sectionTotal = section.items.length;
      const sectionCompleted = section.items.filter(item => item.completed).length;
      section.progress = sectionTotal > 0 ? Math.round((sectionCompleted / sectionTotal) * 100) : 0;
    });
  }

  getCompletedItemsCount(): number {
    return this.completedItems.size;
  }

  getTotalItemsCount(): number {
    return this.sections.reduce((sum, section) => sum + section.items.length, 0);
  }
}
