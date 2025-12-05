import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface TaxTemplate {
  id: number;
  name: string;
  description: string;
  taxRate: number;
  applicableTo: 'Sales' | 'Purchase' | 'Both';
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TaxTemplateService {
  private taxTemplatesSubject = new BehaviorSubject<TaxTemplate[]>([]);
  public taxTemplates$ = this.taxTemplatesSubject.asObservable();

  constructor() {
    this.loadMockData();
  }

  private loadMockData(): void {
    const mockTemplates: TaxTemplate[] = [
      {
        id: 1,
        name: 'GST @ 5%',
        description: 'Goods and Services Tax - 5% rate',
        taxRate: 5,
        applicableTo: 'Both',
        isActive: true
      },
      {
        id: 2,
        name: 'GST @ 12%',
        description: 'Goods and Services Tax - 12% rate',
        taxRate: 12,
        applicableTo: 'Both',
        isActive: true
      },
      {
        id: 3,
        name: 'GST @ 18%',
        description: 'Goods and Services Tax - 18% rate',
        taxRate: 18,
        applicableTo: 'Both',
        isActive: true
      },
      {
        id: 4,
        name: 'GST @ 28%',
        description: 'Goods and Services Tax - 28% rate',
        taxRate: 28,
        applicableTo: 'Both',
        isActive: true
      },
      {
        id: 5,
        name: 'VAT @ 10%',
        description: 'Value Added Tax - 10% rate',
        taxRate: 10,
        applicableTo: 'Sales',
        isActive: true
      },
      {
        id: 6,
        name: 'Sales Tax @ 15%',
        description: 'Sales Tax - 15% rate',
        taxRate: 15,
        applicableTo: 'Sales',
        isActive: false
      }
    ];
    this.taxTemplatesSubject.next(mockTemplates);
  }

  getTaxTemplates(): Observable<TaxTemplate[]> {
    return this.taxTemplates$;
  }

  createTaxTemplate(template: Omit<TaxTemplate, 'id'>): Observable<TaxTemplate> {
    const templates = this.taxTemplatesSubject.value;
    const newTemplate: TaxTemplate = {
      ...template,
      id: Math.max(...templates.map(t => t.id), 0) + 1
    };
    this.taxTemplatesSubject.next([...templates, newTemplate]);
    return new BehaviorSubject(newTemplate).asObservable();
  }

  updateTaxTemplate(id: number, template: Partial<TaxTemplate>): Observable<TaxTemplate> {
    const templates = this.taxTemplatesSubject.value;
    const index = templates.findIndex(t => t.id === id);
    if (index !== -1) {
      templates[index] = { ...templates[index], ...template };
      this.taxTemplatesSubject.next([...templates]);
      return new BehaviorSubject(templates[index]).asObservable();
    }
    return new BehaviorSubject<any>(null).asObservable();
  }

  deleteTaxTemplate(id: number): Observable<boolean> {
    const templates = this.taxTemplatesSubject.value;
    const filtered = templates.filter(t => t.id !== id);
    this.taxTemplatesSubject.next(filtered);
    return new BehaviorSubject(true).asObservable();
  }
}
