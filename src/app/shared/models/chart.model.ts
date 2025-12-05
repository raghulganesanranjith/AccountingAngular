/**
 * Chart Data Models
 */

export interface ChartPoint {
  x: string;
  y: number;
}

export interface ChartDataset {
  label: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string;
  fill?: boolean;
}

export interface BarChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartConfig {
  colors: {
    positive: string;
    negative: string;
  };
  gridColor?: string;
  fontColor?: string;
  darkMode: boolean;
}
