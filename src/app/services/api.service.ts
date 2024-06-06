import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://127.0.0.1/3000'
  constructor(
    private http: HttpClient
  ) { }

  async getNearByAmbulance(longitude: number, latitude: number){
    return await this.http.get(`${this.baseUrl}/ambulance/longitude=${longitude}&latitude=${latitude}`);
  }


}
