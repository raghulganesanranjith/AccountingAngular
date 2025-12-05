import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

interface Supplier {
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
  selector: 'app-new-supplier',
  templateUrl: './new-supplier.component.html',
  styleUrls: ['./new-supplier.component.css'],
  standalone: false
})
export class NewSupplierComponent implements OnInit {
  supplier: Supplier = {
    id: '',
    name: '',
    fullName: '',
    role: 'Supplier',
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
  roles: string[] = ['Supplier', 'Vendor', 'Partner', 'Contractor'];
  currencies: string[] = ['INR', 'USD', 'EUR', 'GBP', 'AED'];
  gstOptions: string[] = ['Registered', 'Unregistered', 'Exempt', 'Consumer'];
  accounts: string[] = ['Default Account', 'Account 1', 'Account 2', 'Account 3'];
  leads: string[] = ['Lead 1', 'Lead 2', 'Lead 3', 'Lead 4'];

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadSupplierFromStorage();
  }

  private loadSupplierFromStorage(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      const saved = localStorage.getItem('currentSupplier');
      if (saved) {
        this.supplier = JSON.parse(saved);
      }
    } catch (err) {
      console.error('Error loading supplier:', err);
    }
  }

  onAvatarChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.avatarPreview = e.target.result;
        this.supplier.avatar = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeAvatar(): void {
    this.avatarPreview = null;
    this.supplier.avatar = '';
  }

  submitSupplier(): void {
    if (!this.supplier.fullName || !this.supplier.email) {
      alert('Please fill in all required fields: Full Name and Email');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.supplier.email)) {
      alert('Please enter a valid email address');
      return;
    }

    this.loading = true;

    // Mock API call with 1 second delay
    const mockApiResponse = {
      status: 'success',
      message: 'Supplier added successfully',
      supplierId: 'SUPP-' + Date.now().toString().slice(-4)
    };

    of(mockApiResponse)
      .pipe(delay(1000))
      .subscribe((response) => {
        this.loading = false;
        alert(response.message);
        // Clear localStorage and navigate back
        if (isPlatformBrowser(this.platformId)) {
          localStorage.removeItem('currentSupplier');
        }
        this.router.navigate(['/purchase/suppliers']);
      });
  }

  discardSupplier(): void {
    if (confirm('Are you sure you want to discard this supplier?')) {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.removeItem('currentSupplier');
      }
      this.router.navigate(['/purchase/suppliers']);
    }
  }

  goBackToSuppliers(): void {
    this.router.navigate(['/purchase/suppliers']);
  }

  isValidEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.supplier.email);
  }

  // ---- MOCK DEMO SUPPLIER START (generateDemoSupplier) ----
  private generateDemoSupplier(): Supplier {
    return {
      id: 'supplier-demo-001',
      name: 'demosupplier',
      fullName: 'Demo Supplier',
      role: 'Supplier',
      email: 'demo@supplier.com',
      phone: '+91-9876543210',
      address: '456 Supply Road, Supply City, India',
      defaultAccount: 'Default Account',
      currency: 'INR',
      gstRegistration: 'Registered',
      fromLead: 'Lead 1',
      avatar: '',
      created: new Date().toISOString()
    };
  }
  // ---- MOCK DEMO SUPPLIER END ----
}
