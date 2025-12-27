import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CobrosPagosComponent } from './cobros-pagos.component';

describe('CobrosPagosComponent', () => {
  let component: CobrosPagosComponent;
  let fixture: ComponentFixture<CobrosPagosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CobrosPagosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CobrosPagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
