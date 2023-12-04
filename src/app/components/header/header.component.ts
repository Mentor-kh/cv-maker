import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: true,
    imports: [MatToolbarModule, RouterLink, MatIconModule, NgIf, MatButtonModule]
})
export class HeaderComponent {
  @Output() deleteSession: EventEmitter<void> = new EventEmitter();
  @Input() public isAuthentificated: boolean = false;

  public logout(): void {
    this.deleteSession.emit();
  }
}
