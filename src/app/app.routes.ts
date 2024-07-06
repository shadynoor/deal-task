import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tab1',
    loadComponent: () =>
      import('./Components/tab1/tab1.page').then((c) => c.Tab1Page),
  },
  {
    path: 'tab2',
    loadComponent: () =>
      import('./Components/tab2/tab2.page').then((c) => c.Tab2Page),
  },
  {
    path: 'tab3',
    loadComponent: () =>
      import('./Components/tab3/tab3.page').then((c) => c.Tab3Page),
  },
  {
    path: 'recorder',
    loadComponent: () =>
      import('./Components/recorder/recorder.page').then((c) => c.RecorderPage),
  },
  {
    path: '',
    redirectTo: 'tab1',
    pathMatch: 'full',
  },
  {
    path: 'header',
    loadComponent: () =>
      import('./Components/header/header.page').then((m) => m.HeaderPage),
  },
  {
    path: 'recorder',
    loadComponent: () =>
      import('./Components/recorder/recorder.page').then((m) => m.RecorderPage),
  },
];
