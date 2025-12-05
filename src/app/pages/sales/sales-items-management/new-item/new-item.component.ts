import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

interface Item {
  id: string;
  itemName: string;
  itemCode: string;
  purpose: string;
  type: string;
  unitType: string;
  rate: number;
  description: string;
  salesAccount: string;
  purchaseAccount: string;
  tax: string;
  hsn: string;
  avatar?: string;
  created: string;
}

@Component({
  selector: 'app-new-item',
  templateUrl: './new-item.component.html',
  styleUrls: ['./new-item.component.css'],
  standalone: false
})
export class NewItemComponent implements OnInit {
  item: Item = {
    id: '',
    itemName: '',
    itemCode: '',
    purpose: 'Sales',
    type: 'Product',
    unitType: 'Unit',
    rate: 0,
    description: '',
    salesAccount: 'Income',
    purchaseAccount: 'Expense',
    tax: '',
    hsn: '',
    avatar: '',
    created: new Date().toISOString()
  };

  loading = false;
  avatarPreview: string | ArrayBuffer | null = null;

  // Mock data
  purposes: string[] = ['Sales', 'Purchase', 'Both'];
  types: string[] = ['Product', 'Service', 'Raw Material', 'Component'];
  unitTypes: string[] = ['Unit', 'Piece', 'Kg', 'Liter', 'Meter', 'Box', 'Dozen'];
  salesAccounts: string[] = ['Income', 'Sales Revenue', 'Service Income'];
  purchaseAccounts: string[] = ['Expense', 'Cost of Goods Sold', 'Purchase Expense'];
  taxOptions: string[] = ['18%', '12%', '5%', '0%', 'Exempt'];
  hsnCodes: string[] = ['8471', '4901', '3004', '2204', '6204'];

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadItemFromStorage();
  }

  private loadItemFromStorage(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      const saved = localStorage.getItem('currentItem');
      if (saved) {
        this.item = JSON.parse(saved);
      }
    } catch (err) {
      console.error('Error loading item:', err);
    }
  }

  onAvatarChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.avatarPreview = e.target.result;
        this.item.avatar = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeAvatar(): void {
    this.avatarPreview = null;
    this.item.avatar = '';
  }

  submitItem(): void {
    if (!this.item.itemName || !this.item.itemCode) {
      alert('Please fill in all required fields: Item Name and Item Code');
      return;
    }

    this.loading = true;

    // Mock API call with 1 second delay
    const mockApiResponse = {
      status: 'success',
      message: 'Item added successfully',
      itemId: 'ITEM-' + Date.now().toString().slice(-4)
    };

    of(mockApiResponse)
      .pipe(delay(1000))
      .subscribe((response) => {
        this.loading = false;
        alert(response.message);
        // Clear localStorage and navigate back
        if (isPlatformBrowser(this.platformId)) {
          localStorage.removeItem('currentItem');
        }
        this.router.navigate(['/sales/items']);
      });
  }

  discardItem(): void {
    if (confirm('Are you sure you want to discard this item?')) {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.removeItem('currentItem');
      }
      this.router.navigate(['/sales/items']);
    }
  }

  goBackToItems(): void {
    this.router.navigate(['/sales/items']);
  }

  // ---- MOCK DEMO ITEM START (generateDemoItem) ----
  private generateDemoItem(): Item {
    return {
      id: 'item-demo-001',
      itemName: 'Demo Product',
      itemCode: 'DEMO-001',
      purpose: 'Sales',
      type: 'Product',
      unitType: 'Unit',
      rate: 1000,
      description: 'This is a demo item for testing purposes',
      salesAccount: 'Income',
      purchaseAccount: 'Expense',
      tax: '18%',
      hsn: '8471',
      avatar: '',
      created: new Date().toISOString()
    };
  }
  // ---- MOCK DEMO ITEM END ----
}
