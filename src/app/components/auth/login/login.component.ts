import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthContext } from '../auth.context';
import { HttpErrorResponse } from '@angular/common/http';
import { Token } from 'src/app/swagger-api/model/token';
import { AppRoutes } from 'src/app/common/app.routes';
import { AppConstants } from 'src/app/common/app.constants';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends AuthContext {

  public form: FormGroup = new FormGroup({
    phone: new FormControl('', [Validators.required, Validators.pattern(AppConstants.PhonePatten)]),
    password: new FormControl('', Validators.required),
  });

  protected proceedFormSubmit(): void {
    this.trackSubscription(
      this.authService.login(this.form.value).subscribe({
        next: (response: Token) => {
          this.sessionService.session = response;
          this.router.navigateByUrl(AppRoutes.baseUrl);
          this.formError = '';
        },
        error: (httpErrorResponse: HttpErrorResponse) => {
          this.formError = httpErrorResponse.error;
        },
      }),
    );
  }
}
