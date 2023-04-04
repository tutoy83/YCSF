import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SimulateurComponent } from './simulateur/simulateur.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/simulateur' },
  { path: 'simulateur', component: SimulateurComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: '', component: SimulateurComponent }
    ])

  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
