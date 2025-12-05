import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DemoDataManagerService } from '../../../services/demo-data-manager.service';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface QuoteItem {
  id: string;
  itemName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  batch?: string;
  isFreeItem?: boolean;
}

interface SalesQuote {
  id: string;
  quoteNumber: string;
  date: Date;
  customer: Customer;
  items: QuoteItem[];
  subtotal: number;
  tax: number;
  grandTotal: number;
  status: 'Draft' | 'Submitted' | 'Accepted' | 'Rejected' | 'Expired';
  validFrom: Date;
  validTo: Date;
  notes: string;
}

@Component({
  selector: 'app-sales-quotes',
  templateUrl: './sales-quotes.component.html',
  styleUrls: ['./sales-quotes.component.css'],
  standalone: false
})
export class SalesQuotesComponent implements OnInit, OnDestroy {
  quotes$ = new BehaviorSubject<SalesQuote[]>([]);
  selectedQuote$ = new BehaviorSubject<SalesQuote | null>(null);
  showForm = false;
  showModal = false;
  editingQuote: SalesQuote | null = null;
  formTitle = 'New Sales Quote';
  private destroy$ = new Subject<void>();

  // Form data
  formData = {
    quoteNumber: '',
    date: new Date().toISOString().split('T')[0],
    customer: '',
    items: [] as QuoteItem[],
    validFrom: new Date().toISOString().split('T')[0],
    validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: ''
  };

  mockCustomers: Customer[] = [
    { id: '1', name: 'ABC Corporation', email: 'contact@abc.com', phone: '555-0101' },
    { id: '2', name: 'XYZ Industries', email: 'sales@xyz.com', phone: '555-0102' },
    { id: '3', name: 'Tech Solutions Ltd', email: 'info@tech.com', phone: '555-0103' }
  ];

  mockItems = [
    { name: 'Laptop', unitPrice: 1200, description: 'Professional Laptop' },
    { name: 'Software License', unitPrice: 500, description: 'Annual License' },
    { name: 'Support Services', unitPrice: 100, description: 'Per Hour Support' },
    { name: 'Cloud Storage', unitPrice: 50, description: 'Monthly Subscription' }
  ];

  constructor(
    private router: Router,
    private demoDataManager: DemoDataManagerService
  ) {
    this.initializeDemoQuotes();
  }

  ngOnInit(): void {
    this.loadQuotes();
    this.subscribeToDemo();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ---- MOCK DEMO QUOTES START (generateDemoQuotes) ----
  private initializeDemoQuotes(): void {
    const demoQuotes: SalesQuote[] = [
      {
        id: 'demo-quote-001',
        quoteNumber: 'SQ-DEMO-001',
        date: new Date(),
        customer: {
          id: 'demo-1',
          name: 'Demo Customer',
          email: 'customer@demo.com',
          phone: '555-0000'
        },
        items: [
          { id: '1', itemName: 'Demo Laptop', description: 'Professional Demo Laptop', quantity: 2, unitPrice: 1200, amount: 2400 },
          { id: '2', itemName: 'Demo License', description: 'Demo Annual License', quantity: 1, unitPrice: 500, amount: 500 }
        ],
        subtotal: 2900,
        tax: 290,
        grandTotal: 3190,
        status: 'Submitted',
        validFrom: new Date(),
        validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        notes: 'Demo quote - Valid for 30 days'
      },
      {
        id: 'demo-quote-002',
        quoteNumber: 'SQ-DEMO-002',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        customer: {
          id: 'demo-2',
          name: 'XYZ Industries',
          email: 'sales@xyz.com',
          phone: '555-0102'
        },
        items: [
          { id: '3', itemName: 'Cloud Storage', description: '1TB Cloud Storage', quantity: 5, unitPrice: 50, amount: 250 },
          { id: '4', itemName: 'Support Services', description: 'Premium Support', quantity: 10, unitPrice: 100, amount: 1000 }
        ],
        subtotal: 1250,
        tax: 125,
        grandTotal: 1375,
        status: 'Draft',
        validFrom: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        validTo: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000),
        notes: 'Standard quote for enterprise'
      }
    ];

    this.demoDataManager.registerDemoRecords('quote', 'sales', demoQuotes);
    this.quotes$.next(demoQuotes);
  }
  // ---- MOCK DEMO QUOTES END ----

  private subscribeToDemo(): void {
    this.demoDataManager.getDemoRecords('quote')
      .pipe(takeUntil(this.destroy$))
      .subscribe((quotes: any[]) => {
        if (quotes.length > 0) {
          this.quotes$.next(quotes);
        }
      });
  }

  loadQuotes(): void {
    // In real app, this would call a service
    console.log('Loading quotes...');
  }

  createNewQuote(): void {
    this.router.navigate(['/sales/quotes/new']);
  }

  /**
   * Open demo quote in form for editing
   */
  openDemoQuote(quote: SalesQuote): void {
    this.editingQuote = quote;
    this.formTitle = `Edit Quote - ${quote.quoteNumber}`;
    this.formData = {
      quoteNumber: quote.quoteNumber,
      date: this.formatDate(quote.date),
      customer: quote.customer.id,
      items: [...quote.items],
      validFrom: this.formatDate(quote.validFrom),
      validTo: this.formatDate(quote.validTo),
      notes: quote.notes
    };
    this.showForm = true;
  }

  editQuote(quote: SalesQuote): void {
    this.openDemoQuote(quote);
  }

  deleteQuote(quote: SalesQuote): void {
    if (confirm(`Delete quote ${quote.quoteNumber}?`)) {
      const quotes = this.quotes$.value.filter(q => q.id !== quote.id);
      this.quotes$.next(quotes);
      this.demoDataManager.deleteDemoRecord('quote', quote.id);
    }
  }

  viewQuote(quote: SalesQuote): void {
    this.selectedQuote$.next(quote);
    this.showModal = true;
  }

  saveQuote(): void {
    const customer = this.mockCustomers.find(c => c.id === this.formData.customer);
    if (!customer) {
      alert('Please select a customer');
      return;
    }

    if (this.formData.items.length === 0) {
      alert('Please add at least one item');
      return;
    }

    const subtotal = this.formData.items.reduce((sum, item) => sum + item.amount, 0);
    const tax = subtotal * 0.1; // 10% tax
    const grandTotal = subtotal + tax;

    if (this.editingQuote) {
      // Update existing quote
      const updatedQuote: SalesQuote = {
        ...this.editingQuote,
        quoteNumber: this.formData.quoteNumber,
        date: new Date(this.formData.date),
        customer,
        items: this.formData.items,
        validFrom: new Date(this.formData.validFrom),
        validTo: new Date(this.formData.validTo),
        notes: this.formData.notes,
        subtotal,
        tax,
        grandTotal
      };

      const quotes = this.quotes$.value.map(q =>
        q.id === this.editingQuote!.id ? updatedQuote : q
      );
      this.quotes$.next(quotes);

      // Update in demo manager if it's a demo quote
      if (this.editingQuote.id.includes('demo')) {
        this.demoDataManager.registerDemoRecords('quote', 'sales', quotes);
      }
    } else {
      // Create new quote
      const newQuote: SalesQuote = {
        id: Date.now().toString(),
        quoteNumber: this.formData.quoteNumber || `SQ-${Date.now()}`,
        date: new Date(this.formData.date),
        customer,
        items: this.formData.items,
        subtotal,
        tax,
        grandTotal,
        status: 'Draft',
        validFrom: new Date(this.formData.validFrom),
        validTo: new Date(this.formData.validTo),
        notes: this.formData.notes
      };
      const quotes = [newQuote, ...this.quotes$.value];
      this.quotes$.next(quotes);
    }

    this.closeForm();
  }

  addItemToQuote(): void {
    const newItem: QuoteItem = {
      id: Date.now().toString(),
      itemName: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      amount: 0
    };
    this.formData.items.push(newItem);
  }

  removeItemFromQuote(index: number): void {
    this.formData.items.splice(index, 1);
  }

  updateItemAmount(index: number): void {
    const item = this.formData.items[index];
    item.amount = item.quantity * item.unitPrice;
  }

  submitQuote(quote: SalesQuote): void {
    const quotes = this.quotes$.value.map(q =>
      q.id === quote.id ? { ...q, status: 'Submitted' as const } : q
    );
    this.quotes$.next(quotes);
  }

  makeInvoiceFromQuote(quote: SalesQuote): void {
    alert(`Creating invoice from quote ${quote.quoteNumber}\nThis would navigate to create invoice in real app.`);
  }

  closeForm(): void {
    this.showForm = false;
    this.resetForm();
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedQuote$.next(null);
  }

  private resetForm(): void {
    this.formData = {
      quoteNumber: '',
      date: new Date().toISOString().split('T')[0],
      customer: '',
      items: [],
      validFrom: new Date().toISOString().split('T')[0],
      validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: ''
    };
    this.editingQuote = null;
    this.formTitle = 'New Sales Quote';
  }

  private formatDate(date: Date): string {
    return new Date(date).toISOString().split('T')[0];
  }

  getStatusBadgeColor(status: string): string {
    const colors: Record<string, string> = {
      'Draft': 'gray',
      'Submitted': 'blue',
      'Accepted': 'green',
      'Rejected': 'red',
      'Expired': 'orange'
    };
    return colors[status] || 'gray';
  }
}
