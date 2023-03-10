/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { HarnessPredicate, ContentContainerComponentHarness } from '@angular/cdk/testing';
/**
 * Harness for interacting with a standard mat-card in tests.
 * @deprecated Use `MatCardHarness` from `@angular/material/card/testing` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
export class MatLegacyCardHarness extends ContentContainerComponentHarness {
    constructor() {
        super(...arguments);
        this._title = this.locatorForOptional('.mat-card-title');
        this._subtitle = this.locatorForOptional('.mat-card-subtitle');
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatCardHarness` that meets
     * certain criteria.
     * @param options Options for filtering which card instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatLegacyCardHarness, options)
            .addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text))
            .addOption('title', options.title, (harness, title) => HarnessPredicate.stringMatches(harness.getTitleText(), title))
            .addOption('subtitle', options.subtitle, (harness, subtitle) => HarnessPredicate.stringMatches(harness.getSubtitleText(), subtitle));
    }
    /** Gets all of the card's content as text. */
    async getText() {
        return (await this.host()).text();
    }
    /** Gets the cards's title text. */
    async getTitleText() {
        return (await this._title())?.text() ?? '';
    }
    /** Gets the cards's subtitle text. */
    async getSubtitleText() {
        return (await this._subtitle())?.text() ?? '';
    }
}
/** The selector for the host element of a `MatCard` instance. */
MatLegacyCardHarness.hostSelector = '.mat-card';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FyZC1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2xlZ2FjeS1jYXJkL3Rlc3RpbmcvY2FyZC1oYXJuZXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQ0FBZ0MsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBZXhGOzs7O0dBSUc7QUFDSCxNQUFNLE9BQU8sb0JBQXFCLFNBQVEsZ0NBQXNEO0lBQWhHOztRQXVCVSxXQUFNLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDcEQsY0FBUyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0lBZ0JwRSxDQUFDO0lBcENDOzs7OztPQUtHO0lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFvQyxFQUFFO1FBQ2hELE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxvQkFBb0IsRUFBRSxPQUFPLENBQUM7YUFDdkQsU0FBUyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFLENBQ2pELGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQ3hEO2FBQ0EsU0FBUyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQ3BELGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQzlEO2FBQ0EsU0FBUyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQzdELGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsZUFBZSxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQ3BFLENBQUM7SUFDTixDQUFDO0lBS0QsOENBQThDO0lBQzlDLEtBQUssQ0FBQyxPQUFPO1FBQ1gsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDcEMsQ0FBQztJQUVELG1DQUFtQztJQUNuQyxLQUFLLENBQUMsWUFBWTtRQUNoQixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUM7SUFDN0MsQ0FBQztJQUVELHNDQUFzQztJQUN0QyxLQUFLLENBQUMsZUFBZTtRQUNuQixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUM7SUFDaEQsQ0FBQzs7QUF0Q0QsaUVBQWlFO0FBQzFELGlDQUFZLEdBQUcsV0FBVyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7SGFybmVzc1ByZWRpY2F0ZSwgQ29udGVudENvbnRhaW5lckNvbXBvbmVudEhhcm5lc3N9IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7TGVnYWN5Q2FyZEhhcm5lc3NGaWx0ZXJzfSBmcm9tICcuL2NhcmQtaGFybmVzcy1maWx0ZXJzJztcblxuLyoqXG4gKiBTZWxlY3RvcnMgZm9yIGRpZmZlcmVudCBzZWN0aW9ucyBvZiB0aGUgbWF0LWNhcmQgdGhhdCBjYW4gY29udGFpbmVyIHVzZXIgY29udGVudC5cbiAqIEBkZXByZWNhdGVkIFVzZSBgTWF0Q2FyZFNlY3Rpb25gIGZyb20gYEBhbmd1bGFyL21hdGVyaWFsL2NhcmQvdGVzdGluZ2AgaW5zdGVhZC4gU2VlIGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhci5pby9ndWlkZS9tZGMtbWlncmF0aW9uIGZvciBpbmZvcm1hdGlvbiBhYm91dCBtaWdyYXRpbmcuXG4gKiBAYnJlYWtpbmctY2hhbmdlIDE3LjAuMFxuICovXG5leHBvcnQgY29uc3QgZW51bSBNYXRMZWdhY3lDYXJkU2VjdGlvbiB7XG4gIEhFQURFUiA9ICcubWF0LWNhcmQtaGVhZGVyJyxcbiAgQ09OVEVOVCA9ICcubWF0LWNhcmQtY29udGVudCcsXG4gIEFDVElPTlMgPSAnLm1hdC1jYXJkLWFjdGlvbnMnLFxuICBGT09URVIgPSAnLm1hdC1jYXJkLWZvb3RlcicsXG59XG5cbi8qKlxuICogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIG1hdC1jYXJkIGluIHRlc3RzLlxuICogQGRlcHJlY2F0ZWQgVXNlIGBNYXRDYXJkSGFybmVzc2AgZnJvbSBgQGFuZ3VsYXIvbWF0ZXJpYWwvY2FyZC90ZXN0aW5nYCBpbnN0ZWFkLiBTZWUgaHR0cHM6Ly9tYXRlcmlhbC5hbmd1bGFyLmlvL2d1aWRlL21kYy1taWdyYXRpb24gZm9yIGluZm9ybWF0aW9uIGFib3V0IG1pZ3JhdGluZy5cbiAqIEBicmVha2luZy1jaGFuZ2UgMTcuMC4wXG4gKi9cbmV4cG9ydCBjbGFzcyBNYXRMZWdhY3lDYXJkSGFybmVzcyBleHRlbmRzIENvbnRlbnRDb250YWluZXJDb21wb25lbnRIYXJuZXNzPE1hdExlZ2FjeUNhcmRTZWN0aW9uPiB7XG4gIC8qKiBUaGUgc2VsZWN0b3IgZm9yIHRoZSBob3N0IGVsZW1lbnQgb2YgYSBgTWF0Q2FyZGAgaW5zdGFuY2UuICovXG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC1jYXJkJztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBgTWF0Q2FyZEhhcm5lc3NgIHRoYXQgbWVldHNcbiAgICogY2VydGFpbiBjcml0ZXJpYS5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgZmlsdGVyaW5nIHdoaWNoIGNhcmQgaW5zdGFuY2VzIGFyZSBjb25zaWRlcmVkIGEgbWF0Y2guXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogTGVnYWN5Q2FyZEhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdExlZ2FjeUNhcmRIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdExlZ2FjeUNhcmRIYXJuZXNzLCBvcHRpb25zKVxuICAgICAgLmFkZE9wdGlvbigndGV4dCcsIG9wdGlvbnMudGV4dCwgKGhhcm5lc3MsIHRleHQpID0+XG4gICAgICAgIEhhcm5lc3NQcmVkaWNhdGUuc3RyaW5nTWF0Y2hlcyhoYXJuZXNzLmdldFRleHQoKSwgdGV4dCksXG4gICAgICApXG4gICAgICAuYWRkT3B0aW9uKCd0aXRsZScsIG9wdGlvbnMudGl0bGUsIChoYXJuZXNzLCB0aXRsZSkgPT5cbiAgICAgICAgSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGhhcm5lc3MuZ2V0VGl0bGVUZXh0KCksIHRpdGxlKSxcbiAgICAgIClcbiAgICAgIC5hZGRPcHRpb24oJ3N1YnRpdGxlJywgb3B0aW9ucy5zdWJ0aXRsZSwgKGhhcm5lc3MsIHN1YnRpdGxlKSA9PlxuICAgICAgICBIYXJuZXNzUHJlZGljYXRlLnN0cmluZ01hdGNoZXMoaGFybmVzcy5nZXRTdWJ0aXRsZVRleHQoKSwgc3VidGl0bGUpLFxuICAgICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgX3RpdGxlID0gdGhpcy5sb2NhdG9yRm9yT3B0aW9uYWwoJy5tYXQtY2FyZC10aXRsZScpO1xuICBwcml2YXRlIF9zdWJ0aXRsZSA9IHRoaXMubG9jYXRvckZvck9wdGlvbmFsKCcubWF0LWNhcmQtc3VidGl0bGUnKTtcblxuICAvKiogR2V0cyBhbGwgb2YgdGhlIGNhcmQncyBjb250ZW50IGFzIHRleHQuICovXG4gIGFzeW5jIGdldFRleHQoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS50ZXh0KCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgY2FyZHMncyB0aXRsZSB0ZXh0LiAqL1xuICBhc3luYyBnZXRUaXRsZVRleHQoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX3RpdGxlKCkpPy50ZXh0KCkgPz8gJyc7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgY2FyZHMncyBzdWJ0aXRsZSB0ZXh0LiAqL1xuICBhc3luYyBnZXRTdWJ0aXRsZVRleHQoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX3N1YnRpdGxlKCkpPy50ZXh0KCkgPz8gJyc7XG4gIH1cbn1cbiJdfQ==