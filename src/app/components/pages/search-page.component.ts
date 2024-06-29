import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable, tap } from 'rxjs';
import { Country } from '../../models/country.model';
import { CountryApiService } from '../../services/api/country-api.service';
import { CountryTableComponent } from '../tables/country-table/country-table.component';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  standalone: true,
  imports: [FormsModule, CountryTableComponent, NgIf, NgFor, AsyncPipe],
})
export class SearchPageComponent implements OnInit {
  searchTerm = '';

  apiResults$?: Observable<Country[]>;

  constructor(private apiService: CountryApiService) {}

  ngOnInit() {}

  onSearch(): void {
    console.log(`Searching ${this.searchTerm}`);
    this.apiResults$ = this.apiService.findByName(this.searchTerm);
  }
}
