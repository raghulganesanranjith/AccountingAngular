import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface ImportRowData {
  id: string;
  [key: string]: any;
}

interface ImportResult {
  name: string;
  error?: string;
}

@Component({
  selector: 'app-import-wizard',
  templateUrl: './import-wizard.component.html',
  styleUrls: ['./import-wizard.component.css'],
  standalone: false
})
export class ImportWizardComponent implements OnInit {
  // UI State
  showColumnPicker = false;
  complete = false;
  isMakingEntries = false;
  percentLoading = 0;
  messageLoading = '';

  // Data
  importType = '';
  fileName = '';
  file: { name: string; text: string } | null = null;
  success: string[] = [];
  failed: ImportResult[] = [];
  rows: ImportRowData[] = [];
  columnHeaders: string[] = [];
  assignedColumns: { [key: number]: string | null } = {};
  selectedColumns: Set<string> = new Set();

  // Import Types
  importableTypes = [
    { value: 'sales', label: 'Sales Invoice' },
    { value: 'purchase', label: 'Purchase Invoice' },
    { value: 'payment', label: 'Payment' },
    { value: 'party', label: 'Party' },
    { value: 'item', label: 'Item' },
    { value: 'journal', label: 'Journal Entry' },
    { value: 'tax', label: 'Tax' },
    { value: 'account', label: 'Account' },
    { value: 'address', label: 'Address' },
    { value: 'numberseries', label: 'Number Series' }
  ];

  // Column definitions by import type
  columnDefinitions: { [key: string]: string[] } = {
    sales: ['Date', 'Party', 'Item', 'Quantity', 'Rate', 'Description'],
    purchase: ['Date', 'Party', 'Item', 'Quantity', 'Rate', 'Description'],
    payment: ['Date', 'Party', 'Amount', 'Reference', 'Description'],
    party: ['Name', 'Email', 'Phone', 'Address', 'City'],
    item: ['Name', 'SKU', 'Unit', 'Rate', 'Description'],
    journal: ['Date', 'Account', 'Debit', 'Credit', 'Description'],
    tax: ['Name', 'Rate', 'Type', 'Description'],
    account: ['Name', 'Type', 'Parent', 'Description'],
    address: ['Name', 'Address Line 1', 'City', 'State', 'Postal Code'],
    numberseries: ['Name', 'Prefix', 'Start Number', 'Description']
  };

  constructor(private router: Router) {}

  ngOnInit(): void {}

  setImportType(type: string): void {
    this.clear();
    if (!type) return;

    this.importType = type;
    this.columnHeaders = this.columnDefinitions[type] || [];
  }

  selectFile(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const text = e.target.result;
      this.parseCSV(text, file.name);
    };
    reader.readAsText(file);
  }

  parseCSV(text: string, fileName: string): void {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      alert('Invalid CSV file. Must contain headers and data.');
      return;
    }

    const headers = lines[0].split(',').map(h => h.trim());
    this.rows = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const row: ImportRowData = { id: `row_${i}` };

      headers.forEach((header, idx) => {
        row[header] = values[idx] || '';
      });

      this.rows.push(row);
    }

    this.file = { name: fileName, text };
    this.fileName = fileName;
  }

  toggleColumn(column: string): void {
    if (this.selectedColumns.has(column)) {
      this.selectedColumns.delete(column);
    } else {
      this.selectedColumns.add(column);
    }
  }

  assignColumn(columnIndex: number, assignedField: string | null): void {
    this.assignedColumns[columnIndex] = assignedField;
  }

  addRow(): void {
    const newRow: ImportRowData = { id: `row_${Date.now()}` };
    this.columnHeaders.forEach(col => {
      newRow[col] = '';
    });
    this.rows.push(newRow);
  }

  removeRow(index: number): void {
    this.rows.splice(index, 1);
  }

  async performImport(): Promise<void> {
    if (!this.validateImport()) {
      return;
    }

    this.isMakingEntries = true;
    this.success = [];
    this.failed = [];

    const total = this.rows.length;
    for (let i = 0; i < total; i++) {
      this.percentLoading = (i + 1) / total;
      this.messageLoading = `${i + 1} entries processed out of ${total}...`;

      try {
        await this.processRow(this.rows[i]);
        this.success.push(`${this.importType}_${i + 1}`);
      } catch (error: any) {
        this.failed.push({
          name: `${this.importType}_${i + 1}`,
          error: error.message
        });
      }
    }

    this.isMakingEntries = false;
    this.complete = true;
  }

  private validateImport(): boolean {
    if (!this.importType) {
      alert('Please select an import type');
      return false;
    }

    if (this.rows.length === 0) {
      alert('No data to import. Please select a file or add rows.');
      return false;
    }

    return true;
  }

  private async processRow(row: ImportRowData): Promise<void> {
    // Simulate API call to save data
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Validate required fields exist
        const requiredFields = this.columnHeaders.slice(0, 2);
        for (const field of requiredFields) {
          if (!row[field] || row[field] === '') {
            reject(new Error(`Missing required field: ${field}`));
            return;
          }
        }
        resolve();
      }, 100);
    });
  }

  saveTemplate(): void {
    if (!this.importType) {
      alert('Please select an import type');
      return;
    }

    const template = this.generateCSVTemplate();
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${this.importType}_template.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  private generateCSVTemplate(): string {
    return this.columnHeaders.join(',') + '\n' + 
           this.columnHeaders.map(() => '').join(',');
  }

  clearSuccessfullyImportedEntries(): void {
    this.rows = this.rows.filter((row: ImportRowData) => {
      const firstField = this.columnHeaders[0];
      return !this.success.some(s => s.includes(row[firstField]));
    });
    this.complete = false;
  }

  clear(): void {
    this.file = null;
    this.success = [];
    this.failed = [];
    this.rows = [];
    this.assignedColumns = {};
    this.selectedColumns.clear();
    this.fileName = '';
    this.importType = '';
    this.complete = false;
    this.isMakingEntries = false;
    this.percentLoading = 0;
    this.messageLoading = '';
  }

  goBack(): void {
    this.router.navigate(['/setup']);
  }

  showMe(): void {
    this.clear();
    this.router.navigate(['/setup']);
  }

  get hasImporter(): boolean {
    return !!this.importType;
  }

  get canImportData(): boolean {
    return this.rows.length > 0 && this.importType !== '';
  }

  get errorMessage(): string {
    if (!this.importType) {
      return 'Please select an import type';
    }
    if (this.rows.length === 0 && this.fileName === '') {
      return 'Please select a file or add rows';
    }
    return '';
  }

  get helperMessage(): string {
    if (!this.importType) {
      return 'Set an Import Type';
    }
    if (!this.fileName) {
      return '';
    }
    return this.fileName;
  }
}
