import { Injectable } from '@angular/core';
import  { Firestore, collectionData, getDoc, doc } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  items!: Observable<any[]>;
  currentUser$ = new Subject<User>();

  constructor(private firebase: Firestore,
    private router: Router) { 
  }
  
  saveWithId(collection: any, id: any, item: any) {
    return collectionData(collection(this.firebase, collection)); // ???????????? https://github.com/angular/angularfire/blob/master/docs/version-7-upgrade.md
    // return this.firebase.collection(collection).doc(id).set(item); // PARA INSERTAR CON ID PROPIO
  }
  save(collection: any, item: any){
    // return this.firebase.collection(collection).add(item); // PARA INSERTAR
  }

  getAllSnapshot(collection: any): Observable<any> {
    return new Observable;
    // return this.firebase.collection(collection).snapshotChanges();
  }
  getAll(collection: any): Observable<any> {
    return new Observable;
    // return this.firebase.collection(collection).get();
  }
  
  get(collection: any, id: string) {
    // return this.firebase.collection(collection).doc(id).get()
  }

  update(collection: any, id:string, data:any) {
    // return this.firebase.collection(collection).doc(id).update(data);
  }

  delete(collection: any, id: any) {
    // return this.firebase.collection(collection).doc(id).delete();
  }
  
  deleteField(collection: any, id: any, field: any) {
    // return this.firebase.collection(collection).doc(id).update({
      // [field]: null
  // });
  }

  login(collection: any, phone: string) {
    getDoc(doc(this.firebase, collection, phone))
    .then((data:any) => {
      console.log(data.data())
      if(data.data()){
        localStorage.setItem('currentUser', JSON.stringify(data.data()));
        this.currentUser$.next(data.data());
        this.router.navigate(['home']);
      } else {
        console.log('NO login')
      }
    })
    .catch((err:any) => {
      console.log(err)
    })
  }
}
