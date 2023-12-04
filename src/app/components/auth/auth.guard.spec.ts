import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import {
  ActivatedRouteSnapshot, CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlSegmentGroup,
  UrlTree
} from '@angular/router';
import {Observable, of, throwError} from 'rxjs';
import { SessionService } from 'src/app/services/session.service';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let mockRouter: jasmine.SpyObj<Router>
  let sessionService: SessionService;
  const urlPath = '/dataset';

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj(AuthGuard, ['navigate', 'createUrlTree', 'parseUrl'])
    mockRouter.parseUrl.and.callFake((url: string) => {
      const urlTree = new UrlTree()
      const urlSegment = new UrlSegment( url, {})
      urlTree.root = new UrlSegmentGroup( [urlSegment], {})
      return urlTree
    });
    await TestBed.configureTestingModule( {
      providers: [
        {
          provide: Router,
          useValue: mockRouter
        },
        SessionService,
      ]
    });

    sessionService = TestBed.inject(SessionService);
  })

  it('should return false if the user is not logged in ', fakeAsync(async () => {
    spyOn(sessionService, 'isSessionActive').and.returnValue(false);
    const authenticated = await runAuthGuardWithContext(getAuthGuardWithDummyUrl(urlPath))
    expect(authenticated).toBeFalsy()
  }));

  it('should return true if the user is logged in ', fakeAsync(async () => {
    spyOn(sessionService, 'isSessionActive').and.returnValue(true);
    const authenticated = await runAuthGuardWithContext(getAuthGuardWithDummyUrl(urlPath))
    expect(authenticated).toBeTruthy()
  }));

  function getAuthGuardWithDummyUrl(urlPath: string): () => boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
    const dummyRoute = new ActivatedRouteSnapshot( )
    dummyRoute.url = [ new UrlSegment(urlPath, {}) ]
    const dummyState: RouterStateSnapshot = { url: urlPath, root:  new ActivatedRouteSnapshot() }
    return () => AuthGuard(dummyRoute, dummyState)
  }

  async function runAuthGuardWithContext(authGuard: () => boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree>): Promise<boolean | UrlTree> {
    const result = TestBed.runInInjectionContext(authGuard)
    const authenticated = result instanceof Observable ? await handleObservableResult(result) : result;
    return authenticated
  }

  function handleObservableResult(result: Observable<boolean | UrlTree>): Promise<boolean | UrlTree> {
    return new Promise<boolean | UrlTree>((resolve) => {
      result.subscribe((value) => {
        resolve(value);
      });
    });
  }
})