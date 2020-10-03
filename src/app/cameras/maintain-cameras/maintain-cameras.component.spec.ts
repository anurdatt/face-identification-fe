import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainCamerasComponent } from './maintain-cameras.component';

describe('MaintainCamerasComponent', () => {
  let component: MaintainCamerasComponent;
  let fixture: ComponentFixture<MaintainCamerasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintainCamerasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainCamerasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
