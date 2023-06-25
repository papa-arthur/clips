import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import IClip from 'src/app/models/clip.model';
import { ClipService } from 'src/app/services/clip.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {
  inSubmission: boolean = false;
  showAlert: boolean = false;
  alertColor: string = '';
  alertMessage: string = 'Please wait! Updating clip';
  @Output() update = new EventEmitter<IClip>()

  constructor(private modal: ModalService, private clipService: ClipService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.activeClip) {
      return;
    }

    this.inSubmission = false
    this.showAlert = false
    this.clipID.setValue(this.activeClip.docID!);
    this.videoTitle.setValue(this.activeClip.title);
  }
  clipID = new FormControl('', {
    nonNullable: true,
  });

  videoTitle: FormControl = new FormControl('', {
    validators: [Validators.required, Validators.minLength(3)],
    nonNullable: true,
  });

  editForm = new FormGroup({
    title: this.videoTitle,
  });
  ngOnInit(): void {
    this.modal.register('editClip');
  }
  ngOnDestroy(): void {
    this.modal.unregister('editClip');
  }
  @Input() activeClip: IClip | null = null;

  async submit() {
    this.inSubmission = true;
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMessage = 'Please wait! Updating clip';

    if(!this.activeClip){
      return
    }

    try {
      await this.clipService.updateClip(
        this.clipID.value,
        this.videoTitle.value
      );
    } catch (error) {
      this.inSubmission = false;
      this.alertMessage = 'red';
      this.alertMessage = 'Sometging went wrong. Try again later';
      return;
    }
    this.activeClip.title = this.videoTitle.value
    this.update.emit(this.activeClip)
    this.inSubmission = false;
    this.alertColor = 'green';
    this.alertMessage = 'Success!';
  }
}
