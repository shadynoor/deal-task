import { Injectable } from '@angular/core';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { convertBlobToBase64 } from '../helpers/helpers';
import { UserPhoto } from '../interfaces/photo.interface';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  public photo!: UserPhoto;
  private PHOTO_STORAGE: string = 'photo';

  constructor() {}

  public async addNewToGallery() {
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });
    const savedImageFile = await this.savePicture(capturedPhoto);
    this.photo = savedImageFile;
  }

  public async getImage() {
    const { value } = await Preferences.get({ key: this.PHOTO_STORAGE });
    if (!value) {
      return;
    }
    this.photo = (value ? JSON.parse(value) : '') as UserPhoto;
    if (!this.photo.uploaded) {
      const readFile = await Filesystem.readFile({
        path: this.photo.filepath,
        directory: Directory.Data,
      });
    }
  }

  private async savePicture(photo: Photo) {
    // Write the file to the data directory
    const fileName = Date.now() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: await this.readAsBase64(photo),
      directory: Directory.Data,
    });
    return {
      filepath: fileName,
      webviewPath: await this.readAsBase64(photo),
    };
  }

  private async readAsBase64(photo: Photo) {
    const response = await fetch(photo.webPath!);
    const blob = await response.blob();
    return (await convertBlobToBase64(blob)) as string;
  }

  // Update Storage to keep image stored in the same location and whenever app is reloaded with a connection it will send request
  updatePhotoPath() {
    Preferences.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photo),
    });
  }
}
