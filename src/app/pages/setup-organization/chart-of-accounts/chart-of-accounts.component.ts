import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ChartOfAccountsService, Account, AccountBalance } from '../../../services/chart-of-accounts.service';

@Component({
  selector: 'app-chart-of-accounts',
  templateUrl: './chart-of-accounts.component.html',
  styleUrls: ['./chart-of-accounts.component.css']
})
export class ChartOfAccountsComponent implements OnInit {
  @ViewChild('inputRef') inputRef: ElementRef | null = null;

  accounts: Account[] = [];
  balances: Record<string, AccountBalance> = {};
  allAccounts: Account[] = [];
  isAllExpanded = false;
  isAllCollapsed = true;
  newAccountName = '';
  insertingAccount = false;
  editingParent: Account | null = null;
  editingType: 'addingAccount' | 'addingGroupAccount' | null = null;

  constructor(private chartOfAccountsService: ChartOfAccountsService) { }

  ngOnInit(): void {
    this.loadAccounts();
    this.loadBalances();
  }

  /**
   * Load accounts from service
   */
  loadAccounts(): void {
    this.chartOfAccountsService.getAccounts().subscribe(
      (accounts: Account[]) => {
        this.accounts = accounts;
        this.updateAllAccounts();
      },
      (error: any) => {
        console.error('Error loading accounts:', error);
      }
    );
  }

  /**
   * Load account balances
   */
  loadBalances(): void {
    this.chartOfAccountsService.getAccountBalances().subscribe(
      (balances: Record<string, AccountBalance>) => {
        this.balances = balances;
      },
      (error: any) => {
        console.error('Error loading balances:', error);
      }
    );
  }

  /**
   * Update flattened accounts list for display
   */
  updateAllAccounts(): void {
    this.allAccounts = [];
    this.flattenAccounts(this.accounts, 0, []);
  }

  /**
   * Flatten accounts hierarchy for display
   */
  private flattenAccounts(accounts: Account[], level: number, location: number[]): void {
    for (let i = 0; i < accounts.length; i++) {
      const account = accounts[i];
      account.level = level;
      account.location = [...location, i];

      this.allAccounts.push(account);

      if (account.children && account.expanded) {
        this.flattenAccounts(account.children, level + 1, account.location);
      }
    }
  }

  /**
   * Expand all accounts
   */
  expandAll(): void {
    this.chartOfAccountsService.expandAll(this.accounts);
    this.updateAllAccounts();
    this.isAllExpanded = true;
    this.isAllCollapsed = false;
  }

  /**
   * Collapse all accounts
   */
  collapseAll(): void {
    this.chartOfAccountsService.collapseAll(this.accounts);
    this.updateAllAccounts();
    this.isAllCollapsed = true;
    this.isAllExpanded = false;
  }

  /**
   * Handle account click (expand/collapse or open for editing)
   */
  onAccountClick(account: Account): void {
    if (account.isGroup) {
      account.expanded = !account.expanded;
      this.updateAllAccounts();

      if (account.expanded) {
        this.isAllCollapsed = false;
      } else {
        this.isAllExpanded = false;
      }
    }
  }

  /**
   * Get balance string for account
   */
  getBalanceString(account: Account): string {
    const balance = this.chartOfAccountsService.getAccountBalance(account.name);
    const suffix = ['Liability', 'Income', 'Equity'].includes(account.rootType) ? 'Cr.' : 'Dr.';
    return `$${Math.abs(balance).toLocaleString()} ${suffix}`;
  }

  /**
   * Add account or group
   */
  addAccount(parentAccount: Account, type: 'addingAccount' | 'addingGroupAccount'): void {
    if (!parentAccount.expanded) {
      parentAccount.expanded = true;
      this.updateAllAccounts();
    }

    this.editingParent = parentAccount;
    this.editingType = type;
    this.newAccountName = '';

    // Focus input after view update
    setTimeout(() => {
      if (this.inputRef) {
        this.inputRef.nativeElement.focus();
      }
    }, 0);
  }

  /**
   * Cancel adding account
   */
  cancelAddingAccount(): void {
    this.editingParent = null;
    this.editingType = null;
    this.newAccountName = '';
  }

  /**
   * Create new account
   */
  createNewAccount(): void {
    if (!this.editingParent || !this.newAccountName.trim()) {
      return;
    }

    this.insertingAccount = true;

    const isGroup = this.editingType === 'addingGroupAccount';
    const newAccountData: Partial<Account> = {
      name: this.newAccountName.trim(),
      parentAccount: this.editingParent.name,
      rootType: this.editingParent.rootType,
      accountType: isGroup ? 'Group' : 'Detail',
      isGroup
    };

    this.chartOfAccountsService.createAccount(newAccountData).subscribe(
      (newAccount: Account) => {
        this.insertingAccount = false;
        this.editingParent = null;
        this.editingType = null;
        this.newAccountName = '';
        this.updateAllAccounts();
      },
      (error: any) => {
        console.error('Error creating account:', error);
        this.insertingAccount = false;
      }
    );
  }

  /**
   * Delete account
   */
  deleteAccount(account: Account): void {
    if (confirm(`Are you sure you want to delete ${account.name}?`)) {
      if (account.isGroup && account.children && account.children.length > 0) {
        alert(`Cannot delete ${account.name} - it has child accounts.`);
        return;
      }

      this.chartOfAccountsService.deleteAccount(account.name).subscribe(
        () => {
          this.updateAllAccounts();
        },
        (error: any) => {
          console.error('Error deleting account:', error);
        }
      );
    }
  }

  /**
   * Get indentation style based on level
   */
  getItemStyle(level: number): { [key: string]: string } {
    return {
      paddingLeft: `calc(1rem + 2rem * ${level})`,
      borderBottom: '1px solid #e5e7eb'
    };
  }

  /**
   * Get icon for account type
   */
  getAccountIcon(account: Account): string {
    if (account.isGroup) {
      return '📁';
    }

    switch (account.rootType) {
      case 'Asset':
        return '💰';
      case 'Liability':
        return '💳';
      case 'Income':
        return '📈';
      case 'Expense':
        return '📊';
      case 'Equity':
        return '📊';
      default:
        return '•';
    }
  }

  /**
   * Get chevron icon
   */
  getChevronIcon(account: Account): string {
    if (!account.isGroup) {
      return '';
    }
    return account.expanded ? '▼' : '▶';
  }

  /**
   * Check if add buttons should show
   */
  isEditingParent(account: Account, type: 'addingAccount' | 'addingGroupAccount'): boolean {
    return this.editingParent === account && this.editingType === type;
  }

  /**
   * Handle keydown in input
   */
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.createNewAccount();
    } else if (event.key === 'Escape') {
      this.cancelAddingAccount();
    }
  }
}
