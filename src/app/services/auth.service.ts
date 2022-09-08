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
  collection,
  updateDoc
} from '@angular/fire/firestore';

import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import constants from 'src/constants';
import { Cata, User, FechaPropuesta, Puntuaciones } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  catas$ = new Subject<Cata[]>();
  jueces$ = new Subject<User[]>();
  puntuaciones$ = new Subject<Puntuaciones[]>();
  fechaspropuestas$ = new Subject<FechaPropuesta[]>();
  currentUser$ = new Subject<User>();
  currentGet$ = new Subject<any>();

  constructor(private firebase: Firestore,
    private router: Router) { 
  }
  
  saveWithId(collectionChosen: any, id: any, item: any) {
    setDoc(doc(this.firebase, collectionChosen, id), item)
  }
  save(collectionChosen: any, item: any){
    addDoc(collection(this.firebase, collectionChosen), item).then(docRef => {
      console.log(docRef.id);
    })
    .catch(error => {
        console.log(error);
    })
  }

  // getAllSnapshot(collection: any): Observable<any> {
  //   return new Observable;
  //   // return this.firebase.collection(collection).snapshotChanges();
  // }
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
        case constants.END_POINTS.USERS:
          localStorage.setItem('jueces', JSON.stringify(rows));
          break;
        case constants.END_POINTS.PUNTUACIONES:
          this.puntuaciones$.next(rows);
          break;
        default:
          break;

      }
    })
    .catch((err:any) => {
      console.log(err)
    })
  }
  
  get(collectionChosen: any, id: string) {
    getDoc(doc(this.firebase, collectionChosen, id))
    .then((data:any) => {
      this.currentGet$.next(data.data())
    })
  }

  update(collection: any, id:string, data:any) {
    updateDoc(doc(this.firebase, collection, id), data)
  }

  // delete(collection: any, id: any) {
  //   // return this.firebase.collection(collection).doc(id).delete();
  // }
  
  // deleteField(collection: any, id: any, field: any) {
  //   // return this.firebase.collection(collection).doc(id).update({
  //     // [field]: null
  // // });
  // }

  login(collection: any, phone: string) {
    getDoc(doc(this.firebase, collection, phone))
    // getDoc(doc(this.firebase, collection, '645303663'))
    .then((data:any) => {
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
