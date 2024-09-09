import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { fromEvent, Observable, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { layouVariables } from '../../../../styles/layout-variables';
import { HeaderComponent } from '../header/header.component';
import { SideNavComponent } from '../side-nav/side-nav.component';
import {
  calculateSideNavState,
  initialSideNavState,
  StateChangeTrigger,
  ViewType,
} from './side-nav.state';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SideNavComponent, ButtonModule],
  providers: [MessageService],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit, OnDestroy {
  private windowResize$: Observable<Event>;
  private poisonPill$ = new Subject<void>();
  private get viewType(): ViewType {
    return window.innerWidth < layouVariables.mobileBreakpoint.value
      ? 'Mobile'
      : 'Browser';
  }
  sideNavState = signal(initialSideNavState('Browser'));

  sideNavCssClassByState = new Map<string, string>([
    ['show', ''],
    ['hideInstantly', 'side-nav-closed-instantly'],
    ['hideAnimated', 'side-nav-closed-animated'],
    ['hideAnimatedAndSlowly', 'side-nav-closed-slowly-animated'],
  ]);

  sideNavCloseDelayInMillisecondsByState = new Map<string, number>([
    ['show', 300],
    ['hideInstantly', 0],
    ['hideAnimated', 300],
    ['hideAnimatedAndSlowly', 1000],
  ]);

  constructor() {
    this.windowResize$ = fromEvent(window, 'resize');
  }
  ngOnInit(): void {
    this.sideNavState.set(initialSideNavState(this.viewType));

    this.windowResize$
      .pipe(debounceTime(50), takeUntil(this.poisonPill$))
      .subscribe(() => this.updateSideNavState('WindowResized'));
  }

  updateSideNavState(trigger: StateChangeTrigger) {
    this.sideNavState.set(
      calculateSideNavState(this.sideNavState(), trigger, this.viewType)
    );

    const delay = this.sideNavCloseDelayInMillisecondsByState.get(
      this.sideNavState().state
    );
  }

  onMenuTogglerClicked() {
    this.updateSideNavState('MenuTogglerClicked');
  }

  onMenuItemSelected() {
    this.updateSideNavState('MenuItemSelected');
  }

  onOverlayClicked() {
    this.updateSideNavState('OverlayClicked');
  }

  onAppTitleClicked() {
    this.updateSideNavState('AppTitleClicked');
  }

  ngOnDestroy(): void {
    this.poisonPill$.next();
    this.poisonPill$.complete();
  }
}
