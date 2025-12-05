import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { DemoDataManagerService } from '../../../services/demo-data-manager.service';

interface SalesPaymentItem {
  item: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface SalesPayment {
  id: string;
  paymentId: string;
  invoiceNo: string;
  customer: string;
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
  selector: 'app-sales-payments',
  templateUrl: './sales-payments.component.html',
  styleUrls: ['./sales-payments.component.css'],
  standalone: false
})
export class SalesPaymentsComponent implements OnInit, OnDestroy {
  private paymentsSubject = new BehaviorSubject<SalesPayment[]>([]);
  payments$ = this.paymentsSubject.asObservable();
  demoPayments$ = new BehaviorSubject<SalesPayment[]>([]);
  private destroy$ = new Subject<void>();

  showForm = false;
  showDetailModal = false;
  selectedPayment: SalesPayment | null = null;
  searchQuery = '';
  filterStatus = '';

  formData: Partial<SalesPayment> = {};
  isEditMode = false;

  private statuses = ['Pending', 'Completed', 'Failed', 'Cancelled'];
  private paymentMethods = ['Cash', 'Cheque', 'Bank Transfer', 'Credit Card', 'Digital Wallet'];
  private customers = ['TechCorp Ltd', 'Global Solutions Inc', 'Digital Innovations'];

  get statuses$(): Observable<string[]> {
    return new BehaviorSubject(this.statuses).asObservable();
  }

  get paymentMethods$(): Observable<string[]> {
    return new BehaviorSubject(this.paymentMethods).asObservable();
  }

  get customers$(): Observable<string[]> {
    return new BehaviorSubject(this.customers).asObservable();
  }

  get filteredPayments$(): Observable<SalesPayment[]> {
    return this.payments$.pipe(
      map(payments => this.applyFilters(payments))
    );
  }

  constructor(
    private router: Router,
    private demoDataManager: DemoDataManagerService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.initializeDemoPayments();
  }

  ngOnInit(): void {
    this.loadPayments();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ---- DEMO PAYMENTS ARRAY ----
  private initializeDemoPayments(): void {
    const demoPayments: SalesPayment[] = [
      {
        id: 'payment-demo-001',
        paymentId: 'PAY-DEMO-001',
        invoiceNo: 'SINV-DEMO-001',
        customer: 'Demo Customer',
        amount: 3190,
        paymentMethod: 'Bank Transfer',
        paymentDate: new Date().toISOString().slice(0, 10),
        referenceNo: 'TRF-001',
        status: 'Completed',
        notes: 'Demo payment for testing',
        created: new Date().toISOString(),
        modified: new Date().toISOString()
      },
      {
        id: 'payment-demo-002',
        paymentId: 'PAY-DEMO-002',
        invoiceNo: 'SINV-DEMO-002',
        customer: 'ABC Corporation',
        amount: 110000,
        paymentMethod: 'Cheque',
        paymentDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        referenceNo: 'CHQ-00456',
        status: 'Completed',
        notes: 'Partial payment received',
        created: new Date().toISOString(),
        modified: new Date().toISOString()
      }
    ];

    this.demoDataManager.registerDemoRecords('payment', 'sales', demoPayments);
    this.demoPayments$.next(demoPayments);
    this.paymentsSubject.next(demoPayments);
  }

  private subscribeToDemo(): void {
    this.demoDataManager.getDemoRecords('payment')
      .pipe(takeUntil(this.destroy$))
      .subscribe((payments: any[]) => {
        if (payments.length > 0) {
          this.demoPayments$.next(payments);
          this.paymentsSubject.next(payments);
        }
      });
  }

  private initializeMockData(): void {
    const mockPayments: SalesPayment[] = [
      {
        id: 'spay-001',
        paymentId: 'PAY-2024-001',
        invoiceNo: 'SINV-2024-001',
        customer: 'TechCorp Ltd',
        amount: 50000,
        paymentMethod: 'Bank Transfer',
        paymentDate: '2024-12-01',
        referenceNo: 'TRF-000123456',
        status: 'Completed',
        notes: 'Payment received for invoice SINV-2024-001',
        created: new Date().toISOString(),
        modified: new Date().toISOString()
      },
      {
        id: 'spay-002',
        paymentId: 'PAY-2024-002',
        invoiceNo: 'SINV-2024-002',
        customer: 'Global Solutions Inc',
        amount: 75000,
        paymentMethod: 'Cheque',
        paymentDate: '2024-12-02',
        referenceNo: 'CHK-123456',
        status: 'Completed',
        notes: 'Cheque received - #123456',
        created: new Date().toISOString(),
        modified: new Date().toISOString()
      },
      {
        id: 'spay-003',
        paymentId: 'PAY-2024-003',
        invoiceNo: 'SINV-2024-003',
        customer: 'Digital Innovations',
        amount: 35000,
        paymentMethod: 'Digital Wallet',
        paymentDate: '2024-12-03',
        referenceNo: 'TXN-987654321',
        status: 'Pending',
        notes: 'Payment pending verification',
        created: new Date().toISOString(),
        modified: new Date().toISOString()
      }
    ];

    localStorage.setItem('salesPayments', JSON.stringify(mockPayments));
    this.paymentsSubject.next(mockPayments);
  }

  private loadPayments(): void {
    this.subscribeToDemo();
    const saved = localStorage.getItem('salesPayments');
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
    localStorage.setItem('salesPayments', JSON.stringify(payments));
  }

  private applyFilters(payments: SalesPayment[]): SalesPayment[] {
    return payments.filter(payment => {
      const matchesSearch = this.searchQuery === '' ||
        payment.paymentId.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        payment.invoiceNo.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        payment.customer.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        payment.referenceNo.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesStatus = this.filterStatus === '' ||
        payment.status === this.filterStatus;

      return matchesSearch && matchesStatus;
    });
  }

  openForm(): void {
    this.showForm = true;
    this.isEditMode = false;
    this.formData = {
      paymentId: '',
      invoiceNo: '',
      customer: '',
      amount: 0,
      paymentMethod: 'Bank Transfer',
      paymentDate: new Date().toISOString().slice(0, 10),
      referenceNo: '',
      status: 'Pending',
      notes: ''
    };
  }

  editPayment(payment: SalesPayment): void {
    this.isEditMode = true;
    this.formData = { ...payment };
    this.showForm = true;
  }

  /**
   * Click handler for demo payment row
   * Opens the form inline with demo data pre-filled
   */
  openDemoPayment(payment: SalesPayment): void {
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
        } as SalesPayment;
      }
    } else {
      const newPayment: SalesPayment = {
        id: 'spay-' + Date.now(),
        paymentId: this.formData.paymentId || `PAY-${Date.now()}`,
        invoiceNo: this.formData.invoiceNo || '',
        customer: this.formData.customer || '',
        amount: this.formData.amount || 0,
        paymentMethod: (this.formData.paymentMethod as SalesPayment['paymentMethod']) || 'Bank Transfer',
        paymentDate: this.formData.paymentDate || new Date().toISOString().split('T')[0],
        referenceNo: this.formData.referenceNo || '',
        status: (this.formData.status as SalesPayment['status']) || 'Pending',
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

  deletePayment(payment: SalesPayment): void {
    if (confirm(`Are you sure you want to delete payment ${payment.paymentId}?`)) {
      const payments = this.paymentsSubject.value.filter(p => p.id !== payment.id);
      this.paymentsSubject.next(payments);
      this.savePayments();
    }
  }

  viewDetails(payment: SalesPayment): void {
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
      this.formData.customer &&
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
}
