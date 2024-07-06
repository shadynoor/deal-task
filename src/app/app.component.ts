import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet, IonSpinner } from '@ionic/angular/standalone';
import { TabsPage } from './Components/tabs/tabs.page';
import { VoiceRecorder } from 'capacitor-voice-recorder';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonSpinner, IonApp, IonRouterOutlet, TabsPage],
})
export class AppComponent {
  constructor() {}
}
