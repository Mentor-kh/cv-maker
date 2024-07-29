import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SsBarComponent } from './ss-bar.component';


describe('SsBarComponent', () => {
  let component: SsBarComponent;
  let fixture: ComponentFixture<SsBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SsBarComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SsBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
