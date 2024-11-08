import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ColourWheelComponent } from './colour-wheel.component';
import { ColourConstants } from '../../classes/colour-constants';
import { AnchorColour } from '../../classes/anchor-colour/anchor-colour';
import { FormattingConstants } from '../../classes/formatting-constants';
import { ComponentRef, DebugElement } from '@angular/core';
import { hsvColour } from '../../types/hsvColour';
import { RelativeColour } from '../../types/relativeColour';
import { By } from '@angular/platform-browser';
import { ColourWheelService } from '../../services/colour-wheel/colour-wheel.service';

describe('ColourWheelComponent', () => {
  let fixture: ComponentFixture<ColourWheelComponent>;
  let component: ColourWheelComponent;
  let componentRef: ComponentRef<ColourWheelComponent>;
  let selectedAnchorColour: hsvColour;

  const mockColourWheelService = jasmine.createSpyObj('ColourWheelService', [
    'updateColour',
    'stopUpdatingColour',
    'colourWheelMousedown',
    'anchorPointerMousedown',
    'relativePointerMousedown',
  ]);
  const testRelativeColour = {
    hueOffset: 0,
    saturation: 0,
    value: 0,
  } as RelativeColour;
  const testAnchorColour = new AnchorColour(ColourConstants.red().hsv, []);
  const testMouseEvent = new MouseEvent('click');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColourWheelComponent],
      providers: [
        {
          provide: ColourWheelService,
          useValue: mockColourWheelService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ColourWheelComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;

    component.colourPalette = [new AnchorColour(ColourConstants.red().hsv, [])];
    component.selectedColour = 0;
    selectedAnchorColour =
      component.colourPalette[component.selectedColour].colour;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('updateColour', () => {
    it('should call out to the colourWheelService', () => {
      component.updateColour(new MouseEvent('click'));

      expect(mockColourWheelService.updateColour).toHaveBeenCalled();
    });
  });

  describe('stopUpdatingColour', () => {
    it('should call out to the colourWheelService', () => {
      component.stopUpdatingColour();

      expect(mockColourWheelService.stopUpdatingColour).toHaveBeenCalled();
    });
  });

  describe('colourWheelMousedown', () => {
    it('should call out to the colourWheelService', () => {
      component.colourWheelMousedown(testMouseEvent);

      expect(mockColourWheelService.colourWheelMousedown).toHaveBeenCalled();
    });
  });

  describe('pointerMousedown', () => {
    it('should call out to the colourWheelService', () => {
      component.pointerMousedown(testMouseEvent, testAnchorColour);

      expect(mockColourWheelService.anchorPointerMousedown).toHaveBeenCalled();
    });
  });

  describe('secondaryPointerMousedown', () => {
    it('should call out to the colourWheelService', () => {
      component.secondaryPointerMousedown(
        testMouseEvent,
        testAnchorColour,
        testRelativeColour
      );

      expect(
        mockColourWheelService.relativePointerMousedown
      ).toHaveBeenCalled();
    });
  });

  describe('calculateValueOverlayOpacity', () => {
    it('should return 0 when value is maximum', () => {
      const testValue = ColourConstants.valueMax;
      selectedAnchorColour.value = testValue;

      const result = component.calculateValueOverlayOpacity();

      expect(result).toBe(0);
    });

    it('should return 1 when value is minimum', () => {
      const testValue = 0;
      selectedAnchorColour.value = testValue;

      const result = component.calculateValueOverlayOpacity();

      expect(result).toBe(1);
    });

    it('should return 0.5 value is half of maximum', () => {
      const testValue = ColourConstants.valueMax / 2;
      selectedAnchorColour.value = testValue;

      const result = component.calculateValueOverlayOpacity();

      expect(result).toBe(0.5);
    });

    it('should return 0 when value is over maximum', () => {
      const testValue = ColourConstants.valueMax + 10;
      selectedAnchorColour.value = testValue;

      const result = component.calculateValueOverlayOpacity();

      expect(result).toBe(0);
    });

    it('should return 1 when value is under minimum', () => {
      const testValue = -1;
      selectedAnchorColour.value = testValue;

      const result = component.calculateValueOverlayOpacity();

      expect(result).toBe(1);
    });
  });

  // describe('colourWheelClick', () => {
  //   it('should be called when the colour wheel is clicked', () => {
  //     spyOn(component, 'colourWheelClick');

  //     const colourWheelElement = findComponent('.colour-wheel');
  //     colourWheelElement.click();

  //     expect(component.colourWheelClick).toHaveBeenCalled();
  //   });
  //   it('should emit a change event', () => {
  //     spyOn(component.colourPaletteChange, 'emit');

  //     const colourWheelElement = findComponent('.colour-wheel');
  //     colourWheelElement.click();

  //     expect(component.colourPaletteChange.emit).toHaveBeenCalled();
  //     expect(component.colourPaletteChange.emit).toHaveBeenCalledWith(
  //       component.colourPalette
  //     );
  //   });
  // });

  describe('html rendering', () => {
    describe('anchors', () => {
      it('should render the anchor swatch', () => {
        const elements = findComponents('app-pointer');

        expect(elements).toBeTruthy();
      });
      it('should render any related swatches', () => {
        component.colourPalette[component.selectedColour].relatedColours.push({
          hueOffset: ColourConstants.hueMax / 2,
          saturation:
            component.colourPalette[component.selectedColour].colour.saturation,
          value: component.colourPalette[component.selectedColour].colour.value,
        });
        fixture.detectChanges();

        const elements = findComponents('app-pointer');
        const relatedColoursCount =
          component.colourPalette[component.selectedColour].relatedColours
            .length;

        expect(relatedColoursCount).toBe(1);
        expect(elements).toBeTruthy();
        expect(elements.length).toBe(2);
      });
      it('should not render any related swatches when none exist', () => {
        const elements = findComponents('app-pointer');
        const relatedColoursCount =
          component.colourPalette[component.selectedColour].relatedColours
            .length;

        expect(relatedColoursCount).toBe(0);
        expect(elements).toBeTruthy();
        expect(elements.length).toBe(1);
      });
    });

    describe('diameter', () => {
      it('should render at the correct size when a size parameter is provided', () => {
        const overrideSize = 100;
        componentRef.setInput('diameter', overrideSize);

        const expectedSize =
          overrideSize - FormattingConstants.thinBorderWidth * 2;

        testColourWheelDimensions(expectedSize);
      });
    });

    describe('overlays', () => {
      it('should render completely transparent when value is maximum', () => {
        const testValue = ColourConstants.valueMax;

        testComponentOpacity('.value-overlay', testValue);
      });

      it('should render completely opaque when value is minimum', () => {
        const testValue = 0;

        testComponentOpacity('.value-overlay', testValue);
      });

      it('should render half transparent when value is half of maximum', () => {
        const testValue = ColourConstants.valueMax / 2;

        testComponentOpacity('.value-overlay', testValue);
      });

      it('should render completely transparent when value is over maximum', () => {
        const testValue = ColourConstants.valueMax + 10;

        testComponentOpacity('.value-overlay', testValue);
      });

      it('should render completely opaque when value is under minimum', () => {
        const testValue = -1;

        testComponentOpacity('.value-overlay', testValue);
      });
    });
  });

  function testColourWheelDimensions(expectedSize: number) {
    fixture.detectChanges();

    testElementDimensions('.colour-wheel', expectedSize);
    testElementDimensions('.value-overlay', expectedSize);
    testElementDimensions('.white-overlay', expectedSize);
  }

  function testElementDimensions(
    querySelector: string,
    expectedSize: number
  ): void {
    const element = findComponent(querySelector);
    expect(element).toBeTruthy();
    expect(element.clientWidth).toBe(expectedSize);
    expect(element.clientHeight).toBe(expectedSize);
  }

  function findComponent(querySelector: string): HTMLElement {
    return fixture.debugElement.nativeElement.querySelector(
      querySelector
    ) as HTMLElement;
  }

  function findComponents(querySelector: string): DebugElement[] {
    return fixture.debugElement.queryAll(By.css(querySelector));
  }

  function testComponentOpacity(componentId: string, testValue: number) {
    selectedAnchorColour.value = testValue;
    const expectedOpacity = component.calculateValueOverlayOpacity();

    fixture.detectChanges();

    const element = findComponent(componentId);

    expect(element).toBeTruthy();
    expect(element?.style.opacity).toBe(expectedOpacity.toString());
  }
});
