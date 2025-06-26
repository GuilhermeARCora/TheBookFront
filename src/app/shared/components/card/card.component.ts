import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-card',
  imports: [MatCardModule, CommonModule, MatIconModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {

@Input() nome = '';
@Input() categoria = '';
@Input() id!: number;

@Output() acao1 = new EventEmitter<number>();
@Output() acao2 = new EventEmitter<number>();

  inserirAcao(): void {
    this.acao1.emit(this.id);
  };

  outraAcao(): void {
    this.acao2.emit(this.id);
  };

};
