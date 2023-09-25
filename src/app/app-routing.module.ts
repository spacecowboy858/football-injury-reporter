import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LaunchComponent} from "./components/launch/launch.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";

const routes: Routes = [
  { path: '', component: DashboardComponent},
  { path: 'launch', component: LaunchComponent},
  { // This path MUST ALWAYS be the last path!!!
    // Do not add any paths below this point or they will not work and will be redirected to landing.
    path: '**', redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
