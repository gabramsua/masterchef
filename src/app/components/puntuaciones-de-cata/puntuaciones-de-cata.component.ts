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

  user!: User;
  catasRealizadasDelUsuario!: Cata[];

  constructor(public _service: AuthService,) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if(this.user.cata1) this.getPuntuacionesDeCata(this.user.cata1)
    if(this.user.cata2) this.getPuntuacionesDeCata(this.user.cata2)

    // ESTO NO ESTÁ FUNCIONANDO EN ABSOLUTO
    
  }
  getPuntuacionesDeCata(fechaDeCata: string) {
    const fecha = '123-' + fechaDeCata;
    const cata = this._service.get(Constants.END_POINTS.PUNTUACIONES, fecha);
    console.log('Cata INFO: ', cata)

    
    this._service.currentGet$.subscribe( puntuaciones => {
      console.log(puntuaciones)
      this.catasRealizadasDelUsuario.push(puntuaciones);
    })
    console.log('CaTAS DEL USER: ', this.catasRealizadasDelUsuario)
    // this.catasRealizadasDelUsuario.push()
  }

}
