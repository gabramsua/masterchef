import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/models';
import constants from 'src/constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm!: FormGroup;
  user!: User;

  constructor(
    public _service: AuthService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if(this.user?.telefono)this.login();

    this.loginForm = this.formBuilder.group({
      telefono: ['', Validators.required]
    })
  }

  async login(){
    // Is Administración
    // if(phone === constants.ADMIN_NOVIOS.MARIA || phone === constants.ADMIN_NOVIOS.NENO) {
    //   this.isAdmin = true;
    // } else { 
      await this._service.login(constants.END_POINTS.USERS, this.loginForm.value.telefono.toString())
      await this._service.getAll(constants.END_POINTS.USERS);
    // }
  }
  disableLogin(){}

}
