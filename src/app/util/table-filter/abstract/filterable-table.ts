import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { debounceTime, delay, map, switchMap, tap } from 'rxjs/operators';
import { SortDirection } from './sortable.directive';

interface SearchResult<T> {
  displayedResults: T[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: string;
  sortDirection: SortDirection;
}

function compare(v1: any, v2: any) {
  return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
}

export abstract class FilterableTable<T> {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _displayedResults$ = new BehaviorSubject<T[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  // public allValues: T[] = [];

  private _state: State = {
    page: 1,
    pageSize: 4,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
  };

  constructor(public allValues: T[]) {
    console.log('hermoso goloso');
    console.log(allValues);
    // this.allValues = allValues;
    this._search$
      .pipe(
        tap(() => this._loading$.next(true)),
        debounceTime(200),
        switchMap(() => this._search()),
        delay(200),
        tap(() => this._loading$.next(false))
      )
      .subscribe((result) => {
        this._displayedResults$.next(result.displayedResults);
        this._total$.next(result.total);
      });

    this._search$.next();
  }

  get displayedResults$() {
    return this._displayedResults$.asObservable();
  }
  get total$() {
    return this._total$.asObservable();
  }
  get loading$() {
    return this._loading$.asObservable();
  }
  get page() {
    return this._state.page;
  }
  get pageSize() {
    return this._state.pageSize;
  }
  get searchTerm() {
    return this._state.searchTerm;
  }

  set page(page: number) {
    this._set({ page });
  }
  set pageSize(pageSize: number) {
    this._set({ pageSize });
  }
  set searchTerm(searchTerm: string) {
    this._set({ searchTerm });
  }
  set sortColumn(sortColumn: string) {
    this._set({ sortColumn });
  }
  set sortDirection(sortDirection: SortDirection) {
    this._set({ sortDirection });
  }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  sort(apiResp: T[], column: string, direction: string): T[] {
    console.log(`sourting on column ${column}`);
    if (direction === '') {
      return apiResp;
    } else {
      return [...apiResp].sort((a: T, b: T) => {
        const res = compare(
          this.getProperty(a, column),
          this.getProperty(b, column)
        );
        return direction === 'asc' ? res : -res;
      });
    }
  }

  /**
   * Ability to get nested properties, i.e. `name.common`
   */
  getProperty(object: any, propertyName: string) {
    var parts = propertyName.split('.'),
      length = parts.length,
      i,
      property = object || this;

    for (i = 0; i < length; i++) {
      property = property[parts[i]];
    }

    return property;
  }

  abstract matches(resp: T, term: string): boolean;

  private _search(): Observable<SearchResult<T>> {
    const { sortColumn, sortDirection, pageSize, page, searchTerm } =
      this._state;

    // console.log(`allValues size ${this.allValues.length}`)
    // console.log(`searchTerm: ${searchTerm}`)

    // 1. sort
    let displayResults: T[] = this.sort(
      this.allValues,
      sortColumn,
      sortDirection
    );

    // 2. filter
    displayResults = displayResults.filter((country) =>
      this.matches(country, searchTerm)
    );
    const total = displayResults.length;

    // 3. paginate
    displayResults = displayResults.slice(
      (page - 1) * pageSize,
      (page - 1) * pageSize + pageSize
    );

    // console.log(`displayResults size ${displayResults.length}`)
    return of({ displayedResults: displayResults, total });
  }
}
