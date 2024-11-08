import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ColourConstants } from './classes/colour-constants';
import { AnchorColour } from './classes/anchor-colour/anchor-colour';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    const anchor: AnchorColour = new AnchorColour(
      ColourConstants.red().hsv,
      []
    );
    component.colourPalette = [anchor];

    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have the 'colourtron' title`, () => {
    expect(component.title).toEqual('colourtron');
  });
});
