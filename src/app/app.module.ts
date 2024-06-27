import { NgModule } from '@angular/core';
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

export function apiConfigFactory(): Configuration {
  const params: ConfigurationParameters = {
    basePath: AppSettings.BASE_URL,
  };
  return new Configuration(params);
}

@NgModule({ declarations: [AppComponent],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        ApiModule.forRoot(apiConfigFactory),
        AuthModule,
        PublicModule,
        HeaderComponent], providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: JwtInterceptor,
            multi: true,
        },
        provideHttpClient(withInterceptorsFromDi()),
    ] })
export class AppModule { }
