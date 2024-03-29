import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import  IUSer  from 'src/app/models/UserModel'
import { RegisterValidators } from '../validators/register-validators';
import { EmailTaken } from '../validators/email-taken';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(private auth: AuthService, 
    private emailTaken: EmailTaken){}

  inSubmission: boolean = false
  name = new FormControl('',[
    Validators.required,
    Validators.minLength(3)
  ])
  email=  new FormControl('', [
    Validators.required,
    Validators.email
  ], [this.emailTaken.validate])
  age = new FormControl<number | null>(null, [
    Validators.required,
    Validators.min(18),
    Validators.max(120),
    
  ])
  password=  new FormControl('', [
    Validators.required,
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
  ])
  confirmPassword= new FormControl('',[
    Validators.required
  ])
  phoneNumber = new FormControl('',[
    Validators.minLength(13),
    Validators.maxLength(13)
  ])

showAlert: boolean = false
alertMessage: string = 'Please wait! Your account is being created!'
alertColor: string = 'blue'

  registerForm = new FormGroup({
    name: this.name,
    email: this.email,
    age: this.age,
    password: this.password,
    confirmPassword: this.confirmPassword,
    phoneNumber: this.phoneNumber
  }, [RegisterValidators.match('password', 'confirmPassword')])


 async register(){
    console.table(this.registerForm.value)
    this.showAlert =true
    this.alertMessage = 'Please wait! Your account is being created!'
    this.alertColor='blue'
    this.inSubmission = true
    try {

      await this.auth.createuser(this.registerForm.value as IUSer)
      
    } catch (e) {
      console.error(e);
      this.alertMessage = 'An unexpected error occurred. Please try again later'
      this.alertColor = 'red'
      this.inSubmission = false
      return      
    }
    this.alertMessage = 'Success! You\'re account has been  created'
    this.alertColor = 'green'
  }
}
