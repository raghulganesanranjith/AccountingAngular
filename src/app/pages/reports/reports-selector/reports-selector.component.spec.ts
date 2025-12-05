import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportsSelectorComponent } from './reports-selector.component';

describe('ReportsSelectorComponent', () => {
  let component: ReportsSelectorComponent;
  let fixture: ComponentFixture<ReportsSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportsSelectorComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ReportsSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
