import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

interface PaymentReference {
  type: string;
  name: string;
  amount: number;
}

interface Payment {
  numberSeries: string;
  party: string;
  postingDate: string;
  paymentType: string;
  fromAccount: string;
  toAccount: string;
  paymentMethod: string;
  clearanceDate: string;
  referenceNumber: string;
  referenceDate: string;
  amount: number;
  writeOff: number;
  paymentReferences: PaymentReference[];
  attachment: string;
}

@Component({
  selector: 'app-new-payment',
  templateUrl: './new-payment.component.html',
  styleUrls: ['./new-payment.component.css'],
  standalone: false
})
export class NewPaymentComponent implements OnInit {
  payment: Payment = {
    numberSeries: 'PAY-',
    party: '',
    postingDate: new Date().toISOString().slice(0, 16),
    paymentType: '',
    fromAccount: '',
    toAccount: '',
    paymentMethod: '',
    clearanceDate: '',
    referenceNumber: '',
    referenceDate: '',
    amount: 0,
    writeOff: 0,
    paymentReferences: [],
    attachment: ''
  };

  loading = false;

  // Mock data
  parties: string[] = ['Party 1', 'Party 2', 'Party 3'];
  paymentTypes: string[] = ['Payment', 'Advance', 'Refund', 'Adjustment'];
  accounts: string[] = ['Cash', 'Bank Account', 'Credit Card', 'Wallet'];
  paymentMethods: string[] = ['Cash', 'Check', 'Bank Transfer', 'Credit Card', 'Digital Wallet'];

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadPaymentFromStorage();
  }

  private loadPaymentFromStorage(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      const saved = localStorage.getItem('currentPayment');
      if (saved) {
        this.payment = JSON.parse(saved);
      }
    } catch (err) {
      console.error('Error loading payment:', err);
    }
  }

  addPaymentReference(): void {
    const newReference: PaymentReference = {
      type: '',
      name: '',
      amount: 0
    };
    this.payment.paymentReferences.push(newReference);
  }

  removePaymentReference(index: number): void {
    this.payment.paymentReferences.splice(index, 1);
  }

  updateReferenceAmount(reference: PaymentReference): void {
    this.calculateTotals();
  }

  calculateTotals(): void {
    const referenceTotal = this.payment.paymentReferences.reduce(
      (sum, ref) => sum + (ref.amount || 0),
      0
    );
    this.payment.amount = referenceTotal;
  }

  submitPayment(): void {
    if (!this.payment.party || !this.payment.paymentMethod) {
      alert('Please fill in all required fields: Party and Payment Method');
      return;
    }

    this.loading = true;

    // Mock API call with 1 second delay
    const mockApiResponse = {
      status: 'success',
      message: 'Payment recorded successfully',
      paymentNumber: 'PAY-' + Date.now().toString().slice(-4)
    };

    of(mockApiResponse)
      .pipe(delay(1000))
      .subscribe((response) => {
        this.loading = false;
        alert(response.message);
        // Clear localStorage and navigate back
        if (isPlatformBrowser(this.platformId)) {
          localStorage.removeItem('currentPayment');
        }
        this.router.navigate(['/sales/payments']);
      });
  }

  discardPayment(): void {
    if (confirm('Are you sure you want to discard this payment?')) {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.removeItem('currentPayment');
      }
      this.router.navigate(['/sales/payments']);
    }
  }

  goBackToPayments(): void {
    this.router.navigate(['/sales/payments']);
  }

  // ---- MOCK DEMO PAYMENT START (generateDemoPayment) ----
  private generateDemoPayment(): Payment {
    return {
      numberSeries: 'PAY-',
      party: 'Demo Customer',
      postingDate: new Date().toISOString().slice(0, 16),
      paymentType: 'Payment',
      fromAccount: 'Bank Account',
      toAccount: 'Vendor Account',
      paymentMethod: 'Bank Transfer',
      clearanceDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      referenceNumber: 'CHQ-12345',
      referenceDate: new Date().toISOString().slice(0, 10),
      amount: 5000,
      writeOff: 0,
      paymentReferences: [
        {
          type: 'Invoice',
          name: 'INV-001',
          amount: 5000
        }
      ],
      attachment: ''
    };
  }
  // ---- MOCK DEMO PAYMENT END ----
}
