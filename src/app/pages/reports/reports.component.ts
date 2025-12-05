import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../services/reports.service';
import { GeneralLedgerReport, ReportFilters, FilterField } from '../../services/reports.types';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  report: GeneralLedgerReport | null = null;
  isLoading = false;
  reportType = 'general-ledger';

  filters: ReportFilters = {
    referenceType: 'All',
    groupBy: 'none',
    reverted: false,
    ascending: false,
    fromDate: this.getDefaultFromDate(),
    toDate: this.getDefaultToDate()
  };

  filterFields: FilterField[] = [];

  // Helper method to safely access filter values
  getFilterValue(fieldname: string): any {
    return (this.filters as any)[fieldname];
  }

  // Helper method to safely set filter values
  setFilterValue(fieldname: string, value: any): void {
    (this.filters as any)[fieldname] = value;
  }

  // Unified change handler for all filter types
  onFilterFieldChange(fieldname: string, event: Event): void {
    const target = event.target as any;
    let value: any;

    if (target.type === 'checkbox') {
      value = target.checked;
    } else {
      value = target.value;
    }

    this.setFilterValue(fieldname, value);
    this.onFilterChange();
  }

  constructor(private reportsService: ReportsService) {}

  ngOnInit(): void {
    this.filterFields = this.reportsService.getGeneralLedgerFilters();
    this.loadReport();
  }

  /**
   * Get default from date (1 year ago)
   */
  private getDefaultFromDate(): string {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 1);
    return date.toISOString().split('T')[0];
  }

  /**
   * Get default to date (today)
   */
  private getDefaultToDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  /**
   * Load the report
   */
  loadReport(): void {
    this.isLoading = true;
    this.reportsService.getGeneralLedgerReport(this.filters).subscribe({
      next: (report) => {
        this.report = report;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading report:', error);
        this.isLoading = false;
      }
    });
  }

  /**
   * Handle filter change
   */
  onFilterChange(): void {
    this.loadReport();
  }

  /**
   * Export report to CSV
   */
  exportToCSV(): void {
    if (!this.report) return;

    const headers = this.report.columns.map(col => col.label);
    const rows = this.report.data.map(row =>
      row.cells.map(cell => this.escapeCSV(cell.value)).join(',')
    );

    const csv = [
      headers.join(','),
      ...rows,
      '',
      `Total Debit,${this.reportsService.formatCurrency(this.report.totals.totalDebit)}`,
      `Total Credit,${this.reportsService.formatCurrency(this.report.totals.totalCredit)}`
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `general-ledger-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  /**
   * Escape CSV special characters
   */
  private escapeCSV(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  /**
   * Print report
   */
  printReport(): void {
    window.print();
  }
}
