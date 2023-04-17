import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SimulateurComponent } from './simulateur/simulateur.component';
import { MeteoComponent } from './meteo/meteo.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/simulateur' },
  { path: 'simulateur', component: SimulateurComponent },
  { path: 'meteo', component: MeteoComponent },

];

@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: '', component: SimulateurComponent },
      { path: 'meteo', component: MeteoComponent }

    ])

  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
