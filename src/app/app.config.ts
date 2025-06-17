import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // provideHttpClient(withInterceptors([AuthInterceptor])),

    // // AuthService so Angular can inject it
    // AuthService,
    // // Preload function to run at app startup
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: preloadUser,
    //   deps: [AuthService],
    //   multi: true
    // }
  ]
};
