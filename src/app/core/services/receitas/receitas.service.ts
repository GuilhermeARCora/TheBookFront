import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Receita, ReceitaCard } from '../../../shared/types/receita';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReceitasService {

  http = inject(HttpClient);
  apiUrl = environment.apiUrl;
  private receitasSubject = new BehaviorSubject<ReceitaCard[]>([]);
  receitas$ = this.receitasSubject.asObservable();

  createReceita(form:Receita): Observable<void>{
    return this.http.post<void>(`${this.apiUrl}api/receita`, form);
  };

  editReceita(form:Receita, id:number): Observable<void>{
    return this.http.patch<void>(`${this.apiUrl}api/receita/${id}`, form);
  };

  // getReceitaById(id:number): Observable<Receita>{

  // };

  // getAllReceitas(): Observable<Receita[]>{

  // };

  // deleteReceita(id:number): void{

  // };

};
