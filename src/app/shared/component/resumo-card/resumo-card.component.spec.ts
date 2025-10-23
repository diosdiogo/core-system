import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumoCardComponent } from './resumo-card.component';

describe('ResumoCardComponent', () => {
  let component: ResumoCardComponent;
  let fixture: ComponentFixture<ResumoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumoCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
