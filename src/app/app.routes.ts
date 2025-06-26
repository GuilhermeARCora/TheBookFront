import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AuthGuard } from './core/guards/auth.guard';

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
    path:'meu-livro',
    loadComponent: () => import('./pages/meu-livro/meu-livro.component').then(c => c.MeuLivroComponent),
    canActivate: [AuthGuard]
  },
 {
  path: 'receita',
  children: [
    {
      path: 'ver-receita/:id',
      loadComponent: () => import('./pages/receita/receita.component').then(c => c.ReceitaComponent)
    },
    {
      path: 'create-receita',
      loadComponent: () => import('./pages/receita/criar/criar.component').then(c => c.CriarComponent),
      canActivate: [AuthGuard]
    },
    {
      path: 'edit-receita/:id',
      loadComponent: () => import('./pages/receita/criar/criar.component').then(c => c.CriarComponent),
      canActivate: [AuthGuard]
    }
   ]
  },
  {
    path:'not-found',
    component: NotFoundComponent
  },
  {
    path:'**',
    redirectTo:'/not-found'
  },

];
