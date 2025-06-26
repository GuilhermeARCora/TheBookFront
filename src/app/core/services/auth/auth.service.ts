import { GetUserNameResponse, LoginPayload, LoginResponse } from './../../../shared/types/auth';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { RegisterPayload } from '../../../shared/types/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = environment.apiUrl;
  http = inject(HttpClient);
  router = inject(Router);

  token = signal<string | null>(null);
  isUserLoggedIn = computed(() => !!this.token());
  userName = signal<string | null>(null);
  initialized = signal(false);

  register(form:RegisterPayload): Observable<void>{
    return this.http.post<void>(`${this.apiUrl}permitted/cadastro`, form)
  };

  login(form:LoginPayload): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}permitted/login`, form).pipe(
      tap((res) => {
        const token = res.access_token
        this.token.set(token)
        localStorage.setItem("access_token", token);
      }),
      tap(() => {
      this.getUserName().subscribe();
    })
    )
  };

  logout(): void{
    this.clearSession();
    this.redirectToHome();
  };

  getUserName(): Observable<GetUserNameResponse>{

    const cached = this.userName();

    if (cached) {
      return of({ nome: cached });
    };

    return this.http.get<GetUserNameResponse>(`${this.apiUrl}api/usuario`).pipe(
      tap((res)=>{
        const userName = res.nome;
        this.userName.set(userName);
      })
    )
  };

  initFromStorage(): void {

    if (this.initialized()) return;
    this.initialized.set(true);

    const token = localStorage.getItem('access_token');
    if (token) {
      this.token.set(token);
      this.getUserName().subscribe();
    }
  };

  clearSession(): void{
    this.token.set(null);
    localStorage.removeItem("access_token");
    this.reloadPage();
  };

  reloadPage(){
    window.location.reload();
  };

  redirectToHome():void{
    this.router.navigate(['/']);
  };

};
