import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private auth: AngularFireAuth){}

showAlert: boolean = false
alertMessage: string = 'Verifying your identity'
alertColor: string = 'blue'
inSubmission: boolean = false;

  credentials = {
    email:  "",
    password: ""
  }

  async login(){
    this.inSubmission = true
    this.showAlert = true;
    this.alertMessage = 'Please wait!  We\'re logging you in'
    this.alertColor = 'blue'

    try {
      await this.auth.signInWithEmailAndPassword(
        this.credentials.email, this.credentials.password
      )
    } catch (error) {
      this.showAlert = true;
      this.alertMessage = 'Login failed!. Invalid username or password'
      this.alertColor = 'red'
      this.inSubmission = false;
      return
      
    }
      this.alertMessage = 'Success! You\'re now  Login!'
      this.alertColor = 'green'
  }
}
