import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface PrintTemplate {
  id: number;
  name: string;
  documentType: string;
  templateType: string;
  format: string;
  headerText?: string;
  footerText?: string;
  orientation: 'portrait' | 'landscape';
  pageSize: 'A4' | 'Letter' | 'Legal';
  isActive: boolean;
}

interface PrintTemplateForm {
  name: string;
  documentType: string;
  templateType: string;
  format: string;
  headerText: string;
  footerText: string;
  orientation: 'portrait' | 'landscape';
  pageSize: 'A4' | 'Letter' | 'Legal';
}

@Component({
  selector: 'app-print-templates',
  templateUrl: './print-templates.component.html',
  styleUrls: ['./print-templates.component.css'],
  standalone: false
})
export class PrintTemplatesComponent implements OnInit {
  printTemplates: PrintTemplate[] = [];
  isLoading = false;
  showAddForm = false;
  editingId: number | null = null;

  newTemplate: PrintTemplateForm = {
    name: '',
    documentType: '',
    templateType: '',
    format: 'standard',
    headerText: '',
    footerText: '',
    orientation: 'portrait',
    pageSize: 'A4'
  };

  // Document Types
  documentTypes = [
    { value: 'SalesInvoice', label: 'Sales Invoice' },
    { value: 'PurchaseInvoice', label: 'Purchase Invoice' },
    { value: 'SalesQuote', label: 'Sales Quote' },
    { value: 'Payment', label: 'Payment' },
    { value: 'JournalEntry', label: 'Journal Entry' },
    { value: 'Shipment', label: 'Shipment' },
    { value: 'PurchaseReceipt', label: 'Purchase Receipt' },
    { value: 'StockMovement', label: 'Stock Movement' },
    { value: 'POS', label: 'Point of Sale' }
  ];

  templateTypes = [
    { value: 'standard', label: 'Standard' },
    { value: 'compact', label: 'Compact' },
    { value: 'detailed', label: 'Detailed' },
    { value: 'minimal', label: 'Minimal' }
  ];

  orientations = [
    { value: 'portrait', label: 'Portrait' },
    { value: 'landscape', label: 'Landscape' }
  ];

  pageSizes = [
    { value: 'A4', label: 'A4' },
    { value: 'Letter', label: 'Letter' },
    { value: 'Legal', label: 'Legal' }
  ];

  // Mock data for print templates
  private mockPrintTemplates: PrintTemplate[] = [
    {
      id: 1,
      name: 'Sales Invoice - Standard',
      documentType: 'SalesInvoice',
      templateType: 'standard',
      format: 'standard',
      headerText: 'Invoice',
      footerText: 'Thank you for your business',
      orientation: 'portrait',
      pageSize: 'A4',
      isActive: true
    },
    {
      id: 2,
      name: 'Purchase Invoice - Detailed',
      documentType: 'PurchaseInvoice',
      templateType: 'detailed',
      format: 'standard',
      headerText: 'Purchase Invoice',
      footerText: 'Please remit payment',
      orientation: 'portrait',
      pageSize: 'A4',
      isActive: true
    },
    {
      id: 3,
      name: 'Sales Quote - Compact',
      documentType: 'SalesQuote',
      templateType: 'compact',
      format: 'standard',
      headerText: 'Quote',
      footerText: 'Valid for 30 days',
      orientation: 'portrait',
      pageSize: 'A4',
      isActive: true
    },
    {
      id: 4,
      name: 'Payment Receipt',
      documentType: 'Payment',
      templateType: 'minimal',
      format: 'standard',
      headerText: 'Receipt',
      footerText: 'Payment confirmed',
      orientation: 'portrait',
      pageSize: 'Letter',
      isActive: false
    },
    {
      id: 5,
      name: 'Journal Entry Report',
      documentType: 'JournalEntry',
      templateType: 'detailed',
      format: 'standard',
      headerText: 'Journal Entry',
      footerText: 'Authorized signature required',
      orientation: 'landscape',
      pageSize: 'A4',
      isActive: true
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadPrintTemplates();
  }

  loadPrintTemplates(): void {
    this.isLoading = true;
    // Simulate API call
    setTimeout(() => {
      this.printTemplates = [...this.mockPrintTemplates];
      this.isLoading = false;
    }, 300);
  }

  openAddForm(): void {
    this.showAddForm = true;
    this.editingId = null;
    this.resetForm();
  }

  resetForm(): void {
    this.newTemplate = {
      name: '',
      documentType: '',
      templateType: '',
      format: 'standard',
      headerText: '',
      footerText: '',
      orientation: 'portrait',
      pageSize: 'A4'
    };
  }

  cancelForm(): void {
    this.showAddForm = false;
    this.editingId = null;
    this.resetForm();
  }

  createPrintTemplate(): void {
    if (!this.validateForm()) return;

    const newId = Math.max(...this.printTemplates.map(t => t.id), 0) + 1;
    const template: PrintTemplate = {
      id: newId,
      ...this.newTemplate,
      isActive: true
    };

    this.printTemplates.push(template);
    this.cancelForm();
  }

  editTemplate(template: PrintTemplate): void {
    this.editingId = template.id;
    this.newTemplate = {
      name: template.name,
      documentType: template.documentType,
      templateType: template.templateType,
      format: template.format,
      headerText: template.headerText || '',
      footerText: template.footerText || '',
      orientation: template.orientation,
      pageSize: template.pageSize
    };
    this.showAddForm = true;
  }

  updateTemplate(): void {
    if (!this.validateForm()) return;

    if (this.editingId === null) return;

    const index = this.printTemplates.findIndex(t => t.id === this.editingId);
    if (index !== -1) {
      this.printTemplates[index] = {
        ...this.printTemplates[index],
        ...this.newTemplate
      };
    }
    this.cancelForm();
  }

  deleteTemplate(id: number): void {
    if (confirm('Are you sure you want to delete this print template?')) {
      this.printTemplates = this.printTemplates.filter(t => t.id !== id);
    }
  }

  toggleActiveStatus(template: PrintTemplate): void {
    const index = this.printTemplates.findIndex(t => t.id === template.id);
    if (index !== -1) {
      this.printTemplates[index].isActive = !this.printTemplates[index].isActive;
    }
  }

  previewTemplate(template: PrintTemplate): void {
    // In a real app, this would open a preview window
    alert(`Preview: ${template.name}\n\nDocument Type: ${template.documentType}\nTemplate Type: ${template.templateType}\nOrientation: ${template.orientation}\nPage Size: ${template.pageSize}`);
  }

  setAsDefault(template: PrintTemplate): void {
    alert(`${template.name} set as default for ${template.documentType}`);
  }

  private validateForm(): boolean {
    if (!this.newTemplate.name.trim()) {
      alert('Please enter a template name');
      return false;
    }
    if (!this.newTemplate.documentType) {
      alert('Please select a document type');
      return false;
    }
    if (!this.newTemplate.templateType) {
      alert('Please select a template type');
      return false;
    }
    return true;
  }

  saveAsNewTemplate(): void {
    if (!this.validateForm()) return;

    const newId = Math.max(...this.printTemplates.map(t => t.id), 0) + 1;
    const template: PrintTemplate = {
      id: newId,
      ...this.newTemplate,
      isActive: true
    };

    this.printTemplates.push(template);
    alert('Template saved as new');
    this.cancelForm();
  }

  goBack(): void {
    this.router.navigate(['/setup']);
  }

  get documentTypeLabel(): string {
    if (!this.newTemplate.documentType) return '';
    return this.documentTypes.find(d => d.value === this.newTemplate.documentType)?.label || '';
  }

  get templateTypeLabel(): string {
    if (!this.newTemplate.templateType) return '';
    return this.templateTypes.find(t => t.value === this.newTemplate.templateType)?.label || '';
  }
}
