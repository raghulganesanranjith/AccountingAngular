import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

export interface DemoRecord {
  id: string;
  type: string; // 'quote', 'invoice', 'payment', 'customer', 'item', etc.
  data: any;
  module: string; // 'sales', 'purchase', 'common', etc.
}

@Injectable({
  providedIn: 'root'
})
export class DemoDataManagerService {
  private demoRecords$ = new BehaviorSubject<DemoRecord[]>([]);
  private demoRecordsByType$ = new Map<string, BehaviorSubject<any[]>>();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.initializeDemoData();
  }

  private initializeDemoData(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      const saved = localStorage.getItem('demoRecords');
      if (saved) {
        const records = JSON.parse(saved);
        this.demoRecords$.next(records);
        this.organizeByType(records);
      }
    } catch (err) {
      console.error('Error loading demo data:', err);
    }
  }

  /**
   * Register and store demo records of a specific type
   */
  registerDemoRecords(type: string, module: string, records: any[]): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const demoRecords = records.map(record => ({
      id: record.id || `${type}-${Date.now()}`,
      type,
      module,
      data: record
    }));

    // Merge with existing records
    const current = this.demoRecords$.value;
    const updated = [
      ...current.filter(r => r.type !== type),
      ...demoRecords
    ];

    this.demoRecords$.next(updated);
    this.persistDemoRecords(updated);
    this.organizeByType(updated);
  }

  /**
   * Get all demo records of a specific type
   */
  getDemoRecords(type: string): Observable<any[]> {
    if (!this.demoRecordsByType$.has(type)) {
      this.demoRecordsByType$.set(type, new BehaviorSubject<any[]>([]));
    }
    return this.demoRecordsByType$.get(type)!.asObservable();
  }

  /**
   * Get a single demo record by type and id
   */
  getDemoRecord(type: string, id: string): any | null {
    const records = this.demoRecordsByType$.get(type);
    if (!records) return null;
    return records.value.find(r => r.id === id) || null;
  }

  /**
   * Get raw demo records
   */
  getAllDemoRecords(): Observable<DemoRecord[]> {
    return this.demoRecords$.asObservable();
  }

  /**
   * Add a single demo record
   */
  addDemoRecord(type: string, module: string, record: any): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const demoRecord: DemoRecord = {
      id: record.id || `${type}-${Date.now()}`,
      type,
      module,
      data: record
    };

    const current = this.demoRecords$.value;
    const updated = [...current, demoRecord];
    this.demoRecords$.next(updated);
    this.persistDemoRecords(updated);
    this.organizeByType(updated);
  }

  /**
   * Delete a demo record
   */
  deleteDemoRecord(type: string, id: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const current = this.demoRecords$.value;
    const updated = current.filter(r => !(r.type === type && r.id === id));
    this.demoRecords$.next(updated);
    this.persistDemoRecords(updated);
    this.organizeByType(updated);
  }

  /**
   * Clear all demo records
   */
  clearDemoRecords(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.demoRecords$.next([]);
    localStorage.removeItem('demoRecords');
    this.demoRecordsByType$.forEach(subject => subject.next([]));
  }

  private organizeByType(records: DemoRecord[]): void {
    const grouped = new Map<string, any[]>();

    records.forEach(record => {
      if (!grouped.has(record.type)) {
        grouped.set(record.type, []);
      }
      grouped.get(record.type)!.push(record.data);
    });

    grouped.forEach((data, type) => {
      if (!this.demoRecordsByType$.has(type)) {
        this.demoRecordsByType$.set(type, new BehaviorSubject<any[]>(data));
      } else {
        this.demoRecordsByType$.get(type)!.next(data);
      }
    });
  }

  private persistDemoRecords(records: DemoRecord[]): void {
    try {
      localStorage.setItem('demoRecords', JSON.stringify(records));
    } catch (err) {
      console.error('Error persisting demo records:', err);
    }
  }
}
