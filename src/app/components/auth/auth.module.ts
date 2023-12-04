import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';

import { ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './profile/profile.component';
import { SharedModule } from 'src/app/common/shared.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DragDropModule, CdkDropList, CdkDrag } from '@angular/cdk/drag-drop';
import { DialogComponent } from '../shared/dialog/dialog.component';
import { MatDialogClose, MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
    declarations: [
      SignupComponent,
      LoginComponent,
      ProfileComponent,
      DialogComponent,
    ],
    imports: [
      CommonModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatCheckboxModule,
      MatDialogModule,
      CdkDropList, 
      CdkDrag,
      DragDropModule,
      SharedModule,
    ],
})
export class AuthModule { }
