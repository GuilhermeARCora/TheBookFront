import { Component, inject, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./shared/components/header/header.component";
import { FooterComponent } from "./shared/components/footer/footer.component";
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  router = inject(Router);
  authService = inject(AuthService);

  hideHeader = signal<boolean>(true);
  hideFooter = signal<boolean>(true);

  private headerExcludedRoutes = ['/login', '/not-found', '/404', '/register'];

  private footerExcludedRoutes = ['/not-found', '/404'];

  ngOnInit() {

    this.authService.initFromStorage();
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects;

        this.hideHeader.set(this.headerExcludedRoutes
          .some(route => url === route || url.startsWith(route + '/'))
        );

        this.hideFooter.set(this.footerExcludedRoutes
          .some(route => url === route || url.startsWith(route + '/'))
        );

      });
  };


};
