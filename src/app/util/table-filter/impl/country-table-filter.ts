

import { Country } from '../../../models/country.model';
import { FilterableTable } from '../abstract/filterable-table';


export class CountryTableFilter extends FilterableTable<Country> {
	matches(country: Country, input: string): boolean {
		return (
			country.name.common.toLowerCase().includes(input.toLowerCase()) ||
			country.region.toLowerCase().includes(input.toLowerCase())
		);
	}
}