import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbHighlight, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Country } from '../../../models/country.model';
import {
  NgbdSortableHeader,
  SortEvent,
} from '../../../util/table-filter/abstract/sortable.directive';
import { CountryTableFilter } from '../../../util/table-filter/impl/country-table-filter';

@Component({
  selector: 'app-country-table',
  templateUrl: './country-table.component.html',
  standalone: true,
  imports: [ FormsModule, AsyncPipe, NgbHighlight, NgbdSortableHeader, NgbPaginationModule, NgIf, NgFor],
})
export class CountryTableComponent implements OnInit {
  countries$!: Observable<Country[]>;
  total$!: Observable<number>;

  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;

  @Input() apiResults!: Country[];

  public tableHelper!: CountryTableFilter;

  constructor() {}

  ngOnInit(): void {
    console.log(`part table initialize with results ${this.apiResults}`);
    this.tableHelper = new CountryTableFilter(this.apiResults);

    this.countries$ = this.tableHelper.displayedResults$;
    this.total$ = this.tableHelper.total$;
  }

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.tableHelper!.sortColumn = column.toString();
    this.tableHelper!.sortDirection = direction;
  }

  identify(index: number, item: Country) {
    return item.name.official;
  }
}
