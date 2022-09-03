import { Component, OnInit } from '@angular/core';
import { Cata, Plato, PuntuacionesDeCata, User } from 'src/app/models/models';
import Constants from 'src/constants';
import { AuthService } from 'src/app/services/auth.service';
import { Valoracion } from '../../models/models';

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
  jueces!: User[];
  puntuacionesDeLaCata: PuntuacionesDeCata[] = [];
  puntuacionesDePlatoSeleccionado: any[] = [];

  constructor(public _service: AuthService,) { }

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
    // Jueces
    this.jueces = JSON.parse(localStorage.getItem('jueces') || '{}');

    // Get Puntuaciones De la cata
    this.getPuntuacionesDeCata();
  }
  getPuntuacionesDeCata() {    
    const fecha = this.cata.fecha;
    this._service.get(Constants.END_POINTS.PUNTUACIONES, fecha);    
    this._service.currentGet$.subscribe( puntuaciones => {
      this.puntuacionesDeLaCata.push(puntuaciones);
    })
  }

  puntuacionesDePlato(platoSeleccionado: number) {
    this.puntuacionesDePlatoSeleccionado = [];

    // Seleccionar el plato dentro de cada juez
    this.puntuacionesDeLaCata.map( (elem:any) => {
      this.jueces.map((juez:User) => {
        if(elem[juez.telefono] !== undefined) {        
          this.puntuacionesDePlatoSeleccionado.push({
            cantidad: elem[juez.telefono][platoSeleccionado]?.cantidad,
            estetica: elem[juez.telefono][platoSeleccionado]?.estetica,
            sabor:elem[juez.telefono][platoSeleccionado]?.sabor,
            nombre: elem[juez.telefono][3],
          })
        }
      })
    })
  }
}
