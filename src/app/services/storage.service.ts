import { Injectable } from '@angular/core';
import firebase from 'firebase/app'
import 'firebase/storage'
import { environment } from 'src/environments/environment.prod'

firebase.initializeApp(environment.firebaseConfig)

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  storageRef = firebase.app().storage().ref();

  constructor() { }
  async uploadImage(nombre: string, imgBase64: any){
    try{
      let respuesta = await this.storageRef.child("platos/"+nombre).putString(imgBase64, 'data_url')
      return await respuesta.ref.getDownloadURL();
    }
    catch(error){
      console.log(error)
      return null;
    }
  }
}