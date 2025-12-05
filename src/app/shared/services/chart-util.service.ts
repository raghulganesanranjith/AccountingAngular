import { Injectable } from '@angular/core';

export interface PeriodDateRange {
  fromDate: Date;
  toDate: Date;
  periodList: Date[];
}

@Injectable({
  providedIn: 'root'
})
export class ChartUtilService {

  /**
   * Get date range and period list based on period type
   */
  getDatesAndPeriodList(period: string): PeriodDateRange {
    const today = new Date();
    let fromDate: Date;
    let toDate: Date;
    const periodList: Date[] = [];

    switch (period) {
      case 'This Year':
        fromDate = new Date(today.getFullYear(), 0, 1);
        toDate = today;
        break;
      case 'This Quarter':
        const quarter = Math.floor(today.getMonth() / 3);
        fromDate = new Date(today.getFullYear(), quarter * 3, 1);
        toDate = today;
        break;
      case 'YTD':
        fromDate = new Date(today.getFullYear(), 0, 1);
        toDate = today;
        break;
      default:
        fromDate = new Date(today.getFullYear(), 0, 1);
        toDate = today;
    }

    // Generate monthly period list
    let currentDate = new Date(fromDate);
    while (currentDate <= toDate) {
      periodList.push(new Date(currentDate));
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return { fromDate, toDate, periodList };
  }

  /**
   * Format date as yyyy-MM
   */
  formatYearMonth(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  /**
   * Calculate Y-axis max value
   */
  getYMax(points: number[][]): number {
    const allPoints = points.flat();
    const maxValue = Math.max(...allPoints);
    return Math.ceil(maxValue * 1.1 / 1000) * 1000; // Round up to nearest 1000
  }

  /**
   * Calculate Y-axis min value
   */
  getYMin(points: number[][]): number {
    const allPoints = points.flat();
    const minValue = Math.min(...allPoints);
    return Math.floor(minValue * 0.9 / 1000) * 1000; // Round down to nearest 1000
  }

  /**
   * Format X-axis labels
   */
  formatXLabels(label: string): string {
    // Convert yyyy-MM to abbreviated month year format
    const [year, month] = label.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleString('en-US', { month: 'short', year: '2-digit' });
  }

  /**
   * Format currency value
   */
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }
}
