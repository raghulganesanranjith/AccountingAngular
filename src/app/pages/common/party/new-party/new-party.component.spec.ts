import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPartyComponent } from './new-party.component';

describe('NewPartyComponent', () => {
  let component: NewPartyComponent;
  let fixture: ComponentFixture<NewPartyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPartyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewPartyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
