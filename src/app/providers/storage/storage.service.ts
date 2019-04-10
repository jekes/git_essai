import { Injectable, OnDestroy } from '@angular/core';
import { AuthentificationService } from '../authentification/authentification.service';
import * as moment from 'moment';
import { Storage } from '@ionic/storage/';
import { BehaviorSubject, Observable, throwError, interval } from 'rxjs';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { Subscription } from 'rxjs';
import { LocationService } from '../location/location.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService implements OnDestroy {

  subscription: Subscription;
  private currentStorageItemSubject: BehaviorSubject<any>;
  // private currentStorageItem: Observable<null>;

  private currentStorageParSubject: BehaviorSubject<any>;
  private currentStoragePar: Observable<null>;

  constructor(
    public login: AuthentificationService,
    private location_service: LocationService,
    private storage: Storage,
    private uniqueDeviceID: UniqueDeviceID
  ) {
    this.currentStorageItemSubject = new BehaviorSubject<any>(null);
    // this.currentStorageItem = this.currentStorageItemSubject.asObservable();

    this.currentStorageParSubject = new BehaviorSubject<any>(null);
    this.currentStoragePar = this.currentStorageItemSubject.asObservable();


    this.initStorage();
  }

  // GetUID() {
  //   this.uniqueDeviceID.get()
  //     .then((uuid: any) => {
  //       return uuid;
  //       console.log(uuid);
  //     }
  //     )
  //     .catch((error: any) => {
  //       return 'non';
  //       console.log(error);
  //     });
  // }

  initStorage() {
    this.storage.forEach((value, key, index) => {
      if (key.startsWith('AP-')) {
        const today = moment().format('YYYY-MM-DD HH:mm:ss');
        if (value.Fin == null) {
          value.Fin = today;
          this.storage.set(key, value);
        }
      }
    });

  }

  initItem(Name, Description) {
    // const uuid = this.GetUID();
    // console.log(uuid);
    const CurrentTimeStamp = moment().unix();
    const today = moment().format('YYYY-MM-DD HH:mm:ss');
    const item = {
      Debut: today,
      Fin: null,
      User: this.login.currentUserValue.username,
      NomFormulaire: Name,
      DescriptionFormulaire: Description,
      par: ''
    };
    this.storage.set('AP-' + CurrentTimeStamp, item);
    this.currentStorageParSubject.next('AP-' + CurrentTimeStamp);
    this.subscription = this.location_service.currentPositionValue
      .subscribe(
        message => {
          console.log(message);
          if (message) {
            const point = [message.longitude, message.latitude];
            this.PushParValue(point);
          }
        },
        error => {
          console.log(error);
        });
  }

  PushParValue(parc) {
    this.storage.get(this.currentStorageItemSubject.value).then((value) => {
      const par_actuel = value.par;
      par_actuel.push(parc);
      this.currentStorageParSubject.next(par_actuel);
    });
  }

  GetParValue() {
    this.storage.get(this.currentStorageItemSubject.value).then((value) => {
      const par_actuel = value.par;
      this.currentStorageParSubject.next(par_actuel);
    });
  }

  GetObsValue() {
    return this.currentStoragePar;
  }

  public get currentStorageItemValue() {
    return this.currentStorageItemSubject.value;
  }

  // save(par) {
  //   this.storage.set('AP-' + today, par);
  //   console.log(this.login.currentUserValue);
  // }

  ngOnDestroy() {
   this.subscription.unsubscribe();
  }
}
