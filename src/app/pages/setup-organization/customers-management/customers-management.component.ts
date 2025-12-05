import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gstin?: string;
  loyaltyPoints: number;
  totalSpent: number;
  createdDate: string;
}

@Component({
  selector: 'app-customers-management',
  templateUrl: './customers-management.component.html',
  styleUrls: ['./customers-management.component.css']
})
export class CustomersManagementComponent implements OnInit {
  customers$ = new BehaviorSubject<Customer[]>([]);
  selectedCustomer$ = new BehaviorSubject<Customer | null>(null);
  
  showForm = false;
  showModal = false;
  formMode: 'create' | 'edit' = 'create';
  
  mockCustomers: Customer[] = [
    {
      id: '1',
      name: 'Acme Corporation',
      email: 'contact@acme.com',
      phone: '+91-9876543210',
      address: '123 Business Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      gstin: '27AAPCT1234H1Z0',
      loyaltyPoints: 5000,
      totalSpent: 50000,
      createdDate: '2024-01-15'
    },
    {
      id: '2',
      name: 'Tech Solutions Pvt Ltd',
      email: 'sales@techsol.com',
      phone: '+91-8765432109',
      address: '456 Innovation Hub',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
      gstin: '29AACCT5678H2Z1',
      loyaltyPoints: 3500,
      totalSpent: 35000,
      createdDate: '2024-01-10'
    },
    {
      id: '3',
      name: 'Global Exports Ltd',
      email: 'info@globalexports.com',
      phone: '+91-7654321098',
      address: '789 Trade Center',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600001',
      gstin: '33AABCT7890H3Z2',
      loyaltyPoints: 2000,
      totalSpent: 20000,
      createdDate: '2024-01-05'
    }
  ];

  formData = {
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    gstin: ''
  };

  states = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 
            'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
            'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
            'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
            'Uttar Pradesh', 'Uttarakhand', 'West Bengal'];

  constructor() {}

  ngOnInit(): void {
    this.customers$.next(this.mockCustomers);
  }

  openCreateForm(): void {
    this.formMode = 'create';
    this.resetForm();
    this.showForm = true;
  }

  editCustomer(customer: Customer): void {
    this.formMode = 'edit';
    this.formData = {
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      state: customer.state,
      pincode: customer.pincode,
      gstin: customer.gstin || ''
    };
    this.selectedCustomer$.next(customer);
    this.showForm = true;
  }

  viewCustomer(customer: Customer): void {
    this.selectedCustomer$.next(customer);
    this.showModal = true;
  }

  saveCustomer(): void {
    if (!this.formData.name.trim() || !this.formData.email.trim()) {
      alert('Customer name and email are required');
      return;
    }

    const currentCustomers = this.customers$.value;

    if (this.formMode === 'create') {
      const newCustomer: Customer = {
        id: (currentCustomers.length + 1).toString(),
        name: this.formData.name,
        email: this.formData.email,
        phone: this.formData.phone,
        address: this.formData.address,
        city: this.formData.city,
        state: this.formData.state,
        pincode: this.formData.pincode,
        gstin: this.formData.gstin,
        loyaltyPoints: 0,
        totalSpent: 0,
        createdDate: new Date().toISOString().split('T')[0]
      };
      this.customers$.next([...currentCustomers, newCustomer]);
    } else {
      const selectedCustomer = this.selectedCustomer$.value;
      if (selectedCustomer) {
        const updatedCustomers = currentCustomers.map(customer =>
          customer.id === selectedCustomer.id
            ? {
                ...customer,
                name: this.formData.name,
                email: this.formData.email,
                phone: this.formData.phone,
                address: this.formData.address,
                city: this.formData.city,
                state: this.formData.state,
                pincode: this.formData.pincode,
                gstin: this.formData.gstin
              }
            : customer
        );
        this.customers$.next(updatedCustomers);
      }
    }

    this.closeForm();
  }

  deleteCustomer(id: string): void {
    if (confirm('Are you sure you want to delete this customer?')) {
      const updatedCustomers = this.customers$.value.filter(customer => customer.id !== id);
      this.customers$.next(updatedCustomers);
    }
  }

  closeForm(): void {
    this.showForm = false;
    this.resetForm();
    this.selectedCustomer$.next(null);
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedCustomer$.next(null);
  }

  resetForm(): void {
    this.formData = {
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      gstin: ''
    };
  }
}
