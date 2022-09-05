import { Component, OnInit } from '@angular/core';
import { Cata, PuntuacionesDeCata, User, Valoracion } from 'src/app/models/models';
import constants from 'src/constants';
import { AuthService } from 'src/app/services/auth.service';
import { Puntuaciones } from '../../models/models';

@Component({
  selector: 'app-puntuaciones',
  templateUrl: './puntuaciones.component.html',
  styleUrls: ['./puntuaciones.component.scss']
})
export class PuntuacionesComponent implements OnInit {
  jueces!: User[];
  puntuaciones!: Puntuaciones[];
  catas!: Cata[];
  puntuacionesDeJuezSeleccionado: any; // PuntuacionesDeCata[] = [];

  constructor(public _service: AuthService,) { }

  ngOnInit(): void {
    this._service.puntuaciones$.subscribe( puntuaciones => {
      this.puntuaciones = puntuaciones;
    })
    this._service.catas$.subscribe( catas => {
      this.catas = catas;
    })

    this.jueces = JSON.parse(localStorage.getItem('jueces') || '{}');

    this.getAllPuntuaciones();
    this.getAllCatas();
  }
  getAllPuntuaciones() {
    this._service.getAll(constants.END_POINTS.PUNTUACIONES);
  }
  getAllCatas() {
    this._service.getAll(constants.END_POINTS.CATAS);
  }
  handleClickJuez(juez:User) {
    this.puntuacionesDeJuezSeleccionado = [];
    let puntuacionesOrdenada: any[] = [];
    
    // Recorrer todas las puntuaciones e ir guardando en un array las que sean del juez seleccionado
    // Guardar también la fecha para mostrar info en el template
    this.puntuaciones.map( (elem: any) => {
      if(elem[juez.telefono] !== undefined) {
        elem[juez.telefono].forEach((valoracion: any) => {
          if(typeof(valoracion) !== 'string') {
            valoracion.fecha = elem.id,
            valoracion.cocinero = elem.cocinero 
          }
        })
        puntuacionesOrdenada.push(elem[juez.telefono])
      }
    })
    // Sort por puntuación media
    puntuacionesOrdenada[0].sort((a:Valoracion, b:Valoracion) => this.calcularMedia(a) < this.calcularMedia(b) ? 1 : -1)

    // this.puntuacionesDeJuezSeleccionado = [...puntuacionesOrdenada];
    // this.puntuacionesDeJuezSeleccionado = this.puntuacionesDeJuezSeleccionado[0];

    puntuacionesOrdenada[0].map((x:any) => {
      // Evitamos el field nombre
      if(typeof(x) !== 'string')this.puntuacionesDeJuezSeleccionado.push(x);
    })
  }
  calcularMedia(puntos: Valoracion) {
    return ((puntos.cantidad + puntos.estetica + puntos.sabor) / 3).toPrecision(2); // toFixed(2)
  }

}
