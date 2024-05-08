import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { UserBasic, UserProfile } from 'src/app/swagger-api';
import { UnsubscribeOnDestroyAbsctractClass } from '../../shared/unsubscribe-on-destroy/unsubscribe-on-destroy.component';
import { HttpErrorResponse } from '@angular/common/http';
import { mockUserBasic } from './mock-users';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent extends UnsubscribeOnDestroyAbsctractClass {
  public isDataLoaded: boolean = false;
  public userData!: UserProfile;
  public error!: string;

  public constructor(
    private dataService: DataService,
    private router: ActivatedRoute,
  ) {
    super();
    this.trackSubscription(
      this.router.params.subscribe((params: Params) => this.getUser(params['id'])),
    );
  }

  public get checkData(): boolean {
    return this.isDataLoaded;
  }

  private getUser(userId: string): void {
    this.dataService.getUser(userId).subscribe({
      next: (userData: UserBasic) => {
        this.userData = userData;
        this.isDataLoaded = true;
      },
      error: (httpErrorResponse: HttpErrorResponse) => {
        this.error = httpErrorResponse.error;
      },
    });
  }
}
