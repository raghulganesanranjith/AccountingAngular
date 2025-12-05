import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaxTemplateService, TaxTemplate } from '../../../services/tax-template.service';

@Component({
  selector: 'app-tax-templates',
  templateUrl: './tax-templates.component.html',
  styleUrls: ['./tax-templates.component.css']
})
export class TaxTemplatesComponent implements OnInit {
  taxTemplates: TaxTemplate[] = [];
  isLoading = false;
  showAddForm = false;
  editingId: number | null = null;

  newTemplate = {
    name: '',
    description: '',
    taxRate: 0,
    applicableTo: 'Both' as 'Both' | 'Sales' | 'Purchase'
  };

  constructor(
    private taxTemplateService: TaxTemplateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTaxTemplates();
  }

  loadTaxTemplates(): void {
    this.isLoading = true;
    this.taxTemplateService.getTaxTemplates().subscribe({
      next: (templates: TaxTemplate[]) => {
        this.taxTemplates = templates;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading tax templates:', error);
        this.isLoading = false;
      }
    });
  }

  openAddForm(): void {
    this.router.navigate(['/setup/tax-templates/new']);
  }

  resetForm(): void {
    this.newTemplate = {
      name: '',
      description: '',
      taxRate: 0,
      applicableTo: 'Both'
    };
  }

  createTaxTemplate(): void {
    if (!this.newTemplate.name.trim()) {
      alert('Please enter a tax template name');
      return;
    }

    this.taxTemplateService.createTaxTemplate({
      ...this.newTemplate,
      isActive: true
    }).subscribe({
      next: () => {
        this.loadTaxTemplates();
        this.showAddForm = false;
        this.resetForm();
      },
      error: (error: any) => {
        console.error('Error creating tax template:', error);
      }
    });
  }

  editTemplate(template: TaxTemplate): void {
    this.editingId = template.id;
    this.newTemplate = {
      name: template.name,
      description: template.description,
      taxRate: template.taxRate,
      applicableTo: template.applicableTo
    };
    this.showAddForm = true;
  }

  updateTemplate(): void {
    if (this.editingId === null) return;

    this.taxTemplateService.updateTaxTemplate(this.editingId, {
      ...this.newTemplate
    }).subscribe({
      next: () => {
        this.loadTaxTemplates();
        this.showAddForm = false;
        this.editingId = null;
        this.resetForm();
      },
      error: (error: any) => {
        console.error('Error updating tax template:', error);
      }
    });
  }

  deleteTemplate(id: number): void {
    if (confirm('Are you sure you want to delete this tax template?')) {
      this.taxTemplateService.deleteTaxTemplate(id).subscribe({
        next: () => {
          this.loadTaxTemplates();
        },
        error: (error: any) => {
          console.error('Error deleting tax template:', error);
        }
      });
    }
  }

  cancelForm(): void {
    this.showAddForm = false;
    this.editingId = null;
    this.resetForm();
  }

  toggleActiveStatus(template: TaxTemplate): void {
    this.taxTemplateService.updateTaxTemplate(template.id, {
      isActive: !template.isActive
    }).subscribe({
      next: () => {
        this.loadTaxTemplates();
      },
      error: (error: any) => {
        console.error('Error updating tax template status:', error);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/setup']);
  }
}
