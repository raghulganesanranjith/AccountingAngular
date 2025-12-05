import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Supplier {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gstin: string;
  totalPurchased: number;
  created: string;
  modified: string;
}

@Component({
  selector: 'app-purchase-suppliers',
  templateUrl: './purchase-suppliers.component.html',
  styleUrls: ['./purchase-suppliers.component.css']
})
export class PurchaseSuppliersComponent implements OnInit {
  private suppliersSubject = new BehaviorSubject<Supplier[]>([]);
  suppliers$ = this.suppliersSubject.asObservable();

  showForm = false;
  showDetailModal = false;
  selectedSupplier: Supplier | null = null;
  searchQuery = '';

  formData: Partial<Supplier> = {};
  isEditMode = false;

  private indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  get states(): string[] {
    return this.indianStates;
  }

  get filteredSuppliers$(): Observable<Supplier[]> {
    return this.suppliers$.pipe(
      map(suppliers => this.applyFilters(suppliers))
    );
  }

  constructor(private router: Router) {
    this.initializeDemoSupplier();
  }

  ngOnInit(): void {
    this.loadSuppliers();
  }

  private initializeMockData(): void {
    const mockSuppliers: Supplier[] = [
      {
        name: 'Premium Steel Industries',
        email: 'sales@premiumsteel.com',
        phone: '9123456780',
        address: '100 Industrial Park, Sector 2',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411001',
        gstin: '27AABCT1234A1Z0',
        totalPurchased: 450000,
        created: new Date().toISOString(),
        modified: new Date().toISOString()
      },
      {
        name: 'Electronics Components Ltd',
        email: 'info@electrocomp.com',
        phone: '8234567891',
        address: '245 Tech Complex, Phase 3',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560034',
        gstin: '29AABCT5678A1Z5',
        totalPurchased: 320000,
        created: new Date().toISOString(),
        modified: new Date().toISOString()
      },
      {
        name: 'Packaging Experts Global',
        email: 'contact@packagingexperts.com',
        phone: '7345678912',
        address: '567 Logistics Hub, Block A',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600096',
        gstin: '33AABCT9012A1Z9',
        totalPurchased: 215000,
        created: new Date().toISOString(),
        modified: new Date().toISOString()
      }
    ];

    localStorage.setItem('purchaseSuppliers', JSON.stringify(mockSuppliers));
    this.suppliersSubject.next(mockSuppliers);
  }

  private loadSuppliers(): void {
    const saved = localStorage.getItem('purchaseSuppliers');
    if (saved) {
      try {
        const suppliers = JSON.parse(saved);
        this.suppliersSubject.next(suppliers);
      } catch (e) {
        console.error('Error loading suppliers:', e);
        this.suppliersSubject.next([]);
      }
    }
  }

  private saveSuppliers(): void {
    const suppliers = this.suppliersSubject.value;
    localStorage.setItem('purchaseSuppliers', JSON.stringify(suppliers));
  }

  private applyFilters(suppliers: Supplier[]): Supplier[] {
    return suppliers.filter(supplier => {
      const matchesSearch = this.searchQuery === '' ||
        supplier.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        supplier.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        supplier.phone.includes(this.searchQuery);

      return matchesSearch;
    });
  }

  openForm(): void {
    this.router.navigate(['/purchase/suppliers/new']);
  }

  editSupplier(supplier: Supplier): void {
    this.isEditMode = true;
    this.formData = { ...supplier };
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.formData = {};
    this.isEditMode = false;
  }

  saveSupplier(): void {
    if (!this.validateForm()) {
      alert('Please fill in all required fields (Name, Email, Phone)');
      return;
    }

    const suppliers = this.suppliersSubject.value;

    if (this.isEditMode && this.formData.name) {
      const index = suppliers.findIndex(s => s.name === this.formData.name);
      if (index > -1) {
        suppliers[index] = {
          ...suppliers[index],
          ...this.formData,
          modified: new Date().toISOString()
        } as Supplier;
      }
    } else {
      const newSupplier: Supplier = {
        name: this.formData.name || '',
        email: this.formData.email || '',
        phone: this.formData.phone || '',
        address: this.formData.address || '',
        city: this.formData.city || '',
        state: this.formData.state || '',
        pincode: this.formData.pincode || '',
        gstin: this.formData.gstin || '',
        totalPurchased: 0,
        created: new Date().toISOString(),
        modified: new Date().toISOString()
      };
      suppliers.push(newSupplier);
    }

    this.suppliersSubject.next([...suppliers]);
    this.saveSuppliers();
    this.closeForm();
  }

  deleteSupplier(supplier: Supplier): void {
    if (confirm(`Are you sure you want to delete ${supplier.name}?`)) {
      const suppliers = this.suppliersSubject.value.filter(s => s.name !== supplier.name);
      this.suppliersSubject.next(suppliers);
      this.saveSuppliers();
    }
  }

  viewDetails(supplier: Supplier): void {
    this.selectedSupplier = supplier;
    this.showDetailModal = true;
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedSupplier = null;
  }

  private validateForm(): boolean {
    return !!(
      this.formData.name &&
      this.formData.email &&
      this.formData.phone
    );
  }

  clearFilters(): void {
    this.searchQuery = '';
  }

  // ---- MOCK DEMO SUPPLIER INITIALIZATION (initializeDemoSupplier) ----
  private initializeDemoSupplier(): void {
    const suppliers: Supplier[] = [
      this.generateDemoSupplier()
    ];
    this.suppliersSubject.next(suppliers);
  }

  private generateDemoSupplier(): Supplier {
    return {
      name: 'Demo Supplier',
      email: 'demo@supplier.com',
      phone: '9876543210',
      address: '789 Supply Lane, Industrial Area',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      gstin: '27AABCU1234A1Z0',
      totalPurchased: 250000,
      created: new Date().toISOString(),
      modified: new Date().toISOString()
    };
  }
  // ---- MOCK DEMO SUPPLIER END ----
}
