import { Directive, Injectable } from "@angular/core";
import { Location } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { DataService } from "src/app/services/data.service";
import { SessionService } from "src/app/services/session.service";
import { MatDialog } from '@angular/material/dialog';
import { UnsubscribeOnDestroyAbsctractClass } from "../shared/unsubscribe-on-destroy/unsubscribe-on-destroy.component";

@Injectable()
export class AuthContext extends UnsubscribeOnDestroyAbsctractClass {
    public isHintHidden: boolean = true;
    public isSubmitted: boolean = false;
    public formError: string = '';
    public form: FormGroup = this.fb.group({});
    
    public constructor(
        protected authService: AuthService,
        protected dataService: DataService,
        protected sessionService: SessionService,
        protected router: Router,
        protected location: Location,
        protected fb: FormBuilder,
        protected dialog: MatDialog,
    ) {
        super();
    }

    public submitForm(e: Event): void {
        e.preventDefault();

        this.isSubmitted = true;
        if (this.form.valid) {
            this.proceedFormSubmit();
        }
    }

    public checkErrors(key: string): boolean {
        const control: AbstractControl = this.form.controls[key];
        return this.isSubmitted && !!control.errors;
    }

    protected proceedFormSubmit(): void {};
}