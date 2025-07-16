import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface HeaderButton {
  label: string;
  icon: string;
  routerLink?: string;
  color?: string;
  click?: () => void;
  type?: 'raised' | 'stroked' | 'basic' | 'flat';
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule, MatButtonModule, MatIconModule],
  template: `
    <mat-toolbar color="primary" class="mat-elevation-z4 toolbar-custom">
      <mat-icon class="logo-icon">{{ icon }}</mat-icon>
      <span class="title">{{ title }}</span>
      <span class="spacer"></span>
      <ng-container *ngFor="let btn of buttons">
        <ng-container [ngSwitch]="btn.type || 'stroked'">
          <button *ngSwitchCase="'raised'"
                  mat-raised-button
                  [color]="btn.color || 'primary'"
                  class="toolbar-btn"
                  [routerLink]="btn.routerLink"
                  (click)="btn.click && btn.click()">
            <mat-icon *ngIf="btn.icon">{{ btn.icon }}</mat-icon> {{ btn.label }}
          </button>
          <button *ngSwitchCase="'stroked'"
                  mat-stroked-button
                  [color]="btn.color || 'primary'"
                  class="toolbar-btn"
                  [routerLink]="btn.routerLink"
                  (click)="btn.click && btn.click()">
            <mat-icon *ngIf="btn.icon">{{ btn.icon }}</mat-icon> {{ btn.label }}
          </button>
          <button *ngSwitchCase="'flat'"
                  mat-flat-button
                  [color]="btn.color || 'primary'"
                  class="toolbar-btn"
                  [routerLink]="btn.routerLink"
                  (click)="btn.click && btn.click()">
            <mat-icon *ngIf="btn.icon">{{ btn.icon }}</mat-icon> {{ btn.label }}
          </button>
          <button *ngSwitchCase="'basic'"
                  mat-button
                  [color]="btn.color || 'primary'"
                  class="toolbar-btn"
                  [routerLink]="btn.routerLink"
                  (click)="btn.click && btn.click()">
            <mat-icon *ngIf="btn.icon">{{ btn.icon }}</mat-icon> {{ btn.label }}
          </button>
        </ng-container>
      </ng-container>
    </mat-toolbar>
  `,
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Input() icon: string = '';
  @Input() title: string = '';
  @Input() buttons: HeaderButton[] = [];
} 