/**
 * DEMO DATA IMPLEMENTATION GUIDE - INTEGRATED INTO TABLE/LIST
 * 
 * This guide shows how to implement demo data directly integrated into
 * existing lists/tables (not as separate cards).
 * 
 * Demo records appear in the same table with special styling:
 * - DEMO badge next to the record
 * - Pink/gradient left border to highlight
 * - Clickable row that opens form with auto-filled data
 * 
 * IMPLEMENTATION PATTERN:
 * 
 * 1. Import the DemoDataManagerService:
 *    import { DemoDataManagerService } from '../../../services/demo-data-manager.service';
 *    import { Subject } from 'rxjs';
 *    import { takeUntil } from 'rxjs/operators';
 * 
 * 2. In your component:
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DemoDataManagerService } from '../../../services/demo-data-manager.service';

// Define your interface
interface Record {
  id: string;
  name: string;
  date: Date;
  amount: number;
  status: string;
}

@Component({
  selector: 'app-module-component',
  templateUrl: './module-component.html',
  styleUrls: ['./module-component.css'],
  standalone: false
})
export class ModuleComponent implements OnInit, OnDestroy {
  
  // All records (including demo)
  records$ = new BehaviorSubject<Record[]>([]);
  
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private demoDataManager: DemoDataManagerService
  ) {
    this.initializeDemoRecords();
  }

  ngOnInit(): void {
    this.subscribeToDemo();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ---- MOCK DEMO RECORDS START ----
  private initializeDemoRecords(): void {
    const demoRecords: Record[] = [
      {
        id: 'demo-record-001',
        name: 'Demo Record 1',
        date: new Date(),
        amount: 1000,
        status: 'Submitted'
      },
      {
        id: 'demo-record-002',
        name: 'Demo Record 2',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        amount: 2500,
        status: 'Draft'
      }
    ];

    // Register demo records
    this.demoDataManager.registerDemoRecords('record', 'module-name', demoRecords);
    this.records$.next(demoRecords);
  }
  // ---- MOCK DEMO RECORDS END ----

  private subscribeToDemo(): void {
    this.demoDataManager.getDemoRecords('record')
      .pipe(takeUntil(this.destroy$))
      .subscribe((records: any[]) => {
        if (records.length > 0) {
          this.records$.next(records);
        }
      });
  }

  /**
   * Click handler - Opens form with auto-filled demo data
   * Called when clicking the table row
   */
  openRecord(record: Record): void {
    this.populateFormWithRecord(record);
    this.showForm = true;
  }

  /**
   * Populate form with record data
   */
  private populateFormWithRecord(record: Record): void {
    this.editingRecord = record;
    this.formData = {
      name: record.name,
      date: this.formatDate(record.date),
      amount: record.amount,
      // ... other fields
    };
  }

  /**
   * Save record (create or update)
   */
  saveRecord(): void {
    if (this.editingRecord) {
      // Update existing record
      const updatedRecord: Record = {
        ...this.editingRecord,
        // ... updated fields
      };
      
      const records = this.records$.value.map(r =>
        r.id === this.editingRecord!.id ? updatedRecord : r
      );
      this.records$.next(records);

      // Update in demo manager if it's a demo record
      if (this.editingRecord.id.includes('demo')) {
        this.demoDataManager.registerDemoRecords('record', 'module-name', records);
      }
    }
  }

  private formatDate(date: Date): string {
    return new Date(date).toISOString().split('T')[0];
  }
}

/**
 * IN TEMPLATE (HTML):
 * 
 * <div class="records-list" *ngIf="!showForm && (records$ | async) as records">
 *   <div *ngIf="records.length > 0" class="table-wrapper">
 *     <table class="records-table">
 *       <thead>
 *         <tr>
 *           <th>Name</th>
 *           <th>Date</th>
 *           <th>Amount</th>
 *           <th>Status</th>
 *           <th>Actions</th>
 *         </tr>
 *       </thead>
 *       <tbody>
 *         <!-- IMPORTANT: Add [class.demo-row]="record.id.includes('demo')" and (click)="openRecord(record)" -->
 *         <tr 
 *           *ngFor="let record of records" 
 *           [class.demo-row]="record.id.includes('demo')"
 *           (click)="openRecord(record)"
 *           class="clickable-row"
 *         >
 *           <td>
 *             <strong>{{ record.name }}</strong>
 *             <!-- Show DEMO badge inline for demo records -->
 *             <span *ngIf="record.id.includes('demo')" class="demo-badge-inline">DEMO</span>
 *           </td>
 *           <td>{{ record.date | date: 'dd/MM/yyyy' }}</td>
 *           <td>{{ record.amount | currency }}</td>
 *           <td>{{ record.status }}</td>
 *           <td class="actions">
 *             <button class="btn-icon" (click)="editRecord(record); $event.stopPropagation()">
 *               <i class="fas fa-edit"></i>
 *             </button>
 *             <button class="btn-icon" (click)="deleteRecord(record); $event.stopPropagation()">
 *               <i class="fas fa-trash"></i>
 *             </button>
 *           </td>
 *         </tr>
 *       </tbody>
 *     </table>
 *   </div>
 * </div>
 * 
 * <!-- Form Section -->
 * <div class="form" *ngIf="showForm">
 *   <input [(ngModel)]="formData.name" />
 *   <input [(ngModel)]="formData.date" type="date" />
 *   <input [(ngModel)]="formData.amount" type="number" />
 *   <button (click)="saveRecord()">Save</button>
 * </div>
 */

/**
 * IN CSS:
 * 
 * // Demo row styling
 * .demo-row {
 *   background: linear-gradient(90deg, rgba(245, 87, 108, 0.05) 0%, rgba(102, 126, 234, 0.05) 100%);
 *   border-left: 4px solid #f5576c;
 * }
 * 
 * .demo-row:hover {
 *   background: linear-gradient(90deg, rgba(245, 87, 108, 0.1) 0%, rgba(102, 126, 234, 0.1) 100%);
 * }
 * 
 * .clickable-row {
 *   cursor: pointer;
 *   transition: background-color 0.2s ease;
 * }
 * 
 * .clickable-row:hover {
 *   background-color: #f9fafb;
 * }
 * 
 * .demo-badge-inline {
 *   display: inline-block;
 *   background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
 *   color: white;
 *   padding: 2px 8px;
 *   border-radius: 3px;
 *   font-size: 11px;
 *   font-weight: 700;
 *   margin-left: 8px;
 *   letter-spacing: 0.5px;
 * }
 */

/**
 * KEY POINTS:
 * 
 * 1. Demo records have IDs that include 'demo': 'demo-record-001'
 * 
 * 2. Add [class.demo-row]="record.id.includes('demo')" to highlight demo rows
 * 
 * 3. Add (click)="openRecord(record)" to row to make it clickable
 * 
 * 4. Add [class.clickable-row]="true" to show cursor: pointer
 * 
 * 5. Use $event.stopPropagation() on action buttons to prevent row click
 * 
 * 6. Show DEMO badge inline with: 
 *    <span *ngIf="record.id.includes('demo')" class="demo-badge-inline">DEMO</span>
 * 
 * 7. When user clicks demo row:
 *    - openRecord(record) is called
 *    - Form is populated with record data
 *    - Form shows and user can edit
 *    - When saving, if ID includes 'demo', update in demoDataManager
 * 
 * 8. All changes persist in localStorage automatically
 */

/**
 * MODULES TO IMPLEMENT:
 * 
 * Sales:
 * - sales-invoices (type: 'sales-invoice')
 * - sales-payments (type: 'sales-payment')
 * - sales-customers (type: 'customer')
 * - sales-items (type: 'sales-item')
 * 
 * Purchase:
 * - purchase-invoices (type: 'purchase-invoice')
 * - purchase-payments (type: 'purchase-payment')
 * - purchase-suppliers (type: 'supplier')
 * - purchase-items (type: 'purchase-item')
 * 
 * Common:
 * - common-items (type: 'common-item')
 * - party (type: 'party')
 * - journal-entry (type: 'journal-entry')
 * 
 * Reports:
 * - balance-sheet (type: 'balance-sheet')
 * - profit-loss (type: 'profit-loss')
 * - trial-balance (type: 'trial-balance')
 */

/**
 * EXAMPLE: Fully Integrated Pattern
 * See sales-quotes component for complete working example
 */


/**
 * API REFERENCE:
 * 
 * registerDemoRecords(type: string, module: string, records: any[]): void
 *   - Store array of demo records
 * 
 * getDemoRecords(type: string): Observable<any[]>
 *   - Get Observable of records by type
 * 
 * getDemoRecord(type: string, id: string): any
 *   - Get single demo record
 * 
 * addDemoRecord(type: string, module: string, record: any): void
 *   - Add single demo record
 * 
 * deleteDemoRecord(type: string, id: string): void
 *   - Delete specific demo record
 * 
 * getAllDemoRecords(): Observable<DemoRecord[]>
 *   - Get all demo records across all types
 * 
 * clearDemoRecords(): void
 *   - Clear all demo records
 */
