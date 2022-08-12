import { Injectable } from '@angular/core';
import { 
  Firestore, 
  collectionData, 
  doc, 
  addDoc, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  getDocs, 
  getFirestore,
  collection
} from '@angular/fire/firestore';

import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import constants from 'src/constants';
import { Cata, User, FechaPropuesta } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  items!: Observable<any[]>;
  catas$ = new Subject<Cata[]>();
  fechaspropuestas$ = new Subject<FechaPropuesta[]>();
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
  getAll(collectionChosen: any) {
    let rows: any[] = [];
    getDocs(collection(this.firebase, collectionChosen))
    .then((data:any) => {
      data.docs.map((elem:any, index:any) => {
        rows.push({...elem.data(), id: elem.id})
      })

      switch(collectionChosen){
        case constants.END_POINTS.CATAS:
          this.catas$.next(rows);
          break;
        case constants.END_POINTS.FECHAS_PROPUESTAS: 
          this.fechaspropuestas$.next(rows);
          break;
        default:
          break;

      }
    })
    .catch((err:any) => {
      console.log(err)
    })
  }
  
  get(collection: any, id: string) {
    getDoc(doc(this.firebase, collection, id))
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
    getDoc(doc(this.firebase, collection, '645303663'))
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
