import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError, interval } from 'rxjs';
import { AppPosition } from '../../interfaces/position';
import { filter, map, flatMap, switchMap } from 'rxjs/operators';
import { Storage } from '@ionic/storage/';
import * as moment from 'moment';
import { Subscription, Subject } from 'rxjs';
import * as socketIo from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { SocketService } from '../../providers/socket/socket.service';
import {
  BackgroundGeolocation,
  BackgroundGeolocationConfig,
  BackgroundGeolocationResponse,
  BackgroundGeolocationEvents
} from '@ionic-native/background-geolocation/ngx';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
// import { StorageService } from '../storage/storage.service';

// import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private subscription: Subscription;
  public locationCoords: any;
  private currentPositionSubject: BehaviorSubject<AppPosition>;
  public currentPosition: Observable<AppPosition>;
  subscriber: any;
  pos: AppPosition = null;
  isApp: boolean;
  postValue: any = new Subject();

  constructor(
    private storage: Storage,
    private backgroundGeolocation: BackgroundGeolocation,
    private socketService: SocketService,
    private geolocation: Geolocation,
    //private storage_service: StorageService
    // private platform: Platform,
  ) {

    // if (this.platform.is('android') || this.platform.is('ios')) {
    //   this.isApp = true;
    // } else {
    //   this.isApp = false;
    // }

    this.isApp = false;

    this.currentPositionSubject = new BehaviorSubject<AppPosition>(null);
    this.currentPosition = this.currentPositionSubject.asObservable();

    this.pos = {
      accuracy: 0,
      bearing: 0,
      latitude: 0,
      longitude: 0,
      speed: 0,
      time: 0
    };

    this.initIoConnection();
  }

  public get currentPositionValue() {
    return this.currentPositionSubject;
  }

  private initIoConnection(): void {
    // this.socketService.initSocket();
    // this.socketService.onMessage()
    //   .subscribe((message) => {
    //   });
  }

  startTracking(Name, Description) {
    // this.storage_service.initItem(Name, Description);
    // if (this.isApp) {
    //   this.getForegroundLocation();
    // } else {
    //   this.startBackgroundLocation();
    // }
    this.startBackgroundLocation();
  }

  stopTracking(): void {
    this.backgroundGeolocation.stop();
    // this.subscriber.unsubscribe();
  }

  getForegroundLocation(): void {
    const geoOptions = {
      frequency: 1000,
      enableHighAccuracy: true,
      maximumAge: 30000,
      timeout: 10000
    };

    // this.geolocation.getCurrentPosition().then((resp) => {
    //   this.pos = {
    //     accuracy: resp.coords.accuracy,
    //     bearing: resp.coords.heading,
    //     latitude: resp.coords.latitude,
    //     longitude: resp.coords.longitude,
    //     speed: resp.coords.speed,
    //     time: resp.timestamp
    //   };
    //   // this.currentPositionSubject.next(this.pos);
    // }).catch((error) => {
    //   console.log('Error getting location', error);
    // });

    const watch = this.geolocation.watchPosition(geoOptions);
    watch.subscribe((loc) => {

      console.log(loc);
      this.pos = {
        accuracy: null,
        bearing: null,
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        speed: null,
        time: null
      };
      if (this.currentPositionSubject.value !== null) {
        const distance = this.calculateDistance(
          this.currentPositionSubject.value.latitude,
          this.pos.latitude,
          this.currentPositionSubject.value.longitude,
          this.pos.longitude);
        if (distance * 1000 > 20) {
          this.SendMessageToServer(this.pos);
        }
      }
      this.currentPositionSubject.next(this.pos);

    });
  }

  startBackgroundLocation(): void {
    this.backgroundGeolocation.configure({
      desiredAccuracy: 10,
      stationaryRadius: 20,
      distanceFilter: 30,
      stopOnTerminate: true,
      debug: false,
      notificationTitle: 'geotracker',
      notificationText: 'Demonstrate background geolocation',
      interval: 2000
    });

    this.backgroundGeolocation.on(BackgroundGeolocationEvents.location)
      .subscribe((location: BackgroundGeolocationResponse) => {
        console.log(location);
        if (location) {
          this.pos = {
            accuracy: location.accuracy,
            bearing: location.bearing,
            latitude: location.latitude,
            longitude: location.longitude,
            speed: location.speed,
            time: location.time
          };
          // this.serverPush.pushPosition(this.pos);
          this.currentPositionSubject.next(this.pos);
        }
        // this.backgroundGeolocation.finish(); // FOR IOS ONLY
      });

    // start recording location
    this.backgroundGeolocation.start();
    this.getForegroundLocation();
  }


  SendMessageToServer(msg) {
    // this.socketService.send('location', msg);
  }

  calculateDistance(lat1: number, lat2: number, long1: number, long2: number) {
    const p = 0.017453292519943295;    // Math.PI / 180
    const c = Math.cos;
    const a = 0.5 - c((lat1 - lat2) * p) / 2 + c(lat2 * p) * c((lat1) * p) * (1 - c(((long1 - long2) * p))) / 2;
    const dis = (12742 * Math.asin(Math.sqrt(a))); // 2 * R; R = 6371 km
    console.log('distance ' + dis + 'km');
    return dis;
  }

  save(par) {
    const today = moment().format('YYYY-MM-DD HH:mm:ss');
    this.storage.set('AP-' + today, par);
  }

  getstorage() {
    const data = [];
    this.storage.forEach((value, key, index) => {
      if (key.startsWith('AP-')) {
        // console.log('This is the value', value);
        // console.log('from the key', key);
        // console.log('Index is', index);
        data.push(
          {
            'index': index,
            'key': key,
            'value': value
          });
      }
    });
    // console.log(data);
    return data;
  }

  getValue(id) {
    this.getstorageById(id);
    return this.postValue;
  }

  getstorageById(id) {
    this.storage.forEach((value, key, index) => {
      if (key.startsWith('AP-')) {
        if (index.toString() === id) {
          this.postValue.next(value);
        }
      }
    });
  }
}
