import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeFeed } from './recipe-feed';

describe('RecipeFeed', () => {
  let component: RecipeFeed;
  let fixture: ComponentFixture<RecipeFeed>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeFeed]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipeFeed);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
