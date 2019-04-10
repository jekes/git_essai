import { Component } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { LocationService } from '../providers/location/location.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  timetest: any;
  InfoForm: FormGroup;

  constructor(
    private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy,
    private formBuilder: FormBuilder,
    private location_service: LocationService
  ) {
    this.timetest = Date.now();
    this.InfoForm = this.formBuilder.group({
      nom: ['', Validators.required],
      description: ['']
    });
  }

  // Check if application having GPS access permission
  checkGPSPermission() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
      result => {
        if (result.hasPermission) {
          // If having permission show 'Turn On GPS' dialogue
          this.askToTurnOnGPS();
        } else {
          // If not having permission ask for permission
          this.requestGPSPermission();
        }
      },
      err => {
        alert(err);
      }
    );
  }

  requestGPSPermission() {
    // this.location_service.getLocationCoordinates();
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
        console.log('4');
      } else {
        // Show 'GPS Permission Request' dialogue
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
          .then(
            () => {
              // call method to turn on GPS
              this.askToTurnOnGPS();
            },
            error => {
              // Show alert if user click on 'No Thanks'
              alert('requestPermission Error requesting location permissions ' + error);
            }
          );
      }
    });
  }

  startforground() {
    this.location_service.startTracking(this.InfoForm.value.nom, this.InfoForm.value.description);
    // this.location_service.startTracking();
  }

  askToTurnOnGPS() {
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      () => {
        // When GPS Turned ON call method to get Accurate location coordinates
        // this.location_service.getLocationCoordinates();
        this.location_service.startTracking(this.InfoForm.value.nom, this.InfoForm.value.description);
      },
      error => alert('Error requesting location permissions ' + JSON.stringify(error))
    );

  }
}
