/**
 * Report-related types and interfaces
 */

export interface LedgerEntry {
  name?: number | string;
  account: string;
  date: Date | string | null;
  debit: number | null;
  credit: number | null;
  balance?: number | null;
  referenceType: string;
  referenceName: string;
  party: string;
  reverted: boolean;
  reverts: string;
  index?: string;
}

export interface ReportCell {
  italics?: boolean;
  bold?: boolean;
  value: string;
  rawValue: any;
  align?: 'left' | 'right' | 'center';
  width?: number;
}

export interface ReportRow {
  isEmpty?: boolean;
  cells: ReportCell[];
}

export type ReportData = ReportRow[];

export interface ColumnField {
  label: string;
  fieldtype: string;
  fieldname: string;
  align?: 'left' | 'right' | 'center';
  width?: number;
}

export type GroupedMap = Map<string, LedgerEntry[]>;

export interface FilterField {
  fieldtype: string;
  options?: Array<{ label: string; value: string }>;
  label: string;
  fieldname: string;
  placeholder?: string;
  references?: string;
  emptyMessage?: string;
  target?: string;
}

export interface ReportFilters {
  account?: string;
  party?: string;
  referenceName?: string;
  referenceType?: string;
  fromDate?: string;
  toDate?: string;
  groupBy?: 'none' | 'party' | 'account' | 'referenceName';
  reverted?: boolean;
  ascending?: boolean;
}

export interface GeneralLedgerReport {
  title: string;
  columns: ColumnField[];
  filters: FilterField[];
  data: ReportData;
  totals: {
    totalDebit: number;
    totalCredit: number;
  };
}
