import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { LocationService } from '../../providers/location/location.service';
import { Subscription } from 'rxjs';
import { geoJSON } from 'leaflet';
import * as geojson from 'geojson';
import * as L from 'leaflet';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  data: any[];
  myfrugalmap: any;

  private subscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private lService: LocationService,
  ) { }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.init();
    const index = this.route.snapshot.paramMap.get('index');
    this.subscription = this.lService.getValue(index)
      .subscribe(
        data => {
          console.log(data);
          this.myfrugalmap.invalidateSize();
          this.AddL(data);
        });


  }

  init() {
    this.myfrugalmap = L.map('map2').fitWorld();
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: 'Frugal Map'
    }).addTo(this.myfrugalmap);
  }

  AddL(par) {
    const myLines = <geojson.LineString>{
      type: 'LineString',
      coordinates: par
    };

    const myStyle = {
      'color': '#ff7800',
      'weight': 5,
      'opacity': 0.65
    };

    L.geoJSON(myLines, {
      style: myStyle
    }).addTo(this.myfrugalmap);

    const geom = L.GeoJSON.coordsToLatLngs(par);

    const line = L.polyline(geom);
    this.myfrugalmap.fitBounds(line.getBounds());
  }

  goBack() {
    this.subscription.unsubscribe();
    this.location.back();
  }
}
