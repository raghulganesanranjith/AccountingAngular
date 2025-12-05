import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { GeneralLedgerReport, FilterField, ColumnField } from './reports.types';

export interface AccountNode {
  name: string;
  balance: number;
  children: AccountNode[];
  rootType: string;
  indent: number;
}

export interface RootTypeRow {
  rootType: string;
  totalName: string;
  rootNodes: AccountNode[];
  rows: any[];
}

@Injectable({
  providedIn: 'root'
})
export class BalanceSheetService {

  constructor() { }

  /**
   * Get Balance Sheet Report
   */
  getBalanceSheetReport(filters: any): Observable<GeneralLedgerReport> {
    const reportData = this.getMockBalanceSheetData();
    return of(reportData);
  }

  /**
   * Get Balance Sheet Filter Fields
   */
  getBalanceSheetFilters(): FilterField[] {
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
        fieldtype: 'Select',
        label: 'Based On',
        fieldname: 'basedOn',
        options: [
          { label: 'Until Date', value: 'Until Date' },
          { label: 'Fiscal Year', value: 'Fiscal Year' }
        ]
      },
      {
        fieldtype: 'Select',
        label: 'Group By',
        fieldname: 'groupBy',
        options: [
          { label: 'Monthly', value: 'Monthly' },
          { label: 'Quarterly', value: 'Quarterly' },
          { label: 'Yearly', value: 'Yearly' }
        ]
      }
    ];
  }

  /**
   * Get Balance Sheet Column Fields
   */
  getBalanceSheetColumns(): ColumnField[] {
    return [
      { label: 'Account', fieldtype: 'Link', fieldname: 'account', align: 'left', width: 2 },
      { label: 'Current Period', fieldtype: 'Currency', fieldname: 'current', align: 'right', width: 1.25 },
      { label: 'Previous Period', fieldtype: 'Currency', fieldname: 'previous', align: 'right', width: 1.25 },
      { label: 'Variance', fieldtype: 'Currency', fieldname: 'variance', align: 'right', width: 1.25 }
    ];
  }

  /**
   * Mock Balance Sheet Data
   */
  private getMockBalanceSheetData(): GeneralLedgerReport {
    return {
      title: 'Balance Sheet',
      columns: this.getBalanceSheetColumns(),
      filters: this.getBalanceSheetFilters(),
      data: [
        // Assets Section
        {
          cells: [
            { value: 'ASSETS', rawValue: 'ASSETS', align: 'left', width: 2, bold: true },
            { value: '', rawValue: '', align: 'right', width: 1.25 },
            { value: '', rawValue: '', align: 'right', width: 1.25 },
            { value: '', rawValue: '', align: 'right', width: 1.25 }
          ]
        },
        {
          cells: [
            { value: 'Current Assets', rawValue: 'Current Assets', align: 'left', width: 2, bold: true },
            { value: '', rawValue: '', align: 'right', width: 1.25 },
            { value: '', rawValue: '', align: 'right', width: 1.25 },
            { value: '', rawValue: '', align: 'right', width: 1.25 }
          ]
        },
        {
          cells: [
            { value: '  Cash and Cash Equivalents', rawValue: 'Cash', align: 'left', width: 2, bold: false },
            { value: '$150,000', rawValue: 150000, align: 'right', width: 1.25 },
            { value: '$120,000', rawValue: 120000, align: 'right', width: 1.25 },
            { value: '$30,000', rawValue: 30000, align: 'right', width: 1.25 }
          ]
        },
        {
          cells: [
            { value: '  Accounts Receivable', rawValue: 'AR', align: 'left', width: 2, bold: false },
            { value: '$200,000', rawValue: 200000, align: 'right', width: 1.25 },
            { value: '$180,000', rawValue: 180000, align: 'right', width: 1.25 },
            { value: '$20,000', rawValue: 20000, align: 'right', width: 1.25 }
          ]
        },
        {
          cells: [
            { value: '  Inventory', rawValue: 'Inventory', align: 'left', width: 2, bold: false },
            { value: '$300,000', rawValue: 300000, align: 'right', width: 1.25 },
            { value: '$280,000', rawValue: 280000, align: 'right', width: 1.25 },
            { value: '$20,000', rawValue: 20000, align: 'right', width: 1.25 }
          ]
        },
        {
          cells: [
            { value: 'Total Current Assets', rawValue: 'Total CA', align: 'left', width: 2, bold: true, italics: true },
            { value: '$650,000', rawValue: 650000, align: 'right', width: 1.25, bold: true },
            { value: '$580,000', rawValue: 580000, align: 'right', width: 1.25, bold: true },
            { value: '$70,000', rawValue: 70000, align: 'right', width: 1.25, bold: true }
          ]
        },
        {
          cells: [
            { value: '', rawValue: '', align: 'left' }
          ],
          isEmpty: true
        },
        {
          cells: [
            { value: 'Fixed Assets', rawValue: 'Fixed Assets', align: 'left', width: 2, bold: true },
            { value: '', rawValue: '', align: 'right', width: 1.25 },
            { value: '', rawValue: '', align: 'right', width: 1.25 },
            { value: '', rawValue: '', align: 'right', width: 1.25 }
          ]
        },
        {
          cells: [
            { value: '  Property, Plant & Equipment', rawValue: 'PPE', align: 'left', width: 2, bold: false },
            { value: '$500,000', rawValue: 500000, align: 'right', width: 1.25 },
            { value: '$500,000', rawValue: 500000, align: 'right', width: 1.25 },
            { value: '$0', rawValue: 0, align: 'right', width: 1.25 }
          ]
        },
        {
          cells: [
            { value: '  Accumulated Depreciation', rawValue: 'Depr', align: 'left', width: 2, bold: false },
            { value: '($100,000)', rawValue: -100000, align: 'right', width: 1.25 },
            { value: '($80,000)', rawValue: -80000, align: 'right', width: 1.25 },
            { value: '($20,000)', rawValue: -20000, align: 'right', width: 1.25 }
          ]
        },
        {
          cells: [
            { value: 'Total Fixed Assets', rawValue: 'Total FA', align: 'left', width: 2, bold: true, italics: true },
            { value: '$400,000', rawValue: 400000, align: 'right', width: 1.25, bold: true },
            { value: '$420,000', rawValue: 420000, align: 'right', width: 1.25, bold: true },
            { value: '($20,000)', rawValue: -20000, align: 'right', width: 1.25, bold: true }
          ]
        },
        {
          cells: [
            { value: '', rawValue: '', align: 'left' }
          ],
          isEmpty: true
        },
        {
          cells: [
            { value: 'TOTAL ASSETS', rawValue: 'TOTAL ASSETS', align: 'left', width: 2, bold: true, italics: true },
            { value: '$1,050,000', rawValue: 1050000, align: 'right', width: 1.25, bold: true },
            { value: '$1,000,000', rawValue: 1000000, align: 'right', width: 1.25, bold: true },
            { value: '$50,000', rawValue: 50000, align: 'right', width: 1.25, bold: true }
          ]
        },
        {
          cells: [
            { value: '', rawValue: '', align: 'left' }
          ],
          isEmpty: true
        },
        // Liabilities Section
        {
          cells: [
            { value: 'LIABILITIES', rawValue: 'LIABILITIES', align: 'left', width: 2, bold: true },
            { value: '', rawValue: '', align: 'right', width: 1.25 },
            { value: '', rawValue: '', align: 'right', width: 1.25 },
            { value: '', rawValue: '', align: 'right', width: 1.25 }
          ]
        },
        {
          cells: [
            { value: 'Current Liabilities', rawValue: 'Current Liabilities', align: 'left', width: 2, bold: true },
            { value: '', rawValue: '', align: 'right', width: 1.25 },
            { value: '', rawValue: '', align: 'right', width: 1.25 },
            { value: '', rawValue: '', align: 'right', width: 1.25 }
          ]
        },
        {
          cells: [
            { value: '  Accounts Payable', rawValue: 'AP', align: 'left', width: 2, bold: false },
            { value: '$80,000', rawValue: 80000, align: 'right', width: 1.25 },
            { value: '$70,000', rawValue: 70000, align: 'right', width: 1.25 },
            { value: '$10,000', rawValue: 10000, align: 'right', width: 1.25 }
          ]
        },
        {
          cells: [
            { value: '  Short-term Debt', rawValue: 'ST Debt', align: 'left', width: 2, bold: false },
            { value: '$100,000', rawValue: 100000, align: 'right', width: 1.25 },
            { value: '$100,000', rawValue: 100000, align: 'right', width: 1.25 },
            { value: '$0', rawValue: 0, align: 'right', width: 1.25 }
          ]
        },
        {
          cells: [
            { value: 'Total Current Liabilities', rawValue: 'Total CL', align: 'left', width: 2, bold: true, italics: true },
            { value: '$180,000', rawValue: 180000, align: 'right', width: 1.25, bold: true },
            { value: '$170,000', rawValue: 170000, align: 'right', width: 1.25, bold: true },
            { value: '$10,000', rawValue: 10000, align: 'right', width: 1.25, bold: true }
          ]
        },
        {
          cells: [
            { value: '', rawValue: '', align: 'left' }
          ],
          isEmpty: true
        },
        {
          cells: [
            { value: 'Long-term Liabilities', rawValue: 'LT Liabilities', align: 'left', width: 2, bold: true },
            { value: '', rawValue: '', align: 'right', width: 1.25 },
            { value: '', rawValue: '', align: 'right', width: 1.25 },
            { value: '', rawValue: '', align: 'right', width: 1.25 }
          ]
        },
        {
          cells: [
            { value: '  Long-term Debt', rawValue: 'LT Debt', align: 'left', width: 2, bold: false },
            { value: '$200,000', rawValue: 200000, align: 'right', width: 1.25 },
            { value: '$200,000', rawValue: 200000, align: 'right', width: 1.25 },
            { value: '$0', rawValue: 0, align: 'right', width: 1.25 }
          ]
        },
        {
          cells: [
            { value: 'Total Long-term Liabilities', rawValue: 'Total LTL', align: 'left', width: 2, bold: true, italics: true },
            { value: '$200,000', rawValue: 200000, align: 'right', width: 1.25, bold: true },
            { value: '$200,000', rawValue: 200000, align: 'right', width: 1.25, bold: true },
            { value: '$0', rawValue: 0, align: 'right', width: 1.25, bold: true }
          ]
        },
        {
          cells: [
            { value: '', rawValue: '', align: 'left' }
          ],
          isEmpty: true
        },
        {
          cells: [
            { value: 'TOTAL LIABILITIES', rawValue: 'TOTAL LIABILITIES', align: 'left', width: 2, bold: true, italics: true },
            { value: '$380,000', rawValue: 380000, align: 'right', width: 1.25, bold: true },
            { value: '$370,000', rawValue: 370000, align: 'right', width: 1.25, bold: true },
            { value: '$10,000', rawValue: 10000, align: 'right', width: 1.25, bold: true }
          ]
        },
        {
          cells: [
            { value: '', rawValue: '', align: 'left' }
          ],
          isEmpty: true
        },
        // Equity Section
        {
          cells: [
            { value: 'EQUITY', rawValue: 'EQUITY', align: 'left', width: 2, bold: true },
            { value: '', rawValue: '', align: 'right', width: 1.25 },
            { value: '', rawValue: '', align: 'right', width: 1.25 },
            { value: '', rawValue: '', align: 'right', width: 1.25 }
          ]
        },
        {
          cells: [
            { value: '  Share Capital', rawValue: 'Share Capital', align: 'left', width: 2, bold: false },
            { value: '$500,000', rawValue: 500000, align: 'right', width: 1.25 },
            { value: '$500,000', rawValue: 500000, align: 'right', width: 1.25 },
            { value: '$0', rawValue: 0, align: 'right', width: 1.25 }
          ]
        },
        {
          cells: [
            { value: '  Retained Earnings', rawValue: 'Retained Earnings', align: 'left', width: 2, bold: false },
            { value: '$170,000', rawValue: 170000, align: 'right', width: 1.25 },
            { value: '$130,000', rawValue: 130000, align: 'right', width: 1.25 },
            { value: '$40,000', rawValue: 40000, align: 'right', width: 1.25 }
          ]
        },
        {
          cells: [
            { value: 'TOTAL EQUITY', rawValue: 'TOTAL EQUITY', align: 'left', width: 2, bold: true, italics: true },
            { value: '$670,000', rawValue: 670000, align: 'right', width: 1.25, bold: true },
            { value: '$630,000', rawValue: 630000, align: 'right', width: 1.25, bold: true },
            { value: '$40,000', rawValue: 40000, align: 'right', width: 1.25, bold: true }
          ]
        },
        {
          cells: [
            { value: '', rawValue: '', align: 'left' }
          ],
          isEmpty: true
        },
        {
          cells: [
            { value: 'TOTAL LIABILITIES & EQUITY', rawValue: 'TOTAL', align: 'left', width: 2, bold: true, italics: true },
            { value: '$1,050,000', rawValue: 1050000, align: 'right', width: 1.25, bold: true },
            { value: '$1,000,000', rawValue: 1000000, align: 'right', width: 1.25, bold: true },
            { value: '$50,000', rawValue: 50000, align: 'right', width: 1.25, bold: true }
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
