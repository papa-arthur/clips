import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrls: ['./clip.component.css']
})
export class ClipComponent {
  id = ''
  constructor(private route: ActivatedRoute){
    this.route.params.subscribe((params: Params) =>{
      this.id = params['id']
    })
    
  }

}
