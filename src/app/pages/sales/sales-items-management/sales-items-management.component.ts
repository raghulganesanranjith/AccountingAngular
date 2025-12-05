import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

interface SalesItem {
  id: string;
  name: string;
  category: string;
  description: string;
  unit: string;
  rate: number;
  taxRate: number;
  type: 'Sales' | 'Purchase' | 'Both';
  hsn: string;
  sku: string;
  status: 'Active' | 'Inactive';
  created: string;
  modified: string;
}

@Component({
  selector: 'app-sales-items-management',
  templateUrl: './sales-items-management.component.html',
  styleUrls: ['./sales-items-management.component.css']
})
export class SalesItemsManagementComponent implements OnInit {
  private itemsSubject = new BehaviorSubject<SalesItem[]>([]);
  items$ = this.itemsSubject.asObservable();

  showForm = false;
  showDetailModal = false;
  selectedItem: SalesItem | null = null;
  searchQuery = '';
  filterCategory = '';
  filterStatus = '';
  filterType = 'Sales';

  formData: Partial<SalesItem> = {};
  isEditMode = false;

  private categories = [
    'Electronics',
    'Software',
    'Hardware',
    'Services',
    'Supplies',
    'Equipment',
    'Consulting',
    'Support',
    'Other'
  ];

  private units = [
    'Nos', 'Box', 'Kg', 'Ltr', 'Mtr', 'Unit', 'Set', 'Piece', 'Pack', 'Dozen'
  ];

  private taxRates = [0, 5, 12, 18, 28];

  private itemTypes = ['Sales', 'Purchase', 'Both'];

  private statusOptions = ['Active', 'Inactive'];

  get categories$(): Observable<string[]> {
    return new BehaviorSubject(this.categories).asObservable();
  }

  get units$(): Observable<string[]> {
    return new BehaviorSubject(this.units).asObservable();
  }

  get taxRates$(): Observable<number[]> {
    return new BehaviorSubject(this.taxRates).asObservable();
  }

  get itemTypes$(): Observable<string[]> {
    return new BehaviorSubject(this.itemTypes).asObservable();
  }

  get statusOptions$(): Observable<string[]> {
    return new BehaviorSubject(this.statusOptions).asObservable();
  }

  get filteredItems$(): Observable<SalesItem[]> {
    return this.items$.pipe(
      map(items => this.applyFilters(items))
    );
  }

  constructor(private router: Router) {
    this.initializeDemoItem();
  }

  ngOnInit(): void {
    this.loadItems();
  }

  // ---- MOCK DEMO ITEM START (generateDemoItem) ----
  private initializeDemoItem(): void {
    const demoItem = this.generateDemoItem();
    this.itemsSubject.next([demoItem]);
  }

  private generateDemoItem(): SalesItem {
    return {
      id: 'item-demo-001',
      name: 'Demo Product',
      category: 'Electronics',
      description: 'This is a demo item for testing purposes',
      unit: 'Unit',
      rate: 1000,
      taxRate: 18,
      type: 'Sales',
      hsn: '8471',
      sku: 'DEMO-001',
      status: 'Active',
      created: new Date().toISOString(),
      modified: new Date().toISOString()
    };
  }
  // ---- MOCK DEMO ITEM END ----

  private initializeMockData(): void {
    const mockItems: SalesItem[] = [
      {
        id: 'item-001',
        name: 'Laptop',
        category: 'Electronics',
        description: 'High-performance business laptop with 16GB RAM and SSD',
        unit: 'Nos',
        rate: 85000,
        taxRate: 18,
        type: 'Sales',
        hsn: '8471.30.20',
        sku: 'LAPTOP-HP-001',
        status: 'Active',
        created: new Date().toISOString(),
        modified: new Date().toISOString()
      },
      {
        id: 'item-002',
        name: 'Office Chair',
        category: 'Equipment',
        description: 'Ergonomic office chair with adjustable height and back support',
        unit: 'Nos',
        rate: 15000,
        taxRate: 18,
        type: 'Sales',
        hsn: '9401.40.90',
        sku: 'CHAIR-ERG-001',
        status: 'Active',
        created: new Date().toISOString(),
        modified: new Date().toISOString()
      },
      {
        id: 'item-003',
        name: 'Office Desk',
        category: 'Equipment',
        description: 'Wooden office desk with spacious work surface',
        unit: 'Nos',
        rate: 25000,
        taxRate: 12,
        type: 'Sales',
        hsn: '9403.30.90',
        sku: 'DESK-WOOD-001',
        status: 'Active',
        created: new Date().toISOString(),
        modified: new Date().toISOString()
      },
      {
        id: 'item-004',
        name: 'Software License - Annual',
        category: 'Software',
        description: 'Annual software license with support and updates',
        unit: 'Unit',
        rate: 50000,
        taxRate: 18,
        type: 'Both',
        hsn: '49019900',
        sku: 'SOFT-LIC-001',
        status: 'Active',
        created: new Date().toISOString(),
        modified: new Date().toISOString()
      },
      {
        id: 'item-005',
        name: 'Consulting Services',
        category: 'Services',
        description: 'Professional IT consulting and implementation services',
        unit: 'Unit',
        rate: 5000,
        taxRate: 18,
        type: 'Sales',
        hsn: '62090030',
        sku: 'CONS-IT-001',
        status: 'Active',
        created: new Date().toISOString(),
        modified: new Date().toISOString()
      }
    ];

    localStorage.setItem('salesItems', JSON.stringify(mockItems));
    this.itemsSubject.next(mockItems);
  }

  private loadItems(): void {
    const saved = localStorage.getItem('salesItems');
    if (saved) {
      try {
        const items = JSON.parse(saved);
        this.itemsSubject.next(items);
      } catch (e) {
        console.error('Error loading items:', e);
        this.itemsSubject.next([]);
      }
    }
  }

  private saveItems(): void {
    const items = this.itemsSubject.value;
    localStorage.setItem('salesItems', JSON.stringify(items));
  }

  private applyFilters(items: SalesItem[]): SalesItem[] {
    return items.filter(item => {
      const matchesSearch = this.searchQuery === '' ||
        item.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesCategory = this.filterCategory === '' ||
        item.category === this.filterCategory;

      const matchesStatus = this.filterStatus === '' ||
        item.status === this.filterStatus;

      const matchesType = this.filterType === '' ||
        item.type === this.filterType ||
        item.type === 'Both';

      return matchesSearch && matchesCategory && matchesStatus && matchesType;
    });
  }

  openForm(): void {
    this.router.navigate(['/sales/items/new']);
  }

  editItem(item: SalesItem): void {
    this.isEditMode = true;
    this.formData = { ...item };
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.formData = {};
    this.isEditMode = false;
  }

  saveItem(): void {
    if (!this.validateForm()) {
      alert('Please fill in all required fields (Name, Category, Unit, Rate)');
      return;
    }

    const items = this.itemsSubject.value;

    if (this.isEditMode && this.formData.id) {
      const index = items.findIndex(i => i.id === this.formData.id);
      if (index > -1) {
        items[index] = {
          ...items[index],
          ...this.formData,
          modified: new Date().toISOString()
        } as SalesItem;
      }
    } else {
      const newItem: SalesItem = {
        id: 'item-' + Date.now(),
        name: this.formData.name || '',
        category: this.formData.category || 'Other',
        description: this.formData.description || '',
        unit: this.formData.unit || 'Nos',
        rate: this.formData.rate || 0,
        taxRate: this.formData.taxRate || 18,
        type: (this.formData.type as 'Sales' | 'Purchase' | 'Both') || 'Sales',
        hsn: this.formData.hsn || '',
        sku: this.formData.sku || '',
        status: (this.formData.status as 'Active' | 'Inactive') || 'Active',
        created: new Date().toISOString(),
        modified: new Date().toISOString()
      };
      items.push(newItem);
    }

    this.itemsSubject.next([...items]);
    this.saveItems();
    this.closeForm();
  }

  deleteItem(item: SalesItem): void {
    if (confirm(`Are you sure you want to delete ${item.name}?`)) {
      const items = this.itemsSubject.value.filter(i => i.id !== item.id);
      this.itemsSubject.next(items);
      this.saveItems();
    }
  }

  viewDetails(item: SalesItem): void {
    this.selectedItem = item;
    this.showDetailModal = true;
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedItem = null;
  }

  private validateForm(): boolean {
    return !!(
      this.formData.name &&
      this.formData.category &&
      this.formData.unit &&
      this.formData.rate !== undefined &&
      this.formData.rate > 0
    );
  }

  getStatusClass(status: string): string {
    return status === 'Active' ? 'status-active' : 'status-inactive';
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.filterCategory = '';
    this.filterStatus = '';
    this.filterType = 'Sales';
  }

  calculateTaxAmount(rate: number, taxRate: number): number {
    return (rate * taxRate) / 100;
  }

  calculateTotalPrice(rate: number, taxRate: number): number {
    return rate + this.calculateTaxAmount(rate, taxRate);
  }

  getUniqueCategories(): string[] {
    const items = this.itemsSubject.value;
    return [...new Set(items.map(i => i.category))];
  }

  getTotalItemsValue(): number {
    return this.itemsSubject.value.reduce((sum, item) => sum + (item.rate * 1), 0);
  }

  getActiveItemsCount(): number {
    return this.itemsSubject.value.filter(i => i.status === 'Active').length;
  }
}
