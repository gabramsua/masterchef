import { Component, OnInit } from '@angular/core';
import { Cata, User } from 'src/app/models/models';
import { AuthService } from 'src/app/services/auth.service';
import Constants from 'src/constants';

@Component({
  selector: 'puntuaciones-de-cata',
  templateUrl: './puntuaciones-de-cata.component.html',
  styleUrls: ['./puntuaciones-de-cata.component.scss']
})
export class PuntuacionesDeCataComponent implements OnInit {

  tfnoCocinero!: number;
  currentUser!: User;
  jueces!: User[];
  catasRealizadasDelUsuario!: Cata[];

  constructor(public _service: AuthService,) { }

  ngOnInit(): void {
    this.tfnoCocinero = JSON.parse(localStorage.getItem('puntuacionesDeCocinero') || '{}')
    this.jueces = JSON.parse(localStorage.getItem('jueces') || '{}');
    // this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    console.log(this.tfnoCocinero)
    // 0. Guardar la fecha de la cata al establecer una fecha
    // 1. Traerse al user y sus fechas de catas
    // 2. Get Puntuaciones para cada fecha


    // if(this.user.cata1) this.getPuntuacionesDeCata(this.user.cata1)
    // if(this.user.cata2) this.getPuntuacionesDeCata(this.user.cata2)

    // ESTO NO ESTÁ FUNCIONANDO EN ABSOLUTO
    
  }
  getPuntuacionesDeCata(fechaDeCata: string) {
    // const fecha = '123-' + fechaDeCata;
    // const cata = this._service.get(Constants.END_POINTS.PUNTUACIONES, fecha);
    // console.log('Cata INFO: ', cata)

    
    // this._service.currentGet$.subscribe( puntuaciones => {
    //   console.log(puntuaciones)
    //   this.catasRealizadasDelUsuario.push(puntuaciones);
    // })
    // console.log('CaTAS DEL USER: ', this.catasRealizadasDelUsuario)
    // // this.catasRealizadasDelUsuario.push()
  }

}
