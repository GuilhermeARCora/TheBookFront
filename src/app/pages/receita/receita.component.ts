import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { ReceitasService } from '../../core/services/receitas/receitas.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-ver-receita',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './receita.component.html',
  styleUrls: ['./receita.component.scss']
})
export class ReceitaComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private service = inject(ReceitasService);
  private location = inject(Location);

  /** sinal que guarda a receita carregada */
  receita = signal<any | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.service.getReceitaById(id).subscribe({
      next: r => this.receita.set(r),
      error: () => {
        // aqui você pode tratar erros (404, etc.)
        this.receita.set(null);
      }
    });
  }

  goBack(): void {
    // volta à rota anterior
    this.location.back();
  }
}
