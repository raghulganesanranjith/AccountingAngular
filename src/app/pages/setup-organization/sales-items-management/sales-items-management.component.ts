import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface SalesItem {
  id: string;
  name: string;
  hsn?: string;
  description: string;
  rate: number;
  unit: string;
  tax: string;
  type: 'Sales' | 'Purchase' | 'Both';
  createdDate: string;
}

@Component({
  selector: 'app-sales-items-management',
  templateUrl: './sales-items-management.component.html',
  styleUrls: ['./sales-items-management.component.css']
})
export class SalesItemsManagementComponent implements OnInit {
  items$ = new BehaviorSubject<SalesItem[]>([]);
  selectedItem$ = new BehaviorSubject<SalesItem | null>(null);
  
  showForm = false;
  showModal = false;
  formMode: 'create' | 'edit' = 'create';
  
  mockItems: SalesItem[] = [
    {
      id: '1',
      name: 'Laptop',
      hsn: '8471.30',
      description: 'Dell XPS 13 Laptop',
      rate: 89999,
      unit: 'Nos',
      tax: '5%',
      type: 'Sales',
      createdDate: '2024-01-15'
    },
    {
      id: '2',
      name: 'Office Chair',
      hsn: '9401.71',
      description: 'Ergonomic Office Chair',
      rate: 8500,
      unit: 'Nos',
      tax: '18%',
      type: 'Both',
      createdDate: '2024-01-10'
    },
    {
      id: '3',
      name: 'Desk',
      hsn: '9403.30',
      description: 'Wooden Desk',
      rate: 12000,
      unit: 'Nos',
      tax: '12%',
      type: 'Sales',
      createdDate: '2024-01-05'
    }
  ];

  formData = {
    name: '',
    hsn: '',
    description: '',
    rate: 0,
    unit: 'Nos',
    tax: '18%',
    type: 'Sales' as 'Sales' | 'Purchase' | 'Both'
  };

  units = ['Nos', 'Box', 'Kg', 'Ltr', 'Mtr', 'Unit', 'Set'];
  taxRates = ['0%', '5%', '12%', '18%', '28%'];
  types = ['Sales', 'Purchase', 'Both'];

  constructor() {}

  ngOnInit(): void {
    this.items$.next(this.mockItems);
  }

  openCreateForm(): void {
    this.formMode = 'create';
    this.resetForm();
    this.showForm = true;
  }

  editItem(item: SalesItem): void {
    this.formMode = 'edit';
    this.formData = {
      name: item.name,
      hsn: item.hsn || '',
      description: item.description,
      rate: item.rate,
      unit: item.unit,
      tax: item.tax,
      type: item.type
    };
    this.selectedItem$.next(item);
    this.showForm = true;
  }

  viewItem(item: SalesItem): void {
    this.selectedItem$.next(item);
    this.showModal = true;
  }

  saveItem(): void {
    if (!this.formData.name.trim()) {
      alert('Item name is required');
      return;
    }

    const currentItems = this.items$.value;

    if (this.formMode === 'create') {
      const newItem: SalesItem = {
        id: (currentItems.length + 1).toString(),
        name: this.formData.name,
        hsn: this.formData.hsn,
        description: this.formData.description,
        rate: this.formData.rate,
        unit: this.formData.unit,
        tax: this.formData.tax,
        type: this.formData.type,
        createdDate: new Date().toISOString().split('T')[0]
      };
      this.items$.next([...currentItems, newItem]);
    } else {
      const selectedItem = this.selectedItem$.value;
      if (selectedItem) {
        const updatedItems = currentItems.map(item =>
          item.id === selectedItem.id
            ? {
                ...item,
                name: this.formData.name,
                hsn: this.formData.hsn,
                description: this.formData.description,
                rate: this.formData.rate,
                unit: this.formData.unit,
                tax: this.formData.tax,
                type: this.formData.type
              }
            : item
        );
        this.items$.next(updatedItems);
      }
    }

    this.closeForm();
  }

  deleteItem(id: string): void {
    if (confirm('Are you sure you want to delete this item?')) {
      const updatedItems = this.items$.value.filter(item => item.id !== id);
      this.items$.next(updatedItems);
    }
  }

  closeForm(): void {
    this.showForm = false;
    this.resetForm();
    this.selectedItem$.next(null);
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedItem$.next(null);
  }

  resetForm(): void {
    this.formData = {
      name: '',
      hsn: '',
      description: '',
      rate: 0,
      unit: 'Nos',
      tax: '18%',
      type: 'Sales'
    };
  }

  getStatusColor(type: string): string {
    switch (type) {
      case 'Sales':
        return '#3b82f6';
      case 'Purchase':
        return '#f59e0b';
      case 'Both':
        return '#10b981';
      default:
        return '#6b7280';
    }
  }
}
