import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface CommonItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  unit: string;
  price: number;
  tax: number;
  description: string;
}

@Component({
  selector: 'app-common-items',
  templateUrl: './common-items.component.html',
  styleUrls: ['./common-items.component.css']
})
export class CommonItemsComponent implements OnInit {
  items: CommonItem[] = [];
  showForm = false;
  editingItem: CommonItem | null = null;

  mockItems: CommonItem[] = [
    {
      id: '1',
      name: 'Laptop',
      sku: 'LAP-001',
      category: 'Electronics',
      unit: 'Piece',
      price: 50000,
      tax: 18,
      description: 'Professional Laptop'
    },
    {
      id: '2',
      name: 'Desk Chair',
      sku: 'CHR-001',
      category: 'Furniture',
      unit: 'Piece',
      price: 5000,
      tax: 12,
      description: 'Ergonomic Office Chair'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.items = this.mockItems;
  }

  createNewItem(): void {
    this.router.navigate(['/common/items/new']);
  }

  editItem(item: CommonItem): void {
    this.editingItem = { ...item };
    this.showForm = true;
  }

  deleteItem(item: CommonItem): void {
    if (confirm(`Delete item ${item.name}?`)) {
      this.items = this.items.filter(i => i.id !== item.id);
    }
  }

  closeForm(): void {
    this.showForm = false;
    this.editingItem = null;
  }

  submitForm(): void {
    if (this.editingItem) {
      const index = this.items.findIndex(i => i.id === this.editingItem?.id);
      if (index > -1) {
        this.items[index] = { ...this.editingItem };
      } else {
        this.editingItem.id = 'item-' + Date.now();
        this.items.push({ ...this.editingItem });
      }
    }
    this.closeForm();
  }
}
