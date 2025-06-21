import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-meu-livro',
  imports: [],
  templateUrl: './meu-livro.component.html',
  styleUrl: './meu-livro.component.scss'
})
export class MeuLivroComponent implements OnInit{

  route = inject(ActivatedRoute);

  id = signal<string | null>(null);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id.set(idParam);
  };

};
