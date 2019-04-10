import { Component, OnInit, Input  } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthentificationService } from '../../providers/authentification/authentification.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input() name: string;

  constructor(
    private alertCtrl: AlertController,
    private router: Router,
    private login: AuthentificationService
  ) { }

  ngOnInit() { }

  async LogOut() {
    const alert = await this.alertCtrl.create({
      header: 'Déconnexion',
      message: 'Etes vous sûr de vouloir vous déconnecter ?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        }, {
          text: 'OK',
          handler: () => {
            this.LogOutFunction();
          }
        }]
    });
    await alert.present();
  }

  LogOutFunction () {
    this.login.logout();
    this.router.navigate(['/signin']);
  }
}
