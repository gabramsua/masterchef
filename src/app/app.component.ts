import { Component, OnInit } from '@angular/core';
import { User } from './models/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'masterchef';
  user!: User;
  
  ngOnInit(): void {
    // this.user = JSON.parse(localStorage.getItem('currentUser'));
    if(!this.user) {
      // this.guardService.checkUserLogin()
    }
  }
}
