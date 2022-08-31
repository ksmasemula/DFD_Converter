import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UploaderService {


  constructor(private http: HttpClient) { }

  uploadFile(data:any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Control-Allow-Origin':'*'
      })
    };
    const url = 'http://localhost:3000/api/drawio';
    return this.http.post(url,data,httpOptions);
  }
}
