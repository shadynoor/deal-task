import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonAccordion,
  IonItem,
  IonLabel,
  IonButton,
} from '@ionic/angular/standalone';
import { HeaderPage } from '../header/header.page';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonLabel,
    IonItem,
    IonAccordion,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    RouterLink,
    HeaderPage,
  ],
})
export class Tab1Page {
  constructor() {}
}
