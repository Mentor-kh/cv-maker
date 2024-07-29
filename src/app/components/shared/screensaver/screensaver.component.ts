import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { AppConstants } from 'src/app/common/app.constants';
import { SsBarComponent } from './ss-bar/ss-bar.component';

export interface SS_Settings {
  isSS_active: boolean;
  isMousePointed: boolean;
  autoPlay: false;
  center: {
    pointX: number;
    pointY: number;
  };
  numPolygons: number;
  strokeWidth: number;
  strokeWidthDecrement: number;
  gradientOffsets: number[];
  cornersQuantity: number;
}

@Component({
  selector: 'screensaver',
  standalone: true,
  imports: [CommonModule, SsBarComponent],
  templateUrl: './screensaver.component.html',
  styleUrl: './screensaver.component.scss'
})
export class ScreenSaverComponent implements AfterViewInit, OnDestroy {
  @ViewChild('body', { static: false }) private svgContainer!: ElementRef;

  private svgElement: SVGElement | null = null;
  private polygons: { element: SVGPolygonElement, strokeWidth: number }[] = [];
  private gradientElement: SVGLinearGradientElement | null = null;
  private animationFrameId: number = 0;
  private points: string = '';
  private containerHeight: number = window.innerHeight;
  private containerWidth: number = window.innerWidth;

  public SS_Settings: SS_Settings = {
    isSS_active: false,
    isMousePointed: false,
    autoPlay: false,
    center: {
      pointX: 0,
      pointY: 0,
    },
    numPolygons: AppConstants.numPolygons,
    strokeWidth: AppConstants.initialStrokeWidth,
    strokeWidthDecrement: AppConstants.strokeWidthDecrement,
    gradientOffsets: AppConstants.gradientOffsets,
    cornersQuantity: AppConstants.cornersQuantity,
  };

  public ngAfterViewInit() {
    if (this.svgContainer && this.svgContainer.nativeElement) {
      this.createSVG();
      this.setupSVG();
      this.createGradient();
      // this.startAnimation();
    }
  }

  public ngOnDestroy() {
    this.stopAnimation();
  }

  @HostListener('window:resize', ['$event'])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public onResize(event: Event) {
    this.setupSVG();
    this.redrawPolygons();
  }

  @HostListener('window:mousemove', ['$event'])
  public onMousemove(event: MouseEvent) {
    if (this.SS_Settings.isMousePointed) {
      this.SS_Settings.center.pointX = event.clientX / this.containerWidth * 100;
      this.SS_Settings.center.pointY = event.clientY / this.containerHeight * 100;
    }
  }

  private createSVG(): void {
    if (!this.svgElement) {
      console.log(this.svgContainer.nativeElement);
      
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      svg.setAttribute('height', `${this.containerHeight/10 > 320 ? this.containerHeight/10 : 320}px`);
      svg.setAttribute('width', `${this.containerWidth/10 > 480 ? this.containerWidth/10 : 480}px`);
      this.svgContainer.nativeElement.appendChild(svg);
      this.svgElement = svg;
      this.containerWidth = this.svgContainer.nativeElement.offsetWidth;
      this.containerHeight = this.svgContainer.nativeElement.offsetHeight;
      
      this.SS_Settings.center.pointX = this.containerWidth / 2;
      this.SS_Settings.center.pointY = this.containerHeight / 2;
    }
  }

  private setupSVG(): void {
    if (!this.svgElement) {
      return;
    }

    this.svgElement.setAttribute('viewBox', `0 0 ${this.containerWidth} ${this.containerHeight}`);
    this.svgElement.setAttribute('width', `${this.containerWidth}`);
    this.svgElement.setAttribute('height', `${this.containerHeight}`);
  }

  public createGradient(): void {
    if (!this.svgElement) {
      return;
    }

    this.gradientElement = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    this.gradientElement.setAttribute('id', 'gradient');
    this.gradientElement.setAttribute('x1', '0%');
    this.gradientElement.setAttribute('y1', '0%');
    this.gradientElement.setAttribute('x2', '100%');
    this.gradientElement.setAttribute('y2', '100%');
    this.updateGradientColors();

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.appendChild(this.gradientElement);
    this.svgElement.appendChild(defs);
  }

  public updateGradientColors(): void {
    if (!this.gradientElement) {
      return;
    }

    // Clear existing stops
    while (this.gradientElement.firstChild) {
      this.gradientElement.removeChild(this.gradientElement.firstChild);
    }

    // TODO: add colorpicker and refactor
    // Define colors based on gradient offsets
    const colors = [
      { offset: this.SS_Settings.gradientOffsets[0], color: 'blue' },
      { offset: this.SS_Settings.gradientOffsets[1], color: 'yellow' },
      { offset: this.SS_Settings.gradientOffsets[2], color: 'orange' },
      { offset: this.SS_Settings.gradientOffsets[3], color: 'green' },
      { offset: this.SS_Settings.gradientOffsets[4], color: 'blue' },
      { offset: this.SS_Settings.gradientOffsets[5], color: 'cyan' },
      { offset: this.SS_Settings.gradientOffsets[6], color: 'purple' }
    ];

    // Create stops dynamically
    colors.forEach(({ offset, color }) => {
      const stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop.setAttribute('offset', `${offset * 100}%`);
      stop.setAttribute('stop-color', color);
      this.gradientElement?.appendChild(stop);
    });
  }

  public handleSS_Setting(settings: SS_Settings): void {
    console.log('handleSS_Setting', settings);
    this.SS_Settings = settings;
    if(this.SS_Settings.isSS_active && settings.isSS_active) {
      this.startAnimation();
    } else {
      this.stopAnimation();
    }
  }

  private createPolygon(strokeWidth: number): SVGElementTagNameMap['polygon'] | null {
    if (!this.svgElement) {
      return null;
    }

    const polygon: SVGElementTagNameMap['polygon'] = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    this.points = this.getSmoothlyMovingPolygonPoints();
    polygon.setAttribute('points', this.points);
    polygon.setAttribute('style', `fill: transparent; stroke: url(#gradient); stroke-width: ${strokeWidth}px;`);
    this.svgElement.appendChild(polygon);

    // Store the polygon element and its initial stroke width
    this.polygons.push({ element: polygon, strokeWidth });

    return polygon;
  }

  private redrawPolygons(): void {
    // Remove old polygons if there are more than numPolygons
    while (this.polygons.length > this.SS_Settings.numPolygons) {
      const removedPolygon = this.polygons.shift();
      if (removedPolygon && removedPolygon.element.parentNode) {
        removedPolygon.element.parentNode.removeChild(removedPolygon.element);
      }
    }

    // Create a new polygon with the initial stroke width
    this.createPolygon(this.SS_Settings.strokeWidth);
  }

  private getSmoothlyMovingPolygonPoints(timeStamp: number = 0): string {
    const time = Date.now() / 16000 + timeStamp;
    const frequency = 24;
    const amplitude = Math.min(this.containerWidth, this.containerHeight) * Math.sin(time * frequency + Math.PI); // Adjust amplitude based on viewport sizes

    const points = [];
    for (let i = 0; i < this.SS_Settings.cornersQuantity; i++) {
      let x = Math.sin(this.containerWidth / 2) + amplitude * Math.sin(time * frequency * i * Math.PI * 0.2) + this.SS_Settings.center.pointX;
      let y = Math.cos(this.containerHeight / 5) + amplitude * Math.cos(time * frequency * i * Math.PI * 0.2) + this.SS_Settings.center.pointY;
      if (x < 0) {
        x = 0;
      }
      if (x > this.containerWidth) {
        x = this.containerWidth;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > this.containerHeight) {
        y = this.containerHeight;
      }
      
      points.push(`${x},${y}`);
    }
    return points.join(' ');
  }

  private startAnimation(): void {
    console.log('startAnimation');
    
    const animate = () => {
      // Update gradient colors dynamically
      this.SS_Settings.gradientOffsets = this.SS_Settings.gradientOffsets.map(offset => (offset + 0.001) % 1);
      this.updateGradientColors();

      // Update polygon positions and stroke widths
      this.redrawPolygons();

      // Continue animation loop
      this.animationFrameId = requestAnimationFrame(animate);
    };
    this.animationFrameId = requestAnimationFrame(animate);
  }

  private stopAnimation(): void {
    console.log('stopAnimation');
    cancelAnimationFrame(this.animationFrameId);
  }
}
