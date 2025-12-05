import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

interface JournalEntry {
  id: string;
  entryNumber: string;
  date: string;
  account: string;
  debit: number;
  credit: number;
  description: string;
  status: 'Draft' | 'Posted' | 'Cancelled';
}

@Component({
  selector: 'app-journal-entry',
  templateUrl: './journal-entry.component.html',
  styleUrls: ['./journal-entry.component.css']
})
export class JournalEntryComponent implements OnInit {
  entries: JournalEntry[] = [];
  showForm = false;
  editingEntry: JournalEntry | null = null;

  mockEntries: JournalEntry[] = [
    {
      id: '1',
      entryNumber: 'JE-001',
      date: new Date().toISOString().split('T')[0],
      account: 'Cash',
      debit: 5000,
      credit: 0,
      description: 'Opening balance',
      status: 'Posted'
    },
    {
      id: '2',
      entryNumber: 'JE-002',
      date: new Date().toISOString().split('T')[0],
      account: 'Sales',
      debit: 0,
      credit: 2500,
      description: 'Sales for the day',
      status: 'Posted'
    }
  ];

  constructor(private router: Router) {
    this.initializeDemoJournalEntry();
  }

  ngOnInit(): void {
    this.loadEntries();
  }

  loadEntries(): void {
    this.entries = this.mockEntries;
  }

  createNewEntry(): void {
    this.router.navigate(['/common/journal-entry/new']);
  }

  editEntry(entry: JournalEntry): void {
    this.editingEntry = { ...entry };
    this.showForm = true;
  }

  deleteEntry(entry: JournalEntry): void {
    if (confirm(`Delete journal entry ${entry.entryNumber}?`)) {
      this.entries = this.entries.filter(e => e.id !== entry.id);
    }
  }

  closeForm(): void {
    this.showForm = false;
    this.editingEntry = null;
  }

  submitForm(): void {
    if (this.editingEntry) {
      const index = this.entries.findIndex(e => e.id === this.editingEntry?.id);
      if (index > -1) {
        this.entries[index] = { ...this.editingEntry };
      } else {
        this.editingEntry.id = 'entry-' + Date.now();
        this.entries.push({ ...this.editingEntry });
      }
    }
    this.closeForm();
  }

  // ---- MOCK DEMO JOURNAL ENTRY INITIALIZATION (initializeDemoJournalEntry) ----
  private initializeDemoJournalEntry(): void {
    const demoEntry = this.generateDemoJournalEntry();
    this.mockEntries = [demoEntry, ...this.mockEntries];
  }

  private generateDemoJournalEntry(): JournalEntry {
    return {
      id: 'je-demo-001',
      entryNumber: 'JE-DEMO-001',
      date: new Date().toISOString().split('T')[0],
      account: 'Cash',
      debit: 5000,
      credit: 0,
      description: 'Demo journal entry for testing',
      status: 'Posted'
    };
  }
  // ---- MOCK DEMO JOURNAL ENTRY END ----
}
