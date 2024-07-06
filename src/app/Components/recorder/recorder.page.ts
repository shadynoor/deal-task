import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { RecordingData, VoiceRecorder } from 'capacitor-voice-recorder';
import { HeaderPage } from '../header/header.page';
import { addIcons } from 'ionicons';
import { camera, micOutline, stopOutline } from 'ionicons/icons';
import { Gesture, GestureController } from '@ionic/angular';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-recorder',
  templateUrl: './recorder.page.html',
  styleUrls: ['./recorder.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    HeaderPage,
  ],
})
export class RecorderPage implements AfterViewInit {
  recording = false;
  storedFiles: any[] = [];
  @ViewChild('recordBtn', { read: ElementRef }) recordBtn!: ElementRef;
  durationText = '00:00';
  duration = 0;
  interval: any;
  @Output() stopRecord = new EventEmitter<string>();

  constructor(private gesture: GestureController) {
    addIcons({ camera, micOutline, stopOutline });
  }

  // Native JS
  time!: number;
  public mouseup() {
    this.time = 0;
    this.stopRecording();
    if (this.interval) clearInterval(this.interval);
    this.calculateDuration();
  }

  public mousedown() {
    this.time += 1;
    this.startRecording();
    this.calculateDuration();
  }

  // IONIC Haptic
  ngAfterViewInit(): void {
    const longPress = this.gesture.create(
      {
        el: this.recordBtn.nativeElement,
        threshold: 0,
        gestureName: 'long-press',
        onStart: (ev) => {
          VoiceRecorder.canDeviceVoiceRecord().then((res) => {
            if (!res.value) {
              alert('Device Cannot Record Audio');
              return;
            }
            VoiceRecorder.hasAudioRecordingPermission().then((has) => {
              if (has.value) {
                Haptics.impact({ style: ImpactStyle.Light });
                this.startRecording();
                this.calculateDuration();
              } else {
                VoiceRecorder.requestAudioRecordingPermission().then(
                  (request) => {
                    if (request.value) {
                      Haptics.impact({ style: ImpactStyle.Light });
                      this.startRecording();
                      this.calculateDuration();
                    } else {
                      alert('Permission Denied');
                    }
                  }
                );
              }
            });
          });
        },
        onEnd: (ev) => {
          Haptics.impact({ style: ImpactStyle.Light });
          this.stopRecording();
          if (this.interval) clearInterval(this.interval);
          this.calculateDuration();
        },
      },
      true
    );

    longPress.enable();
  }

  startRecording() {
    if (this.recording) {
      return;
    }
    this.recording = true;
    this.stopRecord.emit('');
    VoiceRecorder.startRecording().catch((err) => {
      alert(err);
    });
  }

  stopRecording() {
    if (!this.recording) {
      return;
    }
    this.recording = false;
    VoiceRecorder.stopRecording()
      .then(async (res: RecordingData) => {
        if (res.value && res.value.recordDataBase64) {
          const recordData = res.value.recordDataBase64;
          const fileName = new Date().toISOString() + '.wav';

          await Filesystem.writeFile({
            path: fileName,
            data: recordData,
            directory: Directory.Data,
          });

          this.stopRecord.emit(
            `data:audio/wav;base64,${res.value.recordDataBase64}`
          );
        }
      })
      .catch((err) => {
        alert(err);
      });
  }

  calculateDuration() {
    if (!this.recording) {
      this.duration = 0;
      this.durationText = '00:00';
      return;
    }

    this.interval = setInterval(() => {
      this.duration += 1;
      this.durationText = this.formatTime(this.duration);
    }, 1000);
  }
  formatTime(duration: number): string {
    const minutes = Math.floor(duration / 60);
    const seconds = duration - minutes * 60;
    return `${minutes < 10 ? '0' + minutes : minutes}:${
      seconds < 10 ? '0' + seconds : seconds
    }`;
  }

  async playFile(f: any) {
    const audioFile = await Filesystem.readFile({
      path: f.name,
      directory: Directory.Data,
    });
    const base64Sound = audioFile.data;
    const audio = new Audio(`data:audio/wav;base64,${base64Sound}`);

    audio.oncanplaythrough = () => {
      audio.play();
    };
    audio.load();
    audio.play();
  }

  loadData() {
    Filesystem.readdir({
      path: '',
      directory: Directory.Data,
    }).then((res) => {
      this.storedFiles = res.files;
    });
  }
}
