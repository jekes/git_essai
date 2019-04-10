import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthentificationService } from '../../../providers/authentification/authentification.service';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit, OnDestroy {
  dataSource: any;
  displayedColumns: string[];
  signinForm: FormGroup;
  returnUrl: string;
  errorDisplay: boolean;
  Erreur: string;
  private subscription: Subscription;


  // loginForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private menuCtrl: MenuController,
    private route: ActivatedRoute,
    private router: Router,
    private login: AuthentificationService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    if (this.login.currentUserValue) {
      this.router.navigate(['/']);
    }
    this.errorDisplay = false;
    this.signinForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // reset login status
    this.login.logout();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.Erreur = '';
    // this.menuCtrl.enable(false);
    // this.menuCtrl.swipeEnable(false)

    // this.subscription = this.login.login('signin', this.signinForm.value)
    // .pipe(first())
    // .subscribe(
    //   data => {
    //     console.log(data);
    //     this.handleApplicationData(data);
    //     // this.router.navigate([this.returnUrl]);
    //   },
    //   error => {
    //     this.error = error;
    //     this.loading = false;
    //   });

    // this.subscription = this.login.getcurrentUserValue().subscribe(
    //   data => {
    //     if (data) {
    //       this.Demo();
    //     }

    //     // this.router.navigate([this.returnUrl]);
    //   },
    //   error => {
    //     this.error = error;
    //     this.loading = false;
    //   });
  }

  handleApplicationData(result) {
    console.log(result);
    if (result) {
      if (result.hasOwnProperty('errno')) {
        this.errorDisplay = true;
        this.Erreur = 'Error ' +
          // 'lors de l\'identification ' +
          result.errno + ' -' + result.code;
      } else if (result.hasOwnProperty('U')) {
        this.errorDisplay = true;
        this.Erreur = 'Error ' +
          // 'lors de l\'identification ' +
          result.U + ' doesn\'t exists';
      } else if (result.hasOwnProperty('failed')) {
        this.errorDisplay = true;
        this.Erreur = 'Error ' +
          // 'lors de l\'identification ' +
          result.failed;
      } else if (result.hasOwnProperty('success')) {
        // this.login.login(
        //   this.signinForm.value.username,
        //   result.userid,
        //   result.token,
        //   result.role,
        // );
        this.router.navigate(['/']);
      }
    }
  }

  get f() { return this.signinForm.controls; }

  signin2() {
    this.submitted = true;
    this.errorDisplay = false;
    this.loading = true;

    if (this.signinForm.invalid) {
      return;
    }
    // this.login.signin('signin', this.signinForm.value);
    this.login.login('signin', this.signinForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.handleApplicationData(data);
          // this.router.navigate([this.returnUrl]);
        },
        error => {
          this.error = error;
          this.loading = false;
        });
  }

  Demo() {

    this.login.demo();
    this.router.navigate(['/']);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
