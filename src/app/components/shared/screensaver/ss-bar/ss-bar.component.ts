import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AppConstants } from 'src/app/common/app.constants';
import { SS_Settings } from '../screensaver.component';

@Component({
  selector: 'ss-bar',
  standalone: true,
  imports: [MatButtonToggleModule, MatIconModule, MatListModule],
  templateUrl: './ss-bar.component.html',
  styleUrl: './ss-bar.component.scss'
})
export class SsBarComponent {
  @Output() emitSS_settings: EventEmitter<SS_Settings> = new EventEmitter();

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
  
  public SS_Random(): void {
    this.SS_Settings.center.pointX = window.innerWidth * Math.random() / 10;
    this.SS_Settings.center.pointY = window.innerHeight * Math.random() / 10;
    this.emitSettings();
  }

  public SS_Pointer(): void {
    this.SS_Settings.isMousePointed ? this.SS_Settings.isMousePointed = false : this.SS_Settings.isMousePointed = true;
    this.emitSettings();
  }

  public isOpen(): void {
    this.SS_Settings.isSS_active ? this.SS_Settings.isSS_active = false : this.SS_Settings.isSS_active = true;
    this.emitSettings();
  }

  private emitSettings(): void {
    this.emitSS_settings.emit(this.SS_Settings);
  }
}
