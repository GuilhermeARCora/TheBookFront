import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

import('./app/core/services/swal/toaster.service.spec');
import('./app/core/services/auth/auth.service.spec');

import('./app/core/guards/auth.guard.spec');
import('./app/core/interceptors/auth.interceptor.spec');

import('./app/app.component.spec');

import('./app/pages/login/login.component.spec');
import('./app/pages//home/home.component.spec');
import('./app/pages/register/register.component.spec');
import('./app/pages/about-us/about-us.component.spec');
import('./app/pages/receita/receita.component.spec');
import('./app/pages/meu-livro/meu-livro.component.spec');
import('./app/pages/not-found/not-found.component.spec');

import('./app/shared/components/header/header.component.spec');
import('./app/shared/components/footer/footer.component.spec');
import('./app/shared/components/card/card.component.spec');



