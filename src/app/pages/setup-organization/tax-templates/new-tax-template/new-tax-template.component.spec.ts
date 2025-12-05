import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTaxTemplateComponent } from './new-tax-template.component';

describe('NewTaxTemplateComponent', () => {
  let component: NewTaxTemplateComponent;
  let fixture: ComponentFixture<NewTaxTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewTaxTemplateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewTaxTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
