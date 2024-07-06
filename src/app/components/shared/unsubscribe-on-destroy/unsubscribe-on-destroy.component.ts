import { Injectable, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { subjectsComplete } from 'src/app/common/helpers';
import { SubSink } from 'subsink';

@Injectable()
export class UnsubscribeOnDestroyAbsctractClass implements OnDestroy {
  private subs: SubSink = new SubSink();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected subjects$: Subject<any>[] = [];

  public ngOnDestroy(): void {
    this.subs.unsubscribe();
    subjectsComplete(this.subjects$);
  }

  protected trackSubscription(subscription: Subscription): void { this.subs.add(subscription); }
}
