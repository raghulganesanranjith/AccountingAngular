import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

interface Customer {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gstin: string;
  loyaltyPoints: number;
  totalSpent: number;
  created: string;
  modified: string;
}

@Component({
  selector: 'app-sales-customers',
  templateUrl: './sales-customers.component.html',
  styleUrls: ['./sales-customers.component.css']
})
export class SalesCustomersComponent implements OnInit {
  private customersSubject = new BehaviorSubject<Customer[]>([]);
  customers$ = this.customersSubject.asObservable();

  showForm = false;
  showDetailModal = false;
  selectedCustomer: Customer | null = null;
  searchQuery = '';
  filterEmail = '';
  filterPhone = '';

  formData: Partial<Customer> = {};
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

  get filteredCustomers$(): Observable<Customer[]> {
    return this.customers$.pipe(
      map(customers => this.applyFilters(customers))
    );
  }

  constructor(private router: Router) {
    this.initializeDemoCustomer();
  }

  ngOnInit(): void {
    this.loadCustomers();
  }

  // ---- MOCK DEMO CUSTOMER START (generateDemoCustomer) ----
  private initializeDemoCustomer(): void {
    const demoCustomer = this.generateDemoCustomer();
    this.customersSubject.next([demoCustomer]);
  }

  private generateDemoCustomer(): Customer {
    return {
      name: 'Demo Customer',
      email: 'demo@customer.com',
      phone: '+91-9876543210',
      address: '123 Demo Street, Demo City',
      city: 'Demo City',
      state: 'Maharashtra',
      pincode: '400001',
      gstin: '27AABCT1234A1Z0',
      loyaltyPoints: 0,
      totalSpent: 0,
      created: new Date().toISOString(),
      modified: new Date().toISOString()
    };
  }
  // ---- MOCK DEMO CUSTOMER END ----

  private initializeMockData(): void {
    const mockCustomers: Customer[] = [
      {
        name: 'Acme Corporation',
        email: 'contact@acme.com',
        phone: '9876543210',
        address: '123 Business Park, Tech Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        gstin: '27AABCT1234A1Z0',
        loyaltyPoints: 2500,
        totalSpent: 125000,
        created: new Date().toISOString(),
        modified: new Date().toISOString()
      },
      {
        name: 'Tech Solutions Ltd',
        email: 'info@techsolutions.com',
        phone: '8765432109',
        address: '456 Innovation Hub, Silicon Valley Road',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
        gstin: '29AABCT5678A1Z5',
        loyaltyPoints: 3200,
        totalSpent: 185000,
        created: new Date().toISOString(),
        modified: new Date().toISOString()
      },
      {
        name: 'Global Exports Inc',
        email: 'sales@globalexports.com',
        phone: '7654321098',
        address: '789 Trade Center, Export Zone',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600001',
        gstin: '33AABCT9012A1Z9',
        loyaltyPoints: 1800,
        totalSpent: 95000,
        created: new Date().toISOString(),
        modified: new Date().toISOString()
      }
    ];

    localStorage.setItem('salesCustomers', JSON.stringify(mockCustomers));
    this.customersSubject.next(mockCustomers);
  }

  private loadCustomers(): void {
    const saved = localStorage.getItem('salesCustomers');
    if (saved) {
      try {
        const customers = JSON.parse(saved);
        this.customersSubject.next(customers);
      } catch (e) {
        console.error('Error loading customers:', e);
        this.customersSubject.next([]);
      }
    }
  }

  private saveCustomers(): void {
    const customers = this.customersSubject.value;
    localStorage.setItem('salesCustomers', JSON.stringify(customers));
  }

  private applyFilters(customers: Customer[]): Customer[] {
    return customers.filter(customer => {
      const matchesSearch = this.searchQuery === '' ||
        customer.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        customer.phone.includes(this.searchQuery);

      const matchesEmail = this.filterEmail === '' ||
        customer.email.toLowerCase().includes(this.filterEmail.toLowerCase());

      const matchesPhone = this.filterPhone === '' ||
        customer.phone.includes(this.filterPhone);

      return matchesSearch && matchesEmail && matchesPhone;
    });
  }

  openForm(): void {
    this.router.navigate(['/sales/customers/new']);
  }

  editCustomer(customer: Customer): void {
    this.isEditMode = true;
    this.formData = { ...customer };
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.formData = {};
    this.isEditMode = false;
  }

  saveCustomer(): void {
    if (!this.validateForm()) {
      alert('Please fill in all required fields (Name, Email, Phone)');
      return;
    }

    const customers = this.customersSubject.value;

    if (this.isEditMode && this.formData.name) {
      const index = customers.findIndex(c => c.name === this.formData.name);
      if (index > -1) {
        customers[index] = {
          ...customers[index],
          ...this.formData,
          modified: new Date().toISOString()
        } as Customer;
      }
    } else {
      const newCustomer: Customer = {
        name: this.formData.name || '',
        email: this.formData.email || '',
        phone: this.formData.phone || '',
        address: this.formData.address || '',
        city: this.formData.city || '',
        state: this.formData.state || '',
        pincode: this.formData.pincode || '',
        gstin: this.formData.gstin || '',
        loyaltyPoints: 0,
        totalSpent: 0,
        created: new Date().toISOString(),
        modified: new Date().toISOString()
      };
      customers.push(newCustomer);
    }

    this.customersSubject.next([...customers]);
    this.saveCustomers();
    this.closeForm();
  }

  deleteCustomer(customer: Customer): void {
    if (confirm(`Are you sure you want to delete ${customer.name}?`)) {
      const customers = this.customersSubject.value.filter(c => c.name !== customer.name);
      this.customersSubject.next(customers);
      this.saveCustomers();
    }
  }

  viewDetails(customer: Customer): void {
    this.selectedCustomer = customer;
    this.showDetailModal = true;
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedCustomer = null;
  }

  private validateForm(): boolean {
    return !!(
      this.formData.name &&
      this.formData.email &&
      this.formData.phone
    );
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  getLoyaltyTier(points: number): string {
    if (points >= 3000) return 'Gold';
    if (points >= 2000) return 'Silver';
    return 'Standard';
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.filterEmail = '';
    this.filterPhone = '';
  }
}
