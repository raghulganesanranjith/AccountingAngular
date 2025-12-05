import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

interface TaxTemplateRow {
  id: string;
  taxInvoiceAccount: string;
  taxPaymentAccount: string;
  rate: number;
}

interface TaxTemplate {
  id: string;
  name: string;
  rows: TaxTemplateRow[];
  created: string;
}

@Component({
  selector: 'app-new-tax-template',
  templateUrl: './new-tax-template.component.html',
  styleUrls: ['./new-tax-template.component.css'],
  standalone: false
})
export class NewTaxTemplateComponent implements OnInit {
  template: TaxTemplate = {
    id: '',
    name: '',
    rows: [],
    created: new Date().toISOString()
  };

  loading = false;
  showNameError = false;

  // Mock data for dropdowns
  accounts: string[] = ['Sales Account', 'Purchase Account', 'Tax Account', 'GST Input', 'GST Output', 'Revenue Account', 'Expense Account'];

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadTemplateFromStorage();
  }

  private loadTemplateFromStorage(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      const saved = localStorage.getItem('currentTaxTemplate');
      if (saved) {
        this.template = JSON.parse(saved);
      }
    } catch (err) {
      console.error('Error loading tax template:', err);
    }
  }

  addRow(): void {
    const newRow: TaxTemplateRow = {
      id: 'row-' + Date.now(),
      taxInvoiceAccount: '',
      taxPaymentAccount: '',
      rate: 0
    };
    this.template.rows.push(newRow);
  }

  removeRow(rowId: string): void {
    this.template.rows = this.template.rows.filter(r => r.id !== rowId);
  }

  submitTemplate(): void {
    this.showNameError = false;

    if (!this.template.name.trim()) {
      this.showNameError = true;
      return;
    }

    if (this.template.rows.length === 0) {
      alert('Please add at least one tax row');
      return;
    }

    this.loading = true;

    const mockApiResponse = {
      status: 'success',
      message: 'Tax Template added successfully',
      templateId: 'TAX-' + Date.now().toString().slice(-4)
    };

    of(mockApiResponse)
      .pipe(delay(1000))
      .subscribe((response) => {
        this.loading = false;
        alert(response.message);
        if (isPlatformBrowser(this.platformId)) {
          localStorage.removeItem('currentTaxTemplate');
        }
        this.router.navigate(['/setup/tax-templates']);
      });
  }

  discardTemplate(): void {
    if (confirm('Are you sure you want to discard this tax template?')) {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.removeItem('currentTaxTemplate');
      }
      this.router.navigate(['/setup/tax-templates']);
    }
  }

  goBack(): void {
    this.router.navigate(['/setup/tax-templates']);
  }
}
