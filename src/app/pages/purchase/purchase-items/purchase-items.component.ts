import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface PurchaseItem {
  id: string;
  name: string;
  category: string;
  description: string;
  unit: string;
  rate: number;
  taxRate: number;
  hsn: string;
  sku: string;
  status: 'Active' | 'Inactive';
  created: string;
  modified: string;
}

@Component({
  selector: 'app-purchase-items',
  templateUrl: './purchase-items.component.html',
  styleUrls: ['./purchase-items.component.css']
})
export class PurchaseItemsComponent implements OnInit {
  private itemsSubject = new BehaviorSubject<PurchaseItem[]>([]);
  items$ = this.itemsSubject.asObservable();

  showForm = false;
  showDetailModal = false;
  selectedItem: PurchaseItem | null = null;
  searchQuery = '';
  filterCategory = '';
  filterStatus = '';

  formData: Partial<PurchaseItem> = {};
  isEditMode = false;

  private categories = ['Raw Materials', 'Components', 'Finished Goods', 'Services', 'Supplies', 'Equipment', 'Other'];
  private units = ['Nos', 'Box', 'Kg', 'Ltr', 'Mtr', 'Unit', 'Set', 'Piece', 'Pack', 'Dozen'];
  private taxRates = [0, 5, 12, 18, 28];
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

  get statusOptions$(): Observable<string[]> {
    return new BehaviorSubject(this.statusOptions).asObservable();
  }

  get filteredItems$(): Observable<PurchaseItem[]> {
    return this.items$.pipe(
      map(items => this.applyFilters(items))
    );
  }

  constructor(private router: Router) {
    this.initializeDemoPurchaseItem();
  }

  ngOnInit(): void {
    this.loadItems();
  }

  private initializeMockData(): void {
    const mockItems: PurchaseItem[] = [
      {
        id: 'pitem-001',
        name: 'Raw Steel',
        category: 'Raw Materials',
        description: 'High-quality steel for manufacturing',
        unit: 'Kg',
        rate: 450,
        taxRate: 5,
        hsn: '7208.90.10',
        sku: 'STEEL-RAW-001',
        status: 'Active',
        created: new Date().toISOString(),
        modified: new Date().toISOString()
      },
      {
        id: 'pitem-002',
        name: 'Electronic Components',
        category: 'Components',
        description: 'PCB, resistors, capacitors and other components',
        unit: 'Box',
        rate: 5000,
        taxRate: 12,
        hsn: '8534.31.00',
        sku: 'COMP-ELEC-001',
        status: 'Active',
        created: new Date().toISOString(),
        modified: new Date().toISOString()
      },
      {
        id: 'pitem-003',
        name: 'Packaging Materials',
        category: 'Supplies',
        description: 'Boxes, padding, and packaging materials',
        unit: 'Set',
        rate: 1200,
        taxRate: 18,
        hsn: '4819.40.90',
        sku: 'PACK-MAT-001',
        status: 'Active',
        created: new Date().toISOString(),
        modified: new Date().toISOString()
      },
      {
        id: 'pitem-004',
        name: 'Quality Assurance Testing',
        category: 'Services',
        description: 'Third-party QA and testing services',
        unit: 'Unit',
        rate: 2500,
        taxRate: 18,
        hsn: '72210000',
        sku: 'QA-TEST-001',
        status: 'Active',
        created: new Date().toISOString(),
        modified: new Date().toISOString()
      }
    ];

    localStorage.setItem('purchaseItems', JSON.stringify(mockItems));
    this.itemsSubject.next(mockItems);
  }

  private loadItems(): void {
    const saved = localStorage.getItem('purchaseItems');
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
    localStorage.setItem('purchaseItems', JSON.stringify(items));
  }

  private applyFilters(items: PurchaseItem[]): PurchaseItem[] {
    return items.filter(item => {
      const matchesSearch = this.searchQuery === '' ||
        item.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesCategory = this.filterCategory === '' ||
        item.category === this.filterCategory;

      const matchesStatus = this.filterStatus === '' ||
        item.status === this.filterStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }

  openForm(): void {
    this.router.navigate(['/purchase/items/new']);
  }

  editItem(item: PurchaseItem): void {
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
      alert('Please fill in all required fields');
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
        } as PurchaseItem;
      }
    } else {
      const newItem: PurchaseItem = {
        id: 'pitem-' + Date.now(),
        name: this.formData.name || '',
        category: this.formData.category || 'Other',
        description: this.formData.description || '',
        unit: this.formData.unit || 'Nos',
        rate: this.formData.rate || 0,
        taxRate: this.formData.taxRate || 18,
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

  deleteItem(item: PurchaseItem): void {
    if (confirm(`Are you sure you want to delete ${item.name}?`)) {
      const items = this.itemsSubject.value.filter(i => i.id !== item.id);
      this.itemsSubject.next(items);
      this.saveItems();
    }
  }

  viewDetails(item: PurchaseItem): void {
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

  // ---- MOCK DEMO PURCHASE ITEM INITIALIZATION (initializeDemoPurchaseItem) ----
  private initializeDemoPurchaseItem(): void {
    const items: PurchaseItem[] = [
      this.generateDemoPurchaseItem()
    ];
    this.itemsSubject.next(items);
  }

  private generateDemoPurchaseItem(): PurchaseItem {
    return {
      id: 'pitem-demo-001',
      name: 'Demo Purchase Item',
      category: 'Raw Materials',
      description: 'Demo item for purchase testing',
      unit: 'Kg',
      rate: 500,
      taxRate: 12,
      hsn: '3004',
      sku: 'PITEM-001',
      status: 'Active',
      created: new Date().toISOString(),
      modified: new Date().toISOString()
    };
  }
  // ---- MOCK DEMO PURCHASE ITEM END ----
}
