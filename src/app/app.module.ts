import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { CUSTOM_ELEMENTS_SCHEMA }      from '@angular/core'; 

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './components/menu/menu.component';
import { CalendarioComponent } from './components/calendario/calendario.component';
import { LoginComponent } from './components/login/login.component';
import { ClasificacionComponent } from './components/clasificacion/clasificacion.component';
import { PuntuacionesComponent } from './components/puntuaciones/puntuaciones.component';
import { PuntuacionesDeCataComponent } from './components/puntuaciones-de-cata/puntuaciones-de-cata.component';
import { PuntuarComponent } from './components/puntuar/puntuar.component';
import { CustomSnackBarComponent } from './shared/SnackBar.component';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { HomeComponent } from './components/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    CalendarioComponent,
    LoginComponent,
    ClasificacionComponent,
    PuntuacionesComponent,
    PuntuacionesDeCataComponent,
    PuntuarComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
  ],
  providers: [
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2000}}
  ],
  entryComponents: [CustomSnackBarComponent],
  bootstrap: [AppComponent], 
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
