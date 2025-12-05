import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { SetupOrganizationComponent } from './pages/setup-organization/setup-organization.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DashboardMainComponent } from './pages/dashboard-main/dashboard-main.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { ReportsSelectorComponent } from './pages/reports/reports-selector/reports-selector.component';
import { ProfitLossComponent } from './pages/reports/profit-loss/profit-loss.component';
import { BalanceSheetComponent } from './pages/reports/balance-sheet/balance-sheet.component';
import { TrialBalanceComponent } from './pages/reports/trial-balance/trial-balance.component';
import { ChartOfAccountsComponent } from './pages/setup-organization/chart-of-accounts/chart-of-accounts.component';
import { SetupItemsComponent } from './pages/setup-organization/setup-items/setup-items.component';
import { TaxTemplatesComponent } from './pages/setup-organization/tax-templates/tax-templates.component';
import { ImportWizardComponent } from './pages/setup-organization/import-wizard/import-wizard.component';
import { PrintTemplatesComponent } from './pages/setup-organization/print-templates/print-templates.component';
import { SettingsComponent } from './pages/setup-organization/settings/settings.component';
import { GetStartedComponent } from './getstarted/getstarted.component';
import { LayoutComponent } from './layout/layout.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SalesItemsComponent } from './pages/sales/sales-items/sales-items.component';
import { SalesQuotesComponent } from './pages/sales/sales-quotes/sales-quotes.component';
import { SalesInvoicesComponent } from './pages/sales/sales-invoices/sales-invoices.component';
import { SalesPaymentsComponent } from './pages/sales/sales-payments/sales-payments.component';
import { CustomersComponent } from './pages/sales/customers/customers.component';
import { SalesItemsDetailComponent } from './pages/sales/sales-items-detail/sales-items-detail.component';
import { SalesItemsManagementComponent } from './pages/setup-organization/sales-items-management/sales-items-management.component';
import { CustomersManagementComponent } from './pages/setup-organization/customers-management/customers-management.component';
import { SalesCustomersComponent } from './pages/sales/sales-customers/sales-customers.component';
import { SalesItemsManagementComponent as SalesItemsMgmtComponent } from './pages/sales/sales-items-management/sales-items-management.component';
import { PurchaseItemsComponent } from './pages/purchase/purchase-items/purchase-items.component';
import { PurchaseSuppliersComponent } from './pages/purchase/purchase-suppliers/purchase-suppliers.component';
import { PurchaseInvoicesComponent } from './pages/purchase/purchase-invoices/purchase-invoices.component';
import { PurchasePaymentsComponent } from './pages/purchase/purchase-payments/purchase-payments.component';
import { SetupWizardComponent } from './pages/setup-wizard/setup-wizard.component';
import { NewQuoteComponent } from './pages/sales/sales-quotes/new-quote/new-quote.component';
import { NewInvoiceComponent } from './pages/sales/sales-invoices/new-invoice/new-invoice.component';
import { NewPaymentComponent } from './pages/sales/sales-payments/new-payment/new-payment.component';
import { NewCustomerComponent } from './pages/sales/sales-customers/new-customer/new-customer.component';
import { NewItemComponent } from './pages/sales/sales-items-management/new-item/new-item.component';
import { NewPurchaseInvoiceComponent } from './pages/purchase/purchase-invoices/new-purchase-invoice/new-purchase-invoice.component';
import { NewPurchasePaymentComponent } from './pages/purchase/purchase-payments/new-purchase-payment/new-purchase-payment.component';
import { NewSupplierComponent } from './pages/purchase/purchase-suppliers/new-supplier/new-supplier.component';
import { NewPurchaseItemComponent } from './pages/purchase/purchase-items/new-purchase-item/new-purchase-item.component';
import { NewJournalEntryComponent } from './pages/common/journal-entry/new-journal-entry/new-journal-entry.component';
import { NewPartyComponent } from './pages/common/party/new-party/new-party.component';
import { JournalEntryComponent } from './pages/common/journal-entry/journal-entry.component';
import { PartyComponent } from './pages/common/party/party.component';
import { CommonItemsComponent } from './pages/common/items/common-items.component';
import { NewItemComponent as NewCommonItemComponent } from './pages/common/items/new-item/new-item.component';
import { NewTaxTemplateComponent } from './pages/setup-organization/tax-templates/new-tax-template/new-tax-template.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'setup-wizard', component: SetupWizardComponent },
  { path: 'sidebar', component: SidebarComponent },

  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'get-started', component: GetStartedComponent },
      {
        path: 'setup',
        component: SetupItemsComponent
      },
      {
        path: 'setup/chart-of-accounts',
        component: ChartOfAccountsComponent
      },
      {
        path: 'setup/tax-templates',
        component: TaxTemplatesComponent
      },
      {
        path: 'setup/tax-templates/new',
        component: NewTaxTemplateComponent
      },
      {
        path: 'setup/import-wizard',
        component: ImportWizardComponent
      },
      {
        path: 'setup/print-templates',
        component: PrintTemplatesComponent
      },
      {
        path: 'setup/settings',
        component: SettingsComponent
      },
      {
        path: 'setup/sales-items-management',
        component: SalesItemsManagementComponent
      },
      {
        path: 'setup/customers',
        component: CustomersManagementComponent
      },
      {
        path: 'setup/purchase-items-management',
        component: SalesItemsManagementComponent
      },
      {
        path: 'setup/suppliers',
        component: CustomersManagementComponent
      },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'dashboard-main', component: DashboardMainComponent },
      { path: 'reports', component: ReportsSelectorComponent },
      { path: 'reports/general-ledger', component: ReportsComponent },
      { path: 'reports/profit-loss', component: ProfitLossComponent },
      { path: 'reports/balance-sheet', component: BalanceSheetComponent },
      { path: 'reports/trial-balance', component: TrialBalanceComponent },
      { path: 'sales/quotes', component: SalesQuotesComponent },
      { path: 'sales/quotes/new', component: NewQuoteComponent },
      { path: 'sales/invoices', component: SalesInvoicesComponent },
      { path: 'sales/invoices/new', component: NewInvoiceComponent },
      { path: 'sales/payments', component: SalesPaymentsComponent },
      { path: 'sales/payments/new', component: NewPaymentComponent },
      { path: 'sales/customers', component: SalesCustomersComponent },
      { path: 'sales/customers/new', component: NewCustomerComponent },
      { path: 'sales/items', component: SalesItemsMgmtComponent },
      { path: 'sales/items/new', component: NewItemComponent },
      { path: 'sales/items-detail', component: SalesItemsDetailComponent },
      { path: 'purchase/invoices', component: PurchaseInvoicesComponent },
      { path: 'purchase/invoices/new', component: NewPurchaseInvoiceComponent },
      { path: 'purchase/payments', component: PurchasePaymentsComponent },
      { path: 'purchase/payments/new', component: NewPurchasePaymentComponent },
      { path: 'purchase/suppliers', component: PurchaseSuppliersComponent },
      { path: 'purchase/suppliers/new', component: NewSupplierComponent },
      { path: 'purchase/items', component: PurchaseItemsComponent },
      { path: 'purchase/items/new', component: NewPurchaseItemComponent },
      { path: 'common/journal-entry', component: JournalEntryComponent },
      { path: 'common/journal-entry/new', component: NewJournalEntryComponent },
      { path: 'common/party', component: PartyComponent },
      { path: 'common/party/new', component: NewPartyComponent },
      { path: 'common/items', component: CommonItemsComponent },
      { path: 'common/items/new', component: NewCommonItemComponent },
    ]
  },

  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
