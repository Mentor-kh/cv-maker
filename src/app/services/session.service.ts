import { Injectable } from '@angular/core';
import { Token } from '../swagger-api/model/token';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private sessionChanges$: Subject<Token> = new Subject();
  private activeSession: Token = {
    userId: '',
    entityId: '',
    expires: '',
  };

  private constructor() {
    this.emitSessionChanges();
  }

  public get session(): Token {
    return this.activeSession;
  }

  public get sessionChanges(): Observable<Token> {
    return this.sessionChanges$.asObservable();
  }

  public set session(body: Token) {
    localStorage.setItem('userId', body.userId);
    localStorage.setItem('entityId', body.entityId);
    localStorage.setItem('expires', body.expires);
    this.emitSessionChanges();
  }

  public isSessionActive(): boolean {
    return (
      this.activeSession.entityId.length > 0 &&
      +this.activeSession.expires > Date.now()
    );
  }

  public removeSession(): void {
    localStorage.removeItem('userId');
    localStorage.removeItem('entityId');
    localStorage.removeItem('expires');
    this.emitSessionChanges();
  }

  public emitSessionChanges(): void {
    this.readSessionFromLocalStore();
    this.sessionChanges$.next(this.activeSession);
  }

  private readSessionFromLocalStore(): void {
    this.activeSession.userId = localStorage.getItem('userId') || '';
    this.activeSession.entityId = localStorage.getItem('entityId') || '';
    this.activeSession.expires = localStorage.getItem('expires') || '';
  }
}
