import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

interface Customer {
  id: string;
  name: string;
  fullName: string;
  role: string;
  email: string;
  phone: string;
  address: string;
  defaultAccount: string;
  currency: string;
  gstRegistration: string;
  fromLead: string;
  avatar?: string;
  created: string;
}

@Component({
  selector: 'app-new-customer',
  templateUrl: './new-customer.component.html',
  styleUrls: ['./new-customer.component.css'],
  standalone: false
})
export class NewCustomerComponent implements OnInit {
  customer: Customer = {
    id: '',
    name: '',
    fullName: '',
    role: 'Customer',
    email: '',
    phone: '',
    address: '',
    defaultAccount: '',
    currency: 'INR',
    gstRegistration: 'Unregistered',
    fromLead: '',
    avatar: '',
    created: new Date().toISOString()
  };

  loading = false;
  avatarPreview: string | ArrayBuffer | null = null;

  // Mock data
  roles: string[] = ['Customer', 'Supplier', 'Vendor', 'Partner'];
  currencies: string[] = ['INR', 'USD', 'EUR', 'GBP', 'AED'];
  gstOptions: string[] = ['Registered', 'Unregistered', 'Exempt', 'Consumer'];
  accounts: string[] = ['Default Account', 'Account 1', 'Account 2', 'Account 3'];
  leads: string[] = ['Lead 1', 'Lead 2', 'Lead 3', 'Lead 4'];

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadCustomerFromStorage();
  }

  private loadCustomerFromStorage(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      const saved = localStorage.getItem('currentCustomer');
      if (saved) {
        this.customer = JSON.parse(saved);
      }
    } catch (err) {
      console.error('Error loading customer:', err);
    }
  }

  onAvatarChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.avatarPreview = e.target.result;
        this.customer.avatar = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeAvatar(): void {
    this.avatarPreview = null;
    this.customer.avatar = '';
  }

  submitCustomer(): void {
    if (!this.customer.fullName || !this.customer.email) {
      alert('Please fill in all required fields: Full Name and Email');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.customer.email)) {
      alert('Please enter a valid email address');
      return;
    }

    this.loading = true;

    // Mock API call with 1 second delay
    const mockApiResponse = {
      status: 'success',
      message: 'Customer added successfully',
      customerId: 'CUST-' + Date.now().toString().slice(-4)
    };

    of(mockApiResponse)
      .pipe(delay(1000))
      .subscribe((response) => {
        this.loading = false;
        alert(response.message);
        // Clear localStorage and navigate back
        if (isPlatformBrowser(this.platformId)) {
          localStorage.removeItem('currentCustomer');
        }
        this.router.navigate(['/sales/customers']);
      });
  }

  discardCustomer(): void {
    if (confirm('Are you sure you want to discard this customer?')) {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.removeItem('currentCustomer');
      }
      this.router.navigate(['/sales/customers']);
    }
  }

  goBackToCustomers(): void {
    this.router.navigate(['/sales/customers']);
  }

  isValidEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.customer.email);
  }

  // ---- MOCK DEMO CUSTOMER START (generateDemoCustomer) ----
  private generateDemoCustomer(): Customer {
    return {
      id: 'customer-demo-001',
      name: 'democustomer',
      fullName: 'Demo Customer',
      role: 'Customer',
      email: 'demo@customer.com',
      phone: '+91-9876543210',
      address: '123 Demo Street, Demo City, India',
      defaultAccount: 'Default Account',
      currency: 'INR',
      gstRegistration: 'Registered',
      fromLead: 'Lead 1',
      avatar: '',
      created: new Date().toISOString()
    };
  }
  // ---- MOCK DEMO CUSTOMER END ----
}
