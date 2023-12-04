import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthContext } from '../auth.context';
import { AppConstants } from 'src/app/common/app.constants';
import { AppRoutes } from 'src/app/common/app.routes';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
})
export class SignupComponent extends AuthContext {

  public form: FormGroup = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    phone: new FormControl('', [Validators.required, Validators.pattern(AppConstants.PhonePatten)]),
    password: new FormControl('', Validators.required),
    tosAgreement: new FormControl('', Validators.requiredTrue),
  });

  protected proceedFormSubmit(): void {
    this.trackSubscription(
      this.authService.createUser(this.form.value).subscribe({
        next: (response: {}) => {
          this.router.navigateByUrl(AppRoutes.login);
          this.formError = '';
        },
        error: (httpErrorResponse: HttpErrorResponse) => {
          this.formError = httpErrorResponse.error;
        },
      }),
    );
  }
}
