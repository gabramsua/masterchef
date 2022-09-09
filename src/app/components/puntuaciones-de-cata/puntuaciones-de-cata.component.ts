import { Component, OnDestroy, OnInit } from '@angular/core';
import { Cata, User } from 'src/app/models/models';
import { AuthService } from 'src/app/services/auth.service';
import Constants from 'src/constants';
import * as moment from 'moment';

@Component({
  selector: 'puntuaciones-de-cata',
  templateUrl: './puntuaciones-de-cata.component.html',
  styleUrls: ['./puntuaciones-de-cata.component.scss']
})
export class PuntuacionesDeCataComponent implements OnInit{

  cocinero!: any;
  userSeleccionado!: User;
  jueces!: User[];
  catasRealizadasDelUsuario: Cata[] = [];
  allPuntuacionesDelUsuario: any[] = [];

  constructor(public _service: AuthService,) { }

  ngOnInit(): void {
    this.cocinero = JSON.parse(localStorage.getItem('puntuacionesDeCocinero') || '{}')
    this.jueces = JSON.parse(localStorage.getItem('jueces') || '{}');
    
    this.jueces.map((juez: any) => {
      if(juez.telefono == this.cocinero.telefono) {
        this.getAllPuntuaciones();
      }
    })
    
    this._service.puntuaciones$.subscribe( puntuaciones => {
      puntuaciones.sort((a, b) => (moment(a.id, 'DD-MM-YYYY').toDate().valueOf() > moment(b.id, 'DD-MM-YYYY').toDate().valueOf()) ? 1 : -1)
      this.allPuntuacionesDelUsuario = puntuaciones.filter( elem => elem.telefono == this.cocinero.telefono)
    })
    
    // 0. Guardar la fecha de la cata al establecer una fecha
    // 1. Traerse al user y sus fechas de catas
    // 2. Get Puntuaciones para cada fecha
    
  }

  // getAllCatas() {
  //   this._service.getAll(Constants.END_POINTS.CATAS)
  // }
  getAllPuntuaciones() {
    this._service.getAll(Constants.END_POINTS.PUNTUACIONES)
  }

}
