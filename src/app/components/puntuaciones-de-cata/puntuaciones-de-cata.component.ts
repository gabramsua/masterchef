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
  allPuntuacionesDelUsuarioCata1: any[] = [];
  allPuntuacionesDelUsuarioCata2: any[] = [];

  
  platos: any[] = [
    {viewValue: '', value: '100'},
    {viewValue: 'Entrante', value: '0'},
    {viewValue: 'Principal', value: '1'},
    {viewValue: 'Postre', value: '2'},
  ];
  selectedOrden = this.platos[0].value;
  selectedOrden2 = this.platos[0].value;

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
      console.log(this.allPuntuacionesDelUsuario)
    })
    
    // 0. Guardar la fecha de la cata al establecer una fecha
    // 1. Traerse al user y sus fechas de catas
    // 2. Get Puntuaciones para cada fecha

    // YO CREO QUE YA SE PUEDEN MOSTRAR LAS PUNTUACIONES
    
  }

  getAllPuntuaciones() {
    this._service.getAll(Constants.END_POINTS.PUNTUACIONES)
  }

  verCata(i: number){
    console.log('Click ver Cata', i)
  }
  getAllPuntuacionesDelUsuario(index: number) {
    return this.allPuntuacionesDelUsuario[index];
  }
  selectPlato(index: number, plato: string) {

    if(parseInt(plato) != 100) {
      if(index == 0) {
        this.selectedOrden =  this.platos[parseInt(plato)].value
        this.allPuntuacionesDelUsuarioCata1 = [];
      }
      if(index == 1) {
        this.selectedOrden2 =  this.platos[parseInt(plato)].value
        this.allPuntuacionesDelUsuarioCata2 = [];
      }

      const array = {...this.allPuntuacionesDelUsuario[index]}
      
      for (const property in array) {
        this.jueces.map((juez:User) => {
          if(property == juez.telefono) {
            if(index == 0) this.allPuntuacionesDelUsuarioCata1.push(array[property][parseInt(plato)]);
            if(index == 1) this.allPuntuacionesDelUsuarioCata2.push(array[property][parseInt(plato)]);
          }
        })
      }
    } else {
      
      if(index == 0) {
        this.allPuntuacionesDelUsuarioCata1 = [];
      }
      if(index == 1) {
        this.allPuntuacionesDelUsuarioCata2 = [];
      }
    }
  }

}
