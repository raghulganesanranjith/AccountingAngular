import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

interface PurchaseInvoiceItem {
  id: string;
  item: string;
  tax: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface PurchaseInvoice {
  numberSeries: string;
  supplier: string;
  account: string;
  date: string;
  items: PurchaseInvoiceItem[];
  netTotal: number;
  grandTotal: number;
  outstandingAmount: number;
  stockNotReceived: number;
  notes: string;
  attachment: string;
  returnAgainst: string;
}

@Component({
  selector: 'app-new-purchase-invoice',
  templateUrl: './new-purchase-invoice.component.html',
  styleUrls: ['./new-purchase-invoice.component.css'],
  standalone: false
})
export class NewPurchaseInvoiceComponent implements OnInit {
  purchaseInvoice: PurchaseInvoice = {
    numberSeries: 'PINV-',
    supplier: '',
    account: '',
    date: new Date().toISOString().slice(0, 16),
    items: [],
    netTotal: 0,
    grandTotal: 0,
    outstandingAmount: 0,
    stockNotReceived: 0,
    notes: '',
    attachment: '',
    returnAgainst: ''
  };

  loading = false;

  // Mock data
  suppliers: string[] = ['Supplier 1', 'Supplier 2', 'Supplier 3'];
  accounts: string[] = ['Expense', 'Cost of Goods Sold', 'Inventory'];
  itemList: string[] = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];
  taxOptions: string[] = ['18%', '12%', '5%', '0%'];

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadPurchaseInvoiceFromStorage();
  }

  private loadPurchaseInvoiceFromStorage(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      const saved = localStorage.getItem('currentPurchaseInvoice');
      if (saved) {
        this.purchaseInvoice = JSON.parse(saved);
      }
    } catch (err) {
      console.error('Error loading purchase invoice:', err);
    }
  }

  addRow(): void {
    const newItem: PurchaseInvoiceItem = {
      id: Date.now().toString(),
      item: '',
      tax: '18%',
      quantity: 1,
      rate: 0,
      amount: 0
    };
    this.purchaseInvoice.items.push(newItem);
  }

  removeRow(index: number): void {
    this.purchaseInvoice.items.splice(index, 1);
    this.calculateTotals();
  }

  updateItemAmount(item: PurchaseInvoiceItem): void {
    item.amount = item.quantity * item.rate;
    this.calculateTotals();
  }

  calculateTotals(): void {
    this.purchaseInvoice.netTotal = this.purchaseInvoice.items.reduce(
      (sum, item) => sum + (item.amount || 0),
      0
    );

    // Simple tax calculation (assuming tax is included in amount for demo)
    const taxAmount = this.purchaseInvoice.items.reduce((sum, item) => {
      const taxRate = parseFloat(item.tax) / 100;
      return sum + (item.amount * taxRate);
    }, 0);

    this.purchaseInvoice.grandTotal = this.purchaseInvoice.netTotal + taxAmount;
    this.purchaseInvoice.outstandingAmount = this.purchaseInvoice.grandTotal;
  }

  submitPurchaseInvoice(): void {
    if (!this.purchaseInvoice.supplier || !this.purchaseInvoice.account) {
      alert('Please fill in all required fields: Supplier and Account');
      return;
    }

    if (this.purchaseInvoice.items.length === 0) {
      alert('Please add at least one item');
      return;
    }

    this.loading = true;

    // Mock API call with 1 second delay
    const mockApiResponse = {
      status: 'success',
      message: 'Purchase invoice created successfully',
      invoiceNumber: 'PINV-' + Date.now().toString().slice(-4)
    };

    of(mockApiResponse)
      .pipe(delay(1000))
      .subscribe((response) => {
        this.loading = false;
        alert(response.message);
        // Clear localStorage and navigate back
        if (isPlatformBrowser(this.platformId)) {
          localStorage.removeItem('currentPurchaseInvoice');
        }
        this.router.navigate(['/purchase/invoices']);
      });
  }

  discardPurchaseInvoice(): void {
    if (confirm('Are you sure you want to discard this purchase invoice?')) {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.removeItem('currentPurchaseInvoice');
      }
      this.router.navigate(['/purchase/invoices']);
    }
  }

  goBackToPurchaseInvoices(): void {
    this.router.navigate(['/purchase/invoices']);
  }

  // ---- MOCK DEMO PURCHASE INVOICE START (generateDemoPurchaseInvoice) ----
  private generateDemoPurchaseInvoice(): PurchaseInvoice {
    return {
      numberSeries: 'PINV-',
      supplier: 'Demo Supplier',
      account: 'Expense',
      date: new Date().toISOString().slice(0, 16),
      items: [
        {
          id: 'item-1',
          item: 'Item 1',
          tax: '18%',
          quantity: 2,
          rate: 1200,
          amount: 2400
        },
        {
          id: 'item-2',
          item: 'Item 2',
          tax: '12%',
          quantity: 1,
          rate: 500,
          amount: 500
        }
      ],
      netTotal: 2900,
      grandTotal: 3256,
      outstandingAmount: 3256,
      stockNotReceived: 0,
      notes: 'Demo purchase invoice for testing',
      attachment: '',
      returnAgainst: ''
    };
  }
  // ---- MOCK DEMO PURCHASE INVOICE END ----
}
