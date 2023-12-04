import { Component } from '@angular/core';

import { RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { DataService } from 'src/app/services/data.service';
import { UserBasic } from 'src/app/swagger-api';
import { UnsubscribeOnDestroyAbsctractClass } from '../shared/unsubscribe-on-destroy/unsubscribe-on-destroy.component';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    standalone: true,
    imports: [NgFor, MatCardModule, RouterLink, MatIconModule, MatRippleModule, MatProgressSpinnerModule]
})
export class DashboardComponent extends UnsubscribeOnDestroyAbsctractClass {
  public isDataLoaded: boolean = false;
  public error!: string;
  public users!: UserBasic[];

  public constructor(private dataService: DataService) {
    super();
    this.getUsers();
  }

  private getUsers(): void {
    this.trackSubscription(
      this.dataService.users.subscribe({
        next: (response: UserBasic[]) => {
          this.users = response;
          this.isDataLoaded = true;
        },
        error: (httpErrorResponse: HttpErrorResponse) => {
         this.error = httpErrorResponse.error;
        },
      }),
    );
  }

  public get checkData(): boolean {
    return this.isDataLoaded;
  }
}
