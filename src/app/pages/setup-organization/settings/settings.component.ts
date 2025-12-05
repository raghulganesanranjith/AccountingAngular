import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface AccountingSettingsForm {
  fullname: string;
  companyName: string;
  bankName: string;
  country: string;
  email: string;
  phone: string;
  gstNumber: string;
  writeOffAccount: string;
  roundOffAccount: string;
  discountAccount: string;
  printColor: string;
  printFont: string;
  displayLogoInInvoice: boolean;
  displayAmountInWords: boolean;
  displayTimeInInvoice: boolean;
  displayDescriptionInInvoice: boolean;
  displayTermsAndConditions: boolean;
  posPrintWidth: number;
  enableDiscounting: boolean;
  enableInventory: boolean;
  enablePriceList: boolean;
  enableInvoiceReturns: boolean;
  enableFormCustomization: boolean;
  enableERPNextSync: boolean;
  enableLead: boolean;
  enablePricingRule: boolean;
  enableItemEnquiry: boolean;
  enableLoyaltyProgram: boolean;
  enableCouponCode: boolean;
  enableitemGroup: boolean;
  enablePointOfSaleWithOutInventory: boolean;
  enablePartialPayment: boolean;
  fiscalYearStart: string;
  fiscalYearEnd: string;
  dateFormat: string;
  version: string;
  removeFilter: boolean;
  locale: string;
  displayPrecision: number;
  currency: string;
  darkMode: boolean;
  hideGetStarted: boolean;
  allowBypassFilters: boolean;
  displayTermsAndConditionsSystem: boolean;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  standalone: false
})
export class SettingsComponent implements OnInit {
  settings: AccountingSettingsForm = {
    fullname: '',
    companyName: '',
    bankName: '',
    country: '',
    email: '',
    phone: '',
    gstNumber: '',
    writeOffAccount: '',
    roundOffAccount: '',
    discountAccount: '',
    printColor: '#000000',
    printFont: 'Arial',
    displayLogoInInvoice: false,
    displayAmountInWords: false,
    displayTimeInInvoice: false,
    displayDescriptionInInvoice: false,
    displayTermsAndConditions: false,
    posPrintWidth: 8,
    enableDiscounting: false,
    enableInventory: false,
    enablePriceList: false,
    enableInvoiceReturns: false,
    enableFormCustomization: false,
    enableERPNextSync: false,
    enableLead: false,
    enablePricingRule: false,
    enableItemEnquiry: false,
    enableLoyaltyProgram: false,
    enableCouponCode: false,
    enableitemGroup: false,
    enablePointOfSaleWithOutInventory: false,
    enablePartialPayment: false,
    fiscalYearStart: '',
    fiscalYearEnd: '',
    dateFormat: 'Mar 23, 2022',
    version: '0.36.0',
    removeFilter: false,
    locale: 'India (en-IN)',
    displayPrecision: 2,
    currency: 'INR',
    darkMode: false,
    hideGetStarted: false,
    allowBypassFilters: false,
    displayTermsAndConditionsSystem: false
  };

  isLoading = false;
  isSaving = false;
  saveMessage = '';
  saveError = '';

  countries = [
    'United States',
    'Canada',
    'United Kingdom',
    'Australia',
    'India',
    'Germany',
    'France',
    'Japan',
    'China',
    'Brazil',
    'Mexico',
    'Singapore',
    'Other'
  ];

  accounts: { value: string; label: string }[] = [
    { value: 'acc-1', label: 'Expenses' },
    { value: 'acc-2', label: 'Sales Returns' },
    { value: 'acc-3', label: 'Purchase Returns' },
    { value: 'acc-4', label: 'Rounding Difference' },
    { value: 'acc-5', label: 'Discount Given' }
  ];

  featureGroups = [
    {
      name: 'Sales & Inventory',
      features: [
        { key: 'enableDiscounting', label: 'Enable Discounting' },
        { key: 'enableInventory', label: 'Enable Inventory' },
        { key: 'enablePriceList', label: 'Enable Price List' },
        { key: 'enableInvoiceReturns', label: 'Enable Invoice Returns' },
        { key: 'enableitemGroup', label: 'Enable Item Group' }
      ]
    },
    {
      name: 'Advanced Features',
      features: [
        { key: 'enableFormCustomization', label: 'Enable Form Customization' },
        { key: 'enablePricingRule', label: 'Enable Pricing Rule' },
        { key: 'enableItemEnquiry', label: 'Enable Item Enquiry' },
        { key: 'enablePartialPayment', label: 'Enable Partial Payment' }
      ]
    },
    {
      name: 'Loyalty & Promotions',
      features: [
        { key: 'enableLoyaltyProgram', label: 'Enable Loyalty Program' },
        { key: 'enableCouponCode', label: 'Enable Coupon Code' },
        { key: 'enableLead', label: 'Enable Lead' }
      ]
    },
    {
      name: 'Point of Sale & Integrations',
      features: [
        { key: 'enablePointOfSaleWithOutInventory', label: 'Enable POS Without Inventory' },
        { key: 'enableERPNextSync', label: 'Enable ERPNext Sync' }
      ]
    }
  ];

  activeTab = 'general';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.isLoading = true;
    // Simulate API call
    setTimeout(() => {
      // Load mock data
      this.settings = {
        fullname: 'ff',
        companyName: 'ha',
        bankName: 'icici',
        country: 'India',
        email: 'haru@gmail.com',
        phone: '9088900000',
        gstNumber: '27AAAAAA000A1Z5',
        writeOffAccount: 'acc-1',
        roundOffAccount: 'acc-4',
        discountAccount: 'acc-5',
        printColor: '#000000',
        printFont: 'Arial',
        displayLogoInInvoice: false,
        displayAmountInWords: false,
        displayTimeInInvoice: false,
        displayDescriptionInInvoice: false,
        displayTermsAndConditions: false,
        posPrintWidth: 8,
        enableDiscounting: false,
        enableInventory: false,
        enablePriceList: false,
        enableInvoiceReturns: false,
        enableFormCustomization: false,
        enableERPNextSync: false,
        enableLead: false,
        enablePricingRule: false,
        enableItemEnquiry: false,
        enableLoyaltyProgram: false,
        enableCouponCode: false,
        enableitemGroup: false,
        enablePointOfSaleWithOutInventory: false,
        enablePartialPayment: false,
        fiscalYearStart: '2024-01-01',
        fiscalYearEnd: '2024-12-31',
        dateFormat: 'Mar 23, 2022',
        version: '0.36.0',
        removeFilter: false,
        locale: 'India (en-IN)',
        displayPrecision: 2,
        currency: 'INR',
        darkMode: false,
        hideGetStarted: false,
        allowBypassFilters: false,
        displayTermsAndConditionsSystem: false
      };
      this.isLoading = false;
    }, 300);
  }

  saveSettings(): void {
    if (!this.validateSettings()) {
      this.saveError = 'Please fill in all required fields';
      return;
    }

    this.isSaving = true;
    this.saveError = '';
    this.saveMessage = '';

    // Simulate API call
    setTimeout(() => {
      this.isSaving = false;
      this.saveMessage = 'Settings saved successfully!';
      setTimeout(() => {
        this.saveMessage = '';
      }, 3000);
    }, 800);
  }

  resetSettings(): void {
    if (confirm('Are you sure you want to reset all changes?')) {
      this.loadSettings();
      this.saveError = '';
      this.saveMessage = '';
    }
  }

  private validateSettings(): boolean {
    if (!this.settings.fullname.trim()) return false;
    if (!this.settings.companyName.trim()) return false;
    if (!this.settings.bankName.trim()) return false;
    if (!this.settings.country) return false;
    if (!this.settings.email.trim()) return false;
    if (!this.settings.fiscalYearStart) return false;
    if (!this.settings.fiscalYearEnd) return false;

    // Validate fiscal year dates
    const startDate = new Date(this.settings.fiscalYearStart);
    const endDate = new Date(this.settings.fiscalYearEnd);
    if (endDate <= startDate) {
      this.saveError = 'Fiscal year end date must be after start date';
      return false;
    }

    return true;
  }

  toggleFeature(featureKey: string): void {
    const key = featureKey as keyof AccountingSettingsForm;
    const currentValue = this.settings[key];
    if (typeof currentValue === 'boolean') {
      (this.settings[key] as any) = !currentValue;
    }
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  toggleSection(section: string): void {
    // Section toggle logic can be added here if needed
  }

  goBack(): void {
    this.router.navigate(['/setup']);
  }

  getFeatureValue(key: string): boolean {
    const value = this.settings[key as keyof AccountingSettingsForm];
    return typeof value === 'boolean' ? value : false;
  }

  setFeatureValue(key: string, value: boolean): void {
    (this.settings[key as keyof AccountingSettingsForm] as any) = value;
  }

  exportSettings(): void {
    const dataStr = JSON.stringify(this.settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `accounting-settings-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  get enabledFeaturesCount(): number {
    return Object.values(this.settings).filter(v => v === true).length;
  }

  calculateFiscalYearDuration(): number {
    if (!this.settings.fiscalYearStart || !this.settings.fiscalYearEnd) {
      return 0;
    }
    const startDate = new Date(this.settings.fiscalYearStart).getTime();
    const endDate = new Date(this.settings.fiscalYearEnd).getTime();
    return Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
  }
}
