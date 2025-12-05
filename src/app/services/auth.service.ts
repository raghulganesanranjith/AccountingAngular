import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {}

  login(username: string, password: string) {
    // Mock API response (always success)
    const mockResponse = {
      status: 'success',
      message: 'Login successful',
      token: 'fake-jwt-token',
      user: {
        username: username
      }
    };

    // Return mock response after 1 second (fake API delay)
    return of(mockResponse).pipe(delay(1000));
  }
}
