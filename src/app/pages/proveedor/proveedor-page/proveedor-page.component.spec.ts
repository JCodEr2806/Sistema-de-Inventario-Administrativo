import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProveedorPageComponent } from './proveedor-page.component';

describe('ProveedorPageComponent', () => {
  let component: ProveedorPageComponent;
  let fixture: ComponentFixture<ProveedorPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProveedorPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProveedorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
