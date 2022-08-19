import { Component, OnInit } from '@angular/core';
import { Cata, Plato } from 'src/app/models/models';

@Component({
  selector: 'app-ver-cata',
  templateUrl: './ver-cata.component.html',
  styleUrls: ['./ver-cata.component.scss']
})
export class VerCataComponent implements OnInit {
  cata!: Cata;
  platoEntrante!: Plato;
  platoPrincipal!: Plato;
  platoPostre!: Plato;

  constructor() { }

  ngOnInit(): void {
    this.cata = JSON.parse(localStorage.getItem('currentCata') || '{}');

    this.platoEntrante = {
      nombre: this.cata.nombreEntrante ?? 'sin nombre',
      descripcion: this.cata.descripcionEntrante ?? 'sin descripcion',
      foto: this.cata.fotoEntrante ?? ''
    }
    this.platoPrincipal = {
      nombre: this.cata.nombrePrincipal ?? 'sin nombre',
      descripcion: this.cata.descripcionPrincipal ?? 'sin descripcion',
      foto: this.cata.fotoPrincipal ?? ''
    }
    this.platoPostre = {
      nombre: this.cata.nombrePostre ?? 'sin nombre',
      descripcion: this.cata.descripcionPostre ?? 'sin descripcion',
      foto: this.cata.fotoPostre ?? ''
    }
  }

}
