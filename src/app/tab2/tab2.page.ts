import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { Map, LatLngExpression, latLng, tileLayer, Layer, marker, Icon, icon, Marker, } from 'leaflet';
import { LocationService } from '../providers/location/location.service';
import { Subscription } from 'rxjs';
import * as geojson from 'geojson';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit, AfterViewInit {
  private defaultIcon: Icon = icon({
    iconUrl: 'leaflet/marker-icon.png',
    shadowUrl: 'leaflet/marker-shadow.png'
  });
  mymap: any | undefined;
  latitude = 0;
  longitude = 0;
  disable = false;
  layerControl: any;
  private subscription: Subscription;
  marker: any;
  par = [];
  constructor(
    private location_service: LocationService
  ) {
    Marker.prototype.options.icon = this.defaultIcon;
  }

  ngOnInit() {
    console.log(this.mymap);
    if (this.mymap === undefined) {
      console.log('passe');
      this.initMap();
    }
  }

  initMap() {
    this.mymap = new Map('map').setView([50.6311634, 3.0599573], 8);
    this.marker = L.marker(this.mymap.getCenter()).addTo(this.mymap);
    const osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: 'Carte',
        maxZoom: 18
      }).addTo(this.mymap);

    const baseMaps = {
      'OSM': osm
    };
    this.layerControl = L.control.layers(baseMaps);
    this.layerControl.addTo(this.mymap);
    // const test = this.location_service.getLocationCoordinates();
    this.subscription = this.location_service.currentPositionValue
      .subscribe(
        message => {
          console.log(message);
          if (message) {
            this.longitude = message.longitude;
            this.latitude = message.latitude;
            const point = [this.longitude, this.latitude];
            this.par.push([message.longitude, message.latitude]);
            if (this.par.length > 2) { this.AddL(this.par); }
            if (this.mymap !== null) {
              this.mymap.invalidateSize();
              this.mymap.setView(new L.LatLng(this.latitude, this.longitude), 12, { animation: true });
              this.marker.setLatLng([this.latitude, this.longitude]).update();
            }
          }
        },
        error => {
          console.log(error);
        });
  }

  AddL(par) {
    this.mymap.invalidateSize();
    console.log(par);
    // const myLines = <geojson.LineString>{
    //   type: 'LineString',
    //   coordinates: par
    // };
    // const myStyle = {
    //   'color': '#ff7800',
    //   'weight': 5,
    //   'opacity': 0.65
    // };

    // L.geoJSON(myLines, {
    //   style: myStyle
    // }).addTo(this.mymap);

    // const polygon = L.geoJSON(myLines, {
    //   style: myStyle
    // });
    // this.mymap.fitBounds(polygon.getBounds());
    const myLines = [{
      'type': 'LineString',
      'coordinates': par
    }];

    const myStyle = {
      'color': '#ff7800',
      'weight': 5,
      'opacity': 0.65
    };

    L.geoJSON(myLines, {
      style: myStyle
    }).addTo(this.mymap);

    // const polygon = L.geoJSON(myLines, {
    //   style: myStyle
    // });
    // this.mymap.fitBounds(polygon.getBounds());
  }

  Stop() {
    this.location_service.stopTracking();
    // this.disable = !this.disable;
    this.location_service.save(this.par);
    this.subscription.unsubscribe();
  }

  ngAfterViewInit() {
    setTimeout(
      () => {
        this.mymap.invalidateSize();
      }, 0);
  }

}
