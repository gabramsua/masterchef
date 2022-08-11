import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import constants from 'src/constants';
import { Cata } from 'src/app/models/models';
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

  constructor(public _service: AuthService) { }

  ngOnInit(): void {
    this._service.rows$.subscribe( catas => {
      this.catas = catas;
    })
    this.getAllCatas();
  }

  getAllCatas() {
    this._service.getAll(constants.END_POINTS.CATAS)
  }
  getCatasProximas() {
    const catasProximas = [];
    for(const cata of this.catas){
      if(moment(cata.fecha, 'DD-MM-YYYY').toDate() >= this.hoy) {
        catasProximas.push(cata)
      }
    }
    return catasProximas;
  }
  getCatasAntiguas() {
    const catasAntiguas = [];
    for(const cata of this.catas){
      if(moment(cata.fecha, 'DD-MM-YYYY').toDate() < this.hoy) {
        catasAntiguas.push(cata)
      }
    }
    return catasAntiguas;
  }

}
