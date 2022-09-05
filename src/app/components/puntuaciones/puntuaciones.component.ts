import { Component, OnInit } from '@angular/core';
import { Cata, PuntuacionesDeCata, User, Valoracion } from 'src/app/models/models';
import constants from 'src/constants';
import { AuthService } from 'src/app/services/auth.service';
import { Puntuaciones, Plato } from '../../models/models';
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

  platos: any[] = [];
  platosPuntuados: any[] = [];
  platoSeleccionado!: Plato;

  ordenes: Orden[] = [
    {viewValue: 'Mayor a Menor', value: '0'},
    {viewValue: 'Menor a Mayor', value: '1'},
    // {viewValue: 'Cronológico', value: '2'},
  ];
  selectedOrden = this.ordenes[0].value;

  constructor(public _service: AuthService,) { }

  ngOnInit(): void {
    this.jueces = JSON.parse(localStorage.getItem('jueces') || '{}');
    
    this._service.puntuaciones$.subscribe( puntuaciones => {
      this.puntuaciones = puntuaciones;
      this.getAllPlatos();
    })
    this._service.catas$.subscribe( catas => {
      this.catas = catas;
    })


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
    
    if(puntuacionesOrdenada[0] != undefined){
      puntuacionesOrdenada[0].map((x:any) => {
        // Evitamos el field nombre
        if(typeof(x) !== 'string' && parseInt(this.calcularMedia(x)) > 0) {
          this.puntuacionesDeJuezSeleccionado.push(x);
        }
      })

      this.selectOrden(this.selectedOrden);
    }
  }

  calcularMedia(puntos: Valoracion) {
    return ((puntos.cantidad + puntos.estetica + puntos.sabor) / 3).toPrecision(2); // toFixed(2)
  }

  selectOrden(orden: string) {
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

  getAllPlatos() {
    // Queremos todos los platos y sus valoraciones medias. 
    // Habrá que asociar las puntuaciones -que ya tenemos- con los platos a los que pertenecen
    
    let valoraciones: any[] = [];
    this.puntuaciones.map((puntuacion: any) => {
      // console.log(puntuacion)
      this.jueces.map((juez: any) => {
        valoraciones.push( {...puntuacion[juez.telefono], fecha: puntuacion.id} );
      })
    })

    valoraciones.map((valor:any) => {
      if(Object.keys(valor).length > 1){
        this.platos.push({ ...valor[0], media: this.calcularMedia(valor[0]), fecha: valor.fecha });
        this.platos.push({ ...valor[1], media: this.calcularMedia(valor[1]), fecha: valor.fecha });
        this.platos.push({ ...valor[2], media: this.calcularMedia(valor[2]), fecha: valor.fecha });
      }
    })

    this.platos.sort((a,b) => a.media - b.media).reverse();// .filter(plato => parseInt(plato.media) > 0);
    this.platos.map((plato: any) => {
      if(plato.media !== '0.0')this.platosPuntuados.push(plato)
    })
  }

  handleClickPlato(plato: any) {
    // Buscar plato en las catas y traerse la información y la foto
    let platoAux: Plato = {};

    this.catas.map((cata:Cata) => {
      if(cata.id == plato.fecha) {
        // No sabemos si el plato es entrante, principal o postre => pero tenemos su nombre
        if(cata.nombreEntrante == plato.nombrePlato){
          platoAux.nombre = cata.nombreEntrante
          platoAux.descripcion = cata.descripcionEntrante;
          platoAux.foto = cata.fotoEntrante;
        }
        else if(cata.nombrePrincipal == plato.nombrePlato){
          platoAux.nombre = cata.nombrePrincipal
          platoAux.descripcion = cata.descripcionPrincipal;
          platoAux.foto = cata.fotoPrincipal;
        }
        else if(cata.nombrePostre == plato.nombrePlato){
          platoAux.nombre = cata.nombrePostre
          platoAux.descripcion = cata.descripcionPostre;
          platoAux.foto = cata.fotoPostre;
        }

        this.platoSeleccionado = platoAux;
      }
    })


  }

}
