import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import constants from 'src/constants';
import { Cata, FechaPropuesta, User } from 'src/app/models/models';
import * as moment from 'moment';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.scss']
})
export class CalendarioComponent implements OnInit {

  selectedDate!: Date;
  catas!: Cata[];
  hoy = new Date();
  user!: User;
  estadoCalendario = constants.ESTADOS_CALENDARIO.LISTA;
  showDatepicker = false;

  fechasPropuestas: FechaPropuesta[] = [];
  tituloModal: string = '';
  userDeCataModal: string = '';
  usuariosAFavorModal: string[] = [];
  usuariosEnContraModal: string[] = [];
  indexFechaAbierta: number= 0;

  constructor(public _service: AuthService) { }

  ngOnInit(): void {
    this._service.catas$.subscribe( catas => {
      // Sort Catas by Date DESC
      catas.sort((a, b) => (moment(a.id, 'DD-MM-YYYY').toDate().valueOf() > moment(b.id, 'DD-MM-YYYY').toDate().valueOf()) ? 1 : -1)

      this.catas = catas;
    })
    this._service.fechaspropuestas$.subscribe( fechas => {
      this.fechasPropuestas = fechas;
    })

    this.hoy.setHours(0,0,0,0);
    this.user = JSON.parse(localStorage.getItem('currentUser') || '{}');

    this.getAllCatas();
  }

  getAllCatas() {
    this._service.getAll(constants.END_POINTS.CATAS)
  }
  getCatasProximas() {
    const catasProximas = [];
    for(const cata of this.catas ?? []){
      if(moment(cata.fecha, 'DD-MM-YYYY').toDate() >= this.hoy) {
        catasProximas.push(cata)
      }
    }
    return catasProximas;
  }
  getCatasAntiguas() {
    const catasAntiguas = [];
    for(const cata of this.catas ?? []){
      if(moment(cata.fecha, 'DD-MM-YYYY').toDate() < this.hoy) {
        catasAntiguas.push(cata)
      }
    }
    return catasAntiguas.reverse();
  }
  aunQuedanCatasPorRealizar() {
    return this.catas?.length == 8;
  }
  aunTieneCatasPorRealizar(): boolean {
    return this.catas.filter(cata => cata.telefono == this.user.telefono).length < 2
  }
  hayCataHoy(fecha: any): boolean {
    return fecha ==  this.formatDate(this.hoy);

  }
  siguienteCata() {
    const number = this.catas.filter(cata => cata.telefono == this.user.telefono).length
    return number == 0 ? 'primera' : 'segunda';
  }
  verFechas(){
    this.estadoCalendario = constants.ESTADOS_CALENDARIO.VER_FECHAS;
    this.getFechasPropuestas()
  }
  getFechasPropuestas() {
    this._service.getAll(constants.END_POINTS.FECHAS_PROPUESTAS)
  }
  goBack() {
    this.estadoCalendario = constants.ESTADOS_CALENDARIO.LISTA;
  }
  proponerFecha() {
    this.showDatepicker = true;
  }
  ocultarFecha() {
    this.showDatepicker = false;
  }
  saveFechaPropuesta() {
    console.log('SAVE FECHA PROPUESTA')
    // Save and reload

    this.showDatepicker = false;
    this.estadoCalendario = constants.ESTADOS_CALENDARIO.LISTA;
  }
  formatDate(d: Date) {
    var month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [day, month, year].join('-');
  }

  openModalFechaPropuesta(index: number) {
    this.tituloModal = 'Cata de ' + this.fechasPropuestas[index].nombre + ' el ' + this.fechasPropuestas[index].id;
    this.userDeCataModal = this.fechasPropuestas[index].nombre;
    this.indexFechaAbierta = index;
    this.usuariosAFavorModal = this.fechasPropuestas[index].votosAFavor;
    this.usuariosEnContraModal = this.fechasPropuestas[index].votosEnContra;
  }
  
  votarAFavor() {
    this.fechasPropuestas[this.indexFechaAbierta].votosAFavor.push(this.user.nombre)
    console.log(this.fechasPropuestas[this.indexFechaAbierta])
  }
  votarEnContra() {
    this.fechasPropuestas[this.indexFechaAbierta].votosEnContra.push(this.user.nombre)
    console.log(this.fechasPropuestas[this.indexFechaAbierta])

  }
}
