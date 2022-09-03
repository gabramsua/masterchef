import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { CUSTOM_ELEMENTS_SCHEMA }      from '@angular/core'; 

import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule, MAT_RADIO_DEFAULT_OPTIONS  } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatIconModule } from '@angular/material/icon'
import { MatStepperModule } from '@angular/material/stepper'; 
import { MatListModule } from '@angular/material/list'; 
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';


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
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { VerCataComponent } from './components/ver-cata/ver-cata.component';
import { PlatoDetailComponent } from './components/plato-detail/plato-detail.component';
import { PuntuacionDetailComponent } from './components/puntuacion-detail/puntuacion-detail.component';
import { EditarCataComponent } from './components/editar-cata/editar-cata.component';

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
    HomeComponent,
    VerCataComponent,
    PlatoDetailComponent,
    PuntuacionDetailComponent,
    EditarCataComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatButtonModule,
    ClipboardModule,
    MatIconModule,
    MatSnackBarModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatListModule,
    MatButtonToggleModule,
    MatCardModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatSliderModule,
    
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },
    { provide: MAT_RADIO_DEFAULT_OPTIONS , useValue: { color: 'red'}}, // '#336E7B' } },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2000}},
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES'},
  ],
  entryComponents: [CustomSnackBarComponent],
  bootstrap: [AppComponent], 
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
