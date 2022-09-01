import { Component, Input, OnInit } from '@angular/core';
import { Valoracion } from 'src/app/models/models';

@Component({
  selector: 'puntuacion-detail',
  templateUrl: './puntuacion-detail.component.html',
  styleUrls: ['./puntuacion-detail.component.scss']
})
export class PuntuacionDetailComponent implements OnInit {
  @Input() puntos!: Valoracion;
  puntuacionMedia: any = 0;

  constructor() { }

  ngOnInit(): void {
    this.puntuacionMedia = ((this.puntos.cantidad + this.puntos.estetica + this.puntos.sabor) / 3).toPrecision(2); // toFixed(2)
  }

}
