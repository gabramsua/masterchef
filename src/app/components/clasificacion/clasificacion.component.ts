import { Component, OnInit } from '@angular/core';

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
      puntos: '9.75'
    },
    {
      nombre: 'Javier',
      apellidos: 'Armijo',
      telefono: '623469128',
      puntos: '6.89'
    },
    {
      nombre: 'Lucía',
      apellidos: 'Álvarez',
      telefono: '671498077',
      puntos: '5.3'
    }
  ];

  constructor() { }

  ngOnInit(): void {

  }

}
