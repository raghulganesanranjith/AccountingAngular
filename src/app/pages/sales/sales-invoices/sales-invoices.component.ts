import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { DemoDataManagerService } from '../../../services/demo-data-manager.service';

interface Customer {
  id: string;
  name: string;
  email: string;
  loyaltyProgram?: string;
  totalLoyaltyPoints?: number;
}

interface InvoiceItem {
  id: string;
  itemName: string;
  rate: number;
  quantity: number;
  amount: number;
  isFreeItem?: boolean;
}

interface LoyaltyTier {
  tierName: string;
  collectionFactor: number;
  minimumTotalSpent: number;
}

interface LoyaltyProgram {
  id: string;
  name: string;
  fromDate: Date;
  toDate: Date;
  email: string;
  mobile: string;
  collectionRules: LoyaltyTier[];
  isEnabled: boolean;
  expiryDuration: number;
  conversionFactor: number;
}

interface SalesInvoice {
  id: string;
  invoiceNumber: string;
  date: Date;
  customer: Customer;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  tax: number;
  grandTotal: number;
  outstandingAmount: number;
  status: 'Draft' | 'Submitted' | 'Paid' | 'PartlyPaid' | 'Unpaid' | 'Cancelled' | 'Return';
  loyaltyProgram?: string;
  loyaltyPoints?: number;
  redeemLoyaltyPoints?: boolean;
  notes: string;
  returnAgainst?: string;
}

@Component({
  selector: 'app-sales-invoices',
  templateUrl: './sales-invoices.component.html',
  styleUrls: ['./sales-invoices.component.css'],
  standalone: false
})
export class SalesInvoicesComponent implements OnInit, OnDestroy {
  demoInvoices$ = new BehaviorSubject<SalesInvoice[]>([]);
  invoices$ = new BehaviorSubject<SalesInvoice[]>([]);
  selectedInvoice$ = new BehaviorSubject<SalesInvoice | null>(null);
  showForm = false;
  showModal = false;
  editingInvoice: SalesInvoice | null = null;
  formTitle = 'New Sales Invoice';
  taxRate = 10; // 10% default tax
  private destroy$ = new Subject<void>();

  formData = {
    invoiceNumber: '',
    date: new Date().toISOString().split('T')[0],
    customer: '',
    items: [] as InvoiceItem[],
    redeemLoyaltyPoints: false,
    loyaltyPoints: 0,
    notes: ''
  };

  mockCustomers: Customer[] = [
    { 
      id: '1', 
      name: 'John Whoe', 
      email: 'john@whoe.com',
      loyaltyProgram: 'program',
      totalLoyaltyPoints: 0
    },
    { id: '2', name: 'ABC Corporation', email: 'contact@abc.com', totalLoyaltyPoints: 0 },
    { id: '3', name: 'XYZ Industries', email: 'sales@xyz.com', totalLoyaltyPoints: 0 }
  ];

  mockItems = [
    { name: 'Pen', rate: 4000, description: 'Ballpoint Pen' },
    { name: 'Laptop', rate: 120000, description: 'Professional Laptop' },
    { name: 'Software License', rate: 50000, description: 'Annual License' },
    { name: 'Consulting', rate: 10000, description: 'Per Hour Rate' }
  ];

  mockLoyaltyProgram: LoyaltyProgram = {
    id: '1',
    name: 'program',
    fromDate: new Date('2024-12-10'),
    toDate: new Date('2024-12-30'),
    email: 'sample@gmail.com',
    mobile: '1234567890',
    collectionRules: [
      { tierName: 'Silver', collectionFactor: 0.5, minimumTotalSpent: 2000 },
      { tierName: 'Gold', collectionFactor: 0.75, minimumTotalSpent: 3000 }
    ],
    isEnabled: true,
    expiryDuration: 365,
    conversionFactor: 0.1
  };

  constructor(
    private router: Router,
    private demoDataManager: DemoDataManagerService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.initializeDemoInvoices();
  }

  ngOnInit(): void {
    this.loadInvoices();
    this.subscribeToRouteChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subscribeToRouteChanges(): void {
    this.router.events
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          // When returning from new invoice page to invoices list
          if (event.url === '/sales/invoices') {
            this.showForm = false;
            this.loadInvoices();
          }
        }
      });
  }

  // ---- DEMO INVOICES ARRAY ----
  private initializeDemoInvoices(): void {
    const demoInvoices: SalesInvoice[] = [
      {
        id: 'demo-invoice-001',
        invoiceNumber: 'SINV-DEMO-001',
        date: new Date(),
        customer: {
          id: 'customer-demo-001',
          name: 'Demo Customer',
          email: 'customer@demo.com',
          totalLoyaltyPoints: 0
        },
        items: [
          {
            id: 'item-1',
            itemName: 'Laptop',
            rate: 1200,
            quantity: 2,
            amount: 2400
          },
          {
            id: 'item-2',
            itemName: 'License',
            rate: 500,
            quantity: 1,
            amount: 500
          }
        ],
        subtotal: 2900,
        taxRate: 10,
        tax: 290,
        grandTotal: 3190,
        outstandingAmount: 3190,
        status: 'Draft',
        notes: 'Demo invoice for testing',
        redeemLoyaltyPoints: false
      },
      {
        id: 'demo-invoice-002',
        invoiceNumber: 'SINV-DEMO-002',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        customer: {
          id: 'customer-demo-002',
          name: 'ABC Corporation',
          email: 'contact@abc.com',
          totalLoyaltyPoints: 5000
        },
        items: [
          {
            id: 'item-3',
            itemName: 'Software License',
            rate: 50000,
            quantity: 3,
            amount: 150000
          },
          {
            id: 'item-4',
            itemName: 'Consulting',
            rate: 10000,
            quantity: 5,
            amount: 50000
          }
        ],
        subtotal: 200000,
        taxRate: 10,
        tax: 20000,
        grandTotal: 220000,
        outstandingAmount: 110000,
        status: 'PartlyPaid',
        notes: 'Professional services invoice',
        redeemLoyaltyPoints: false,
        loyaltyPoints: 5000
      }
    ];

    this.demoDataManager.registerDemoRecords('invoice', 'sales', demoInvoices);
    this.demoInvoices$.next(demoInvoices);
    this.invoices$.next(demoInvoices);
  }

  private subscribeToDemo(): void {
    this.demoDataManager.getDemoRecords('invoice')
      .pipe(takeUntil(this.destroy$))
      .subscribe((invoices: any[]) => {
        if (invoices.length > 0) {
          this.demoInvoices$.next(invoices);
          this.invoices$.next(invoices);
        }
      });
  }

  loadInvoices(): void {
    this.subscribeToDemo();
  }

  /**
   * Click handler for demo invoice card
   * Opens the new invoice form with demo data pre-filled
   */
  openDemoInvoice(invoice: SalesInvoice): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Format date to include time (YYYY-MM-DDTHH:mm format for datetime-local input)
    const dateObj = new Date(invoice.date);
    const dateStr = dateObj.toISOString().slice(0, 16);

    // Store the demo invoice in localStorage for NewInvoiceComponent to load
    localStorage.setItem('demoInvoiceData', JSON.stringify({
      invoiceNumber: invoice.invoiceNumber,
      customer: invoice.customer.name,
      date: dateStr,
      items: invoice.items.map(item => ({
        item: item.itemName,
        quantity: item.quantity,
        rate: item.rate,
        amount: item.amount,
        tax: '18%'
      })),
      netTotal: invoice.subtotal,
      grandTotal: invoice.grandTotal,
      outstandingAmount: invoice.outstandingAmount,
      notes: invoice.notes
    }));

    // Navigate to new invoice form
    this.router.navigate(['/sales/invoices/new']);
  }

  createNewInvoice(): void {
    localStorage.removeItem('demoInvoiceData');
    this.router.navigate(['/sales/invoices/new']);
  }

  editInvoice(invoice: SalesInvoice): void {
    this.editingInvoice = invoice;
    this.formTitle = `Edit Invoice - ${invoice.invoiceNumber}`;
    this.formData = {
      invoiceNumber: invoice.invoiceNumber,
      date: this.formatDate(invoice.date),
      customer: invoice.customer.id,
      items: [...invoice.items],
      redeemLoyaltyPoints: invoice.redeemLoyaltyPoints || false,
      loyaltyPoints: invoice.loyaltyPoints || 0,
      notes: invoice.notes
    };
    this.showForm = true;
  }

  deleteInvoice(invoice: SalesInvoice): void {
    if (confirm(`Delete invoice ${invoice.invoiceNumber}?`)) {
      const invoices = this.invoices$.value.filter(i => i.id !== invoice.id);
      this.invoices$.next(invoices);
      this.demoDataManager.deleteDemoRecord('invoice', invoice.id);
    }
  }

  viewInvoice(invoice: SalesInvoice): void {
    this.selectedInvoice$.next(invoice);
    this.showModal = true;
  }

  makePayment(invoice: SalesInvoice): void {
    alert(`Making payment for ${invoice.invoiceNumber}`);
  }

  submitInvoice(invoice: SalesInvoice): void {
    const invoices = this.invoices$.value.map(i =>
      i.id === invoice.id ? { ...i, status: 'Submitted' as const } : i
    );
    this.invoices$.next(invoices);
    alert(`Invoice ${invoice.invoiceNumber} submitted successfully!`);
  }

  saveInvoice(): void {
    const customer = this.mockCustomers.find(c => c.id === this.formData.customer);
    if (!customer) {
      alert('Please select a customer');
      return;
    }

    const subtotal = this.formData.items.reduce((sum, item) => sum + item.amount, 0);
    const tax = subtotal * (this.taxRate / 100);
    const grandTotal = subtotal + tax;

    if (this.editingInvoice) {
      const updatedInvoice: SalesInvoice = {
        ...this.editingInvoice,
        invoiceNumber: this.formData.invoiceNumber,
        date: new Date(this.formData.date),
        customer,
        items: this.formData.items,
        subtotal,
        tax,
        grandTotal,
        notes: this.formData.notes
      };

      const invoices = this.invoices$.value.map(i =>
        i.id === this.editingInvoice!.id ? updatedInvoice : i
      );
      this.invoices$.next(invoices);

      if (this.editingInvoice.id.includes('demo')) {
        this.demoDataManager.registerDemoRecords('invoice', 'sales', invoices);
      }
    }

    this.closeForm();
  }

  addItemToInvoice(): void {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      itemName: '',
      rate: 0,
      quantity: 1,
      amount: 0
    };
    this.formData.items.push(newItem);
  }

  removeItemFromInvoice(index: number): void {
    this.formData.items.splice(index, 1);
  }

  updateItemAmount(index: number): void {
    const item = this.formData.items[index];
    item.amount = item.quantity * item.rate;
  }

  closeForm(): void {
    this.showForm = false;
    this.resetForm();
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedInvoice$.next(null);
  }

  private resetForm(): void {
    this.formData = {
      invoiceNumber: '',
      date: new Date().toISOString().split('T')[0],
      customer: '',
      items: [],
      redeemLoyaltyPoints: false,
      loyaltyPoints: 0,
      notes: ''
    };
    this.editingInvoice = null;
    this.formTitle = 'New Sales Invoice';
  }

  private formatDate(date: Date): string {
    return new Date(date).toISOString().split('T')[0];
  }

  getStatusBadgeColor(status: string): string {
    const colors: Record<string, string> = {
      'Draft': 'gray',
      'Submitted': 'blue',
      'Paid': 'green',
      'PartlyPaid': 'orange',
      'Unpaid': 'red',
      'Cancelled': 'dark',
      'Return': 'purple'
    };
    return colors[status] || 'gray';
  }
}
