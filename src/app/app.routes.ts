import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { EditarCriarReceitaComponent } from './pages/editar-criar-receita/editar-criar-receita.component';
import { ReceitaComponent } from './pages/receita/receita.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [

  {
    path:'',
    redirectTo:'/home',
    pathMatch:'full'
  },
  {
    path:'home',
    component:HomeComponent
  },
  {
    path:'login',
    component:LoginComponent
  },
  {
    path:'register',
    component:RegisterComponent
  },
  {
    path:'about-us',
    loadComponent: () => import('./pages/about-us/about-us.component').then(c => c.AboutUsComponent)
  },
  {
    path:'receita',
    component:ReceitaComponent
  },
  {
    path:'not-found',
    component: NotFoundComponent
  },
  {
    path:'edit-create-receita/:id',
    loadComponent: () => import('./pages/editar-criar-receita/editar-criar-receita.component').then(c => c.EditarCriarReceitaComponent)
  },
  {
    path:'**',
    redirectTo:'/not-found'
  },

];
