import { enableProdMode } from '@angular/core';
import {
  bootstrapApplication,
  provideClientHydration,
} from '@angular/platform-browser';
import {
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  PreloadAllModules,
  InMemoryScrollingOptions,
  withInMemoryScrolling,
  withViewTransitions,
} from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { IonicServerModule } from '@ionic/angular-server';
import { provideServerRendering } from '@angular/platform-server';

if (environment.production) {
  enableProdMode();
}
defineCustomElements(window);

const scrollConfig: InMemoryScrollingOptions = {
  scrollPositionRestoration: 'top',
  anchorScrolling: 'enabled',
};

// Should Add server.ts path to angular.json to work with server side rendering
// but the problem here is with angular builder

bootstrapApplication(AppComponent, {
  providers: [
    // { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideRouter(
      routes,
      withInMemoryScrolling(scrollConfig),
      withViewTransitions()
      // withPreloading(PreloadAllModules)
    ),
    provideIonicAngular(),
    //  provideClientHydration(),
    // IonicServerModule,
  ],
});
