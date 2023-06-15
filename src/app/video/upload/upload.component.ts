import { Component } from '@angular/core';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {
  isDragover: boolean = false
  file: File| null  = null
  fileLoaded: boolean = false

  storeFile($event: Event){
    this.isDragover = false
    this.file = ($event as DragEvent).dataTransfer?.files.item(0) ?? null
    
    if(!this.file || this.file.type !== 'video/mp4'){
      return
    }
    this.fileLoaded = true
    console.log(this.file);
    

  }

}
