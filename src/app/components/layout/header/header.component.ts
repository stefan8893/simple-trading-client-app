import { CommonModule, NgIf } from '@angular/common';
import { Component, OnDestroy, output, ViewEncapsulation } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule } from 'primeng/menu';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    AvatarModule,
    ButtonModule,
    DropdownModule,
    MenuModule,
    BadgeModule,
    NgIf,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnDestroy {
  private poisonPill$ = new Subject<void>();

  menuTogglerClicked = output();
  appTitleClicked = output();

  userPictureObjectUrl = '';

  constructor() {}

  items: MenuItem[] = [
    {
      separator: true,
    },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => {},
    },
  ];

  ngOnDestroy(): void {
    this.poisonPill$.next();
    this.poisonPill$.complete();
  }
}
