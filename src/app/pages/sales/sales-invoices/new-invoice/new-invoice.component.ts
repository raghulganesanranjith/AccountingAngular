import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

interface InvoiceItem {
  id: string;
  item: string;
  tax: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Invoice {
  numberSeries: string;
  customer: string;
  date: string;
  type: string;
  items: InvoiceItem[];
  netTotal: number;
  grandTotal: number;
  outstandingAmount: number;
  notes: string;
  coupons: string;
}

@Component({
  selector: 'app-new-invoice',
  templateUrl: './new-invoice.component.html',
  styleUrls: ['./new-invoice.component.css']
})
export class NewInvoiceComponent implements OnInit {
  invoice: Invoice = {
    numberSeries: 'SINV-',
    customer: '',
    date: new Date().toISOString().slice(0, 16),
    type: 'Party',
    items: [],
    netTotal: 0,
    grandTotal: 0,
    outstandingAmount: 0,
    notes: '',
    coupons: ''
  };

  customers = ['Customer 1', 'Customer 2', 'Customer 3'];
  itemList = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];
  taxOptions = ['18%', '12%', '5%', '0%'];
  loading = false;
  isDemo = false;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadDemoInvoiceData();
      this.loadInvoiceFromStorage();
    }
  }

  /**
   * Load demo invoice data from localStorage if available
   */
  private loadDemoInvoiceData(): void {
    const demoData = localStorage.getItem('demoInvoiceData');
    if (demoData) {
      try {
        const demo = JSON.parse(demoData);
        this.isDemo = true;
        
        // Populate invoice with demo data
        this.invoice = {
          numberSeries: demo.invoiceNumber || 'SINV-',
          customer: demo.customer || '',
          date: demo.date || new Date().toISOString().slice(0, 16),
          type: 'Party',
          items: (demo.items || []).map((item: any, index: number) => ({
            id: (index + 1).toString(),
            item: item.item || '',
            tax: item.tax || '18%',
            quantity: item.quantity || 1,
            rate: item.rate || 0,
            amount: item.amount || 0
          })),
          netTotal: demo.netTotal || 0,
          grandTotal: demo.grandTotal || 0,
          outstandingAmount: demo.outstandingAmount || 0,
          notes: demo.notes || '',
          coupons: ''
        };

        // Clear the demo data from storage after loading
        localStorage.removeItem('demoInvoiceData');
      } catch (error) {
        console.error('Error loading demo invoice data:', error);
      }
    }
  }

  loadInvoiceFromStorage(): void {
    const saved = localStorage.getItem('currentInvoice');
    if (saved && !this.isDemo) {
      this.invoice = JSON.parse(saved);
    }
  }

  saveInvoice(): void {
    localStorage.setItem('currentInvoice', JSON.stringify(this.invoice));
    alert('Invoice saved as draft');
  }

  addRow(): void {
    const newItem: InvoiceItem = {
      id: 'item-' + Date.now(),
      item: '',
      tax: '18%',
      quantity: 1,
      rate: 0,
      amount: 0
    };
    this.invoice.items.push(newItem);
    this.calculateTotals();
  }

  removeRow(index: number): void {
    this.invoice.items.splice(index, 1);
    this.calculateTotals();
  }

  calculateTotals(): void {
    this.invoice.netTotal = this.invoice.items.reduce((sum, item) => sum + item.amount, 0);
    this.invoice.grandTotal = this.invoice.netTotal * 1.18; // Assuming 18% tax
    this.invoice.outstandingAmount = this.invoice.grandTotal;
  }

  submitInvoice(): void {
    this.loading = true;
    of({}).pipe(
      delay(1000)
    ).subscribe(() => {
      this.loading = false;
      alert('Invoice submitted successfully!');
      this.router.navigate(['/sales/invoices']);
    });
  }

  discardInvoice(): void {
    if (confirm('Are you sure you want to discard this invoice? Changes will not be saved.')) {
      localStorage.removeItem('demoInvoiceData');
      localStorage.removeItem('currentInvoice');
      this.router.navigate(['/sales/invoices']);
    }
  }

  backToList(): void {
    this.router.navigate(['/sales/invoices']);
  }

  onItemChange(index: number): void {
    const item = this.invoice.items[index];
    item.amount = item.quantity * item.rate;
    this.calculateTotals();
  }

  updateItemAmount(item: InvoiceItem): void {
    item.amount = item.quantity * item.rate;
    this.calculateTotals();
  }

  goBackToInvoices(): void {
    this.router.navigate(['/sales/invoices']);
  }
}
