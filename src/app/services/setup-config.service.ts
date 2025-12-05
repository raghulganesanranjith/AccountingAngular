import { Injectable } from '@angular/core';

export interface SetupItem {
  key: string;
  label: string;
  icon: string;
  description: string;
  fieldname?: string;
  action?: () => void;
  documentation?: string;
}

export interface SetupSection {
  label: string;
  items: SetupItem[];
}

@Injectable({
  providedIn: 'root'
})
export class SetupConfigService {

  getSetupConfig(): SetupSection[] {
    return [
      {
        label: 'Organisation',
        items: [
          {
            key: 'General',
            label: 'General',
            icon: '⚙️',
            description: 'Set up your company information, email, country and fiscal year',
            fieldname: 'companySetup',
            action: () => console.log('Open General Settings')
          },
          {
            key: 'Print',
            label: 'Print',
            icon: '🖨️',
            description: 'Customize your invoices by adding a logo and address details',
            fieldname: 'printSetup',
            action: () => console.log('Open Print Settings')
          },
          {
            key: 'System',
            label: 'System',
            icon: '💻',
            description: 'Setup system defaults like date format and display precision',
            fieldname: 'systemSetup',
            action: () => console.log('Open System Settings')
          }
        ]
      },
      {
        label: 'Accounts',
        items: [
          {
            key: 'Review Accounts',
            label: 'Review Accounts',
            icon: '📊',
            description: 'Review your chart of accounts, add any account or tax heads as needed',
            fieldname: 'chartOfAccountsReviewed',
            action: () => console.log('Open Chart of Accounts')
          },
          {
            key: 'Opening Balances',
            label: 'Opening Balances',
            icon: '📈',
            description: 'Set up your opening balances before performing any accounting entries',
            fieldname: 'openingBalanceChecked',
            action: () => console.log('Open Opening Balances')
          }
        ]
      },
      {
        label: 'Sales',
        items: [
          {
            key: 'Add Sales Items',
            label: 'Add Items',
            icon: '📦',
            description: 'Add products or services that you sell to your customers',
            fieldname: 'salesItemCreated',
            action: () => console.log('Add Sales Items')
          },
          {
            key: 'Add Customers',
            label: 'Add Customers',
            icon: '👥',
            description: 'Add a few customers to create your first sales invoice',
            fieldname: 'customerCreated',
            action: () => console.log('Add Customers')
          },
          {
            key: 'Create Sales Invoice',
            label: 'Create Sales Invoice',
            icon: '📄',
            description: 'Create your first sales invoice for the created customer',
            fieldname: 'invoiceCreated',
            action: () => console.log('Create Sales Invoice')
          }
        ]
      },
      {
        label: 'Purchase',
        items: [
          {
            key: 'Add Purchase Items',
            label: 'Add Items',
            icon: '📦',
            description: 'Add products or services that you buy from your suppliers',
            fieldname: 'purchaseItemCreated',
            action: () => console.log('Add Purchase Items')
          },
          {
            key: 'Add Suppliers',
            label: 'Add Suppliers',
            icon: '🏢',
            description: 'Add a few suppliers to create your first purchase invoice',
            fieldname: 'supplierCreated',
            action: () => console.log('Add Suppliers')
          },
          {
            key: 'Create Purchase Invoice',
            label: 'Create Purchase Invoice',
            icon: '📋',
            description: 'Create your first purchase invoice from the created supplier',
            fieldname: 'billCreated',
            action: () => console.log('Create Purchase Invoice')
          }
        ]
      },
      {
        label: 'Setup',
        items: [
          {
            key: 'Chart of Accounts',
            label: 'Chart of Accounts',
            icon: '📊',
            description: 'Review and manage your chart of accounts, add accounts or tax heads as needed',
            fieldname: 'chartOfAccountsSetup',
            action: () => console.log('Open Chart of Accounts')
          },
          {
            key: 'Tax Templates',
            label: 'Tax Templates',
            icon: '🧾',
            description: 'Create and manage tax templates for your sales and purchase transactions',
            fieldname: 'taxTemplatesSetup',
            action: () => console.log('Open Tax Templates')
          },
          {
            key: 'Import Wizard',
            label: 'Import Wizard',
            icon: '📥',
            description: 'Import data from your previous accounting system',
            fieldname: 'importWizardSetup',
            action: () => console.log('Open Import Wizard')
          },
          {
            key: 'Print Templates',
            label: 'Print Templates',
            icon: '🖼️',
            description: 'Customize print templates for your documents',
            fieldname: 'printTemplatesSetup',
            action: () => console.log('Open Print Templates')
          },
          {
            key: 'Settings',
            label: 'Settings',
            icon: '⚙️',
            description: 'Configure all system and business settings',
            fieldname: 'settingsSetup',
            action: () => console.log('Open All Settings')
          }
        ]
      }
    ];
  }
}
