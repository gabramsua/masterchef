import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import Constants from 'src/constants';
import constants from 'src/constants';
import { Puntuaciones, User, Valoracion } from '../../models/models';

@Component({
  selector: 'app-clasificacion',
  templateUrl: './clasificacion.component.html',
  styleUrls: ['./clasificacion.component.scss']
})
export class ClasificacionComponent implements OnInit {
  clasificacion: any[] = [
    {
      nombre: 'Gabriel',
      apellidos: 'Ramos',
      telefono: '645303663',
      puntos: '0'
    },
    {
      nombre: 'Javier',
      apellidos: 'Armijo',
      telefono: '623469128',
      puntos: '0'
    },
    {
      nombre: 'Lucía',
      apellidos: 'Álvarez',
      telefono: '671498077',
      puntos: '0'
    },
    {
      nombre: 'Fernando',
      apellidos: 'Valencia',
      telefono: '647066682',
      puntos: '0'
    }
  ];
  puntuaciones!: Puntuaciones[];
  cocineros!: User[];
  jueces!: User[];
  platosDelCocinero: any[] = [];

  puntosGabri: any[] = [];
  puntosFernando: any[] = [];
  puntosJavi: any[] = [];
  puntosLucia: any[] = [];
  puntosAux: any[] = [];

  constructor(public _service: AuthService,) { }

  ngOnInit(): void {
    this.cocineros = JSON.parse(localStorage.getItem('jueces') || '{}').filter((elem:any) => elem.isAspirante);
    this.jueces = JSON.parse(localStorage.getItem('jueces') || '{}');
    
    // Hay que traerse todas las puntuaciones
    this._service.puntuaciones$.subscribe( puntuaciones => {
      this.puntuaciones = puntuaciones;
      this.filtrarPuntuacionesPorCocineros()
      
      // Calcular la media de cada uno
      this.clasificacion[0].puntos = isNaN(this.calcularNotaCocinero(this.puntosGabri)) ? 0.0 : this.calcularNotaCocinero(this.puntosGabri);
      this.clasificacion[1].puntos = isNaN(this.calcularNotaCocinero(this.puntosJavi)) ? 0.0 : this.calcularNotaCocinero(this.puntosJavi);
      this.clasificacion[2].puntos = isNaN(this.calcularNotaCocinero(this.puntosLucia)) ? 0.0 : this.calcularNotaCocinero(this.puntosLucia);
      this.clasificacion[3].puntos = isNaN(this.calcularNotaCocinero(this.puntosFernando)) ? 0.0 : this.calcularNotaCocinero(this.puntosFernando);

      // Ordenar la clasificación
      this.clasificacion.sort((a,b) => a.puntos - b.puntos).reverse();
    })

    this.getAllPuntuaciones();
  }
  getAllPuntuaciones() {
    this._service.getAll(constants.END_POINTS.PUNTUACIONES);
  }

  filtrarPuntuacionesPorCocineros(){
    // Filtrarlas por Cocinero
    this.puntuaciones.map((puntuacion: any) => {
      let valoraciones: any[] = [];
      this.puntosAux = [];
      this.cocineros.map((cocinero: User) => {
        if(puntuacion.telefono == cocinero.telefono)
          
          switch(cocinero.telefono.toString()){
            case Constants.COCINEROS.GABRI:
                this.jueces.map((juez: any) => {
                  valoraciones.push( {...puntuacion[juez.telefono]} );
                })
                valoraciones.map((valor:any) => {
                  if(Object.keys(valor).length > 1){
                    this.puntosAux.push({ media: this.calcularMedia(valor[0]) });
                    this.puntosAux.push({ media: this.calcularMedia(valor[1]) });
                    this.puntosAux.push({ media: this.calcularMedia(valor[2]) });
                  }
                })
                this.puntosAux.sort((a,b) => a.media - b.media).reverse();
                this.puntosGabri.push(this.puntosAux.filter((elem:any) => elem.media !== '0.0'))
                break;

            case Constants.COCINEROS.POLI:
                this.jueces.map((juez: any) => {
                  valoraciones.push( {...puntuacion[juez.telefono]} );
                })
                valoraciones.map((valor:any) => {
                  if(Object.keys(valor).length > 1){
                    this.puntosAux.push({ media: this.calcularMedia(valor[0]) });
                    this.puntosAux.push({ media: this.calcularMedia(valor[1]) });
                    this.puntosAux.push({ media: this.calcularMedia(valor[2]) });
                  }
                })
                this.puntosAux.sort((a,b) => a.media - b.media).reverse();
                this.puntosJavi.push(this.puntosAux.filter((elem:any) => elem.media !== '0.0'))
                break;

                
            case Constants.COCINEROS.FERNANDO:
                this.jueces.map((juez: any) => {
                  valoraciones.push( {...puntuacion[juez.telefono]} );
                })
                valoraciones.map((valor:any) => {
                  if(Object.keys(valor).length > 1){
                    this.puntosAux.push({ media: this.calcularMedia(valor[0]) });
                    this.puntosAux.push({ media: this.calcularMedia(valor[1]) });
                    this.puntosAux.push({ media: this.calcularMedia(valor[2]) });
                  }
                })
                this.puntosAux.sort((a,b) => a.media - b.media).reverse();
                this.puntosFernando.push(this.puntosAux.filter((elem:any) => elem.media !== '0.0'))
                break;

                
            case Constants.COCINEROS.LUCIA:
                this.jueces.map((juez: any) => {
                  valoraciones.push( {...puntuacion[juez.telefono]} );
                })
                valoraciones.map((valor:any) => {
                  if(Object.keys(valor).length > 1){
                    this.puntosAux.push({ media: this.calcularMedia(valor[0]) });
                    this.puntosAux.push({ media: this.calcularMedia(valor[1]) });
                    this.puntosAux.push({ media: this.calcularMedia(valor[2]) });
                  }
                })
                this.puntosAux.sort((a,b) => a.media - b.media).reverse();
                this.puntosLucia.push(this.puntosAux.filter((elem:any) => elem.media !== '0.0'))
                break;
          }
      })
    })
  }

  calcularMedia(puntos: Valoracion) {
    return ((puntos.cantidad + puntos.estetica + puntos.sabor) / 3).toPrecision(2); // toFixed(2)
  }

  calcularNotaCocinero( notas: any[] ) {
    let numeroValoraciones: number = 0;
    let notasValoraciones: number = 0;
    
    // Es un array de arrays de notas
    notas.map((elem:any[]) => {
      numeroValoraciones += elem.length;
      elem.map((e:any) => {
        notasValoraciones += parseFloat(e.media)
      })
    })

    return notasValoraciones/numeroValoraciones;
  }
}
