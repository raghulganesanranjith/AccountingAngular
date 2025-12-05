import { Component, OnInit } from '@angular/core';
import { TrialBalanceService } from '../../../services/trial-balance.service';
import { GeneralLedgerReport, ReportFilters, FilterField } from '../../../services/reports.types';

@Component({
  selector: 'app-trial-balance',
  templateUrl: './trial-balance.component.html',
  styleUrls: ['./trial-balance.component.css']
})
export class TrialBalanceComponent implements OnInit {
  report: GeneralLedgerReport | null = null;
  isLoading = false;
  reportType = 'trial-balance';

  filters: ReportFilters = {
    referenceType: 'All',
    groupBy: 'none',
    reverted: false,
    ascending: false,
    fromDate: this.getDefaultFromDate(),
    toDate: this.getDefaultToDate()
  };

  filterFields: FilterField[] = [];

  constructor(private trialBalanceService: TrialBalanceService) {}

  ngOnInit(): void {
    this.filterFields = this.trialBalanceService.getTrialBalanceFilters();
    this.loadReport();
  }

  /**
   * Load report data
   */
  loadReport(): void {
    this.isLoading = true;
    this.trialBalanceService.getTrialBalanceReport(this.filters).subscribe(
      (data: any) => {
        this.report = data;
        this.isLoading = false;
      },
      (error: any) => {
        console.error('Error loading trial balance report:', error);
        this.isLoading = false;
      }
    );
  }

  /**
   * Get default from date (start of year)
   */
  private getDefaultFromDate(): string {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    return startOfYear.toISOString().split('T')[0];
  }

  /**
   * Get default to date (today)
   */
  private getDefaultToDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  /**
   * Get filter value by fieldname
   */
  getFilterValue(fieldname: string): any {
    return (this.filters as any)[fieldname];
  }

  /**
   * Set filter value
   */
  setFilterValue(fieldname: string, value: any): void {
    (this.filters as any)[fieldname] = value;
  }

  /**
   * Handle filter field change
   */
  onFilterFieldChange(fieldname: string, event: any): void {
    let value: any;
    const target = event.target as HTMLInputElement;

    if (target.type === 'checkbox') {
      value = target.checked;
    } else {
      value = target.value;
    }

    this.setFilterValue(fieldname, value);
    this.onFilterChange();
  }

  /**
   * Handle filter changes
   */
  onFilterChange(): void {
    this.loadReport();
  }

  /**
   * Export to CSV
   */
  exportToCSV(): void {
    if (!this.report) return;

    const headers = this.report.columns.map((c: any) => c.label).join(',');
    const rows = this.report.data.map((row: any) =>
      row.cells.map((cell: any) => `"${cell.value}"`).join(',')
    );

    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', 'trial-balance-report.csv');
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Print the report
   */
  printReport(): void {
    window.print();
  }
}
