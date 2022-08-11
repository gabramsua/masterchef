import { Component, OnInit } from '@angular/core';
import { User } from './models/models';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'masterchef';
  user!: User;
  
  constructor(public _service: AuthService, private router: Router){}

  ngOnInit(): void {
    this._service.currentUser$.subscribe( (user: User) => {
      this.user = user;
    })
    this.user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if(this.user.telefono) {
      this.router.navigate(['/home']);
    }
  }
}
