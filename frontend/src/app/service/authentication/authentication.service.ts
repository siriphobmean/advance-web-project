import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private apiSignIn = 'http://localhost:3000/signin';
  private apiSignUp = 'http://localhost:3000/signup';

  constructor(private http: HttpClient) { }

  signIn(username: string, password: string): Observable<any> {
    const payload = { username, password };
    return this.http.post<any>(this.apiSignIn, payload);
  }

  signUp(username: string, email: string, password: string): Observable<any> {
    const payload = { username, email, password };
    return this.http.post<any>(this.apiSignUp, payload);
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  setToken(token: string): void {
    if (this.isBrowser()) {
      localStorage.setItem('token', token);
    }
  }

  getToken(): string | null {
    if (this.isBrowser()) {
      return localStorage.getItem('token');
    }
    return null;
  }

  removeToken(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('token');
    }
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

}