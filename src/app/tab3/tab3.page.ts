import { Component, OnInit, ViewChild } from '@angular/core';
import { LocationService } from '../providers/location/location.service';

import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { AuthentificationService } from '../providers/authentification/authentification.service';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  icon: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H', icon: 'Ne' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He', icon: 'Ne' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li', icon: 'Ne' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be', icon: 'Ne' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' , icon: 'Ne' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' , icon: 'Ne' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' , icon: 'Ne' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' , icon: 'Ne' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' , icon: 'Ne' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' , icon: 'Ne' },
];

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'details', 'update', 'delete'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  data = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public locationTracker: LocationService,
    public login: AuthentificationService) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.data = this.locationTracker.getstorage();
    console.log(this.data);

    console.log(this.login.currentUserValue);
  }

  ionViewWillEnter() {

    this.data = this.locationTracker.getstorage();
    console.log(this.data);
    console.log(this.login.currentUserValue);
  }
  refresh() {
    this.data = this.locationTracker.getstorage();
  }
}
