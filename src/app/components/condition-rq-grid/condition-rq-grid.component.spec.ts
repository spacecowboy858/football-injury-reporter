import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionRqGridComponent } from './condition-rq-grid.component';

describe('ConditionRqGridComponent', () => {
  let component: ConditionRqGridComponent;
  let fixture: ComponentFixture<ConditionRqGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConditionRqGridComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConditionRqGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
