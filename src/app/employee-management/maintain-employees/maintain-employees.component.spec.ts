import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainEmployeesComponent } from './maintain-employees.component';

describe('MaintainEmployeesComponent', () => {
  let component: MaintainEmployeesComponent;
  let fixture: ComponentFixture<MaintainEmployeesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintainEmployeesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
