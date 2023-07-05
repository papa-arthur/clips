import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/compat/storage';
import { v4 as uuid } from 'uuid';
import { combineLatest, forkJoin, last, switchMap } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { ClipService } from 'src/app/services/clip.service';
import { Router } from '@angular/router';
import { FfmpegService } from 'src/app/services/ffmpeg.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent implements OnDestroy {
  isDragover: boolean = false;
  file: File | null = null;
  fileLoaded: boolean = false;
  showAlert: boolean = false;
  alertMessage: string = 'Please wait! Your clip is being uploaded.';
  alertColor: string = '';
  inSubmission: boolean = false;
  percentage: number = 0;
  showPercentage: boolean = false;
  user: firebase.User | null = null;
  task?: AngularFireUploadTask;
  screenshots: string[] = [];
  selectedScreenshot = ''
  screenshotTask?: AngularFireUploadTask;

  constructor(
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private clipsService: ClipService,
    private router: Router,
    public ffmpegService: FfmpegService
  ) {
    auth.user.subscribe((user) => (this.user = user));
    ffmpegService.init();
  }
  ngOnDestroy(): void {
    this.task?.cancel();
  }

  async storeFile($event: Event) {
    if (this.ffmpegService.isRunning) {
      return;
    }

    this.isDragover = false;
    this.file = ($event as DragEvent).dataTransfer
      ? ($event as DragEvent).dataTransfer?.files.item(0) ?? null
      : ($event.target as HTMLInputElement).files?.item(0) ?? null;

    if (!this.file || this.file.type !== 'video/mp4') {
      return;
    }
    this.screenshots = await this.ffmpegService.getScreenshots(this.file);
    this.selectedScreenshot = this.screenshots[0]
    this.videoTitle.setValue(
      this.file.name.replace(/\.[^.\\/:*?"<>|\r\n]+$/, '')
    );
    this.fileLoaded = true;
  }

  videoTitle: FormControl = new FormControl('', {
    validators: [Validators.required, Validators.minLength(3)],
    nonNullable: true,
  });

  uploadForm = new FormGroup({
    title: this.videoTitle,
  });

 async  uploadFile() {
    this.uploadForm.disable();

    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMessage = 'Please wait! Your clip is being uploaded.';
    this.inSubmission = true;
    this.showPercentage = true;
    const clipFileName = uuid();
    const clipPath = `clips/${clipFileName}.mp4`;

    const screenshotBlob  = await this.ffmpegService.blobFromUrl(this.selectedScreenshot)
    const screenshotPath = `screeshots/${clipFileName}.png`
    this.task = this.storage.upload(clipPath, this.file);
    this.screenshotTask = this.storage.upload(screenshotPath, screenshotBlob)
    const clipRef = this.storage.ref(clipPath);
    const screenshotRef = this.storage.ref(screenshotPath)

    combineLatest([this.task.percentageChanges(), this.screenshotTask.percentageChanges()]).subscribe((values) => {
      const [clipProgress, screenshotProgres] = values
      if(!clipProgress || !screenshotProgres){
        return
      }
      const total = clipProgress + screenshotProgres
      this.percentage = total as number/200;
    });

    forkJoin([this.task.snapshotChanges(), this.screenshotTask.snapshotChanges()])
      .pipe(

        switchMap(() => forkJoin([
          clipRef.getDownloadURL(),
          screenshotRef.getDownloadURL()
        ])
        )
      )
      .subscribe({
        next: async (urls) => {
          const [clipUrl, screenshotUrl] = urls
          const clip = {
            uid: this.user?.uid as string,
            displayName: this.user?.displayName as string,
            title: this.videoTitle.value,
            fileName: `${clipFileName}.mp4`,
            clipUrl,
            screenshotUrl,
            screenshotFileName: `${clipFileName}.png`,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          };
          const clipDocRef = await this.clipsService.createClip(clip);
          this.alertColor = 'green';
          this.alertMessage =
            'Success! Your clip is now ready to share with the world.';
          this.showPercentage = false;

          setTimeout(() => {
            this.router.navigate(['clip', clipDocRef.id]);
          }, 1000);
        },
        error: (error) => {
          this.uploadForm.enable();
          this.alertColor = 'red';
          this.alertMessage = 'Upload failed! Please try again later.';
          this.inSubmission = false;
          this.showPercentage = false;
          console.error(error);
        },
      });
  }
}
