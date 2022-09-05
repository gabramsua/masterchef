import { Component, OnInit } from '@angular/core';
import { Cata, PuntuacionesDeCata, User, Valoracion } from 'src/app/models/models';
import constants from 'src/constants';
import { AuthService } from 'src/app/services/auth.service';
import { Puntuaciones } from '../../models/models';
interface Orden {
  value: string;
  viewValue: string;
}
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

  ordenes: Orden[] = [
    {viewValue: 'Mayor a Menor', value: '0'},
    {viewValue: 'Menor a Mayor', value: '1'},
    // {viewValue: 'Cronológico', value: '2'},
  ];
  selectedOrden = this.ordenes[0].value;

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

    // // Sort por puntuación media
    // puntuacionesOrdenada[0].sort((a:Valoracion, b:Valoracion) => this.calcularMedia(a) < this.calcularMedia(b) ? 1 : -1)

    // this.puntuacionesDeJuezSeleccionado = [...puntuacionesOrdenada];
    // this.puntuacionesDeJuezSeleccionado = this.puntuacionesDeJuezSeleccionado[0];

    puntuacionesOrdenada[0].map((x:any) => {
      // Evitamos el field nombre
      if(typeof(x) !== 'string')this.puntuacionesDeJuezSeleccionado.push(x);
    })

    this.selectOrden(this.selectedOrden);
    // this.puntuacionesDeJuezSeleccionado.sort((a:Valoracion, b:Valoracion) => this.calcularMedia(a) < this.calcularMedia(b) ? 1 : -1)
  }
  calcularMedia(puntos: Valoracion) {
    return ((puntos.cantidad + puntos.estetica + puntos.sabor) / 3).toPrecision(2); // toFixed(2)
  }
  selectOrden(orden: string) {
    // this.selectedOrden = (event.target as HTMLSelectElement).value;
    console.log('ORDENAR POR ', orden)
    this.selectedOrden =  this.ordenes[parseInt(orden)].value
    switch (orden){
      case '0':
        this.puntuacionesDeJuezSeleccionado.sort((a:Valoracion, b:Valoracion) => this.calcularMedia(a) < this.calcularMedia(b) ? 1 : -1)
        break;
      case '1':
        this.puntuacionesDeJuezSeleccionado.sort((a:Valoracion, b:Valoracion) => this.calcularMedia(a) > this.calcularMedia(b) ? 1 : -1)
        break;
      // case '2':
      //   this.puntuacionesDeJuezSeleccionado.sort((a:Valoracion, b:Valoracion) => a < b ? 1 : -1)
      //   break;
      default:
        this.puntuacionesDeJuezSeleccionado.sort((a:Valoracion, b:Valoracion) => this.calcularMedia(a) < this.calcularMedia(b) ? 1 : -1)
        break;
    }
  }

}
