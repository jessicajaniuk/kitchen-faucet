/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { PlatformLocation } from '@angular/common';
import { MockPlatformLocation } from '@angular/common/testing';
import { APP_ID, createPlatformFactory, NgModule, NgZone, PLATFORM_INITIALIZER, platformCore } from '@angular/core';
import { BrowserModule, ɵBrowserDomAdapter as BrowserDomAdapter } from '@angular/platform-browser';
import { BrowserDetection, createNgZone } from './browser_util';
import * as i0 from "@angular/core";
function initBrowserTests() {
    BrowserDomAdapter.makeCurrent();
    BrowserDetection.setup();
}
const _TEST_BROWSER_PLATFORM_PROVIDERS = [{ provide: PLATFORM_INITIALIZER, useValue: initBrowserTests, multi: true }];
/**
 * Platform for testing
 *
 * @publicApi
 */
export const platformBrowserTesting = createPlatformFactory(platformCore, 'browserTesting', _TEST_BROWSER_PLATFORM_PROVIDERS);
/**
 * NgModule for testing.
 *
 * @publicApi
 */
export class BrowserTestingModule {
}
BrowserTestingModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0-next.0+sha-ba2c1d8", ngImport: i0, type: BrowserTestingModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
BrowserTestingModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0-next.0+sha-ba2c1d8", ngImport: i0, type: BrowserTestingModule, exports: [BrowserModule] });
BrowserTestingModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0-next.0+sha-ba2c1d8", ngImport: i0, type: BrowserTestingModule, providers: [
        { provide: APP_ID, useValue: 'a' },
        { provide: NgZone, useFactory: createNgZone },
        { provide: PlatformLocation, useClass: MockPlatformLocation },
    ], imports: [BrowserModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0-next.0+sha-ba2c1d8", ngImport: i0, type: BrowserTestingModule, decorators: [{
            type: NgModule,
            args: [{
                    exports: [BrowserModule],
                    providers: [
                        { provide: APP_ID, useValue: 'a' },
                        { provide: NgZone, useFactory: createNgZone },
                        { provide: PlatformLocation, useClass: MockPlatformLocation },
                    ]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJvd3Nlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3BsYXRmb3JtLWJyb3dzZXIvdGVzdGluZy9zcmMvYnJvd3Nlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFDSCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUNqRCxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUM3RCxPQUFPLEVBQUMsTUFBTSxFQUFFLHFCQUFxQixFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsb0JBQW9CLEVBQUUsWUFBWSxFQUFpQixNQUFNLGVBQWUsQ0FBQztBQUNsSSxPQUFPLEVBQUMsYUFBYSxFQUFFLGtCQUFrQixJQUFJLGlCQUFpQixFQUFDLE1BQU0sMkJBQTJCLENBQUM7QUFFakcsT0FBTyxFQUFDLGdCQUFnQixFQUFFLFlBQVksRUFBQyxNQUFNLGdCQUFnQixDQUFDOztBQUU5RCxTQUFTLGdCQUFnQjtJQUN2QixpQkFBaUIsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNoQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUMzQixDQUFDO0FBRUQsTUFBTSxnQ0FBZ0MsR0FDbEMsQ0FBQyxFQUFDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxRQUFRLEVBQUUsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7QUFFL0U7Ozs7R0FJRztBQUNILE1BQU0sQ0FBQyxNQUFNLHNCQUFzQixHQUMvQixxQkFBcUIsQ0FBQyxZQUFZLEVBQUUsZ0JBQWdCLEVBQUUsZ0NBQWdDLENBQUMsQ0FBQztBQUU1Rjs7OztHQUlHO0FBU0gsTUFBTSxPQUFPLG9CQUFvQjs7NEhBQXBCLG9CQUFvQjs2SEFBcEIsb0JBQW9CLFlBUHJCLGFBQWE7NkhBT1osb0JBQW9CLGFBTnBCO1FBQ1QsRUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUM7UUFDaEMsRUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUM7UUFDM0MsRUFBQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsUUFBUSxFQUFFLG9CQUFvQixFQUFDO0tBQzVELFlBTFMsYUFBYTtzR0FPWixvQkFBb0I7a0JBUmhDLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsYUFBYSxDQUFDO29CQUN4QixTQUFTLEVBQUU7d0JBQ1QsRUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUM7d0JBQ2hDLEVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFDO3dCQUMzQyxFQUFDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxRQUFRLEVBQUUsb0JBQW9CLEVBQUM7cUJBQzVEO2lCQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge1BsYXRmb3JtTG9jYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge01vY2tQbGF0Zm9ybUxvY2F0aW9ufSBmcm9tICdAYW5ndWxhci9jb21tb24vdGVzdGluZyc7XG5pbXBvcnQge0FQUF9JRCwgY3JlYXRlUGxhdGZvcm1GYWN0b3J5LCBOZ01vZHVsZSwgTmdab25lLCBQTEFURk9STV9JTklUSUFMSVpFUiwgcGxhdGZvcm1Db3JlLCBTdGF0aWNQcm92aWRlcn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0Jyb3dzZXJNb2R1bGUsIMm1QnJvd3NlckRvbUFkYXB0ZXIgYXMgQnJvd3NlckRvbUFkYXB0ZXJ9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuXG5pbXBvcnQge0Jyb3dzZXJEZXRlY3Rpb24sIGNyZWF0ZU5nWm9uZX0gZnJvbSAnLi9icm93c2VyX3V0aWwnO1xuXG5mdW5jdGlvbiBpbml0QnJvd3NlclRlc3RzKCkge1xuICBCcm93c2VyRG9tQWRhcHRlci5tYWtlQ3VycmVudCgpO1xuICBCcm93c2VyRGV0ZWN0aW9uLnNldHVwKCk7XG59XG5cbmNvbnN0IF9URVNUX0JST1dTRVJfUExBVEZPUk1fUFJPVklERVJTOiBTdGF0aWNQcm92aWRlcltdID1cbiAgICBbe3Byb3ZpZGU6IFBMQVRGT1JNX0lOSVRJQUxJWkVSLCB1c2VWYWx1ZTogaW5pdEJyb3dzZXJUZXN0cywgbXVsdGk6IHRydWV9XTtcblxuLyoqXG4gKiBQbGF0Zm9ybSBmb3IgdGVzdGluZ1xuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGNvbnN0IHBsYXRmb3JtQnJvd3NlclRlc3RpbmcgPVxuICAgIGNyZWF0ZVBsYXRmb3JtRmFjdG9yeShwbGF0Zm9ybUNvcmUsICdicm93c2VyVGVzdGluZycsIF9URVNUX0JST1dTRVJfUExBVEZPUk1fUFJPVklERVJTKTtcblxuLyoqXG4gKiBOZ01vZHVsZSBmb3IgdGVzdGluZy5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbkBOZ01vZHVsZSh7XG4gIGV4cG9ydHM6IFtCcm93c2VyTW9kdWxlXSxcbiAgcHJvdmlkZXJzOiBbXG4gICAge3Byb3ZpZGU6IEFQUF9JRCwgdXNlVmFsdWU6ICdhJ30sXG4gICAge3Byb3ZpZGU6IE5nWm9uZSwgdXNlRmFjdG9yeTogY3JlYXRlTmdab25lfSxcbiAgICB7cHJvdmlkZTogUGxhdGZvcm1Mb2NhdGlvbiwgdXNlQ2xhc3M6IE1vY2tQbGF0Zm9ybUxvY2F0aW9ufSxcbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBCcm93c2VyVGVzdGluZ01vZHVsZSB7XG59XG4iXX0=