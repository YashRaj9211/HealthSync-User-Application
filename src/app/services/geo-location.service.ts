import { OnInit, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeoLocationService {
  getCurrentCoordinates(callback: (coordinates: any) => void): void {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          callback({ latitude, longitude });
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              console.error('User denied the request for Geolocation.');
              break;
            case error.POSITION_UNAVAILABLE:
              console.error('Location information is unavailable.');
              break;
            case error.TIMEOUT:
              console.error('The request to get user location timed out.');
              break;
          }
          callback(null);
        }
      );
    } else {
      console.error('Geolocation is not supported in this browser.');
      callback(null);
    }
  }
}
