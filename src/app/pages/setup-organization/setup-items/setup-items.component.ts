import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface SetupOption {
  title: string;
  description: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-setup-items',
  templateUrl: './setup-items.component.html',
  styleUrls: ['./setup-items.component.css']
})
export class SetupItemsComponent {
  setupItems: SetupOption[] = [
    {
      title: 'Chart of Accounts',
      description: 'Review and manage your chart of accounts',
      icon: 'fas fa-chart-pie',
      route: '/setup/chart-of-accounts'
    },
    {
      title: 'Tax Templates',
      description: 'Create and manage tax templates',
      icon: 'fas fa-file-invoice-dollar',
      route: '/setup/tax-templates'
    },
    {
      title: 'Import Wizard',
      description: 'Import data from previous system',
      icon: 'fas fa-download',
      route: '/setup/import-wizard'
    },
    {
      title: 'Print Templates',
      description: 'Customize print templates for documents',
      icon: 'fas fa-print',
      route: '/setup/print-templates'
    },
    {
      title: 'Settings',
      description: 'Configure system and business settings',
      icon: 'fas fa-cog',
      route: '/setup/settings'
    }
  ];

  constructor(private router: Router) {}

  navigateToSetup(route: string): void {
    this.router.navigate([route]);
  }
}
