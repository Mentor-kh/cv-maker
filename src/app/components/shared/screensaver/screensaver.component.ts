import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';

@Component({
  selector: 'screensaver',
  standalone: true,
  imports: [],
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
  private gradientOffsets: number[] = [0, 0.15, 0.30, 0.45, 0.60, 0.75, 1]; // Gradient offsets for different colors
  private numPolygons: number = 30; // Number of polygons to display
  private initialStrokeWidth: number = 2; // Initial stroke width of the first polygon
  private strokeWidthDecrement: number = 0.2; // Amount to decrement stroke width on each polygon
  private pointX: number = window.innerWidth / 2;
  private pointY: number = window.innerHeight / 2;
  private cornersQuantity: number = 4;

  public ngAfterViewInit() {
    if (this.svgContainer) {
      this.createSVG();
      this.setupSVG();
      this.createGradient();
      this.startAnimation();
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
    return;
    this.pointX = event.clientX;
    this.pointY = event.clientY;
  }


  private createSVG(): void {
    if (this.svgContainer && this.svgContainer.nativeElement && !this.svgElement) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      this.svgContainer.nativeElement.appendChild(svg);
      this.svgElement = svg;
    }
  }

  private setupSVG(): void {
    if (!this.svgElement) {
      return;
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    this.svgElement.setAttribute('viewBox', `0 0 ${width} ${height}`);
    this.svgElement.setAttribute('width', `${width}`);
    this.svgElement.setAttribute('height', `${height}`);
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

    // Define colors based on gradient offsets
    const colors = [
      { offset: this.gradientOffsets[0], color: 'blue' },
      { offset: this.gradientOffsets[1], color: 'yellow' },
      { offset: this.gradientOffsets[2], color: 'orange' },
      { offset: this.gradientOffsets[3], color: 'green' },
      { offset: this.gradientOffsets[4], color: 'blue' },
      { offset: this.gradientOffsets[5], color: 'cyan' },
      { offset: this.gradientOffsets[6], color: 'purple' }
    ];

    // Create stops dynamically
    colors.forEach(({ offset, color }) => {
      const stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop.setAttribute('offset', `${offset * 100}%`);
      stop.setAttribute('stop-color', color);
      this.gradientElement?.appendChild(stop);
    });
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
    while (this.polygons.length > this.numPolygons) {
      const removedPolygon = this.polygons.shift();
      if (removedPolygon && removedPolygon.element.parentNode) {
        removedPolygon.element.parentNode.removeChild(removedPolygon.element)
      }
    }

    // const element = document.getElementsByTagName('polygon');
    // if (!element) return;
    // let index: number;

    // for (index = element.length - this.numPolygons; index > 0; index--) {
    //   element[index].parentNode?.removeChild(element[index]);
    // }

    // Update stroke widths and positions of existing polygons
    this.polygons.forEach((polygon, index) => {
      const newStrokeWidth = polygon.strokeWidth - this.strokeWidthDecrement; // Decrease stroke width
      polygon.element.setAttribute('stroke-width', `${newStrokeWidth}px`);
      this.points = this.getSmoothlyMovingPolygonPoints(index * 0.1);
      polygon.element.setAttribute('points', this.points);
    });

    // Create a new polygon with the initial stroke width
    this.createPolygon(this.initialStrokeWidth);
  }

  private getSmoothlyMovingPolygonPoints(timeStamp: number = 0): string {
    const time = Date.now() / 1000 + timeStamp;
    const frequency = 0.4;
    const amplitude = Math.min(window.innerWidth, window.innerHeight) * Math.sin(time * frequency + Math.PI); // Adjust amplitude based on viewport sizes

    const points = [];
    for (let i = 0; i < this.cornersQuantity; i++) {
      const x = Math.sin(window.innerWidth / 2) + amplitude * Math.sin(time * frequency * i * Math.PI * 0.2) + this.pointX;
      const y = Math.cos(window.innerHeight / 5) + amplitude * Math.cos(time * frequency * i * Math.PI * 0.2) + this.pointY;
      points.push(`${x},${y}`);
    }
    return points.join(' ');
  }

  private startAnimation(): void {
    const animate = () => {
      // Update gradient colors dynamically
      this.gradientOffsets = this.gradientOffsets.map(offset => (offset + 0.001) % 1);
      this.updateGradientColors();

      // Update polygon positions and stroke widths
      this.redrawPolygons();

      // Continue animation loop
      this.animationFrameId = requestAnimationFrame(animate);
    };
    this.animationFrameId = requestAnimationFrame(animate);
  }

  private stopAnimation(): void {
    cancelAnimationFrame(this.animationFrameId);
  }
}
