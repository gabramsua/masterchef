import { Component, Input, OnInit } from '@angular/core';
import { Valoracion } from 'src/app/models/models';

@Component({
  selector: 'puntuacion-detail',
  templateUrl: './puntuacion-detail.component.html',
  styleUrls: ['./puntuacion-detail.component.scss']
})
export class PuntuacionDetailComponent implements OnInit {
  @Input() puntos!: Valoracion; // {nombre: string, cantidad: number, estetica: number, sabor: number};


  constructor() { }

  ngOnInit(): void {
  }

}
