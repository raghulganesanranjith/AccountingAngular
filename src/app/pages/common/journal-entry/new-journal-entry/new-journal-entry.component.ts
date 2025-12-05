import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

interface AccountEntry {
  account: string;
  debit: number;
  credit: number;
}

interface JournalEntry {
  id: string;
  entryNumber: string;
  entryType: string;
  numberSeries: string;
  date: string;
  accountEntries: AccountEntry[];
  referenceNumber: string;
  referenceDate: string;
  remark: string;
  attachment: string;
  created: string;
}

@Component({
  selector: 'app-new-journal-entry',
  templateUrl: './new-journal-entry.component.html',
  styleUrls: ['./new-journal-entry.component.css'],
  standalone: false
})
export class NewJournalEntryComponent implements OnInit {
  journalEntry: JournalEntry = {
    id: '',
    entryNumber: 'New Journal Entry ' + new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }),
    entryType: '',
    numberSeries: 'JV-',
    date: new Date().toISOString().split('T')[0],
    accountEntries: [],
    referenceNumber: '',
    referenceDate: '',
    remark: '',
    attachment: '',
    created: new Date().toISOString()
  };

  loading = false;

  // Mock data
  entryTypes: string[] = ['Entry Type 1', 'Entry Type 2', 'Entry Type 3', 'Entry Type 4'];
  accounts: string[] = ['Cash', 'Bank Account', 'Sales', 'Expense', 'Receivable', 'Payable'];

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadJournalEntryFromStorage();
  }

  private loadJournalEntryFromStorage(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      const saved = localStorage.getItem('currentJournalEntry');
      if (saved) {
        this.journalEntry = JSON.parse(saved);
      }
    } catch (err) {
      console.error('Error loading journal entry:', err);
    }
  }

  addAccountEntry(): void {
    const newEntry: AccountEntry = {
      account: '',
      debit: 0,
      credit: 0
    };
    this.journalEntry.accountEntries.push(newEntry);
  }

  removeAccountEntry(index: number): void {
    this.journalEntry.accountEntries.splice(index, 1);
  }

  updateAccountAmount(entry: AccountEntry): void {
    // Validation can be added here
  }

  getTotalDebit(): number {
    return this.journalEntry.accountEntries.reduce((sum, entry) => sum + (entry.debit || 0), 0);
  }

  getTotalCredit(): number {
    return this.journalEntry.accountEntries.reduce((sum, entry) => sum + (entry.credit || 0), 0);
  }

  submitJournalEntry(): void {
    if (!this.journalEntry.entryType) {
      alert('Please select Entry Type');
      return;
    }

    if (this.journalEntry.accountEntries.length === 0) {
      alert('Please add at least one account entry');
      return;
    }

    // Check if debit and credit are balanced
    const totalDebit = this.getTotalDebit();
    const totalCredit = this.getTotalCredit();

    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      alert('Debit and Credit amounts must be balanced');
      return;
    }

    this.loading = true;

    // Mock API call with 1 second delay
    const mockApiResponse = {
      status: 'success',
      message: 'Journal entry created successfully',
      entryId: 'JE-' + Date.now().toString().slice(-4)
    };

    of(mockApiResponse)
      .pipe(delay(1000))
      .subscribe((response) => {
        this.loading = false;
        alert(response.message);
        // Clear localStorage and navigate back
        if (isPlatformBrowser(this.platformId)) {
          localStorage.removeItem('currentJournalEntry');
        }
        this.router.navigate(['/common/journal-entry']);
      });
  }

  discardJournalEntry(): void {
    if (confirm('Are you sure you want to discard this journal entry?')) {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.removeItem('currentJournalEntry');
      }
      this.router.navigate(['/common/journal-entry']);
    }
  }

  goBackToJournalEntry(): void {
    this.router.navigate(['/common/journal-entry']);
  }

  // ---- MOCK DEMO JOURNAL ENTRY START (generateDemoJournalEntry) ----
  private generateDemoJournalEntry(): JournalEntry {
    return {
      id: 'je-demo-001',
      entryNumber: 'New Journal Entry 12/04',
      entryType: 'Entry Type 1',
      numberSeries: 'JV-',
      date: new Date().toISOString().split('T')[0],
      accountEntries: [
        {
          account: 'Cash',
          debit: 5000,
          credit: 0
        },
        {
          account: 'Bank Account',
          debit: 0,
          credit: 5000
        }
      ],
      referenceNumber: 'REF-001',
      referenceDate: new Date().toISOString().split('T')[0],
      remark: 'Demo journal entry for testing',
      attachment: '',
      created: new Date().toISOString()
    };
  }
  // ---- MOCK DEMO JOURNAL ENTRY END ----
}
