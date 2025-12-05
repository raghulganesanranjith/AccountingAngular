import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface PurchasePayment {
  id: string;
  paymentId: string;
  invoiceNo: string;
  supplier: string;
  amount: number;
  paymentMethod: 'Cash' | 'Cheque' | 'Bank Transfer' | 'Credit Card' | 'Digital Wallet';
  paymentDate: string;
  referenceNo: string;
  status: 'Pending' | 'Completed' | 'Failed' | 'Cancelled';
  notes: string;
  created: string;
  modified: string;
}

@Component({
  selector: 'app-purchase-payments',
  templateUrl: './purchase-payments.component.html',
  styleUrls: ['./purchase-payments.component.css']
})
export class PurchasePaymentsComponent implements OnInit {
  private paymentsSubject = new BehaviorSubject<PurchasePayment[]>([]);
  payments$ = this.paymentsSubject.asObservable();

  showForm = false;
  showDetailModal = false;
  selectedPayment: PurchasePayment | null = null;
  searchQuery = '';
  filterStatus = '';

  formData: Partial<PurchasePayment> = {};
  isEditMode = false;

  private statuses = ['Pending', 'Completed', 'Failed', 'Cancelled'];
  private paymentMethods = ['Cash', 'Cheque', 'Bank Transfer', 'Credit Card', 'Digital Wallet'];
  private suppliers = ['Premium Steel Industries', 'Electronics Components Ltd', 'Packaging Experts Global'];

  get statuses$(): Observable<string[]> {
    return new BehaviorSubject(this.statuses).asObservable();
  }

  get paymentMethods$(): Observable<string[]> {
    return new BehaviorSubject(this.paymentMethods).asObservable();
  }

  get suppliers$(): Observable<string[]> {
    return new BehaviorSubject(this.suppliers).asObservable();
  }

  get filteredPayments$(): Observable<PurchasePayment[]> {
    return this.payments$.pipe(
      map(payments => this.applyFilters(payments))
    );
  }

  constructor(private router: Router) {
    this.initializeDemoPurchasePayment();
  }

  ngOnInit(): void {
    this.loadPayments();
  }

  private initializeMockData(): void {
    const mockPayments: PurchasePayment[] = [
      {
        id: 'ppay-001',
        paymentId: 'PAY-2024-001',
        invoiceNo: 'PINV-2024-001',
        supplier: 'Premium Steel Industries',
        amount: 47250,
        paymentMethod: 'Bank Transfer',
        paymentDate: '2024-12-05',
        referenceNo: 'TRF-000123456',
        status: 'Completed',
        notes: 'Payment against invoice PINV-2024-001',
        created: new Date().toISOString(),
        modified: new Date().toISOString()
      },
      {
        id: 'ppay-002',
        paymentId: 'PAY-2024-002',
        invoiceNo: 'PINV-2024-002',
        supplier: 'Electronics Components Ltd',
        amount: 14000,
        paymentMethod: 'Cheque',
        paymentDate: '2024-12-06',
        referenceNo: 'CHK-987654',
        status: 'Completed',
        notes: 'Partial payment - cheque issued',
        created: new Date().toISOString(),
        modified: new Date().toISOString()
      },
      {
        id: 'ppay-003',
        paymentId: 'PAY-2024-003',
        invoiceNo: 'PINV-2024-002',
        supplier: 'Electronics Components Ltd',
        amount: 14000,
        paymentMethod: 'Bank Transfer',
        paymentDate: '2024-12-10',
        referenceNo: 'TRF-000123457',
        status: 'Pending',
        notes: 'Balance payment pending approval',
        created: new Date().toISOString(),
        modified: new Date().toISOString()
      }
    ];

    localStorage.setItem('purchasePayments', JSON.stringify(mockPayments));
    this.paymentsSubject.next(mockPayments);
  }

  private loadPayments(): void {
    const saved = localStorage.getItem('purchasePayments');
    if (saved) {
      try {
        const payments = JSON.parse(saved);
        this.paymentsSubject.next(payments);
      } catch (e) {
        console.error('Error loading payments:', e);
        this.paymentsSubject.next([]);
      }
    }
  }

  private savePayments(): void {
    const payments = this.paymentsSubject.value;
    localStorage.setItem('purchasePayments', JSON.stringify(payments));
  }

  private applyFilters(payments: PurchasePayment[]): PurchasePayment[] {
    return payments.filter(payment => {
      const matchesSearch = this.searchQuery === '' ||
        payment.paymentId.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        payment.invoiceNo.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        payment.supplier.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        payment.referenceNo.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesStatus = this.filterStatus === '' ||
        payment.status === this.filterStatus;

      return matchesSearch && matchesStatus;
    });
  }

  openForm(): void {
    this.router.navigate(['/purchase/payments/new']);
  }

  editPayment(payment: PurchasePayment): void {
    this.isEditMode = true;
    this.formData = { ...payment };
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.formData = {};
    this.isEditMode = false;
  }

  savePayment(): void {
    if (!this.validateForm()) {
      alert('Please fill in required fields');
      return;
    }

    const payments = this.paymentsSubject.value;

    if (this.isEditMode && this.formData.id) {
      const index = payments.findIndex(p => p.id === this.formData.id);
      if (index > -1) {
        payments[index] = {
          ...payments[index],
          ...this.formData,
          modified: new Date().toISOString()
        } as PurchasePayment;
      }
    } else {
      const newPayment: PurchasePayment = {
        id: 'ppay-' + Date.now(),
        paymentId: this.formData.paymentId || `PAY-${Date.now()}`,
        invoiceNo: this.formData.invoiceNo || '',
        supplier: this.formData.supplier || '',
        amount: this.formData.amount || 0,
        paymentMethod: (this.formData.paymentMethod as PurchasePayment['paymentMethod']) || 'Bank Transfer',
        paymentDate: this.formData.paymentDate || new Date().toISOString().split('T')[0],
        referenceNo: this.formData.referenceNo || '',
        status: (this.formData.status as PurchasePayment['status']) || 'Pending',
        notes: this.formData.notes || '',
        created: new Date().toISOString(),
        modified: new Date().toISOString()
      };
      payments.push(newPayment);
    }

    this.paymentsSubject.next([...payments]);
    this.savePayments();
    this.closeForm();
  }

  deletePayment(payment: PurchasePayment): void {
    if (confirm(`Are you sure you want to delete payment ${payment.paymentId}?`)) {
      const payments = this.paymentsSubject.value.filter(p => p.id !== payment.id);
      this.paymentsSubject.next(payments);
      this.savePayments();
    }
  }

  viewDetails(payment: PurchasePayment): void {
    this.selectedPayment = payment;
    this.showDetailModal = true;
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedPayment = null;
  }

  private validateForm(): boolean {
    return !!(
      this.formData.paymentId &&
      this.formData.invoiceNo &&
      this.formData.supplier &&
      this.formData.amount &&
      this.formData.paymentDate
    );
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      'Pending': 'status-pending',
      'Completed': 'status-completed',
      'Failed': 'status-failed',
      'Cancelled': 'status-cancelled'
    };
    return classes[status] || '';
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.filterStatus = '';
  }

  getTotalPayments(): number {
    return this.paymentsSubject.value.reduce((sum, payment) => sum + payment.amount, 0);
  }

  getCompletedPayments(): number {
    return this.paymentsSubject.value
      .filter(p => p.status === 'Completed')
      .reduce((sum, payment) => sum + payment.amount, 0);
  }

  getPendingPayments(): number {
    return this.paymentsSubject.value
      .filter(p => p.status === 'Pending')
      .reduce((sum, payment) => sum + payment.amount, 0);
  }

  // ---- MOCK DEMO PURCHASE PAYMENT INITIALIZATION (initializeDemoPurchasePayment) ----
  private initializeDemoPurchasePayment(): void {
    const payments: PurchasePayment[] = [
      this.generateDemoPurchasePayment()
    ];
    this.paymentsSubject.next(payments);
  }

  private generateDemoPurchasePayment(): PurchasePayment {
    return {
      id: 'ppay-demo-001',
      paymentId: 'PAY-DEMO-001',
      invoiceNo: 'PINV-001',
      supplier: 'Demo Supplier',
      amount: 3500,
      paymentMethod: 'Bank Transfer',
      paymentDate: new Date().toISOString().slice(0, 10),
      referenceNo: 'TRF-000111',
      status: 'Completed',
      notes: 'Demo payment for testing',
      created: new Date().toISOString(),
      modified: new Date().toISOString()
    };
  }
  // ---- MOCK DEMO PURCHASE PAYMENT END ----
}

