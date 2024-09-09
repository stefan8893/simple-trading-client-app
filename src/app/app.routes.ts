import { Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { LayoutComponent } from './components/layout/layout/layout.component';

export const routes: Routes = [
  {
    path: 'app',
    component: LayoutComponent,
    children: [],
  },
  {
    path: '',
    component: LandingPageComponent,
  },
];
