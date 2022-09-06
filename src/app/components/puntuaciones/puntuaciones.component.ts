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
  puntosAux: any[] = [];
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
  arrayDeFechas: any[] = [];

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
    this.puntosAux = [];
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
        this.puntosAux.push(elem[juez.telefono]);
        puntuacionesOrdenada.push(elem[juez.telefono]);
      }
    })
    
    this.puntosAux = this.puntosAux.filter((elem:any) => elem[0].sabor > 0);

    if(puntuacionesOrdenada[0] != undefined){
      // this.puntuacionesDeJuezSeleccionado.push(this.puntosAux.filter((elem:any) => elem.media !== '0.0'))
      this.puntosAux.map((elem:any) => {
          this.puntuacionesDeJuezSeleccionado = this.puntuacionesDeJuezSeleccionado.concat(elem[0], elem[1], elem[2]);
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

    // Agrupar el listado de platos por nombre => ¿calcular las medias?
    this.platos = this.platos.filter((elem:any) => elem.media != '0.0')

    let nombresDePlato:any = new Set();
    let arrayTemporal:any[] = []
    
    this.platos.map((plato:any, index) => {
      arrayTemporal.push({nombrePlato: plato.nombrePlato, media: plato.media, fecha: plato.fecha});
      nombresDePlato.add(plato.nombrePlato);
    })
    
    let arrayPuntos:any = new Array(nombresDePlato.size).fill(0); // [0,0, ... , 0]     
    let arrayFechas:any = new Array(nombresDePlato.size) 
    nombresDePlato.forEach((nombrePlato:string, index: number) => {
      // Buscamos todos los puntos con ese nombre
      let platosConMismoNombre: any[] = arrayTemporal.filter((elem: any) => elem.nombrePlato == nombrePlato)
      platosConMismoNombre.map((plato:any) => {
        arrayPuntos[index] = arrayPuntos[index] ?? 0
        arrayPuntos[index] += parseFloat(plato.media);

        arrayFechas[index] = arrayFechas[index] ?? ''
        arrayFechas[index] = plato.fecha;
      })
      this.arrayDeFechas = arrayFechas;
      
      this.platosPuntuados.push({ 
        nombrePlato: nombrePlato, 
        media: parseFloat(arrayPuntos[index])/platosConMismoNombre.length,
        fecha: arrayFechas[nombrePlato].fecha
      })
    });

    this.platosPuntuados.sort((a,b) => a.media - b.media).reverse();
  }

  handleClickPlato(plato: any) {
    // Buscar plato en las catas y traerse la información y la foto
    let platoAux: Plato = {};
    
    // plato.fecha = this.arrayDeFechas[plato.nombrePlato].fecha
    // No funciona pero en la condicion del if de L.182 lo hemos guardado previamente
    // en otro array de fechas con esta única finalidad

    this.catas.map((cata:Cata) => {
      if(cata.id == this.arrayDeFechas[plato.nombrePlato]) {
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
