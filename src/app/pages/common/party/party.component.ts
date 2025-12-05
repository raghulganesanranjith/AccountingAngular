import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Party {
  id: string;
  name: string;
  type: 'Customer' | 'Supplier' | 'Vendor';
  email: string;
  phone: string;
  address: string;
  created: string;
}

@Component({
  selector: 'app-party',
  templateUrl: './party.component.html',
  styleUrls: ['./party.component.css']
})
export class PartyComponent implements OnInit {
  parties: Party[] = [];
  showForm = false;
  editingParty: Party | null = null;

  mockParties: Party[] = [
    {
      id: '1',
      name: 'ABC Corporation',
      type: 'Customer',
      email: 'contact@abc.com',
      phone: '555-0101',
      address: '123 Business St, City',
      created: new Date().toISOString().split('T')[0]
    },
    {
      id: '2',
      name: 'XYZ Suppliers',
      type: 'Supplier',
      email: 'sales@xyz.com',
      phone: '555-0102',
      address: '456 Supply Ave, City',
      created: new Date().toISOString().split('T')[0]
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadParties();
  }

  loadParties(): void {
    this.parties = this.mockParties;
  }

  createNewParty(): void {
    this.router.navigate(['/common/party/new']);
  }

  editParty(party: Party): void {
    this.editingParty = { ...party };
    this.showForm = true;
  }

  deleteParty(party: Party): void {
    if (confirm(`Delete party ${party.name}?`)) {
      this.parties = this.parties.filter(p => p.id !== party.id);
    }
  }

  closeForm(): void {
    this.showForm = false;
    this.editingParty = null;
  }

  submitForm(): void {
    if (this.editingParty) {
      const index = this.parties.findIndex(p => p.id === this.editingParty?.id);
      if (index > -1) {
        this.parties[index] = { ...this.editingParty };
      } else {
        this.editingParty.id = 'party-' + Date.now();
        this.parties.push({ ...this.editingParty });
      }
    }
    this.closeForm();
  }
}
