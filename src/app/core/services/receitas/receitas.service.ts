import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { Receita } from '../../../shared/types/receita';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReceitasService {

  http = inject(HttpClient);
  apiUrl = environment.apiUrl;
  private receitasSubject = new BehaviorSubject<any[]>([]);
  receitas$ = this.receitasSubject.asObservable();

  createReceita(form:Receita): Observable<void>{
    return this.http.post<void>(`${this.apiUrl}api/receita`, form);
  };

  editReceita(form:Receita, id:number): Observable<void>{
    return this.http.patch<void>(`${this.apiUrl}api/receita/${id}`, form);
  };

  getReceitaById(id:number): Observable<Receita>{
    return this.http.get<Receita>(`${this.apiUrl}api/receita/${id}`);
  };

  loadMinhasReceitas(): void {
    this.http
      // 1) Informe ao TS que o retorno é { receitas: Receita[] }
      .get<{ receitas: any[] }>(`${this.apiUrl}api/receita/minhasReceitas`)
      .pipe(
        // 2) Extraia só o array
        map(response => response.receitas),
        // 3) Atualize o BehaviorSubject
        tap(arr => this.receitasSubject.next(arr))
      )
      .subscribe({
        error: err => console.error('Erro ao carregar receitas', err)
      });
  }

  // deleteReceita(id:number): void{

  // };

};
