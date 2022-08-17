import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import constants from 'src/constants';
import { Cata, FechaPropuesta, User } from 'src/app/models/models';
import * as moment from 'moment';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup } from '@angular/forms';

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
  public tipoCata!: FormGroup;

  fechasPropuestas: FechaPropuesta[] = [];
  tituloModal: string = '';
  userDeCataModal: string = '';
  usuariosAFavorModal: string[] = [];
  usuariosEnContraModal: string[] = [];
  indexFechaAbierta: number= 0;

  constructor(
    public _service: AuthService,
    private _formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this._service.catas$.subscribe( catas => {
      // Sort Catas by Date DESC
      catas.sort((a, b) => (moment(a.id, 'DD-MM-YYYY').toDate().valueOf() > moment(b.id, 'DD-MM-YYYY').toDate().valueOf()) ? 1 : -1)

      this.catas = catas;
    })
    this._service.fechaspropuestas$.subscribe( fechas => {
      // Sort Fechas Propuestas by Date DESC
      fechas.sort((a, b) => (moment(a.id, 'DD-MM-YYYY').toDate().valueOf() > moment(b.id, 'DD-MM-YYYY').toDate().valueOf()) ? 1 : -1)
      this.fechasPropuestas = fechas.filter((elem: FechaPropuesta) => !elem.descartada && !elem.establecida);
    })

    this.hoy.setHours(0,0,0,0);
    this.user = JSON.parse(localStorage.getItem('currentUser') || '{}');

    this.getAllCatas();
    
    this.minDate = this.hoy;//new Date(2000, 0, 1);
    this.maxDate = new Date(2023, 6, 31);
    
    this.tipoCata = this._formBuilder.group({
      isAlmuerzo: ['']
    });
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
    // Save and reload
    let fechaPropuesta: FechaPropuesta = {
      id: this.fechaInput.toString(),
      fechaDesde: moment(this.hoy).format('DD-MM-YYYY'),
      nombre: this.user.nombre,
      telefono: this.user.telefono,
      votosAFavor: [this.user.nombre],
      votosEnContra: [],
      descartada: false,
      establecida: false,
      isAlmuerzo: this.tipoCata.value.isAlmuerzo
    }
    // SIN ID: this._service.save(constants.END_POINTS.FECHAS_PROPUESTAS, fechaPropuesta)
    /* CON ID */ this._service.saveWithId(constants.END_POINTS.FECHAS_PROPUESTAS,fechaPropuesta.id, fechaPropuesta)

    this.showDatepicker = false;
    this.getFechasPropuestas()
    // this.estadoCalendario = constants.ESTADOS_CALENDARIO.LISTA;
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
  isAlmuerzo(index:number){
    return this.fechasPropuestas[index].isAlmuerzo;
  }
  openModalFechaPropuesta(index: number) {
    this.tituloModal = 'Cata de ' + this.fechasPropuestas[index].nombre + ' el ' + this.fechasPropuestas[index].id;
    this.userDeCataModal = this.fechasPropuestas[index].nombre;
    this.indexFechaAbierta = index;
    this.usuariosAFavorModal = this.fechasPropuestas[index].votosAFavor;
    this.usuariosEnContraModal = this.fechasPropuestas[index].votosEnContra;
  }
  heVotadoAlgo(i: number) {
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
  esMiPropuesta(i:number) {
    const index = i == -1 ? this.indexFechaAbierta : i;
    return this.fechasPropuestas[index]?.telefono == this.user?.telefono
  }
  todosHanVotadoYa(i:number){
    return this.fechasPropuestas[i].votosAFavor.length + this.fechasPropuestas[i].votosEnContra.length == 0
  }
  establecerFecha() {
    // Mirar que no haya una cata antes en esa fecha porque exista colisión con otra persona
    this.getAllCatas()
    const hayCataConEsaFecha = this.catas.find((cata:Cata) => cata.fecha == this.fechasPropuestas[this.indexFechaAbierta].id)

    if(hayCataConEsaFecha) {
      this.fechasPropuestas[this.indexFechaAbierta].descartada = true;
      this.errorAlert('')
    } else {
      this.fechasPropuestas[this.indexFechaAbierta].establecida = true;
      this.sweetAlert()
    }
    // Establecer fecha propuesta
    this._service.update(
      constants.END_POINTS.FECHAS_PROPUESTAS, 
      this.fechasPropuestas[this.indexFechaAbierta].id, 
      this.fechasPropuestas[this.indexFechaAbierta])

    // Guardar cata
    const cata: Cata = {
      id: this.fechasPropuestas[this.indexFechaAbierta].id,
      nombre: this.user.nombre,
      telefono: this.user.telefono,
      fecha: this.fechasPropuestas[this.indexFechaAbierta].id,
      nombreEntrante: '',
      descripcionEntrante: '',
      nombrePrincipal: '',
      descripcionPrincipal: '',
      nombrePostre: '',
      descripcionPostre: '',
      isAlmuerzo: this.fechasPropuestas[this.indexFechaAbierta].isAlmuerzo
    };
    this._service.saveWithId(constants.END_POINTS.CATAS, cata.id, cata)

    this.estadoCalendario = constants.ESTADOS_CALENDARIO.LISTA;
  }
  descartarFecha() {
    this.fechasPropuestas[this.indexFechaAbierta].descartada = true;
    this._service.update(
      constants.END_POINTS.FECHAS_PROPUESTAS, 
      this.fechasPropuestas[this.indexFechaAbierta].id, 
      this.fechasPropuestas[this.indexFechaAbierta])
    this.sweetAlert()
  }
  
  sweetAlert(){
    Swal.fire(
      '¡Guardado!',
      'Actualizamos los registros',
      'success'
    )
    this._service.getAll(constants.END_POINTS.FECHAS_PROPUESTAS)
    // this.usuariosForm = this._formBuilder.group({
    //   nombre: ['', Validators.required],
    //   apellidos: ['', Validators.required],
    //   telefono: ['', Validators.required]
    // });
    // this.quizzForm = this._formBuilder.group({
    //   pregunta: ['', Validators.required],
    //   r_correcta: ['', Validators.required],
    //   r_falsa_1: ['', Validators.required],
    //   r_falsa_2: ['', Validators.required],
    //   r_falsa_3: ['', Validators.required],
    //   dificultad: ['', Validators.required]
    // });
  }
  errorAlert(error: string){
    this._service.update(
      constants.END_POINTS.FECHAS_PROPUESTAS, 
      this.fechasPropuestas[this.indexFechaAbierta].id, 
      this.fechasPropuestas[this.indexFechaAbierta])
    Swal.fire(
      'Esa fecha ya está cogida.',
      'Procedemos a borrar esta sugerencia.',
      'error'
    )
    this._service.getAll(constants.END_POINTS.FECHAS_PROPUESTAS)
  }
}
