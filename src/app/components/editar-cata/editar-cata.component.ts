import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Cata } from 'src/app/models/models';
import { AuthService } from 'src/app/services/auth.service';
import constants from 'src/constants';

@Component({
  selector: 'editar-cata',
  templateUrl: './editar-cata.component.html',
  styleUrls: ['./editar-cata.component.scss']
})
export class EditarCataComponent implements OnInit {
  @Output() dispatchGoBack = new EventEmitter<any>();
  @Input() cataParaEditar!: Cata;
  
  step = -1;

  constructor(
    public _service: AuthService,) { }

  ngOnInit(): void {
  }
  goBack() {
    this.dispatchGoBack.next(null);
  }
  save(acabada = false) {
    const cata: Cata = {
      id: this.cataParaEditar.id,
      nombre: this.cataParaEditar.nombre,
      telefono: this.cataParaEditar.telefono,
      fecha: this.cataParaEditar.fecha,
      isAlmuerzo: this.cataParaEditar.isAlmuerzo,
      nombreEntrante: this.cataParaEditar.nombreEntrante,
      descripcionEntrante: this.cataParaEditar.descripcionEntrante,
      nombrePrincipal: this.cataParaEditar.nombrePrincipal,
      descripcionPrincipal: this.cataParaEditar.descripcionPrincipal,
      nombrePostre: this.cataParaEditar.nombrePostre,
      descripcionPostre: this.cataParaEditar.descripcionPostre,
      votacionesAbiertas:  acabada ? false : this.cataParaEditar.votacionesAbiertas,
      acabada: acabada
    };

    this._service.update(constants.END_POINTS.CATAS, this.cataParaEditar.id, cata);
    this.goBack();
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