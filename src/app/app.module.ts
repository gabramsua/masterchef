import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './components/menu/menu.component';
import { CalendarioComponent } from './components/calendario/calendario.component';
import { LoginComponent } from './components/login/login.component';
import { ClasificacionComponent } from './components/clasificacion/clasificacion.component';
import { PuntuacionesComponent } from './components/puntuaciones/puntuaciones.component';
import { PuntuacionesDeCataComponent } from './components/puntuaciones-de-cata/puntuaciones-de-cata.component';
import { PuntuarComponent } from './components/puntuar/puntuar.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    CalendarioComponent,
    LoginComponent,
    ClasificacionComponent,
    PuntuacionesComponent,
    PuntuacionesDeCataComponent,
    PuntuarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
