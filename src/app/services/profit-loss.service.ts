import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { GeneralLedgerReport, FilterField, ColumnField, ReportFilters } from './reports.types';

@Injectable({
  providedIn: 'root'
})
export class ProfitLossService {
  private apiUrl = '/api/reports';

  constructor(private http: HttpClient) {}

  /**
   * Get Profit & Loss Report
   */
  getProfitLossReport(filters: ReportFilters): Observable<GeneralLedgerReport> {
    // For now, return mock data
    // In production, this would call: return this.http.post(`${this.apiUrl}/profit-loss`, filters);
    return of(this.getMockProfitLossData());
  }

  /**
   * Get filter fields for Profit & Loss report
   */
  getProfitLossFilters(): FilterField[] {
    return [
      {
        fieldname: 'fromDate',
        label: 'From Date',
        fieldtype: 'Date',
        placeholder: 'Start Date'
      },
      {
        fieldname: 'toDate',
        label: 'To Date',
        fieldtype: 'Date',
        placeholder: 'End Date'
      },
      {
        fieldname: 'basedOn',
        label: 'Based On',
        fieldtype: 'Select',
        options: [
          { label: 'Until Date', value: 'Until Date' },
          { label: 'Fiscal Year', value: 'Fiscal Year' }
        ]
      },
      {
        fieldname: 'groupBy',
        label: 'Group By',
        fieldtype: 'Select',
        options: [
          { label: 'None', value: 'none' },
          { label: 'Monthly', value: 'Monthly' },
          { label: 'Quarterly', value: 'Quarterly' },
          { label: 'Yearly', value: 'Yearly' }
        ]
      }
    ];
  }

  /**
   * Get column definitions for Profit & Loss report
   */
  getProfitLossColumns(): ColumnField[] {
    return [
      {
        label: 'Account',
        fieldtype: 'Link',
        fieldname: 'account',
        align: 'left',
        width: 2
      },
      {
        label: 'Current Period',
        fieldtype: 'Currency',
        fieldname: 'currentPeriod',
        align: 'right',
        width: 1.25
      },
      {
        label: 'Previous Period',
        fieldtype: 'Currency',
        fieldname: 'previousPeriod',
        align: 'right',
        width: 1.25
      },
      {
        label: 'Variance',
        fieldtype: 'Currency',
        fieldname: 'variance',
        align: 'right',
        width: 1.25
      }
    ];
  }

  /**
   * Mock Profit & Loss Report Data
   */
  private getMockProfitLossData(): GeneralLedgerReport {
    return {
      title: 'Profit & Loss Report',
      columns: this.getProfitLossColumns(),
      filters: this.getProfitLossFilters(),
      data: [
        {
          cells: [
            { value: 'Revenue', rawValue: 'Revenue', align: 'left', width: 2, bold: true },
            { value: '$150,000', rawValue: 150000, align: 'right', width: 1.25 },
            { value: '$120,000', rawValue: 120000, align: 'right', width: 1.25 },
            { value: '$30,000', rawValue: 30000, align: 'right', width: 1.25 }
          ]
        },
        {
          cells: [
            { value: 'Sales', rawValue: 'Sales', align: 'left', width: 2, bold: false },
            { value: '$150,000', rawValue: 150000, align: 'right', width: 1.25 },
            { value: '$120,000', rawValue: 120000, align: 'right', width: 1.25 },
            { value: '$30,000', rawValue: 30000, align: 'right', width: 1.25 }
          ]
        },
        {
          cells: [
            { value: 'Cost of Goods Sold', rawValue: 'Cost of Goods Sold', align: 'left', width: 2, bold: true },
            { value: '$75,000', rawValue: 75000, align: 'right', width: 1.25 },
            { value: '$60,000', rawValue: 60000, align: 'right', width: 1.25 },
            { value: '$15,000', rawValue: 15000, align: 'right', width: 1.25 }
          ]
        },
        {
          cells: [
            { value: 'Gross Profit', rawValue: 'Gross Profit', align: 'left', width: 2, bold: true },
            { value: '$75,000', rawValue: 75000, align: 'right', width: 1.25 },
            { value: '$60,000', rawValue: 60000, align: 'right', width: 1.25 },
            { value: '$15,000', rawValue: 15000, align: 'right', width: 1.25 }
          ]
        },
        {
          cells: [
            { value: 'Operating Expenses', rawValue: 'Operating Expenses', align: 'left', width: 2, bold: true },
            { value: '$25,000', rawValue: 25000, align: 'right', width: 1.25 },
            { value: '$20,000', rawValue: 20000, align: 'right', width: 1.25 },
            { value: '$5,000', rawValue: 5000, align: 'right', width: 1.25 }
          ]
        },
        {
          cells: [
            { value: 'Net Profit', rawValue: 'Net Profit', align: 'left', width: 2, bold: true },
            { value: '$50,000', rawValue: 50000, align: 'right', width: 1.25 },
            { value: '$40,000', rawValue: 40000, align: 'right', width: 1.25 },
            { value: '$10,000', rawValue: 10000, align: 'right', width: 1.25 }
          ]
        }
      ],
      totals: {
        totalDebit: 0,
        totalCredit: 0
      }
    };
  }

  /**
   * Format currency value
   */
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  }

  /**
   * Format date value
   */
  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
