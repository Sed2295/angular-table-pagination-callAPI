import './polyfills';
import { provideHttpClient, withNoXsrfProtection } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { SearchPageComponent } from './app/components/pages/search-page.component';

bootstrapApplication(SearchPageComponent, {
  providers: [provideHttpClient(withNoXsrfProtection())],
})
  .then((ref) => {
    // Ensure Angular destroys itself on hot reloads.
    if ((window as any)['ngRef']) {
      (window as any)['ngRef'].destroy();
    }
    (window as any)['ngRef'] = ref;

    // Otherwise, log the boot error
  })
  .catch((err) => console.error(err));
