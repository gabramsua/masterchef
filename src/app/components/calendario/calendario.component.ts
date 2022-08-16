import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import constants from 'src/constants';
import { Cata, FechaPropuesta, User } from 'src/app/models/models';
import * as moment from 'moment';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

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
  fechaInput!: any;
  minDate!: any;// = new Date(2000, 0, 1);
  maxDate!: any;// = new Date(2020, 0, 1);

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
      // fechas.map((elem:FechaPropuesta) => {
      //   const favorable = elem.votosAFavor.find((elem: any) => elem == this.user.nombre)
      //   const encontrable = elem.votosEnContra.find((elem: any) => elem == this.user.nombre)
      // })
    })

    this.hoy.setHours(0,0,0,0);
    this.user = JSON.parse(localStorage.getItem('currentUser') || '{}');

    this.getAllCatas();
    
    this.minDate = this.hoy;//new Date(2000, 0, 1);
    this.maxDate = new Date(2023, 6, 31);
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
  onDateChange(event: MatDatepickerInputEvent<Date>): void {
    this.fechaInput = moment(event.value).format('DD-MM-YYYY');
  }
  saveFechaPropuesta() {
    console.log('SAVE FECHA PROPUESTA', this.fechaInput)
    // Save and reload
    let fechaPropuesta: FechaPropuesta = {
      id: this.fechaInput.toString(),
      fechaDesde: moment(this.hoy).format('DD-MM-YYYY'),
      nombre: this.user.nombre,
      telefono: this.user.telefono,
      votosAFavor: [],
      votosEnContra: []
    }
    console.log(fechaPropuesta)
    // this._service.save(constants.END_POINTS.FECHAS_PROPUESTAS, fechaPropuesta)
    this._service.saveWithId(constants.END_POINTS.FECHAS_PROPUESTAS,fechaPropuesta.id, fechaPropuesta)


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
  heVotadoAlgo(i: number) {
    console.log('favorable', this.fechasPropuestas[i]?.votosAFavor.find((elem: any) => elem == this.user.nombre))
    console.log('encontrable', this.fechasPropuestas[i]?.votosEnContra.find((elem: any) => elem == this.user.nombre))
    return this.fechasPropuestas[i]?.votosAFavor.find((elem: any) => elem == this.user.nombre) || this.fechasPropuestas[i]?.votosEnContra.find((elem: any) => elem == this.user.nombre)
  }
  votarAFavor() {
    // Si ya votó en contra hay que borrarlo
    if(this.yaVoteEnContra()){
      // get index and remove()
      const indexOfUser = this.fechasPropuestas[this.indexFechaAbierta].votosEnContra.indexOf(this.user.nombre);
      if (indexOfUser > -1) {this.fechasPropuestas[this.indexFechaAbierta].votosEnContra.splice(indexOfUser, 1);}
    }

    this.fechasPropuestas[this.indexFechaAbierta].votosAFavor.push(this.user.nombre)
    this._service.update(constants.END_POINTS.FECHAS_PROPUESTAS, this.fechasPropuestas[this.indexFechaAbierta].id, this.fechasPropuestas[this.indexFechaAbierta])
  }
  votarEnContra() {
    // Si ya votó a favor hay que borrarlo
    if(this.yaVoteAFavor()){
      // get index and remove()
      const indexOfUser = this.fechasPropuestas[this.indexFechaAbierta].votosAFavor.indexOf(this.user.nombre);
      if (indexOfUser > -1) {this.fechasPropuestas[this.indexFechaAbierta].votosAFavor.splice(indexOfUser, 1);}
    }

    this.fechasPropuestas[this.indexFechaAbierta].votosEnContra.push(this.user.nombre)
    this._service.update(constants.END_POINTS.FECHAS_PROPUESTAS, this.fechasPropuestas[this.indexFechaAbierta].id, this.fechasPropuestas[this.indexFechaAbierta])
  }
  yaVoteAFavor() {
    return this.fechasPropuestas[this.indexFechaAbierta]?.votosAFavor.find((elem: any) => elem == this.user.nombre)
  }
  yaVoteEnContra() {
    return this.fechasPropuestas[this.indexFechaAbierta]?.votosEnContra.find((elem: any) => elem == this.user.nombre)
  }
}
