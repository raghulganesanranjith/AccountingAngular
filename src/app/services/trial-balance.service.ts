import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { GeneralLedgerReport, FilterField, ColumnField } from './reports.types';

export interface TrialBalanceEntry {
  account: string;
  openingDebit: number;
  openingCredit: number;
  debit: number;
  credit: number;
  closingDebit: number;
  closingCredit: number;
}

@Injectable({
  providedIn: 'root'
})
export class TrialBalanceService {

  constructor() { }

  /**
   * Get Trial Balance Report
   */
  getTrialBalanceReport(filters: any): Observable<GeneralLedgerReport> {
    const reportData = this.getMockTrialBalanceData();
    return of(reportData);
  }

  /**
   * Get Trial Balance Filter Fields
   */
  getTrialBalanceFilters(): FilterField[] {
    return [
      {
        fieldtype: 'Date',
        label: 'From Date',
        fieldname: 'fromDate',
        placeholder: 'Select from date'
      },
      {
        fieldtype: 'Date',
        label: 'To Date',
        fieldname: 'toDate',
        placeholder: 'Select to date'
      },
      {
        fieldtype: 'Checkbox',
        label: 'Hide Group Amounts',
        fieldname: 'hideGroupAmounts'
      }
    ];
  }

  /**
   * Get Trial Balance Column Fields
   */
  getTrialBalanceColumns(): ColumnField[] {
    return [
      { label: 'Account', fieldtype: 'Link', fieldname: 'account', align: 'left', width: 2 },
      { label: 'Opening (Dr)', fieldtype: 'Currency', fieldname: 'openingDebit', align: 'right', width: 1.2 },
      { label: 'Opening (Cr)', fieldtype: 'Currency', fieldname: 'openingCredit', align: 'right', width: 1.2 },
      { label: 'Debit', fieldtype: 'Currency', fieldname: 'debit', align: 'right', width: 1.2 },
      { label: 'Credit', fieldtype: 'Currency', fieldname: 'credit', align: 'right', width: 1.2 },
      { label: 'Closing (Dr)', fieldtype: 'Currency', fieldname: 'closingDebit', align: 'right', width: 1.2 },
      { label: 'Closing (Cr)', fieldtype: 'Currency', fieldname: 'closingCredit', align: 'right', width: 1.2 }
    ];
  }

  /**
   * Mock Trial Balance Data
   */
  private getMockTrialBalanceData(): GeneralLedgerReport {
    return {
      title: 'Trial Balance',
      columns: this.getTrialBalanceColumns(),
      filters: this.getTrialBalanceFilters(),
      data: [
        // Assets
        {
          cells: [
            { value: 'ASSETS', rawValue: 'ASSETS', align: 'left', width: 2, bold: true },
            { value: '', rawValue: 0, align: 'right', width: 1.2 },
            { value: '', rawValue: 0, align: 'right', width: 1.2 },
            { value: '', rawValue: 0, align: 'right', width: 1.2 },
            { value: '', rawValue: 0, align: 'right', width: 1.2 },
            { value: '', rawValue: 0, align: 'right', width: 1.2 },
            { value: '', rawValue: 0, align: 'right', width: 1.2 }
          ]
        },
        {
          cells: [
            { value: 'Cash & Bank', rawValue: 'Cash & Bank', align: 'left', width: 2, bold: true },
            { value: '$50,000', rawValue: 50000, align: 'right', width: 1.2 },
            { value: '$0', rawValue: 0, align: 'right', width: 1.2 },
            { value: '$150,000', rawValue: 150000, align: 'right', width: 1.2 },
            { value: '$0', rawValue: 0, align: 'right', width: 1.2 },
            { value: '$200,000', rawValue: 200000, align: 'right', width: 1.2, bold: true },
            { value: '$0', rawValue: 0, align: 'right', width: 1.2, bold: true }
          ]
        },
        {
          cells: [
            { value: 'Accounts Receivable', rawValue: 'AR', align: 'left', width: 2, bold: true },
            { value: '$80,000', rawValue: 80000, align: 'right', width: 1.2 },
            { value: '$0', rawValue: 0, align: 'right', width: 1.2 },
            { value: '$120,000', rawValue: 120000, align: 'right', width: 1.2 },
            { value: '$50,000', rawValue: 50000, align: 'right', width: 1.2 },
            { value: '$150,000', rawValue: 150000, align: 'right', width: 1.2, bold: true },
            { value: '$0', rawValue: 0, align: 'right', width: 1.2, bold: true }
          ]
        },
        {
          cells: [
            { value: 'Inventory', rawValue: 'Inventory', align: 'left', width: 2, bold: true },
            { value: '$120,000', rawValue: 120000, align: 'right', width: 1.2 },
            { value: '$0', rawValue: 0, align: 'right', width: 1.2 },
            { value: '$300,000', rawValue: 300000, align: 'right', width: 1.2 },
            { value: '$200,000', rawValue: 200000, align: 'right', width: 1.2 },
            { value: '$220,000', rawValue: 220000, align: 'right', width: 1.2, bold: true },
            { value: '$0', rawValue: 0, align: 'right', width: 1.2, bold: true }
          ]
        },
        {
          cells: [
            { value: 'Fixed Assets', rawValue: 'Fixed Assets', align: 'left', width: 2, bold: true },
            { value: '$500,000', rawValue: 500000, align: 'right', width: 1.2 },
            { value: '$0', rawValue: 0, align: 'right', width: 1.2 },
            { value: '$0', rawValue: 0, align: 'right', width: 1.2 },
            { value: '$0', rawValue: 0, align: 'right', width: 1.2 },
            { value: '$500,000', rawValue: 500000, align: 'right', width: 1.2, bold: true },
            { value: '$0', rawValue: 0, align: 'right', width: 1.2, bold: true }
          ]
        },
        {
          cells: [
            { value: '', rawValue: '', align: 'left' }
          ],
          isEmpty: true
        },
        // Liabilities
        {
          cells: [
            { value: 'LIABILITIES', rawValue: 'LIABILITIES', align: 'left', width: 2, bold: true },
            { value: '', rawValue: 0, align: 'right', width: 1.2 },
            { value: '', rawValue: 0, align: 'right', width: 1.2 },
            { value: '', rawValue: 0, align: 'right', width: 1.2 },
            { value: '', rawValue: 0, align: 'right', width: 1.2 },
            { value: '', rawValue: 0, align: 'right', width: 1.2 },
            { value: '', rawValue: 0, align: 'right', width: 1.2 }
          ]
        },
        {
          cells: [
            { value: 'Accounts Payable', rawValue: 'AP', align: 'left', width: 2, bold: true },
            { value: '$0', rawValue: 0, align: 'right', width: 1.2 },
            { value: '$40,000', rawValue: 40000, align: 'right', width: 1.2 },
            { value: '$0', rawValue: 0, align: 'right', width: 1.2 },
            { value: '$80,000', rawValue: 80000, align: 'right', width: 1.2 },
            { value: '$0', rawValue: 0, align: 'right', width: 1.2, bold: true },
            { value: '$120,000', rawValue: 120000, align: 'right', width: 1.2, bold: true }
          ]
        },
        {
          cells: [
            { value: 'Short-term Debt', rawValue: 'ST Debt', align: 'left', width: 2, bold: true },
            { value: '$0', rawValue: 0, align: 'right', width: 1.2 },
            { value: '$100,000', rawValue: 100000, align: 'right', width: 1.2 },
            { value: '$0', rawValue: 0, align: 'right', width: 1.2 },
            { value: '$0', rawValue: 0, align: 'right', width: 1.2 },
            { value: '$0', rawValue: 0, align: 'right', width: 1.2, bold: true },
            { value: '$100,000', rawValue: 100000, align: 'right', width: 1.2, bold: true }
          ]
        },
        {
          cells: [
            { value: 'Long-term Debt', rawValue: 'LT Debt', align: 'left', width: 2, bold: true },
            { value: '$0', rawValue: 0, align: 'right', width: 1.2 },
            { value: '$200,000', rawValue: 200000, align: 'right', width: 1.2 },
            { value: '$0', rawValue: 0, align: 'right', width: 1.2 },
            { value: '$0', rawValue: 0, align: 'right', width: 1.2 },
            { value: '$0', rawValue: 0, align: 'right', width: 1.2, bold: true },
            { value: '$200,000', rawValue: 200000, align: 'right', width: 1.2, bold: true }
          ]
        },
        {
          cells: [
            { value: '', rawValue: '', align: 'left' }
          ],
          isEmpty: true
        },
        // Income
        {
          cells: [
            { value: 'INCOME', rawValue: 'INCOME', align: 'left', width: 2, bold: true },
            { value: '', rawValue: 0, align: 'right', width: 1.2 },
            { value: '', rawValue: 0, align: 'right', width: 1.2 },
            { value: '', rawValue: 0, align: 'right', width: 1.2 },
            { value: '', rawValue: 0, align: 'right', width: 1.2 },
            { value: '', rawValue: 0, align: 'right', width: 1.2 },
            { value: '', rawValue: 0, align: 'right', width: 1.2 }
          ]
        },
        {
          cells: [
            { value: 'Sales Revenue', rawValue: 'Sales', align: 'left', width: 2, bold: true },
            { value: '$0', rawValue: 0, align: 'right', width: 1.2 },
            { value: '$500,000', rawValue: 500000, align: 'right', width: 1.2 },
            { value: '$0', rawValue: 0, align: 'right', width: 1.2 },
            { value: '$600,000', rawValue: 600000, align: 'right', width: 1.2 },
            { value: '$0', rawValue: 0, align: 'right', width: 1.2, bold: true },
            { value: '$1,100,000', rawValue: 1100000, align: 'right', width: 1.2, bold: true }
          ]
        },
        {
          cells: [
            { value: 'Service Income', rawValue: 'Service', align: 'left', width: 2, bold: true },
            { value: '$0', rawValue: 0, align: 'right', width: 1.2 },
            { value: '$150,000', rawValue: 150000, align: 'right', width: 1.2 },
            { value: '$0', rawValue: 0, align: 'right', width: 1.2 },
            { value: '$200,000', rawValue: 200000, align: 'right', width: 1.2 },
            { value: '$0', rawValue: 0, align: 'right', width: 1.2, bold: true },
            { value: '$350,000', rawValue: 350000, align: 'right', width: 1.2, bold: true }
          ]
        },
        {
          cells: [
            { value: '', rawValue: '', align: 'left' }
          ],
          isEmpty: true
        },
        // Expenses
        {
          cells: [
            { value: 'EXPENSES', rawValue: 'EXPENSES', align: 'left', width: 2, bold: true },
            { value: '', rawValue: 0, align: 'right', width: 1.2 },
            { value: '', rawValue: 0, align: 'right', width: 1.2 },
            { value: '', rawValue: 0, align: 'right', width: 1.2 },
            { value: '', rawValue: 0, align: 'right', width: 1.2 },
            { value: '', rawValue: 0, align: 'right', width: 1.2 },
            { value: '', rawValue: 0, align: 'right', width: 1.2 }
          ]
        },
        {
          cells: [
            { value: 'Cost of Goods Sold', rawValue: 'COGS', align: 'left', width: 2, bold: true },
            { value: '$0', rawValue: 0, align: 'right', width: 1.2 },
            { value: '$0', rawValue: 0, align: 'right', width: 1.2 },
            { value: '$300,000', rawValue: 300000, align: 'right', width: 1.2 },
            { value: '$0', rawValue: 0, align: 'right', width: 1.2 },
            { value: '$300,000', rawValue: 300000, align: 'right', width: 1.2, bold: true },
            { value: '$0', rawValue: 0, align: 'right', width: 1.2, bold: true }
          ]
        },
        {
          cells: [
            { value: 'Salary Expense', rawValue: 'Salary', align: 'left', width: 2, bold: true },
            { value: '$0', rawValue: 0, align: 'right', width: 1.2 },
            { value: '$0', rawValue: 0, align: 'right', width: 1.2 },
            { value: '$120,000', rawValue: 120000, align: 'right', width: 1.2 },
            { value: '$0', rawValue: 0, align: 'right', width: 1.2 },
            { value: '$120,000', rawValue: 120000, align: 'right', width: 1.2, bold: true },
            { value: '$0', rawValue: 0, align: 'right', width: 1.2, bold: true }
          ]
        },
        {
          cells: [
            { value: 'Utilities Expense', rawValue: 'Utilities', align: 'left', width: 2, bold: true },
            { value: '$0', rawValue: 0, align: 'right', width: 1.2 },
            { value: '$0', rawValue: 0, align: 'right', width: 1.2 },
            { value: '$50,000', rawValue: 50000, align: 'right', width: 1.2 },
            { value: '$0', rawValue: 0, align: 'right', width: 1.2 },
            { value: '$50,000', rawValue: 50000, align: 'right', width: 1.2, bold: true },
            { value: '$0', rawValue: 0, align: 'right', width: 1.2, bold: true }
          ]
        },
        {
          cells: [
            { value: '', rawValue: '', align: 'left' }
          ],
          isEmpty: true
        },
        // Equity
        {
          cells: [
            { value: 'EQUITY', rawValue: 'EQUITY', align: 'left', width: 2, bold: true },
            { value: '', rawValue: 0, align: 'right', width: 1.2 },
            { value: '', rawValue: 0, align: 'right', width: 1.2 },
            { value: '', rawValue: 0, align: 'right', width: 1.2 },
            { value: '', rawValue: 0, align: 'right', width: 1.2 },
            { value: '', rawValue: 0, align: 'right', width: 1.2 },
            { value: '', rawValue: 0, align: 'right', width: 1.2 }
          ]
        },
        {
          cells: [
            { value: 'Share Capital', rawValue: 'Capital', align: 'left', width: 2, bold: true },
            { value: '$0', rawValue: 0, align: 'right', width: 1.2 },
            { value: '$500,000', rawValue: 500000, align: 'right', width: 1.2 },
            { value: '$0', rawValue: 0, align: 'right', width: 1.2 },
            { value: '$0', rawValue: 0, align: 'right', width: 1.2 },
            { value: '$0', rawValue: 0, align: 'right', width: 1.2, bold: true },
            { value: '$500,000', rawValue: 500000, align: 'right', width: 1.2, bold: true }
          ]
        },
        {
          cells: [
            { value: 'Retained Earnings', rawValue: 'RE', align: 'left', width: 2, bold: true },
            { value: '$0', rawValue: 0, align: 'right', width: 1.2 },
            { value: '$130,000', rawValue: 130000, align: 'right', width: 1.2 },
            { value: '$0', rawValue: 0, align: 'right', width: 1.2 },
            { value: '$0', rawValue: 0, align: 'right', width: 1.2 },
            { value: '$0', rawValue: 0, align: 'right', width: 1.2, bold: true },
            { value: '$130,000', rawValue: 130000, align: 'right', width: 1.2, bold: true }
          ]
        },
        {
          cells: [
            { value: '', rawValue: '', align: 'left' }
          ],
          isEmpty: true
        },
        // Totals
        {
          cells: [
            { value: 'TOTAL', rawValue: 'TOTAL', align: 'left', width: 2, bold: true, italics: true },
            { value: '$750,000', rawValue: 750000, align: 'right', width: 1.2, bold: true },
            { value: '$750,000', rawValue: 750000, align: 'right', width: 1.2, bold: true },
            { value: '$570,000', rawValue: 570000, align: 'right', width: 1.2, bold: true },
            { value: '$1,530,000', rawValue: 1530000, align: 'right', width: 1.2, bold: true },
            { value: '$1,070,000', rawValue: 1070000, align: 'right', width: 1.2, bold: true, italics: true },
            { value: '$1,450,000', rawValue: 1450000, align: 'right', width: 1.2, bold: true, italics: true }
          ]
        }
      ],
      totals: {
        totalDebit: 0,
        totalCredit: 0
      }
    };
  }
}
