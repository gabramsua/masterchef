import { Component, Input, OnInit } from '@angular/core';
import { Plato } from 'src/app/models/models';

@Component({
  selector: 'plato-detail',
  templateUrl: './plato-detail.component.html',
  styleUrls: ['./plato-detail.component.scss']
})
export class PlatoDetailComponent implements OnInit {
  @Input() plato!: Plato;

  constructor() { }

  ngOnInit(): void {
  }

}
