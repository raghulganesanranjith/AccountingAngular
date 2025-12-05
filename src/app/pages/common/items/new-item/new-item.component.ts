import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

interface CommonItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  description: string;
  unit: string;
  price: number;
  tax: number;
  hsn: string;
  type: string;
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
  item: CommonItem = {
    id: '',
    name: '',
    sku: '',
    category: 'Electronics',
    description: '',
    unit: 'Piece',
    price: 0,
    tax: 18,
    hsn: '',
    type: 'Product',
    avatar: '',
    created: new Date().toISOString()
  };

  loading = false;
  avatarPreview: string | ArrayBuffer | null = null;

  // Mock data
  categories: string[] = ['Electronics', 'Furniture', 'Raw Materials', 'Components', 'Services', 'Supplies', 'Equipment', 'Other'];
  units: string[] = ['Piece', 'Unit', 'Box', 'Kg', 'Liter', 'Meter', 'Dozen', 'Set', 'Pack', 'Nos'];
  types: string[] = ['Product', 'Service', 'Raw Material', 'Component'];
  taxRates: number[] = [0, 5, 12, 18, 28];
  hsnCodes: string[] = ['8471', '4901', '3004', '2204', '6204', '7208', '8534'];

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
      const saved = localStorage.getItem('currentCommonItem');
      if (saved) {
        this.item = JSON.parse(saved);
      }
    } catch (err) {
      console.error('Error loading common item:', err);
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
    if (!this.item.name || !this.item.sku) {
      alert('Please fill in all required fields: Item Name and SKU');
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
          localStorage.removeItem('currentCommonItem');
        }
        this.router.navigate(['/common/items']);
      });
  }

  discardItem(): void {
    if (confirm('Are you sure you want to discard this item?')) {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.removeItem('currentCommonItem');
      }
      this.router.navigate(['/common/items']);
    }
  }

  goBackToItems(): void {
    this.router.navigate(['/common/items']);
  }

  // ---- MOCK DEMO ITEM START ----
  private generateDemoItem(): CommonItem {
    return {
      id: 'item-demo-001',
      name: 'Demo Item',
      sku: 'ITEM-001',
      category: 'Electronics',
      description: 'Demo Common Item',
      unit: 'Piece',
      price: 10000,
      tax: 18,
      hsn: '8471',
      type: 'Product',
      avatar: '',
      created: new Date().toISOString()
    };
  }
  // ---- MOCK DEMO ITEM END ----
}
