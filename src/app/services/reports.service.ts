import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {
  LedgerEntry,
  ColumnField,
  FilterField,
  ReportFilters,
  GeneralLedgerReport,
  ReportData,
  ReportCell,
  ReportRow,
} from './reports.types';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  /**
   * Get General Ledger report data
   */
  getGeneralLedgerReport(filters: ReportFilters): Observable<GeneralLedgerReport> {
    return this.http.post<any>(`${this.apiUrl}/reports/general-ledger`, filters).pipe(
      map(response => ({
        title: 'General Ledger',
        columns: this.getGeneralLedgerColumns(),
        filters: this.getGeneralLedgerFilters(),
        data: response.data || [],
        totals: response.totals || { totalDebit: 0, totalCredit: 0 }
      })),
      catchError(error => {
        console.error('Error fetching general ledger report:', error);
        return of({
          title: 'General Ledger',
          columns: this.getGeneralLedgerColumns(),
          filters: this.getGeneralLedgerFilters(),
          data: [],
          totals: { totalDebit: 0, totalCredit: 0 }
        });
      })
    );
  }

  /**
   * Get mock ledger entries for demonstration
   */
  getMockLedgerEntries(): LedgerEntry[] {
    return [
      {
        account: 'Cash',
        date: '2024-01-01',
        debit: 1000,
        credit: 0,
        balance: 1000,
        referenceType: 'SalesInvoice',
        referenceName: 'SI-001',
        party: 'John Doe',
        reverted: false,
        reverts: ''
      },
      {
        account: 'Sales',
        date: '2024-01-02',
        debit: 0,
        credit: 1000,
        balance: 0,
        referenceType: 'SalesInvoice',
        referenceName: 'SI-001',
        party: 'John Doe',
        reverted: false,
        reverts: ''
      },
      {
        account: 'Accounts Payable',
        date: '2024-01-03',
        debit: 500,
        credit: 0,
        balance: 500,
        referenceType: 'PurchaseInvoice',
        referenceName: 'PI-001',
        party: 'Supplier ABC',
        reverted: false,
        reverts: ''
      },
      {
        account: 'Expenses',
        date: '2024-01-04',
        debit: 200,
        credit: 0,
        balance: 700,
        referenceType: 'JournalEntry',
        referenceName: 'JE-001',
        party: '',
        reverted: false,
        reverts: ''
      }
    ];
  }

  /**
   * Get General Ledger columns
   */
  getGeneralLedgerColumns(): ColumnField[] {
    return [
      {
        label: '#',
        fieldtype: 'Int',
        fieldname: 'index',
        align: 'right',
        width: 0.5,
      },
      {
        label: 'Account',
        fieldtype: 'Link',
        fieldname: 'account',
        width: 1.5,
      },
      {
        label: 'Date',
        fieldtype: 'Date',
        fieldname: 'date',
      },
      {
        label: 'Debit',
        fieldtype: 'Currency',
        fieldname: 'debit',
        align: 'right',
        width: 1.25,
      },
      {
        label: 'Credit',
        fieldtype: 'Currency',
        fieldname: 'credit',
        align: 'right',
        width: 1.25,
      },
      {
        label: 'Balance',
        fieldtype: 'Currency',
        fieldname: 'balance',
        align: 'right',
        width: 1.25,
      },
      {
        label: 'Party',
        fieldtype: 'Link',
        fieldname: 'party',
      },
      {
        label: 'Ref Name',
        fieldtype: 'Data',
        fieldname: 'referenceName',
      },
      {
        label: 'Reference Type',
        fieldtype: 'Data',
        fieldname: 'referenceType',
      },
      {
        label: 'Reverted',
        fieldtype: 'Check',
        fieldname: 'reverted',
      },
    ];
  }

  /**
   * Get General Ledger filters
   */
  getGeneralLedgerFilters(): FilterField[] {
    return [
      {
        fieldtype: 'Select',
        options: [
          { label: 'All', value: 'All' },
          { label: 'Sales Invoices', value: 'SalesInvoice' },
          { label: 'Purchase Invoices', value: 'PurchaseInvoice' },
          { label: 'Payments', value: 'Payment' },
          { label: 'Journal Entries', value: 'JournalEntry' },
          { label: 'Shipment', value: 'Shipment' },
          { label: 'Purchase Receipt', value: 'PurchaseReceipt' }
        ],
        label: 'Reference Type',
        fieldname: 'referenceType',
        placeholder: 'Select reference type',
      },
      {
        fieldtype: 'Text',
        label: 'Reference Name',
        placeholder: 'Reference Name',
        fieldname: 'referenceName',
      },
      {
        fieldtype: 'Text',
        target: 'Account',
        placeholder: 'Account',
        label: 'Account',
        fieldname: 'account',
      },
      {
        fieldtype: 'Text',
        target: 'Party',
        label: 'Party',
        placeholder: 'Party',
        fieldname: 'party',
      },
      {
        fieldtype: 'Date',
        placeholder: 'From Date',
        label: 'From Date',
        fieldname: 'fromDate',
      },
      {
        fieldtype: 'Date',
        placeholder: 'To Date',
        label: 'To Date',
        fieldname: 'toDate',
      },
      {
        fieldtype: 'Select',
        label: 'Group By',
        fieldname: 'groupBy',
        options: [
          { label: 'None', value: 'none' },
          { label: 'Party', value: 'party' },
          { label: 'Account', value: 'account' },
          { label: 'Reference', value: 'referenceName' },
        ],
      },
      {
        fieldtype: 'Check',
        label: 'Include Cancelled',
        fieldname: 'reverted',
      },
      {
        fieldtype: 'Check',
        label: 'Ascending Order',
        fieldname: 'ascending',
      },
    ];
  }

  /**
   * Format currency value
   */
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  }

  /**
   * Format date value
   */
  formatDate(date: Date | string | null): string {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }
}
