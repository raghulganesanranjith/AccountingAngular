import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';

export interface Account {
  name: string;
  parentAccount: string | null;
  rootType: 'Asset' | 'Liability' | 'Income' | 'Expense' | 'Equity';
  accountType: string;
  isGroup: boolean;
  balance: number;
  children?: Account[];
  expanded?: boolean;
  level?: number;
  location?: number[];
}

export interface AccountBalance {
  account: string;
  totalDebit: number;
  totalCredit: number;
}

@Injectable({
  providedIn: 'root'
})
export class ChartOfAccountsService {
  private accountsSubject = new BehaviorSubject<Account[]>([]);
  accounts$ = this.accountsSubject.asObservable();

  private balancesSubject = new BehaviorSubject<Record<string, AccountBalance>>({});
  balances$ = this.balancesSubject.asObservable();

  constructor() { }

  /**
   * Get all accounts with hierarchy
   */
  getAccounts(): Observable<Account[]> {
    const accounts = this.getMockAccounts();
    this.accountsSubject.next(accounts);
    return of(accounts);
  }

  /**
   * Get account balances
   */
  getAccountBalances(): Observable<Record<string, AccountBalance>> {
    const balances = this.getMockBalances();
    this.balancesSubject.next(balances);
    return of(balances);
  }

  /**
   * Get balance for specific account
   */
  getAccountBalance(accountName: string): number {
    const balances = this.balancesSubject.value;
    const balance = balances[accountName];
    if (!balance) return 0;

    // Determine if credit or debit based on root type
    const account = this.findAccountByName(accountName, this.accountsSubject.value);
    if (!account) return 0;

    const isCreditAccount = ['Liability', 'Income', 'Equity'].includes(account.rootType);
    if (isCreditAccount) {
      return balance.totalCredit - balance.totalDebit;
    }
    return balance.totalDebit - balance.totalCredit;
  }

  /**
   * Find account by name
   */
  private findAccountByName(name: string, accounts: Account[]): Account | null {
    for (const account of accounts) {
      if (account.name === name) return account;
      if (account.children) {
        const found = this.findAccountByName(name, account.children);
        if (found) return found;
      }
    }
    return null;
  }

  /**
   * Create new account
   */
  createAccount(data: Partial<Account>): Observable<Account> {
    const newAccount: Account = {
      name: data.name || `Account_${Date.now()}`,
      parentAccount: data.parentAccount || null,
      rootType: data.rootType || 'Asset',
      accountType: data.accountType || 'Detail',
      isGroup: data.isGroup || false,
      balance: 0,
      expanded: false
    };

    // Add to parent
    if (data.parentAccount) {
      const parent = this.findAccountByName(data.parentAccount, this.accountsSubject.value);
      if (parent) {
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(newAccount);
      }
    } else {
      const accounts = this.accountsSubject.value;
      accounts.push(newAccount);
      this.accountsSubject.next(accounts);
    }

    return of(newAccount);
  }

  /**
   * Delete account
   */
  deleteAccount(accountName: string): Observable<boolean> {
    const accounts = this.accountsSubject.value;
    this.removeAccountFromTree(accountName, accounts);
    this.accountsSubject.next([...accounts]);
    return of(true);
  }

  /**
   * Remove account from tree recursively
   */
  private removeAccountFromTree(accountName: string, accounts: Account[]): boolean {
    for (let i = 0; i < accounts.length; i++) {
      if (accounts[i].name === accountName) {
        accounts.splice(i, 1);
        return true;
      }
      if (accounts[i].children) {
        if (this.removeAccountFromTree(accountName, accounts[i].children!)) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Toggle account expansion
   */
  toggleAccountExpansion(accountName: string, accounts: Account[]): void {
    const account = this.findAccountByName(accountName, accounts);
    if (account && account.isGroup) {
      account.expanded = !account.expanded;
    }
  }

  /**
   * Expand all accounts
   */
  expandAll(accounts: Account[]): void {
    for (const account of accounts) {
      if (account.isGroup) {
        account.expanded = true;
        if (account.children) {
          this.expandAll(account.children);
        }
      }
    }
  }

  /**
   * Collapse all accounts
   */
  collapseAll(accounts: Account[]): void {
    for (const account of accounts) {
      if (account.isGroup) {
        account.expanded = false;
        if (account.children) {
          this.collapseAll(account.children);
        }
      }
    }
  }

  /**
   * Mock accounts data
   */
  private getMockAccounts(): Account[] {
    return [
      {
        name: 'Assets',
        parentAccount: null,
        rootType: 'Asset',
        accountType: 'Group',
        isGroup: true,
        balance: 0,
        expanded: true,
        children: [
          {
            name: 'Current Assets',
            parentAccount: 'Assets',
            rootType: 'Asset',
            accountType: 'Group',
            isGroup: true,
            balance: 0,
            expanded: true,
            children: [
              {
                name: 'Cash & Bank',
                parentAccount: 'Current Assets',
                rootType: 'Asset',
                accountType: 'Detail',
                isGroup: false,
                balance: 50000,
                expanded: false
              },
              {
                name: 'Accounts Receivable',
                parentAccount: 'Current Assets',
                rootType: 'Asset',
                accountType: 'Detail',
                isGroup: false,
                balance: 80000,
                expanded: false
              },
              {
                name: 'Inventory',
                parentAccount: 'Current Assets',
                rootType: 'Asset',
                accountType: 'Detail',
                isGroup: false,
                balance: 120000,
                expanded: false
              }
            ]
          },
          {
            name: 'Fixed Assets',
            parentAccount: 'Assets',
            rootType: 'Asset',
            accountType: 'Group',
            isGroup: true,
            balance: 0,
            expanded: false,
            children: [
              {
                name: 'Property, Plant & Equipment',
                parentAccount: 'Fixed Assets',
                rootType: 'Asset',
                accountType: 'Detail',
                isGroup: false,
                balance: 500000,
                expanded: false
              },
              {
                name: 'Accumulated Depreciation',
                parentAccount: 'Fixed Assets',
                rootType: 'Asset',
                accountType: 'Detail',
                isGroup: false,
                balance: -100000,
                expanded: false
              }
            ]
          }
        ]
      },
      {
        name: 'Liabilities',
        parentAccount: null,
        rootType: 'Liability',
        accountType: 'Group',
        isGroup: true,
        balance: 0,
        expanded: false,
        children: [
          {
            name: 'Current Liabilities',
            parentAccount: 'Liabilities',
            rootType: 'Liability',
            accountType: 'Group',
            isGroup: true,
            balance: 0,
            expanded: false,
            children: [
              {
                name: 'Accounts Payable',
                parentAccount: 'Current Liabilities',
                rootType: 'Liability',
                accountType: 'Detail',
                isGroup: false,
                balance: 40000,
                expanded: false
              },
              {
                name: 'Short-term Debt',
                parentAccount: 'Current Liabilities',
                rootType: 'Liability',
                accountType: 'Detail',
                isGroup: false,
                balance: 100000,
                expanded: false
              }
            ]
          },
          {
            name: 'Long-term Liabilities',
            parentAccount: 'Liabilities',
            rootType: 'Liability',
            accountType: 'Group',
            isGroup: true,
            balance: 0,
            expanded: false,
            children: [
              {
                name: 'Long-term Debt',
                parentAccount: 'Long-term Liabilities',
                rootType: 'Liability',
                accountType: 'Detail',
                isGroup: false,
                balance: 200000,
                expanded: false
              }
            ]
          }
        ]
      },
      {
        name: 'Income',
        parentAccount: null,
        rootType: 'Income',
        accountType: 'Group',
        isGroup: true,
        balance: 0,
        expanded: false,
        children: [
          {
            name: 'Sales Revenue',
            parentAccount: 'Income',
            rootType: 'Income',
            accountType: 'Detail',
            isGroup: false,
            balance: 500000,
            expanded: false
          },
          {
            name: 'Service Income',
            parentAccount: 'Income',
            rootType: 'Income',
            accountType: 'Detail',
            isGroup: false,
            balance: 150000,
            expanded: false
          }
        ]
      },
      {
        name: 'Expenses',
        parentAccount: null,
        rootType: 'Expense',
        accountType: 'Group',
        isGroup: true,
        balance: 0,
        expanded: false,
        children: [
          {
            name: 'Cost of Goods Sold',
            parentAccount: 'Expenses',
            rootType: 'Expense',
            accountType: 'Detail',
            isGroup: false,
            balance: 300000,
            expanded: false
          },
          {
            name: 'Salary Expense',
            parentAccount: 'Expenses',
            rootType: 'Expense',
            accountType: 'Detail',
            isGroup: false,
            balance: 120000,
            expanded: false
          },
          {
            name: 'Utilities Expense',
            parentAccount: 'Expenses',
            rootType: 'Expense',
            accountType: 'Detail',
            isGroup: false,
            balance: 50000,
            expanded: false
          }
        ]
      },
      {
        name: 'Equity',
        parentAccount: null,
        rootType: 'Equity',
        accountType: 'Group',
        isGroup: true,
        balance: 0,
        expanded: false,
        children: [
          {
            name: 'Share Capital',
            parentAccount: 'Equity',
            rootType: 'Equity',
            accountType: 'Detail',
            isGroup: false,
            balance: 500000,
            expanded: false
          },
          {
            name: 'Retained Earnings',
            parentAccount: 'Equity',
            rootType: 'Equity',
            accountType: 'Detail',
            isGroup: false,
            balance: 130000,
            expanded: false
          }
        ]
      }
    ];
  }

  /**
   * Mock balances data
   */
  private getMockBalances(): Record<string, AccountBalance> {
    return {
      'Cash & Bank': { account: 'Cash & Bank', totalDebit: 50000, totalCredit: 0 },
      'Accounts Receivable': { account: 'Accounts Receivable', totalDebit: 80000, totalCredit: 0 },
      'Inventory': { account: 'Inventory', totalDebit: 120000, totalCredit: 0 },
      'Property, Plant & Equipment': { account: 'Property, Plant & Equipment', totalDebit: 500000, totalCredit: 0 },
      'Accumulated Depreciation': { account: 'Accumulated Depreciation', totalDebit: 0, totalCredit: 100000 },
      'Accounts Payable': { account: 'Accounts Payable', totalDebit: 0, totalCredit: 40000 },
      'Short-term Debt': { account: 'Short-term Debt', totalDebit: 0, totalCredit: 100000 },
      'Long-term Debt': { account: 'Long-term Debt', totalDebit: 0, totalCredit: 200000 },
      'Sales Revenue': { account: 'Sales Revenue', totalDebit: 0, totalCredit: 500000 },
      'Service Income': { account: 'Service Income', totalDebit: 0, totalCredit: 150000 },
      'Cost of Goods Sold': { account: 'Cost of Goods Sold', totalDebit: 300000, totalCredit: 0 },
      'Salary Expense': { account: 'Salary Expense', totalDebit: 120000, totalCredit: 0 },
      'Utilities Expense': { account: 'Utilities Expense', totalDebit: 50000, totalCredit: 0 },
      'Share Capital': { account: 'Share Capital', totalDebit: 0, totalCredit: 500000 },
      'Retained Earnings': { account: 'Retained Earnings', totalDebit: 0, totalCredit: 130000 }
    };
  }
}
