import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

interface PurchaseInvoiceItem {
  item: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface PurchaseInvoice {
  id: string;
  invoiceNo: string;
  date: string;
  supplier: string;
  items: PurchaseInvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  status: 'Draft' | 'Submitted' | 'Paid' | 'Unpaid' | 'PartlyPaid' | 'Cancelled';
  dueDate: string;
  notes: string;
  created: string;
  modified: string;
}

@Component({
  selector: 'app-purchase-invoices',
  templateUrl: './purchase-invoices.component.html',
  styleUrls: ['./purchase-invoices.component.css']
})
export class PurchaseInvoicesComponent implements OnInit {
  private invoicesSubject = new BehaviorSubject<PurchaseInvoice[]>([]);
  invoices$ = this.invoicesSubject.asObservable();

  showForm = false;
  showDetailModal = false;
  selectedInvoice: PurchaseInvoice | null = null;
  searchQuery = '';
  filterStatus = '';

  formData: Partial<PurchaseInvoice> = {};
  isEditMode = false;

  private statuses = ['Draft', 'Submitted', 'Paid', 'Unpaid', 'PartlyPaid', 'Cancelled'];
  private suppliers = ['Premium Steel Industries', 'Electronics Components Ltd', 'Packaging Experts Global'];

  get statuses$(): Observable<string[]> {
    return new BehaviorSubject(this.statuses).asObservable();
  }

  get suppliers$(): Observable<string[]> {
    return new BehaviorSubject(this.suppliers).asObservable();
  }

  get filteredInvoices$(): Observable<PurchaseInvoice[]> {
    return this.invoices$.pipe(
      map(invoices => this.applyFilters(invoices))
    );
  }

  constructor(private router: Router) {
    this.initializeDemoPurchaseInvoice();
  }

  ngOnInit(): void {
    this.loadInvoices();
  }

  // ---- MOCK DEMO PURCHASE INVOICE START (generateDemoPurchaseInvoice) ----
  private initializeDemoPurchaseInvoice(): void {
    const demoPurchaseInvoice = this.generateDemoPurchaseInvoice();
    this.invoicesSubject.next([demoPurchaseInvoice]);
  }

  private generateDemoPurchaseInvoice(): PurchaseInvoice {
    return {
      id: 'pinv-demo-001',
      invoiceNo: 'PINV-DEMO-001',
      date: new Date().toISOString().slice(0, 10),
      supplier: 'Demo Supplier',
      items: [
        { item: 'Item 1', quantity: 2, rate: 1200, amount: 2400 },
        { item: 'Item 2', quantity: 1, rate: 500, amount: 500 }
      ],
      subtotal: 2900,
      taxRate: 18,
      taxAmount: 522,
      total: 3422,
      status: 'Draft',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      notes: 'Demo purchase invoice for testing',
      created: new Date().toISOString(),
      modified: new Date().toISOString()
    };
  }
  // ---- MOCK DEMO PURCHASE INVOICE END ----

  private initializeMockData(): void {
    const mockInvoices: PurchaseInvoice[] = [
      {
        id: 'pinv-001',
        invoiceNo: 'PINV-2024-001',
        date: '2024-12-01',
        supplier: 'Premium Steel Industries',
        items: [
          { item: 'Raw Steel', quantity: 100, rate: 450, amount: 45000 }
        ],
        subtotal: 45000,
        taxRate: 5,
        taxAmount: 2250,
        total: 47250,
        status: 'Paid',
        dueDate: '2024-12-15',
        notes: 'Standard delivery terms apply',
        created: new Date().toISOString(),
        modified: new Date().toISOString()
      },
      {
        id: 'pinv-002',
        invoiceNo: 'PINV-2024-002',
        date: '2024-12-02',
        supplier: 'Electronics Components Ltd',
        items: [
          { item: 'Electronic Components', quantity: 5, rate: 5000, amount: 25000 }
        ],
        subtotal: 25000,
        taxRate: 12,
        taxAmount: 3000,
        total: 28000,
        status: 'Unpaid',
        dueDate: '2024-12-20',
        notes: 'Payment terms: Net 30',
        created: new Date().toISOString(),
        modified: new Date().toISOString()
      }
    ];

    localStorage.setItem('purchaseInvoices', JSON.stringify(mockInvoices));
    this.invoicesSubject.next(mockInvoices);
  }

  private loadInvoices(): void {
    const saved = localStorage.getItem('purchaseInvoices');
    if (saved) {
      try {
        const invoices = JSON.parse(saved);
        this.invoicesSubject.next(invoices);
      } catch (e) {
        console.error('Error loading invoices:', e);
        this.invoicesSubject.next([]);
      }
    }
  }

  private saveInvoices(): void {
    const invoices = this.invoicesSubject.value;
    localStorage.setItem('purchaseInvoices', JSON.stringify(invoices));
  }

  private applyFilters(invoices: PurchaseInvoice[]): PurchaseInvoice[] {
    return invoices.filter(invoice => {
      const matchesSearch = this.searchQuery === '' ||
        invoice.invoiceNo.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        invoice.supplier.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesStatus = this.filterStatus === '' ||
        invoice.status === this.filterStatus;

      return matchesSearch && matchesStatus;
    });
  }

  openForm(): void {
    this.router.navigate(['/purchase/invoices/new']);
  }

  editInvoice(invoice: PurchaseInvoice): void {
    this.isEditMode = true;
    this.formData = { ...invoice };
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.formData = {};
    this.isEditMode = false;
  }

  saveInvoice(): void {
    if (!this.validateForm()) {
      alert('Please fill in required fields');
      return;
    }

    const invoices = this.invoicesSubject.value;

    if (this.isEditMode && this.formData.id) {
      const index = invoices.findIndex(i => i.id === this.formData.id);
      if (index > -1) {
        invoices[index] = {
          ...invoices[index],
          ...this.formData,
          modified: new Date().toISOString()
        } as PurchaseInvoice;
      }
    } else {
      const newInvoice: PurchaseInvoice = {
        id: 'pinv-' + Date.now(),
        invoiceNo: this.formData.invoiceNo || `PINV-${Date.now()}`,
        date: this.formData.date || new Date().toISOString().split('T')[0],
        supplier: this.formData.supplier || '',
        items: this.formData.items || [],
        subtotal: this.formData.subtotal || 0,
        taxRate: this.formData.taxRate || 10,
        taxAmount: this.calculateTaxAmount(this.formData.subtotal || 0, this.formData.taxRate || 10),
        total: this.calculateTotal(this.formData.subtotal || 0, this.formData.taxRate || 10),
        status: (this.formData.status as PurchaseInvoice['status']) || 'Draft',
        dueDate: this.formData.dueDate || '',
        notes: this.formData.notes || '',
        created: new Date().toISOString(),
        modified: new Date().toISOString()
      };
      invoices.push(newInvoice);
    }

    this.invoicesSubject.next([...invoices]);
    this.saveInvoices();
    this.closeForm();
  }

  deleteInvoice(invoice: PurchaseInvoice): void {
    if (confirm(`Are you sure you want to delete ${invoice.invoiceNo}?`)) {
      const invoices = this.invoicesSubject.value.filter(i => i.id !== invoice.id);
      this.invoicesSubject.next(invoices);
      this.saveInvoices();
    }
  }

  viewDetails(invoice: PurchaseInvoice): void {
    this.selectedInvoice = invoice;
    this.showDetailModal = true;
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedInvoice = null;
  }

  private validateForm(): boolean {
    return !!(
      this.formData.invoiceNo &&
      this.formData.supplier &&
      this.formData.date
    );
  }

  private calculateTaxAmount(subtotal: number, taxRate: number): number {
    return (subtotal * taxRate) / 100;
  }

  private calculateTotal(subtotal: number, taxRate: number): number {
    return subtotal + this.calculateTaxAmount(subtotal, taxRate);
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      'Draft': 'status-draft',
      'Submitted': 'status-submitted',
      'Paid': 'status-paid',
      'Unpaid': 'status-unpaid',
      'PartlyPaid': 'status-partly-paid',
      'Cancelled': 'status-cancelled'
    };
    return classes[status] || '';
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.filterStatus = '';
  }

  getTotalPurchased(): number {
    return this.invoicesSubject.value.reduce((sum, inv) => sum + inv.total, 0);
  }

  getPaidCount(): number {
    return this.invoicesSubject.value.filter(i => i.status === 'Paid').length;
  }

  getPendingCount(): number {
    return this.invoicesSubject.value.filter(i => ['Unpaid', 'PartlyPaid', 'Draft'].includes(i.status)).length;
  }
}
