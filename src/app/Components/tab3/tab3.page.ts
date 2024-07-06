import { Component } from '@angular/core';

import { sadOutline, trashOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonAvatar,
  IonIcon,
  IonActionSheet,
} from '@ionic/angular/standalone';
import { Preferences } from '@capacitor/preferences';
import { HeaderPage } from '../header/header.page';
import { RecorderPage } from '../recorder/recorder.page';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [
    IonActionSheet,
    IonIcon,
    IonAvatar,
    IonLabel,
    IonItem,
    IonList,
    IonContent,
    IonTitle,
    IonToolbar,
    IonHeader,
    HeaderPage,
    RecorderPage,
  ],
})
export class Tab3Page {
  constructor() {
    addIcons({ sadOutline, trashOutline });
  }
  myData: any[] = [];

  public actionSheetButtons = [
    {
      text: 'Delete',
      data: {
        action: 'delete',
      },
    },
    {
      text: 'Cancel',
      data: {
        action: 'cancel',
      },
    },
  ];

  async ionViewWillEnter() {
    // await this.recorder.getRecord();
    // await this.photoService.getImage();
    this.getData();
  }

  async getData() {
    let { value } = await Preferences.get({
      key: 'data',
    });

    this.myData = JSON.parse(value || '[]');
  }

  deleteAndUpdate(id: number) {
    this.myData.splice(id, 1);
    Preferences.set({
      key: 'data',
      value: JSON.stringify(this.myData),
    });
  }

  onDidDismiss(event: any, id: number) {
    if (!event.detail.data) {
      return;
    }
    if (event.detail.data.action == 'delete') {
      this.deleteAndUpdate(id);
    }
  }
}
