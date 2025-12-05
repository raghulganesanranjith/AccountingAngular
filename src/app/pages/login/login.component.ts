import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  loading = false;

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

  login() {
    if (!this.username.trim() || !this.password.trim()) {
      alert('Please enter username and password');
      return;
    }

    this.loading = true;

    // ---- CALL API: POST /api/login ----
    this.apiService.login({
      username: this.username,
      password: this.password
    }).subscribe(
      (response) => {
        this.loading = false;
        alert(response.message);
        localStorage.setItem('token', response.token);
        this.router.navigate(['/home']);
      },
      (error) => {
        this.loading = false;
        console.error('Login error:', error);
        alert('Login failed. Please try again.');
      }
    );
    // ---- API CALL END ----
  }
}

