import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { AuthGuard } from './auth.guard';
import { HomeComponent } from './pages/website/home/home.component';

const routes: Routes = [

  // 🔹 Landing Page (FIRST LOAD)
  {
    path: '',
    component: HomeComponent
  },

  // 🔹 Auth Routes (Login, Register, etc.)
  {
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('./layouts/auth-layout/auth-layout.module')
        .then(m => m.AuthLayoutModule)
  },

  // 🔹 Protected User Area
  {
    path: 'abc_restaurant',
    component: UserLayoutComponent,
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./layouts/user-layout/user-layout.module')
        .then(m => m.UserLayoutModule)
  },

  // 🔹 Optional Side Nav Route
  { path: 'side-nav', component: SidenavComponent },

  // 🔹 Fallback
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, { useHash: false })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
