import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal/modal.component';
import { ModalService } from '../services/modal.service';
import { TabsContainerComponent } from './tabs-container/tabs-container.component';
import { TabComponent } from './tab/tab.component';
import { InputComponent } from './input/input.component';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgxMaskModule} from 'ngx-mask';
import { AlertComponent } from './alert/alert.component'



@NgModule({
  declarations: [
    ModalComponent,
    TabsContainerComponent,
    TabComponent,
    InputComponent,
    AlertComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgxMaskModule.forRoot(),

  ],
  // providers: [ModalService],
  exports: [
    ModalComponent,
    TabsContainerComponent,
    TabComponent,
    InputComponent
    ,AlertComponent
  ]
})
export class SharedModule { }
