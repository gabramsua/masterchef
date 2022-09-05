import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarioComponent } from './components/calendario/calendario.component';
import { ClasificacionComponent } from './components/clasificacion/clasificacion.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { PuntuacionesDeCataComponent } from './components/puntuaciones-de-cata/puntuaciones-de-cata.component';
import { PuntuacionesComponent } from './components/puntuaciones/puntuaciones.component';
import { VerCataComponent } from './components/ver-cata/ver-cata.component';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'home', component: HomeComponent},
  {path: 'verCata', component: VerCataComponent},
  {path: 'calendario', component: CalendarioComponent},
  {path: 'clasificacion', component: ClasificacionComponent},
  {path: 'puntuaciones-de-cata', component: PuntuacionesDeCataComponent},
  {path: 'puntuaciones', component: PuntuacionesComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
