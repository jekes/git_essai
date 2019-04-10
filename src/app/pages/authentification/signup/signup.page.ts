import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { UsernameValidator } from '../validators/username.validator';
import { PasswordValidator } from '../validators/password.validator';
import { Location } from '@angular/common';
import { AuthentificationService } from '../../../providers/authentification/authentification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})

export class SignupPage implements OnInit, OnDestroy {
  
  private subscription: Subscription;
  validations_form: FormGroup;
  matching_passwords_group: FormGroup;
  country_phone_group: FormGroup;

  validation_messages = {
    'username': [
      { type: 'required', message: 'Champs requis' },
      { type: 'minlength', message: 'Minimum 4 caractères' },
      { type: 'maxlength', message: 'Username cannot be more than 25 characters long.' },
      { type: 'pattern', message: 'Your username must contain only numbers and letters.' },
      { type: 'validUsername', message: 'Your username has already been taken.' }
    ],
    'name': [
      { type: 'required', message: 'Champs requis' }
    ],
    'lastname': [
      { type: 'required', message: 'Champs requis' }
    ],
    'email': [
      { type: 'required', message: 'Champs requis' },
      { type: 'pattern', message: 'Enter a valid email.' }
    ],
    'password': [
      { type: 'required', message: 'Champs requis' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' },
      { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number.' }
    ],
    'confirm_password': [
      { type: 'required', message: 'Champs requis' }
    ],
    'matching_passwords': [
      { type: 'areEqual', message: 'Password mismatch' }
    ],
    'terms': [
      { type: 'pattern', message: 'You must accept terms and conditions.' }
    ],
  };

  constructor(
    private formBuilder: FormBuilder,
    private login: AuthentificationService,
    private location: Location
  ) { }
  
  ngOnInit() {
    this.matching_passwords_group = new FormGroup({
      password: new FormControl(''),
      confirm_password: new FormControl('')
    }, (formGroup: FormGroup) => {
      return PasswordValidator.areEqual(formGroup);
    });

    const FrenchPattern = /^[a-zàâæéêèëïîôœûùçüÿñ _'’.-]{1,19}$/i;
    // tslint:disable-next-line:max-line-length
    const EmailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // this.validations_form = this.formBuilder.group({
    //   username: new FormControl('', Validators.compose([
    //     UsernameValidator.validUsername,
    //     Validators.maxLength(25),
    //     Validators.minLength(5),
    //     Validators.pattern(FrenchPattern),
    //     Validators.required
    //   ])),
    //   name: new FormControl('', Validators.compose([Validators.required, Validators.pattern(FrenchPattern)])),
    //   lastname: new FormControl('', Validators.compose([Validators.required, Validators.pattern(FrenchPattern)])),
    //   email: new FormControl('', Validators.compose([
    //     Validators.required,
    //     Validators.pattern(EmailPattern)
    //   ])),
    //   matching_passwords: this.matching_passwords_group,
    //   terms: new FormControl(true, Validators.pattern('true'))
    // });

    this.validations_form = this.formBuilder.group({
      username: new FormControl(''),
      name: new FormControl(''),
      lastname: new FormControl(''),
      email: new FormControl(''),
      matching_passwords: this.matching_passwords_group,
      terms: new FormControl(true, Validators.pattern('true'))
    });
  }

  onSubmit() {
    if (this.validations_form.invalid) {
      return;
    }
    const parametres_for_update = Object.assign({}, this.validations_form.value);
    parametres_for_update['password'] = this.matching_passwords_group.value.password;
    delete parametres_for_update['matching_passwords'];
    this.subscription = this.login.signup('signup', parametres_for_update)
    .subscribe(result => {
      // if (result.hasOwnProperty('errno')) {
      //   this.errorDisplay = true;
      //   this.Erreur = 'Erreur ' +
      //     // 'lors de l\'identification ' +
      //     result.errno + ' -' +  result.code;
      // } else if (result.hasOwnProperty('U')) {
      //   this.errorDisplay = true;
      //   this.Erreur = 'Erreur ' +
      //     // 'lors de l\'identification ' +
      //     result.U;
      // }
      console.log(result);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
