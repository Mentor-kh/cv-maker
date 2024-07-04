import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthModule } from './components/auth/auth.module';

import AppSettings from './common/app.settings';
import { ApiModule, Configuration, ConfigurationParameters } from './swagger-api';
import { HeaderComponent } from './components/header/header.component';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { PublicModule } from './components/public/public.module';
import { ServiceWorkerModule } from '@angular/service-worker';

export function apiConfigFactory(): Configuration {
  const params: ConfigurationParameters = {
    basePath: AppSettings.BASE_URL,
  };
  return new Configuration(params);
}

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent], imports: [BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ApiModule.forRoot(apiConfigFactory),
    AuthModule,
    PublicModule,
    HeaderComponent,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })], providers:
    [
      {
        provide: HTTP_INTERCEPTORS,
        useClass: JwtInterceptor,
        multi: true,
      },
      provideHttpClient(withInterceptorsFromDi()),
    ]
})
export class AppModule { }
