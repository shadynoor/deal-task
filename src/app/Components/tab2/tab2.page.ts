import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonInput,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonList,
  IonAvatar,
  IonButton,
  IonActionSheet,
  IonToast,
} from '@ionic/angular/standalone';
import {
  logOutOutline,
  camera,
  micOutline,
  micOffOutline,
  stopOutline,
  createOutline,
  pencilOutline,
  trashOutline,
} from 'ionicons/icons';
import { addIcons } from 'ionicons';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { PhotoService } from 'src/app/Core/services/photo.service';
import { Preferences } from '@capacitor/preferences';
import { NetworkService } from 'src/app/Core/services/network.service';
import { Subscription } from 'rxjs';
import { HeaderPage } from '../header/header.page';
import { RecorderPage } from '../recorder/recorder.page';
import { VoiceRecorder } from 'capacitor-voice-recorder';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [
    IonToast,
    IonActionSheet,
    IonButton,
    IonAvatar,
    IonList,
    IonImg,
    IonCol,
    IonRow,
    IonGrid,
    IonInput,
    IonLabel,
    IonItem,
    IonIcon,
    IonFabButton,
    IonFab,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    ReactiveFormsModule,
    NgFor,
    NgIf,
    HeaderPage,
    RecorderPage,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class Tab2Page implements OnInit {
  constructor(
    public photoService: PhotoService,
    private network: NetworkService
  ) {
    addIcons({ camera, micOutline, stopOutline, trashOutline });
  }

  @ViewChild('imgUploader', { static: false })
  imgUploader!: ElementRef<HTMLInputElement>;
  currentName = '';
  data: any[] = [];
  networkStatus$!: Subscription;

  seconds = 0;
  mins = 0;
  interval: any;
  file!: File;

  public actionSheetButtons = [
    {
      text: 'Upload Photo',
      data: {
        action: 'upload',
      },
    },
    {
      text: 'Open Camera',
      data: {
        action: 'camera',
      },
    },
  ];

  public deleteActionSheetButtons = [
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

  errorMsg = '';
  isToastOpen = false;
  formSent = false;
  successMsg = '';

  currentAudio = '';

  canRecord = false;

  // Form Group
  myForm = new FormGroup({
    image: new FormControl(this.file, {
      validators: [Validators.required],
    }),
    name: new FormControl(this.currentName, [
      Validators.required,
      Validators.maxLength(10),
      Validators.minLength(3),
    ]),
  });

  ngOnInit(): void {
    // Request Permission
    VoiceRecorder.hasAudioRecordingPermission().then((has) => {
      if (!has.value) {
        VoiceRecorder.requestAudioRecordingPermission().then((request) => {
          if (!request.value) {
            alert('Permission Denied');
          }
        });
      }
    });
  }

  async ionViewWillEnter() {
    this.networkStatus$ = this.network
      .checkNetworkStatus()
      .subscribe(async (status) => {
        if (status) {
          this.successMsg = 'Form Successfully sent';
          // Send Form Data To API which already saved in local storage
          // Fetch This Object after reconnect
          // const userData = {
          //   name: this.currentName,
          //   image: this.photoService.photo.webviewPath,
          //   audio: this.currentAudio,
          // };
        } else {
          this.successMsg =
            'Form Successfully saved, Once you are online it will be synced';
          this.isToastOpen = true;
          this.errorMsg = 'No Internet Connection';

          // Get Local Data
          await this.photoService.getImage();
          await this.getUserData();
          this.myForm.get('name')?.setValue(this.currentName);
        }
      });
  }

  onStopRecord(event: string) {
    this.currentAudio = event;
  }

  // Get name
  async getUserData() {
    const { value } = await Preferences.get({ key: 'userData' });
    const data = JSON.parse(value || '');
    this.currentName = data.name;
    this.currentAudio = data.audio;
  }

  // Bottom Sheet
  onDidDismiss(event: any) {
    if (!event.detail.data) {
      return;
    }
    if (event.detail.data.action == 'camera') {
      this.addPhotoToGallery();
    } else {
      this.imgUploader.nativeElement.click();
    }
  }

  deleteBottomSheet(event: any) {
    if (!event.detail.data) {
      return;
    }
    if (event.detail.data.action == 'delete') {
      this.currentAudio = '';
    }
  }
  // Bottom Sheet

  // dataURLtoFile(dataurl: any, filename: any) {
  //   var arr = dataurl.split(','),
  //     mime = arr[0].match(/:(.*?);/)[1],
  //     bstr = atob(arr[arr.length - 1]),
  //     n = bstr.length,
  //     u8arr = new Uint8Array(n);
  //   while (n--) {
  //     u8arr[n] = bstr.charCodeAt(n);
  //   }
  //   return new File([u8arr], filename, { type: mime });
  // }

  // Submit Form
  async onSubmit() {
    const imgValid = this.photoService.photo;
    this.isToastOpen = false;
    if (
      imgValid &&
      imgValid.webviewPath &&
      this.myForm.get('name')?.valid &&
      this.currentAudio
    ) {
      this.photoService.updatePhotoPath();
      this.formSent = true;
      this.data.push({
        name: this.myForm.get('name')?.value!,
        image: imgValid.webviewPath,
        audio: this.currentAudio,
      });
      this.currentName = this.myForm.get('name')?.value!;
      Preferences.set({
        key: 'userData',
        value: JSON.stringify({
          name: this.currentName,
          image: imgValid.webviewPath,
          audio: this.currentAudio,
        }),
      });
      this.storeData(this.data);
      this.reset();
    } else {
      if (
        !imgValid &&
        !(this.myForm.get('name')?.value?.length! > 0) &&
        !this.currentAudio
      ) {
        this.errorMsg =
          'Please enter your name, select an image and record an introduction about yourself';
        this.isToastOpen = true;
      } else if (!imgValid && !(this.myForm.get('name')?.value?.length! > 0)) {
        this.errorMsg = 'Please enter your name and select an image';
        this.isToastOpen = true;
      } else if (
        this.myForm.get('name')?.value?.length! > 0 &&
        !this.myForm.get('name')?.valid
      ) {
        this.errorMsg = 'Please enter valid name, minlength 3 and max 10';
        this.isToastOpen = true;
      } else if (imgValid && !this.myForm.get('name')?.valid) {
        this.errorMsg = 'Please enter valid name, minlength 3 and max 10';
        this.isToastOpen = true;
      } else if (!this.currentAudio) {
        this.errorMsg = 'Please record an introduction about yourself';
        this.isToastOpen = true;
      } else {
        this.errorMsg = 'Please select an image';
        this.isToastOpen = true;
      }
    }
  }

  reset() {
    this.photoService.photo = null!;
    this.currentAudio = '';
    this.myForm.reset();
  }

  async storeData(data: any[]) {
    let { value } = await Preferences.get({
      key: 'data',
    });

    const oldData = JSON.parse(value || '[]');

    if (oldData) {
      this.data = [...oldData, ...data];
    }

    Preferences.set({
      key: 'data',
      value: JSON.stringify(this.data),
    });
  }

  // Open Camera
  async addPhotoToGallery() {
    await this.photoService.addNewToGallery();
  }

  // Upload Image
  detectChange(event: any) {
    const file = event.target.files[0];
    // this.myForm.get('image')?.updateValueAndValidity();
    const imgSize = 2097152;

    if (file.size > imgSize) {
      // Img size error
      return;
    }

    // Loading virtual image to get width and height
    const img = new Image();
    const reader = new FileReader();
    let isFileValid = true;
    reader.readAsDataURL(file);
    reader.onload = (e: any) => {
      img.src = e.target.result;
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        if (width > 1080 || height > 1080) {
          console.log('Image too large');
          this.errorMsg = 'Image too large (1080px x 1080px) is the max size';
          this.isToastOpen = true;
          isFileValid = false;
        } else {
          isFileValid = true;
        }

        if (isFileValid) {
          if (this.photoService.photo) {
            this.photoService.photo.webviewPath = e.target.result;
            this.photoService.photo.filepath = file.name;
            this.photoService.photo.uploaded = true;
          } else {
            this.photoService.photo = {
              filepath: file.name,
              webviewPath: e.target.result,
              uploaded: true,
            };
          }
        }
      };
    };
  }

  ionViewDidLeave() {
    this.reset();
    if (this.networkStatus$) this.networkStatus$.unsubscribe();
  }
}
