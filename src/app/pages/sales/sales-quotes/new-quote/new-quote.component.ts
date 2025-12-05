import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

interface QuoteItem {
  id: string;
  item: string;
  tax: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Quote {
  numberSeries: string;
  customer: string;
  date: string;
  type: string;
  items: QuoteItem[];
  netTotal: number;
  grandTotal: number;
  outstandingAmount: number;
  notes: string;
  attachment: string;
}

@Component({
  selector: 'app-new-quote',
  templateUrl: './new-quote.component.html',
  styleUrls: ['./new-quote.component.css']
})
export class NewQuoteComponent implements OnInit {
  quote: Quote = {
    numberSeries: 'SQUOT-',
    customer: '',
    date: new Date().toISOString().slice(0, 16),
    type: 'Party',
    items: [],
    netTotal: 0,
    grandTotal: 0,
    outstandingAmount: 0,
    notes: '',
    attachment: ''
  };

  customers = ['Customer 1', 'Customer 2', 'Customer 3'];
  itemList = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];
  taxOptions = ['18%', '12%', '5%', '0%'];
  loading = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadQuoteFromStorage();
  }

  loadQuoteFromStorage(): void {
    const saved = localStorage.getItem('currentQuote');
    if (saved) {
      this.quote = JSON.parse(saved);
    }
  }

  saveQuote(): void {
    localStorage.setItem('currentQuote', JSON.stringify(this.quote));
    alert('Quote saved as draft');
  }

  addRow(): void {
    const newItem: QuoteItem = {
      id: 'item-' + Date.now(),
      item: '',
      tax: '18%',
      quantity: 1,
      rate: 0,
      amount: 0
    };
    this.quote.items.push(newItem);
    this.calculateTotals();
  }

  removeRow(index: number): void {
    this.quote.items.splice(index, 1);
    this.calculateTotals();
  }

  updateItemAmount(item: QuoteItem): void {
    item.amount = item.quantity * item.rate;
    this.calculateTotals();
  }

  calculateTotals(): void {
    this.quote.netTotal = this.quote.items.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = this.quote.items.reduce((sum, item) => {
      const taxPercent = parseInt(item.tax) / 100;
      return sum + (item.amount * taxPercent);
    }, 0);
    this.quote.grandTotal = this.quote.netTotal + taxAmount;
    this.quote.outstandingAmount = this.quote.grandTotal;
  }

  submitQuote(): void {
    if (!this.quote.customer.trim()) {
      alert('Please select a customer');
      return;
    }
    if (this.quote.items.length === 0) {
      alert('Please add at least one item');
      return;
    }

    this.loading = true;

    // ---- MOCK API CALL START (generateDemoQuote) ----
    const mockApiResponse = {
      status: 'success',
      message: 'Quote created successfully',
      quoteNumber: 'SQUOT-' + Date.now().toString().slice(-4)
    };

    // Simulate calling API (1s delay)
    of(mockApiResponse)
      .pipe(delay(1000))
      .subscribe((response) => {
        this.loading = false;
        alert(response.message);
        localStorage.removeItem('currentQuote');
        this.router.navigate(['/sales/quotes']);
      });
    // ---- MOCK API CALL END ----
  }

  discardQuote(): void {
    if (confirm('Are you sure you want to discard this quote?')) {
      localStorage.removeItem('currentQuote');
      this.router.navigate(['/sales/quotes']);
    }
  }

  goBackToQuotes(): void {
    this.router.navigate(['/sales/quotes']);
  }
}
