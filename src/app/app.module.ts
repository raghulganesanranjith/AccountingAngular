import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Components
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
import { LayoutComponent } from './layout/layout.component';
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

// Forms + HTTP
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './pages/login/login.component';
import { GetStartedComponent } from './getstarted/getstarted.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SetupOrganizationComponent,
    SetupItemsComponent,
    TaxTemplatesComponent,
    ImportWizardComponent,
    PrintTemplatesComponent,
    SettingsComponent,
    DashboardComponent,
    DashboardMainComponent,
    ReportsComponent,
    ReportsSelectorComponent,
    ProfitLossComponent,
    BalanceSheetComponent,
    TrialBalanceComponent,
    ChartOfAccountsComponent,
    LayoutComponent,
    LoginComponent,
    GetStartedComponent,
    SidebarComponent,
    SalesItemsComponent,
    SalesQuotesComponent,
    SalesInvoicesComponent,
    SalesPaymentsComponent,
    CustomersComponent,
    SalesItemsDetailComponent,
    SalesItemsManagementComponent,
    CustomersManagementComponent,
    SalesCustomersComponent,
    SalesItemsMgmtComponent,
    PurchaseItemsComponent,
    PurchaseSuppliersComponent,
    PurchaseInvoicesComponent,
    PurchasePaymentsComponent,
    SetupWizardComponent,
    NewQuoteComponent,
    NewInvoiceComponent,
    NewPaymentComponent,
    NewCustomerComponent,
    NewItemComponent,
    NewPurchaseInvoiceComponent,
    NewPurchasePaymentComponent,
    NewSupplierComponent,
    NewPurchaseItemComponent,
    NewJournalEntryComponent,
    NewPartyComponent,
    JournalEntryComponent,
    PartyComponent,
    CommonItemsComponent,
    NewCommonItemComponent,
    NewTaxTemplateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
