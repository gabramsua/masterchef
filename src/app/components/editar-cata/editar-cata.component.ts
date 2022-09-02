import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Cata } from 'src/app/models/models';

@Component({
  selector: 'editar-cata',
  templateUrl: './editar-cata.component.html',
  styleUrls: ['./editar-cata.component.scss']
})
export class EditarCataComponent implements OnInit {
  @Output() dispatchGoBack = new EventEmitter<any>();
  @Input() cataParaEditar!: Cata;
  
  step = 0;

  constructor() { }

  ngOnInit(): void {
  }
  goBack() {
    this.dispatchGoBack.next(null);
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