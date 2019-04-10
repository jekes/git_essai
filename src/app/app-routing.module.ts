import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthentificationGuard } from './guards/authentification.guard';

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' ,
  canActivate: [AuthentificationGuard]},
  // {
  //   path: 'home',
  //   loadChildren: './tabs/tabs.module#TabsPageModule',
  //   canActivate: [AuthentificationGuard],
  //   data: { title: 'Example of static route data' }
  // },
  { path: 'signin', loadChildren: './pages/authentification/signin/signin.module#SigninPageModule' },
  { path: 'signup', loadChildren: './pages/authentification/signup/signup.module#SignupPageModule' },
  { path: 'account', loadChildren: './pages/authentification/account/account.module#AccountPageModule' },
  { path: 'details/:index', loadChildren: './pages/detail/detail.module#DetailPageModule' }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
