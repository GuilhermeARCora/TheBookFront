import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthUser, LoginPayload, LoginResponse, RegisterPayload, RegisterResponse } from '../../../shared/types/auth';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  http = inject(HttpClient);
  apiURL = environment.apiUrl;
  router = inject(Router);

  token = signal<string | null>(null);

  isLoggedIn = computed(() => !!this.token);

  constructor() {
    const stored = localStorage.getItem('jwtToken');
    if (stored) this.token.set(stored);
  };

  login(form:LoginPayload): Observable<LoginResponse>{
    return this.http.post<LoginResponse>(`${this.apiURL}login`, form).pipe(
       tap(response => {
          this.token.set(response.token);
          localStorage.setItem('jwtToken', response.token);
        })
    )
  };

  // register(form:RegisterPayload): Observable<RegisterResponse>{

  // };

  logout(){
    return this.http.delete(`${this.apiURL}logout`).pipe(
      tap(()=>{
          this.token.set(null);
          localStorage.removeItem('jwtToken');
          this.router.navigate(['/login']);
      })
    )
  };

  currentUserName(){

  }

};
