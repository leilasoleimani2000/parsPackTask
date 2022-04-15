import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IUsers } from './users.interface';
import { UsersService } from './users.service';
import { NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';
import 'mapbox-gl-leaflet';
import  * as L from 'leaflet';
import { MapOptions } from 'leaflet';
import { environment } from 'src/environments/environment';


interface ColumnItem {
  name: string;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn<IUsers> | null;
  listOfFilter: NzTableFilterList;
  filterFn: NzTableFilterFn<IUsers> | null;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  listOfColumns: ColumnItem[] = [];
  list: IUsers[] = [];
  pageSize = 5;
  pageIndex = 1;
  total = 1;
  isVisible = false;
  loading = false;

  @ViewChild('map')
  mapContainer!: ElementRef;
  
  constructor(private usersService: UsersService) { }

  ngOnInit(): void{
    this.getUsersList();
  }


  getUsersList() {
    this.loading = true;
    this.usersService.getUsersList().subscribe((response) => {
      this.list = response;
      this.createColumns(this.list);
      this.loading = false; 
    });
  }

  createColumns(list:IUsers[]) {    
    this.listOfColumns.push(
      {
        name: 'Name',
        sortOrder: null,
        sortFn: (a: IUsers, b: IUsers) => a.name.localeCompare(b.name),
        listOfFilter: [],
        filterFn: (list: string[], item: IUsers) => list.some(name => item.name.indexOf(name) !== -1)
      },
      {
        name: 'Email',
        sortOrder: null,
        sortFn: (a: IUsers, b: IUsers) => a.email.localeCompare(b.email),
        listOfFilter: [],
        filterFn: (list: string[], item: IUsers) => list.some(email => item.email.indexOf(email) !== -1)
      },
      {
        name: 'City',
        sortOrder: null,
        sortFn: (a: IUsers, b: IUsers) => a.address.city.localeCompare(b.address.city),
        listOfFilter: [],
        filterFn: (list: string[], item: IUsers) => list.some(address => item.address.city.indexOf(address) !== -1)
      }
    )

    this.listOfColumns.map(item => {
      this.list.forEach(listItem => { 
        let filterList;
        if(item.name === 'Name'){
          filterList = listItem.name;
        } else if(item.name === 'City') {
          filterList = listItem.address.city;
        } else {
          filterList = listItem.email;
        }
        item.listOfFilter.push({text: filterList, value: filterList})
      })      
    });   
  }

  trackByName(_: number, item: ColumnItem): string {
    return item.name;
  }

  showModal(data: IUsers): void {
    this.isVisible = true;
    
    setTimeout(() => {
      this.mapInit(data);
    },10);
  }

  mapInit(data: IUsers) {
    const lat = parseFloat(data.address.geo.lat);
    const lng = parseFloat(data.address.geo.lng);
    const osm = L.tileLayer(environment.mapSource);
    const options: MapOptions = {
      zoomControl: false,
      zoom: 11,
      center: [lat, lng],
    };
    const redMarkerIcon = L.icon({
        iconUrl: 'assets/images/marker.png',
        iconSize: [25, 41],
      });
  
    const map = new L.Map(this.mapContainer.nativeElement, options).setView(
      [lat, lng]
    );

    const currentLocationMarker = L.marker([lat, lng], { icon: redMarkerIcon });
     map.addLayer(osm);
    currentLocationMarker.addTo(map);
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
