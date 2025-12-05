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

interface PurchasePayment {
  numberSeries: string;
  supplier: string;
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
  selector: 'app-new-purchase-payment',
  templateUrl: './new-purchase-payment.component.html',
  styleUrls: ['./new-purchase-payment.component.css'],
  standalone: false
})
export class NewPurchasePaymentComponent implements OnInit {
  payment: PurchasePayment = {
    numberSeries: 'PAY-',
    supplier: '',
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
  suppliers: string[] = ['Demo Supplier', 'Supplier 1', 'Supplier 2', 'Supplier 3'];
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
      const saved = localStorage.getItem('currentPurchasePayment');
      if (saved) {
        this.payment = JSON.parse(saved);
      }
    } catch (err) {
      console.error('Error loading purchase payment:', err);
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
    if (!this.payment.supplier || !this.payment.paymentMethod) {
      alert('Please fill in all required fields: Supplier and Payment Method');
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
          localStorage.removeItem('currentPurchasePayment');
        }
        this.router.navigate(['/purchase/payments']);
      });
  }

  discardPayment(): void {
    if (confirm('Are you sure you want to discard this payment?')) {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.removeItem('currentPurchasePayment');
      }
      this.router.navigate(['/purchase/payments']);
    }
  }

  goBackToPayments(): void {
    this.router.navigate(['/purchase/payments']);
  }

  // ---- MOCK DEMO PURCHASE PAYMENT START (generateDemoPurchasePayment) ----
  private generateDemoPurchasePayment(): PurchasePayment {
    return {
      numberSeries: 'PAY-',
      supplier: 'Demo Supplier',
      postingDate: new Date().toISOString().slice(0, 16),
      paymentType: 'Payment',
      fromAccount: 'Bank Account',
      toAccount: 'Vendor Account',
      paymentMethod: 'Bank Transfer',
      clearanceDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      referenceNumber: 'CHQ-12345',
      referenceDate: new Date().toISOString().slice(0, 10),
      amount: 3500,
      writeOff: 0,
      paymentReferences: [
        {
          type: 'Purchase Invoice',
          name: 'PINV-001',
          amount: 3500
        }
      ],
      attachment: ''
    };
  }
  // ---- MOCK DEMO PURCHASE PAYMENT END ----
}
