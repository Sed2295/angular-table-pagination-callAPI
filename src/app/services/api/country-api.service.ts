import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Country } from '../../models/country.model';

const baseUrl = 'https://restcountries.com/v3.1';

@Injectable({
  providedIn: 'root',
})
export class CountryApiService {
  constructor(private http: HttpClient) {}

  findByName(query: string): Observable<Country[]> {
    const params = new HttpParams().set('fields', 'name,region');

    const url = `${baseUrl}/name/${query}`;
    console.log(`querying: ${url}`);
    return this.http.get<Country[]>(url, { params: params });
  }
}
