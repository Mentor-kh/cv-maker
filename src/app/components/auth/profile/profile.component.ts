import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthContext } from '../auth.context';
import { FormGroup, Validators, FormArray } from '@angular/forms';
import { UserProfile, UserProfileAdditionals } from 'src/app/swagger-api';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { moveItemInFormArray } from 'src/app/common/helpers';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { AppConstants } from 'src/app/common/app.constants';
import { AppRoutes } from 'src/app/common/app.routes';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent extends AuthContext implements OnInit {
  public isDataLoaded: boolean = false;
  public error!: string;
  private userData!: UserProfile;

  public form: FormGroup = this.fb.group({
    firstName: this.fb.control('', Validators.required),
    lastName: this.fb.control('', Validators.required),
    phone: this.fb.control('', [Validators.required, Validators.pattern(AppConstants.PhonePatten)]),
    image: this.fb.control(''),
    email: this.fb.control('', Validators.email),
    address: this.fb.control(''),
    site: this.fb.control(''),
    additionals: this.fb.array([]),
  });
   
  public get additionals(): FormArray {
    return this.form.controls["additionals"] as FormArray;
  }

  public addAdditional(): void {
    const additional: FormGroup = this.fb.group({
      title: ['', Validators.required],
      info: ['',   Validators.required]
    });
    this.additionals.push(additional);
  }


  public moveAdditional(event: CdkDragDrop<string[]>): void {
    moveItemInFormArray(this.additionals, event.previousIndex, event.currentIndex);
  }

  public deleteAdditional(additionalIndex: number): void {
    this.additionals.removeAt(additionalIndex);
  }

  public deleteAccount(): void {
    const dialogRef: MatDialogRef<DialogComponent> = this.dialog.open(DialogComponent);
    this.trackSubscription(
      dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          this.authService.deleteAccount().subscribe({
            next: (response: {}) => 
              this.authService.logout().subscribe({
                next: () => this.sessionService.removeSession(),
                error: (httpErrorResponse: HttpErrorResponse) => 
                  this.formError = httpErrorResponse.error.Error,
              }),
            error: (httpErrorResponse: HttpErrorResponse) => 
              this.formError = httpErrorResponse.error.Error,
          });
        }
      }),
    );
  }

  public ngOnInit(): void {
    this.getUserData();
  }

  public locationBack(e: Event): void {
    e.preventDefault();
    this.location.back();
  }

  public get checkData(): boolean {
    return this.isDataLoaded;
  }

  private getUserData(): void {
    this.trackSubscription(
      this.dataService.getUser(this.sessionService.session.userId).subscribe({
        next: (response: UserProfile) => {
          this.userData = response;
          this.isDataLoaded = true;
          this.form.patchValue(response);
  
          if (response.additionals?.length) {
            this.restoreAdditionalData(response.additionals);
          }
        },
        error: (httpErrorResponse: HttpErrorResponse) => {
          this.formError = httpErrorResponse.error;
          this.error = httpErrorResponse.error;
        },
      }),
    );
  }

  private restoreAdditionalData(additionals: UserProfileAdditionals[]): void {
    additionals.forEach(
      (additional: UserProfileAdditionals, index: number) => {
        this.addAdditional();
        this.additionals.controls[index].patchValue(additional);
      });
  }

  protected proceedFormSubmit(): void {
    this.trackSubscription(
      this.authService.updateUser(this.form.value).subscribe({
        next: (response: {}) => {
          this.router.navigateByUrl(`${AppRoutes.profile}/${this.userData.entityId}`);
          this.formError = '';
        },
        error: (httpErrorResponse: HttpErrorResponse) => {
          this.formError = httpErrorResponse.error;
        }
      }),
    );
  }
}
