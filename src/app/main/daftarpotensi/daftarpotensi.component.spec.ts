import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PenyetoranComponent } from './penyetoran.component';

describe('PenyetoranComponent', () => {
  let component: PenyetoranComponent;
  let fixture: ComponentFixture<PenyetoranComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PenyetoranComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PenyetoranComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
