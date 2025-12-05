import { Component, OnInit } from '@angular/core';
import { ProfitLossService } from '../../../services/profit-loss.service';
import { GeneralLedgerReport, ReportFilters, FilterField } from '../../../services/reports.types';
import { ChartUtilService } from '../../../shared/services/chart-util.service';

interface ProfitLossData {
  yearmonth: string;
  income: number;
  expense: number;
  balance: number;
}

interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    fill: boolean;
  }>;
}

@Component({
  selector: 'app-profit-loss',
  templateUrl: './profit-loss.component.html',
  styleUrls: ['./profit-loss.component.css']
})
export class ProfitLossComponent implements OnInit {
  report: GeneralLedgerReport | null = null;
  isLoading = false;
  reportType = 'profit-loss';

  // Chart data
  chartData: ChartData | null = null;
  chartLoading = false;
  period = 'This Year';
  periodOptions = ['This Year', 'This Quarter', 'YTD'];
  hasChartData = false;

  filters: ReportFilters = {
    referenceType: 'All',
    groupBy: 'none',
    reverted: false,
    ascending: false,
    fromDate: this.getDefaultFromDate(),
    toDate: this.getDefaultToDate()
  };

  filterFields: FilterField[] = [];

  constructor(
    private profitLossService: ProfitLossService,
    private chartUtilService: ChartUtilService
  ) {}

  ngOnInit(): void {
    this.filterFields = this.profitLossService.getProfitLossFilters();
    this.loadReport();
    this.loadChartData();
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
    this.profitLossService.getProfitLossReport(this.filters).subscribe({
      next: (data: GeneralLedgerReport) => {
        this.report = data;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error fetching profit and loss report:', error);
        this.isLoading = false;
      }
    });
  }

  /**
   * Handle filter changes
   */
  onFilterChange(): void {
    this.loadReport();
  }

  /**
   * Helper method to safely access filter values
   */
  getFilterValue(fieldname: string): any {
    return (this.filters as any)[fieldname];
  }

  /**
   * Helper method to safely set filter values
   */
  setFilterValue(fieldname: string, value: any): void {
    (this.filters as any)[fieldname] = value;
  }

  /**
   * Unified change handler for all filter types
   */
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

  /**
   * Load chart data based on selected period
   */
  loadChartData(): void {
    this.chartLoading = true;
    const { fromDate, toDate, periodList } = this.chartUtilService.getDatesAndPeriodList(this.period);

    // Mock data for chart - in production this would call an API
    const mockData: ProfitLossData[] = this.generateMockChartData(periodList);

    this.prepareChartData(mockData);
    this.chartLoading = false;
  }

  /**
   * Generate mock monthly profit/loss data
   */
  private generateMockChartData(periodList: Date[]): ProfitLossData[] {
    return periodList.map(date => {
      const yearmonth = this.chartUtilService.formatYearMonth(date);
      // Mock values - these would come from actual data in production
      const baseIncome = 150000 + Math.random() * 50000;
      const baseExpense = 75000 + Math.random() * 25000;
      return {
        yearmonth,
        income: Math.round(baseIncome),
        expense: Math.round(baseExpense),
        balance: Math.round(baseIncome - baseExpense)
      };
    });
  }

  /**
   * Prepare chart data for display
   */
  private prepareChartData(data: ProfitLossData[]): void {
    if (!data || data.length === 0) {
      this.hasChartData = false;
      return;
    }

    const labels = data.map(d => this.chartUtilService.formatXLabels(d.yearmonth));
    const incomeData = data.map(d => d.income);
    const expenseData = data.map(d => d.expense);
    const balanceData = data.map(d => d.balance);

    this.chartData = {
      labels,
      datasets: [
        {
          label: 'Income',
          data: incomeData,
          borderColor: 'rgba(75, 192, 75, 1)',
          backgroundColor: 'rgba(75, 192, 75, 0.1)',
          fill: true
        },
        {
          label: 'Expense',
          data: expenseData,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.1)',
          fill: true
        },
        {
          label: 'Net Profit',
          data: balanceData,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.1)',
          fill: true
        }
      ]
    };

    this.hasChartData = true;
  }

  /**
   * Handle period change
   */
  onPeriodChange(newPeriod: string): void {
    this.period = newPeriod;
    this.loadChartData();
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
    link.setAttribute('download', 'profit-loss-report.csv');
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
