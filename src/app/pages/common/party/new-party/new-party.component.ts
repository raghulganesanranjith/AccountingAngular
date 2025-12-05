import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

interface Party {
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
  selector: 'app-new-party',
  templateUrl: './new-party.component.html',
  styleUrls: ['./new-party.component.css'],
  standalone: false
})
export class NewPartyComponent implements OnInit {
  party: Party = {
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
  roles: string[] = ['Customer', 'Supplier', 'Vendor', 'Partner', 'Employee', 'Contractor'];
  currencies: string[] = ['INR', 'USD', 'EUR', 'GBP', 'AED'];
  gstOptions: string[] = ['Registered', 'Unregistered', 'Exempt', 'Consumer'];
  accounts: string[] = ['Default Account', 'Account 1', 'Account 2', 'Account 3'];
  leads: string[] = ['Lead 1', 'Lead 2', 'Lead 3', 'Lead 4'];

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadPartyFromStorage();
  }

  private loadPartyFromStorage(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      const saved = localStorage.getItem('currentParty');
      if (saved) {
        this.party = JSON.parse(saved);
      }
    } catch (err) {
      console.error('Error loading party:', err);
    }
  }

  onAvatarChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.avatarPreview = e.target.result;
        this.party.avatar = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeAvatar(): void {
    this.avatarPreview = null;
    this.party.avatar = '';
  }

  submitParty(): void {
    if (!this.party.fullName || !this.party.email) {
      alert('Please fill in all required fields: Full Name and Email');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.party.email)) {
      alert('Please enter a valid email address');
      return;
    }

    this.loading = true;

    // Mock API call with 1 second delay
    const mockApiResponse = {
      status: 'success',
      message: 'Party added successfully',
      partyId: 'PARTY-' + Date.now().toString().slice(-4)
    };

    of(mockApiResponse)
      .pipe(delay(1000))
      .subscribe((response) => {
        this.loading = false;
        alert(response.message);
        // Clear localStorage and navigate back
        if (isPlatformBrowser(this.platformId)) {
          localStorage.removeItem('currentParty');
        }
        this.router.navigate(['/common/party']);
      });
  }

  discardParty(): void {
    if (confirm('Are you sure you want to discard this party?')) {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.removeItem('currentParty');
      }
      this.router.navigate(['/common/party']);
    }
  }

  goBackToParties(): void {
    this.router.navigate(['/common/party']);
  }

  isValidEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.party.email);
  }

  // ---- MOCK DEMO PARTY START (generateDemoParty) ----
  private generateDemoParty(): Party {
    return {
      id: 'party-demo-001',
      name: 'demoparty',
      fullName: 'Demo Party',
      role: 'Customer',
      email: 'demo@party.com',
      phone: '+91-9876543210',
      address: '789 Party Lane, Party City, India',
      defaultAccount: 'Default Account',
      currency: 'INR',
      gstRegistration: 'Registered',
      fromLead: 'Lead 1',
      avatar: '',
      created: new Date().toISOString()
    };
  }
  // ---- MOCK DEMO PARTY END ----
}
