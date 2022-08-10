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
    this._service.currentUser$.subscribe( user => {
      this.user = user;
    })
    this.user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    console.log('USER onInit - LoginComponent', this.user, this.user.telefono)
    if(this.user)this.login();

    this.loginForm = this.formBuilder.group({
      telefono: ['', Validators.required]
    })
  }

  async login(){
    console.log(this.loginForm)
    // const phone = JSON.stringify(this.loginForm.value.telefono);

    // Is Administración
    // if(phone === constants.ADMIN_NOVIOS.MARIA || phone === constants.ADMIN_NOVIOS.NENO) {
    //   this.isAdmin = true;
    // } else { 
      const user = await this._service.login(constants.END_POINTS.USERS, '645303663' /*phone*/)
      console.log('USER - login() - LoginComponent', user.data());
    // }
  }
  disableLogin(){}

}
