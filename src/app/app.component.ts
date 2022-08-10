import { Component, OnInit } from '@angular/core';
import { User } from './models/models';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'masterchef';
  user!: User;
  
  constructor(public _service: AuthService){}

  ngOnInit(): void {
    this._service.currentUser$.subscribe( user => {
      this.user = user;
    })
    this.user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if(!this.user) {
      // this.guardService.checkUserLogin()
      console.log('HAY',this.user)
    }
    else console.log('NO HAY',this.user)
  }
}
