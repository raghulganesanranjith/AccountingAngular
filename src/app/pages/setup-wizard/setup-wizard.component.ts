import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

interface CompanyData {
  companyName: string;
  email: string;
  fullName: string;
  bankName: string;
  country: string;
}

@Component({
  selector: 'app-setup-wizard',
  templateUrl: './setup-wizard.component.html',
  styleUrls: ['./setup-wizard.component.css']
})
export class SetupWizardComponent implements OnInit {
  formData: Partial<CompanyData> = {
    country: 'India'
  };

  errors: Record<string, string> = {};
  loading = false;

  countries = [
    'India', 'United States', 'United Kingdom', 'Canada', 'Australia',
    'Germany', 'France', 'Japan', 'China', 'Mexico', 'Brazil', 'Singapore'
  ];

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {}

  validateForm(): boolean {
    this.errors = {};

    if (!this.formData.companyName?.trim()) {
      this.errors['companyName'] = 'Company name is required';
    }
    if (!this.formData.email?.trim()) {
      this.errors['email'] = 'Email is required';
    } else if (!this.isValidEmail(this.formData.email)) {
      this.errors['email'] = 'Invalid email format';
    }
    if (!this.formData.fullName?.trim()) {
      this.errors['fullName'] = 'Full name is required';
    }
    if (!this.formData.bankName?.trim()) {
      this.errors['bankName'] = 'Bank name is required';
    }
    if (!this.formData.country?.trim()) {
      this.errors['country'] = 'Country is required';
    }

    return Object.keys(this.errors).length === 0;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  submit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;

    // ---- CALL API: POST /api/createcompany ----
    this.apiService.createCompany({
      companyName: this.formData.companyName!,
      email: this.formData.email!,
      fullName: this.formData.fullName!,
      bankName: this.formData.bankName!,
      country: this.formData.country!
    }).subscribe(
      (response) => {
        this.loading = false;
        alert(response.message);
        this.router.navigate(['/home']);
      },
      (error) => {
        this.loading = false;
        console.error('Error creating company:', error);
        alert('Error creating company. Please try again.');
      }
    );
    // ---- API CALL END ----
  }

  cancel(): void {
    this.router.navigate(['/home']);
  }
}
