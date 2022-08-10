import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  items!: Observable<any[]>;

  constructor(private firebase: AngularFirestore,
    private router: Router) { 
  }
  
  saveWithId(collection: any, id: any, item: any) {
    return this.firebase.collection(collection).doc(id).set(item); // PARA INSERTAR CON ID PROPIO
  }
  save(collection: any, item: any){
    return this.firebase.collection(collection).add(item); // PARA INSERTAR
  }

  getAllSnapshot(collection: any): Observable<any> {
    return this.firebase.collection(collection).snapshotChanges();
  }
  getAll(collection: any): Observable<any> {
    return this.firebase.collection(collection).get();
  }
  
  get(collection: any, id: string) {
    return this.firebase.collection(collection).doc(id).get()
  }

  update(collection: any, id:string, data:any) {
    return this.firebase.collection(collection).doc(id).update(data);
  }

  delete(collection: any, id: any) {
    return this.firebase.collection(collection).doc(id).delete();
  }
  
  deleteField(collection: any, id: any, field: any) {
    return this.firebase.collection(collection).doc(id).update({
      [field]: null
  });
  }

  login(collection: any, phone: string) {
      this.firebase.collection(collection).doc(phone).get().toPromise()
      .then( (data: any) => {
        const user = {
          nombre: data.data()['nombre'],
          apellidos: data.data()['apellidos'],
          telefono: phone, //data.data()['telefono'],
        }
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.router.navigate(['home']);
      })
      .catch( (err: any) => {
    })
  }
}
