import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {MatSelectModule} from '@angular/material/select';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-meu-livro',
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatInputModule],
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

  foods: any[] = [
      {value: 'Salgado-0', viewValue: 'Salgado'},
      {value: 'sobremesa-1', viewValue: 'Sobremesa'},
      {value: 'bebida-2', viewValue: 'Bebida'},
      {value: 'fitness-2', viewValue: 'Fitness'},
    ];
    foodControl = new FormControl(this.foods[2].value);
    form = new FormGroup({
      food: this.foodControl
    });


};
