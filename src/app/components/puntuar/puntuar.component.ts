import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Cata, User, Valoracion } from 'src/app/models/models';
import { AuthService } from 'src/app/services/auth.service';
import { PuntuacionesDeCata } from '../../models/models';

@Component({
  selector: 'app-puntuar',
  templateUrl: './puntuar.component.html',
  styleUrls: ['./puntuar.component.scss']
})
export class PuntuarComponent implements OnInit {
  currentUser!: User;
  currentCata!: Cata;
  step = -1;

  puntuacionesEntrante: Valoracion = {cantidad: 0,estetica: 0,sabor: 0,nombre: ''};
  puntuacionesPrincipal: Valoracion = {cantidad: 0,estetica: 0,sabor: 0,nombre: ''};
  puntuacionesPostre: Valoracion = {cantidad: 0,estetica: 0,sabor: 0,nombre: ''};

  constructor(
    public _service: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.currentCata = JSON.parse(localStorage.getItem('currentCata') || '{}');
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
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
    this.puntuacionesPrincipal.nombre = this.currentUser?.nombre;
    this.puntuacionesPostre.nombre = this.currentUser?.nombre;
    console.log('guardar puntuaciones', this.puntuacionesEntrante, this.puntuacionesPrincipal, this.puntuacionesPostre)
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
