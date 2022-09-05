import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Cata, PuntuacionesDeCata, User, Valoracion } from 'src/app/models/models';
import { AuthService } from 'src/app/services/auth.service';
import constants from 'src/constants';

@Component({
  selector: 'app-puntuar',
  templateUrl: './puntuar.component.html',
  styleUrls: ['./puntuar.component.scss']
})
export class PuntuarComponent implements OnInit {
  currentUser!: User;
  currentCata!: Cata;
  step = -1;

  puntuacionesEntrante: Valoracion = {cantidad: 0,estetica: 0,sabor: 0,nombre: '', nombrePlato: ''};
  puntuacionesPrincipal: Valoracion = {cantidad: 0,estetica: 0,sabor: 0,nombre: '', nombrePlato: ''};
  puntuacionesPostre: Valoracion = {cantidad: 0,estetica: 0,sabor: 0,nombre: '', nombrePlato: ''};
  puntuacionesEnCurso!: PuntuacionesDeCata;

  constructor(
    public _service: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.currentCata = JSON.parse(localStorage.getItem('currentCata') || '{}');
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    // Cargar las puntuaciones guardadas de la cata en curso
    this.getPuntuacionesEnCurso();
    this._service.currentGet$.subscribe( puntuaciones => {
      if(puntuaciones != undefined) {
        this.puntuacionesEntrante = puntuaciones[this.currentUser.telefono][0];
        this.puntuacionesPrincipal = puntuaciones[this.currentUser.telefono][1];
        this.puntuacionesPostre = puntuaciones[this.currentUser.telefono][2];
      }
    })
  }
  getPuntuacionesEnCurso() {
    this._service.get(constants.END_POINTS.PUNTUACIONES, this.currentCata.id);
  }

  calcularMediaEntrante() {
    return ((this.puntuacionesEntrante.cantidad + this.puntuacionesEntrante.estetica + this.puntuacionesEntrante.sabor) / 3).toPrecision(2); // toFixed(2)
  }
  calcularMediaPrincipal() {
    return ((this.puntuacionesPrincipal.cantidad + this.puntuacionesPrincipal.estetica + this.puntuacionesPrincipal.sabor) / 3).toPrecision(2); // toFixed(2)
  }
  calcularMediaPostre() {
    return ((this.puntuacionesPostre.cantidad + this.puntuacionesPostre.estetica + this.puntuacionesPostre.sabor) / 3).toPrecision(2); // toFixed(2)
  }

  save() {
    this.puntuacionesEntrante.nombre = this.currentUser?.nombre;
    this.puntuacionesEntrante.nombrePlato = this.currentCata.nombreEntrante;
    this.puntuacionesPrincipal.nombre = this.currentUser?.nombre;
    this.puntuacionesPrincipal.nombrePlato = this.currentCata.nombrePrincipal;
    this.puntuacionesPostre.nombre = this.currentUser?.nombre;
    this.puntuacionesPostre.nombrePlato = this.currentCata.nombrePostre;
    
    const puntuacionDeCata = {
      [this.currentUser?.telefono]: [
        this.puntuacionesEntrante, 
        this.puntuacionesPrincipal, 
        this.puntuacionesPostre, 
        this.currentUser?.nombre]
    };
    this._service.update(constants.END_POINTS.PUNTUACIONES, this.currentCata.id, puntuacionDeCata)
    this.sweetAlert();
  }
  sweetAlert(){
    this.step = -1;
    Swal.fire(
      '¡Guardado!',
      'Actualizamos los registros',
      'success'
    )
  }

  goBack(){
    this.router.navigate(['calendario']);
  }
  setStep(index: number) {
    this.step = index;
  }
  nextStep() {
    this.step++;
  }
  prevStep() {
    this.step--;
  }

}
