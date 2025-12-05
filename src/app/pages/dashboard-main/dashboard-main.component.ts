import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-main',
  templateUrl: './dashboard-main.component.html',
  styleUrls: ['./dashboard-main.component.css']
})
export class DashboardMainComponent implements OnInit {
  boxes = [
    { title: 'General', desc: 'Set up your company information, email, country and fiscal year' },
    { title: 'Print', desc: 'Customize your invoices by adding a logo and address details' },
    { title: 'System', desc: 'Setup system defaults like date format and display precision' },
    { title: 'Review Accounts', desc: 'Review your chart of accounts, add any account or tax heads as needed' },
    { title: 'Opening Balances', desc: 'Set up your opening balances before performing any accounting entries' },
    { title: 'Add Taxes', desc: 'Set up your tax templates for your sales or purchase transactions' }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
