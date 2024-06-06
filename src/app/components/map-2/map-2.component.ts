import { Component, Input } from '@angular/core';
import { GeoLocationService } from '../../services/geo-location.service';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import { GeoJsonObject } from 'geojson';
// import LeafletRoutingMachine from "leaflet-routing-machine"

@Component({
  selector: 'app-map-2',
  templateUrl: './map-2.component.html',
  styleUrl: './map-2.component.css'
})
export class Map2Component {

  @Input() ambCoords!: any;
  private map!: L.Map;
  private lat!: number;
  private lon!: number;
  isMapLoaded: boolean = true;


  constructor(
    private geoService: GeoLocationService,
    private http: HttpClient,
  ) { }

  customIcon = L.icon({
    iconUrl: '../../../assets/Animation - 1709920022493 (2).gif',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  });

  customIcon2 = L.icon({
    iconUrl: '../../../assets/share_location_FILL0_wght400_GRAD0_opsz24.svg',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  });

  //getting co-ordinates and focusing on user location on map
  async getCoordinates() {
    try {
      const coordinates = await new Promise((resolve, reject) => {
        this.geoService.getCurrentCoordinates((coordinates) => {
          if (coordinates) {
            resolve(coordinates);

            this.lat = coordinates.latitude;
            this.lon = coordinates.longitude;

            this.isMapLoaded = false;

            this.map.setView(L.latLng(this.lat, this.lon), 12);

            L.marker(L.latLng(this.lat, this.lon), { icon: this.customIcon }).addTo(this.map);

            console.log(this.lat, this.lon);


            return coordinates
          } else {
            reject('Unable to retrieve coordinates.');
            return undefined
          }
        });
      });
    } catch (error) {
      console.log('Error:', error);
    }
  }

  private initMap(): void {
    const coordinates = this.getCoordinates();
    console.log("Called the function initMap", coordinates);
    if (!this.map) {
      this.map = L.map('map', {
        layers: [
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
        ],
        center: [22.94811934178306, 78.14453973906676],
        zoom: 4
      });
    }
  }

  ngAfterViewInit() {
    this.initMap();
  }

  emergencyCall() {
    this.http.get(`http://localhost:3000/api/ambulance/emergency-call?latitude=23.0751189&longitude=76.8597704`).subscribe({
      next: (value) => {
        // console.log('Value:', value);
        this.ambCoords = value
        console.log(this.ambCoords)
        this.pinMarkers(value)

      },
      error: (err) => {
        console.log('Error:', err);
      },
    })
  }

  async pinMarkers(cords: any) {
    cords.forEach(async (cord: any) => {
      const [_id, _, [lon, lat]] = cord
      // console.log(cord)
      // console.log(lat, lon)
      L.marker(L.latLng(lat, lon), { icon: this.customIcon2 }).addTo(this.map);
    });

    this.fetchRoute()
  }

  fetchRoute(): void {
    const apiUrl = 'https://api.openrouteservice.org/v2/directions/driving-car';
    const apiKey = '5b3ce3597851110001cf62485484f3de57f14c238fc1eac1a2faa99b'; // Replace with your actual API key
    // const start = '72.9644155846564,19.22544267444666';
    // const end = '72.97688249197088,19.227610585273258';
    const start = this.lon

    const url1 = `${apiUrl}?api_key=${apiKey}&start=${this.lon},${this.lat}&end=72.96933171467064,19.22355997463582`;
    const url2 = `${apiUrl}?api_key=${apiKey}&start=${this.lon},${this.lat}&end=72.96604869088559,19.22475538195393`;
    this.http.get<any>(url1).subscribe({
      next: (data) => {
        console.log(data)
        const routeCoordinates = data.features[0].geometry.coordinates;

        const latLngs = routeCoordinates.map((coord: [number, number]) => L.latLng(coord[1], coord[0]));

        const polyline = L.polyline(latLngs, { color: 'green' }).addTo(this.map);

        this.map.fitBounds(polyline.getBounds());
      },
      error: (error) => {
        console.error('Error loading route:', error);
      }
    });
    this.http.get<any>(url2).subscribe({
      next: (data) => {
        console.log(data)
        const routeCoordinates = data.features[0].geometry.coordinates;

        const latLngs = routeCoordinates.map((coord: [number, number]) => L.latLng(coord[1], coord[0]));

        const polyline = L.polyline(latLngs, { color: 'red' }).addTo(this.map);

        this.map.fitBounds(polyline.getBounds());
      },
      error: (error) => {
        console.error('Error loading route:', error);
      }
    });
  }
}
