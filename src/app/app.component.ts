import { Component } from '@angular/core';
import { SessionService } from './services/session.service';
import { Token } from './swagger-api/model/token';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { AppRoutes } from './common/app.routes';
import { UnsubscribeOnDestroyAbsctractClass } from './components/shared/unsubscribe-on-destroy/unsubscribe-on-destroy.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends UnsubscribeOnDestroyAbsctractClass {
  title = 'client';
  public isAuthentificated: boolean = false;

  public constructor(
    private authService: AuthService,
    private sessionService: SessionService,
    private router: Router,
  ) {
    super();
    this.checkisAuthentificated();
  }

  public logout(): void {
    this.trackSubscription(
      this.authService.logout().subscribe({
        next: () => {
          this.sessionService.removeSession();
          this.router.navigateByUrl(AppRoutes.baseUrl);
        },
        error: () => {
          this.sessionService.removeSession();
          this.router.navigateByUrl(AppRoutes.baseUrl);
        }
      }),
    );
  }

  private checkisAuthentificated(): void {
    this.trackSubscription(
      this.sessionService.sessionChanges.subscribe(
        (token: Token) => {
          if (token.entityId) {
            this.isAuthentificated = true;
            if (+token.expires < Date.now()) {
              this.authService.prolong().subscribe({
                next: (token: Token) => {
                  this.isAuthentificated = true;
                },
                error: () => {  
                  this.authService.logout();  
                  this.sessionService.removeSession();
                  this.router.navigateByUrl(AppRoutes.baseUrl);
                },
              });
            }
          } else {
            this.isAuthentificated = false;
            this.router.navigateByUrl(AppRoutes.baseUrl); 
          }
        }
      ),
    );
    this.sessionService.emitSessionChanges();
  }
}
