/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CommonModule, DOCUMENT, XhrFactory, ɵPLATFORM_BROWSER_ID as PLATFORM_BROWSER_ID } from '@angular/common';
import { APP_ID, ApplicationModule, createPlatformFactory, ErrorHandler, inject, Inject, InjectionToken, makeEnvironmentProviders, NgModule, NgZone, Optional, PLATFORM_ID, PLATFORM_INITIALIZER, platformCore, RendererFactory2, SkipSelf, Testability, TestabilityRegistry, ɵINJECTOR_SCOPE as INJECTOR_SCOPE, ɵinternalCreateApplication as internalCreateApplication, ɵinternalProvideHydrationSupport as internalProvideHydrationSupport, ɵsetDocument, ɵTESTABILITY as TESTABILITY, ɵTESTABILITY_GETTER as TESTABILITY_GETTER, ɵTRANSFER_STATE as TRANSFER_STATE } from '@angular/core';
import { BrowserDomAdapter } from './browser/browser_adapter';
import { BrowserGetTestability } from './browser/testability';
import { BrowserXhr } from './browser/xhr';
import { DomRendererFactory2, REMOVE_STYLES_ON_COMPONENT_DESTROY } from './dom/dom_renderer';
import { DomEventsPlugin } from './dom/events/dom_events';
import { EVENT_MANAGER_PLUGINS, EventManager } from './dom/events/event_manager';
import { KeyEventsPlugin } from './dom/events/key_events';
import { DomSharedStylesHost, SharedStylesHost } from './dom/shared_styles_host';
import { TransferState } from './platform-browser';
import * as i0 from "@angular/core";
const NG_DEV_MODE = typeof ngDevMode === 'undefined' || !!ngDevMode;
/**
 * Bootstraps an instance of an Angular application and renders a standalone component as the
 * application's root component. More information about standalone components can be found in [this
 * guide](guide/standalone-components).
 *
 * @usageNotes
 * The root component passed into this function *must* be a standalone one (should have the
 * `standalone: true` flag in the `@Component` decorator config).
 *
 * ```typescript
 * @Component({
 *   standalone: true,
 *   template: 'Hello world!'
 * })
 * class RootComponent {}
 *
 * const appRef: ApplicationRef = await bootstrapApplication(RootComponent);
 * ```
 *
 * You can add the list of providers that should be available in the application injector by
 * specifying the `providers` field in an object passed as the second argument:
 *
 * ```typescript
 * await bootstrapApplication(RootComponent, {
 *   providers: [
 *     {provide: BACKEND_URL, useValue: 'https://yourdomain.com/api'}
 *   ]
 * });
 * ```
 *
 * The `importProvidersFrom` helper method can be used to collect all providers from any
 * existing NgModule (and transitively from all NgModules that it imports):
 *
 * ```typescript
 * await bootstrapApplication(RootComponent, {
 *   providers: [
 *     importProvidersFrom(SomeNgModule)
 *   ]
 * });
 * ```
 *
 * Note: the `bootstrapApplication` method doesn't include [Testability](api/core/Testability) by
 * default. You can add [Testability](api/core/Testability) by getting the list of necessary
 * providers using `provideProtractorTestingSupport()` function and adding them into the `providers`
 * array, for example:
 *
 * ```typescript
 * import {provideProtractorTestingSupport} from '@angular/platform-browser';
 *
 * await bootstrapApplication(RootComponent, {providers: [provideProtractorTestingSupport()]});
 * ```
 *
 * @param rootComponent A reference to a standalone component that should be rendered.
 * @param options Extra configuration for the bootstrap operation, see `ApplicationConfig` for
 *     additional info.
 * @returns A promise that returns an `ApplicationRef` instance once resolved.
 *
 * @publicApi
 */
export function bootstrapApplication(rootComponent, options) {
    return internalCreateApplication({ rootComponent, ...createProvidersConfig(options) });
}
/**
 * Create an instance of an Angular application without bootstrapping any components. This is useful
 * for the situation where one wants to decouple application environment creation (a platform and
 * associated injectors) from rendering components on a screen. Components can be subsequently
 * bootstrapped on the returned `ApplicationRef`.
 *
 * @param options Extra configuration for the application environment, see `ApplicationConfig` for
 *     additional info.
 * @returns A promise that returns an `ApplicationRef` instance once resolved.
 *
 * @publicApi
 */
export function createApplication(options) {
    return internalCreateApplication(createProvidersConfig(options));
}
function createProvidersConfig(options) {
    return {
        appProviders: [
            ...BROWSER_MODULE_PROVIDERS,
            ...(options?.providers ?? []),
        ],
        platformProviders: INTERNAL_BROWSER_PLATFORM_PROVIDERS
    };
}
/**
 * Returns a set of providers required to setup [Testability](api/core/Testability) for an
 * application bootstrapped using the `bootstrapApplication` function. The set of providers is
 * needed to support testing an application with Protractor (which relies on the Testability APIs
 * to be present).
 *
 * @returns An array of providers required to setup Testability for an application and make it
 *     available for testing using Protractor.
 *
 * @publicApi
 */
export function provideProtractorTestingSupport() {
    // Return a copy to prevent changes to the original array in case any in-place
    // alterations are performed to the `provideProtractorTestingSupport` call results in app code.
    return [...TESTABILITY_PROVIDERS];
}
/**
 * # Enable Hydration Support
 *
 * Returns a set of providers required to setup hydration support for an application that is
 * server side rendered. It can be safely added to both server and client providers lists.
 *
 * ## NgModule-based bootstrap
 *
 * You can add the function call to the root AppModule of an application:
 * ```
 * import {provideHydrationSupport} from '@angular/platform-browser';
 *
 * @NgModule({
 *   providers: [
 *     // ... other providers ...
 *     provideHydrationSupport()
 *   ],
 *   declarations: [AppComponent],
 *   bootstrap: [AppComponent]
 * })
 * class AppModule {}
 * ```
 *
 * ## Standalone-based bootstrap
 *
 * Add the function to the `bootstrapApplication` call:
 * ```
 * import {provideHydrationSupport} from '@angular/platform-browser';
 *
 * bootstrapApplication(RootComponent, {
 *   providers: [
 *     // ... other providers ...
 *     provideHydrationSupport()
 *   ]
 * });
 * ```
 *
 * The function sets up an internal flag that would be recognized during SSR time as well,
 * so there is no need to configure or change anything in NgUniversal to enable the feature.
 *
 * ## How to skip hydration for a particular component?
 *
 * If you need to disable hydration for a component for any reason (errors, DOM Manipulation,
 *   etc), you can add `ngSkipHydration` to the host element. You can either add it as an
 *   attribute or set it as a host binding.
 *
 * To opt-out a specific instance of a component, you can use the flag in a template:
 * ```
 * <greetings-cmp ngSkipHydration />
 * ```
 *
 * To opt-out all component instances, you can set this flag via host bindings:
 * ```
 * @Component({
 *   selector: 'greetings-cmp',
 *   template: `<h1>Hi!</h1>`,
 *   host: {'ngSkipHydration': 'true'}
 * })
 * class GreetingComponent {}
 * ```
 *
 * @returns An array of providers required to setup and enable hydration for a server side
 *     rendered application.
 *
 * @publicApi
 * @developerPreview
 */
export function provideHydrationSupport() {
    return makeEnvironmentProviders([
        ...internalProvideHydrationSupport(),
        { provide: TRANSFER_STATE, useFactory: () => inject(TransferState) }
    ]);
}
export function initDomAdapter() {
    BrowserDomAdapter.makeCurrent();
}
export function errorHandler() {
    return new ErrorHandler();
}
export function _document() {
    // Tell ivy about the global document
    ɵsetDocument(document);
    return document;
}
export const INTERNAL_BROWSER_PLATFORM_PROVIDERS = [
    { provide: PLATFORM_ID, useValue: PLATFORM_BROWSER_ID },
    { provide: PLATFORM_INITIALIZER, useValue: initDomAdapter, multi: true },
    { provide: DOCUMENT, useFactory: _document, deps: [] },
];
/**
 * A factory function that returns a `PlatformRef` instance associated with browser service
 * providers.
 *
 * @publicApi
 */
export const platformBrowser = createPlatformFactory(platformCore, 'browser', INTERNAL_BROWSER_PLATFORM_PROVIDERS);
/**
 * Internal marker to signal whether providers from the `BrowserModule` are already present in DI.
 * This is needed to avoid loading `BrowserModule` providers twice. We can't rely on the
 * `BrowserModule` presence itself, since the standalone-based bootstrap just imports
 * `BrowserModule` providers without referencing the module itself.
 */
const BROWSER_MODULE_PROVIDERS_MARKER = new InjectionToken(NG_DEV_MODE ? 'BrowserModule Providers Marker' : '');
const TESTABILITY_PROVIDERS = [
    {
        provide: TESTABILITY_GETTER,
        useClass: BrowserGetTestability,
        deps: [],
    },
    {
        provide: TESTABILITY,
        useClass: Testability,
        deps: [NgZone, TestabilityRegistry, TESTABILITY_GETTER]
    },
    {
        provide: Testability,
        useClass: Testability,
        deps: [NgZone, TestabilityRegistry, TESTABILITY_GETTER]
    }
];
const BROWSER_MODULE_PROVIDERS = [
    { provide: INJECTOR_SCOPE, useValue: 'root' },
    { provide: ErrorHandler, useFactory: errorHandler, deps: [] }, {
        provide: EVENT_MANAGER_PLUGINS,
        useClass: DomEventsPlugin,
        multi: true,
        deps: [DOCUMENT, NgZone, PLATFORM_ID]
    },
    { provide: EVENT_MANAGER_PLUGINS, useClass: KeyEventsPlugin, multi: true, deps: [DOCUMENT] }, {
        provide: DomRendererFactory2,
        useClass: DomRendererFactory2,
        deps: [EventManager, DomSharedStylesHost, APP_ID, REMOVE_STYLES_ON_COMPONENT_DESTROY]
    },
    { provide: RendererFactory2, useExisting: DomRendererFactory2 },
    { provide: SharedStylesHost, useExisting: DomSharedStylesHost }, DomSharedStylesHost, EventManager,
    { provide: XhrFactory, useClass: BrowserXhr, deps: [] },
    NG_DEV_MODE ? { provide: BROWSER_MODULE_PROVIDERS_MARKER, useValue: true } : []
];
/**
 * Exports required infrastructure for all Angular apps.
 * Included by default in all Angular apps created with the CLI
 * `new` command.
 * Re-exports `CommonModule` and `ApplicationModule`, making their
 * exports and providers available to all apps.
 *
 * @publicApi
 */
export class BrowserModule {
    constructor(providersAlreadyPresent) {
        if (NG_DEV_MODE && providersAlreadyPresent) {
            throw new Error(`Providers from the \`BrowserModule\` have already been loaded. If you need access ` +
                `to common directives such as NgIf and NgFor, import the \`CommonModule\` instead.`);
        }
    }
    /**
     * Configures a browser-based app to transition from a server-rendered app, if
     * one is present on the page.
     *
     * @param params An object containing an identifier for the app to transition.
     * The ID must match between the client and server versions of the app.
     * @returns The reconfigured `BrowserModule` to import into the app's root `AppModule`.
     */
    static withServerTransition(params) {
        return {
            ngModule: BrowserModule,
            providers: [
                { provide: APP_ID, useValue: params.appId },
            ],
        };
    }
}
BrowserModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0-next.0+sha-ba2c1d8", ngImport: i0, type: BrowserModule, deps: [{ token: BROWSER_MODULE_PROVIDERS_MARKER, optional: true, skipSelf: true }], target: i0.ɵɵFactoryTarget.NgModule });
BrowserModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0-next.0+sha-ba2c1d8", ngImport: i0, type: BrowserModule, exports: [CommonModule, ApplicationModule] });
BrowserModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0-next.0+sha-ba2c1d8", ngImport: i0, type: BrowserModule, providers: [...BROWSER_MODULE_PROVIDERS, ...TESTABILITY_PROVIDERS], imports: [CommonModule, ApplicationModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0-next.0+sha-ba2c1d8", ngImport: i0, type: BrowserModule, decorators: [{
            type: NgModule,
            args: [{
                    providers: [...BROWSER_MODULE_PROVIDERS, ...TESTABILITY_PROVIDERS],
                    exports: [CommonModule, ApplicationModule],
                }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: SkipSelf
                }, {
                    type: Inject,
                    args: [BROWSER_MODULE_PROVIDERS_MARKER]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJvd3Nlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3BsYXRmb3JtLWJyb3dzZXIvc3JjL2Jyb3dzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFlBQVksRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLG9CQUFvQixJQUFJLG1CQUFtQixFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDaEgsT0FBTyxFQUFDLE1BQU0sRUFBRSxpQkFBaUIsRUFBa0IscUJBQXFCLEVBQXdCLFlBQVksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBRSx3QkFBd0IsRUFBdUIsUUFBUSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLG9CQUFvQixFQUFFLFlBQVksRUFBeUIsZ0JBQWdCLEVBQUUsUUFBUSxFQUFrQixXQUFXLEVBQUUsbUJBQW1CLEVBQVEsZUFBZSxJQUFJLGNBQWMsRUFBRSwwQkFBMEIsSUFBSSx5QkFBeUIsRUFBRSxnQ0FBZ0MsSUFBSSwrQkFBK0IsRUFBRSxZQUFZLEVBQUUsWUFBWSxJQUFJLFdBQVcsRUFBRSxtQkFBbUIsSUFBSSxrQkFBa0IsRUFBRSxlQUFlLElBQUksY0FBYyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRXBxQixPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQztBQUM1RCxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUM1RCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxtQkFBbUIsRUFBRSxrQ0FBa0MsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQzNGLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUN4RCxPQUFPLEVBQUMscUJBQXFCLEVBQUUsWUFBWSxFQUFDLE1BQU0sNEJBQTRCLENB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QUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBQztJQUNyRCxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUMsT0FBTyxFQUFFLCtCQUErQixFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtDQUM5RSxDQUFDO0FBRUY7Ozs7Ozs7O0dBUUc7QUFLSCxNQUFNLE9BQU8sYUFBYTtJQUN4QixZQUNZLHVCQUFxQztRQUMvQyxJQUFJLFdBQVcsSUFBSSx1QkFBdUIsRUFBRTtZQUMxQyxNQUFNLElBQUksS0FBSyxDQUNYLG9GQUFvRjtnQkFDcEYsbUZBQW1GLENBQUMsQ0FBQztTQUMxRjtJQUNILENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0gsTUFBTSxDQUFDLG9CQUFvQixDQUFDLE1BQXVCO1FBQ2pELE9BQU87WUFDTCxRQUFRLEVBQUUsYUFBYTtZQUN2QixTQUFTLEVBQUU7Z0JBQ1QsRUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsS0FBSyxFQUFDO2FBQzFDO1NBQ0YsQ0FBQztJQUNKLENBQUM7O3FIQXpCVSxhQUFhLGtCQUNvQiwrQkFBK0I7c0hBRGhFLGFBQWEsWUFGZCxZQUFZLEVBQUUsaUJBQWlCO3NIQUU5QixhQUFhLGFBSGIsQ0FBQyxHQUFHLHdCQUF3QixFQUFFLEdBQUcscUJBQXFCLENBQUMsWUFDeEQsWUFBWSxFQUFFLGlCQUFpQjtzR0FFOUIsYUFBYTtrQkFKekIsUUFBUTttQkFBQztvQkFDUixTQUFTLEVBQUUsQ0FBQyxHQUFHLHdCQUF3QixFQUFFLEdBQUcscUJBQXFCLENBQUM7b0JBQ2xFLE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxpQkFBaUIsQ0FBQztpQkFDM0M7OzBCQUVjLFFBQVE7OzBCQUFJLFFBQVE7OzBCQUFJLE1BQU07MkJBQUMsK0JBQStCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29tbW9uTW9kdWxlLCBET0NVTUVOVCwgWGhyRmFjdG9yeSwgybVQTEFURk9STV9CUk9XU0VSX0lEIGFzIFBMQVRGT1JNX0JST1dTRVJfSUR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0FQUF9JRCwgQXBwbGljYXRpb25Nb2R1bGUsIEFwcGxpY2F0aW9uUmVmLCBjcmVhdGVQbGF0Zm9ybUZhY3RvcnksIEVudmlyb25tZW50UHJvdmlkZXJzLCBFcnJvckhhbmRsZXIsIGluamVjdCwgSW5qZWN0LCBJbmplY3Rpb25Ub2tlbiwgbWFrZUVudmlyb25tZW50UHJvdmlkZXJzLCBNb2R1bGVXaXRoUHJvdmlkZXJzLCBOZ01vZHVsZSwgTmdab25lLCBPcHRpb25hbCwgUExBVEZPUk1fSUQsIFBMQVRGT1JNX0lOSVRJQUxJWkVSLCBwbGF0Zm9ybUNvcmUsIFBsYXRmb3JtUmVmLCBQcm92aWRlciwgUmVuZGVyZXJGYWN0b3J5MiwgU2tpcFNlbGYsIFN0YXRpY1Byb3ZpZGVyLCBUZXN0YWJpbGl0eSwgVGVzdGFiaWxpdHlSZWdpc3RyeSwgVHlwZSwgybVJTkpFQ1RPUl9TQ09QRSBhcyBJTkpFQ1RPUl9TQ09QRSwgybVpbnRlcm5hbENyZWF0ZUFwcGxpY2F0aW9uIGFzIGludGVybmFsQ3JlYXRlQXBwbGljYXRpb24sIMm1aW50ZXJuYWxQcm92aWRlSHlkcmF0aW9uU3VwcG9ydCBhcyBpbnRlcm5hbFByb3ZpZGVIeWRyYXRpb25TdXBwb3J0LCDJtXNldERvY3VtZW50LCDJtVRFU1RBQklMSVRZIGFzIFRFU1RBQklMSVRZLCDJtVRFU1RBQklMSVRZX0dFVFRFUiBhcyBURVNUQUJJTElUWV9HRVRURVIsIMm1VFJBTlNGRVJfU1RBVEUgYXMgVFJBTlNGRVJfU1RBVEV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge0Jyb3dzZXJEb21BZGFwdGVyfSBmcm9tICcuL2Jyb3dzZXIvYnJvd3Nlcl9hZGFwdGVyJztcbmltcG9ydCB7QnJvd3NlckdldFRlc3RhYmlsaXR5fSBmcm9tICcuL2Jyb3dzZXIvdGVzdGFiaWxpdHknO1xuaW1wb3J0IHtCcm93c2VyWGhyfSBmcm9tICcuL2Jyb3dzZXIveGhyJztcbmltcG9ydCB7RG9tUmVuZGVyZXJGYWN0b3J5MiwgUkVNT1ZFX1NUWUxFU19PTl9DT01QT05FTlRfREVTVFJPWX0gZnJvbSAnLi9kb20vZG9tX3JlbmRlcmVyJztcbmltcG9ydCB7RG9tRXZlbnRzUGx1Z2lufSBmcm9tICcuL2RvbS9ldmVudHMvZG9tX2V2ZW50cyc7XG5pbXBvcnQge0VWRU5UX01BTkFHRVJfUExVR0lOUywgRXZlbnRNYW5hZ2VyfSBmcm9tICcuL2RvbS9ldmVudHMvZXZlbnRfbWFuYWdlcic7XG5pbXBvcnQge0tleUV2ZW50c1BsdWdpbn0gZnJvbSAnLi9kb20vZXZlbnRzL2tleV9ldmVudHMnO1xuaW1wb3J0IHtEb21TaGFyZWRTdHlsZXNIb3N0LCBTaGFyZWRTdHlsZXNIb3N0fSBmcm9tICcuL2RvbS9zaGFyZWRfc3R5bGVzX2hvc3QnO1xuaW1wb3J0IHtUcmFuc2ZlclN0YXRlfSBmcm9tICcuL3BsYXRmb3JtLWJyb3dzZXInO1xuXG5jb25zdCBOR19ERVZfTU9ERSA9IHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8ICEhbmdEZXZNb2RlO1xuXG4vKipcbiAqIFNldCBvZiBjb25maWcgb3B0aW9ucyBhdmFpbGFibGUgZHVyaW5nIHRoZSBhcHBsaWNhdGlvbiBib290c3RyYXAgb3BlcmF0aW9uLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBcHBsaWNhdGlvbkNvbmZpZyB7XG4gIC8qKlxuICAgKiBMaXN0IG9mIHByb3ZpZGVycyB0aGF0IHNob3VsZCBiZSBhdmFpbGFibGUgdG8gdGhlIHJvb3QgY29tcG9uZW50IGFuZCBhbGwgaXRzIGNoaWxkcmVuLlxuICAgKi9cbiAgcHJvdmlkZXJzOiBBcnJheTxQcm92aWRlcnxFbnZpcm9ubWVudFByb3ZpZGVycz47XG59XG5cbi8qKlxuICogQm9vdHN0cmFwcyBhbiBpbnN0YW5jZSBvZiBhbiBBbmd1bGFyIGFwcGxpY2F0aW9uIGFuZCByZW5kZXJzIGEgc3RhbmRhbG9uZSBjb21wb25lbnQgYXMgdGhlXG4gKiBhcHBsaWNhdGlvbidzIHJvb3QgY29tcG9uZW50LiBNb3JlIGluZm9ybWF0aW9uIGFib3V0IHN0YW5kYWxvbmUgY29tcG9uZW50cyBjYW4gYmUgZm91bmQgaW4gW3RoaXNcbiAqIGd1aWRlXShndWlkZS9zdGFuZGFsb25lLWNvbXBvbmVudHMpLlxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKiBUaGUgcm9vdCBjb21wb25lbnQgcGFzc2VkIGludG8gdGhpcyBmdW5jdGlvbiAqbXVzdCogYmUgYSBzdGFuZGFsb25lIG9uZSAoc2hvdWxkIGhhdmUgdGhlXG4gKiBgc3RhbmRhbG9uZTogdHJ1ZWAgZmxhZyBpbiB0aGUgYEBDb21wb25lbnRgIGRlY29yYXRvciBjb25maWcpLlxuICpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIEBDb21wb25lbnQoe1xuICogICBzdGFuZGFsb25lOiB0cnVlLFxuICogICB0ZW1wbGF0ZTogJ0hlbGxvIHdvcmxkISdcbiAqIH0pXG4gKiBjbGFzcyBSb290Q29tcG9uZW50IHt9XG4gKlxuICogY29uc3QgYXBwUmVmOiBBcHBsaWNhdGlvblJlZiA9IGF3YWl0IGJvb3RzdHJhcEFwcGxpY2F0aW9uKFJvb3RDb21wb25lbnQpO1xuICogYGBgXG4gKlxuICogWW91IGNhbiBhZGQgdGhlIGxpc3Qgb2YgcHJvdmlkZXJzIHRoYXQgc2hvdWxkIGJlIGF2YWlsYWJsZSBpbiB0aGUgYXBwbGljYXRpb24gaW5qZWN0b3IgYnlcbiAqIHNwZWNpZnlpbmcgdGhlIGBwcm92aWRlcnNgIGZpZWxkIGluIGFuIG9iamVjdCBwYXNzZWQgYXMgdGhlIHNlY29uZCBhcmd1bWVudDpcbiAqXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBhd2FpdCBib290c3RyYXBBcHBsaWNhdGlvbihSb290Q29tcG9uZW50LCB7XG4gKiAgIHByb3ZpZGVyczogW1xuICogICAgIHtwcm92aWRlOiBCQUNLRU5EX1VSTCwgdXNlVmFsdWU6ICdodHRwczovL3lvdXJkb21haW4uY29tL2FwaSd9XG4gKiAgIF1cbiAqIH0pO1xuICogYGBgXG4gKlxuICogVGhlIGBpbXBvcnRQcm92aWRlcnNGcm9tYCBoZWxwZXIgbWV0aG9kIGNhbiBiZSB1c2VkIHRvIGNvbGxlY3QgYWxsIHByb3ZpZGVycyBmcm9tIGFueVxuICogZXhpc3RpbmcgTmdNb2R1bGUgKGFuZCB0cmFuc2l0aXZlbHkgZnJvbSBhbGwgTmdNb2R1bGVzIHRoYXQgaXQgaW1wb3J0cyk6XG4gKlxuICogYGBgdHlwZXNjcmlwdFxuICogYXdhaXQgYm9vdHN0cmFwQXBwbGljYXRpb24oUm9vdENvbXBvbmVudCwge1xuICogICBwcm92aWRlcnM6IFtcbiAqICAgICBpbXBvcnRQcm92aWRlcnNGcm9tKFNvbWVOZ01vZHVsZSlcbiAqICAgXVxuICogfSk7XG4gKiBgYGBcbiAqXG4gKiBOb3RlOiB0aGUgYGJvb3RzdHJhcEFwcGxpY2F0aW9uYCBtZXRob2QgZG9lc24ndCBpbmNsdWRlIFtUZXN0YWJpbGl0eV0oYXBpL2NvcmUvVGVzdGFiaWxpdHkpIGJ5XG4gKiBkZWZhdWx0LiBZb3UgY2FuIGFkZCBbVGVzdGFiaWxpdHldKGFwaS9jb3JlL1Rlc3RhYmlsaXR5KSBieSBnZXR0aW5nIHRoZSBsaXN0IG9mIG5lY2Vzc2FyeVxuICogcHJvdmlkZXJzIHVzaW5nIGBwcm92aWRlUHJvdHJhY3RvclRlc3RpbmdTdXBwb3J0KClgIGZ1bmN0aW9uIGFuZCBhZGRpbmcgdGhlbSBpbnRvIHRoZSBgcHJvdmlkZXJzYFxuICogYXJyYXksIGZvciBleGFtcGxlOlxuICpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIGltcG9ydCB7cHJvdmlkZVByb3RyYWN0b3JUZXN0aW5nU3VwcG9ydH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG4gKlxuICogYXdhaXQgYm9vdHN0cmFwQXBwbGljYXRpb24oUm9vdENvbXBvbmVudCwge3Byb3ZpZGVyczogW3Byb3ZpZGVQcm90cmFjdG9yVGVzdGluZ1N1cHBvcnQoKV19KTtcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSByb290Q29tcG9uZW50IEEgcmVmZXJlbmNlIHRvIGEgc3RhbmRhbG9uZSBjb21wb25lbnQgdGhhdCBzaG91bGQgYmUgcmVuZGVyZWQuXG4gKiBAcGFyYW0gb3B0aW9ucyBFeHRyYSBjb25maWd1cmF0aW9uIGZvciB0aGUgYm9vdHN0cmFwIG9wZXJhdGlvbiwgc2VlIGBBcHBsaWNhdGlvbkNvbmZpZ2AgZm9yXG4gKiAgICAgYWRkaXRpb25hbCBpbmZvLlxuICogQHJldHVybnMgQSBwcm9taXNlIHRoYXQgcmV0dXJucyBhbiBgQXBwbGljYXRpb25SZWZgIGluc3RhbmNlIG9uY2UgcmVzb2x2ZWQuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgZnVuY3Rpb24gYm9vdHN0cmFwQXBwbGljYXRpb24oXG4gICAgcm9vdENvbXBvbmVudDogVHlwZTx1bmtub3duPiwgb3B0aW9ucz86IEFwcGxpY2F0aW9uQ29uZmlnKTogUHJvbWlzZTxBcHBsaWNhdGlvblJlZj4ge1xuICByZXR1cm4gaW50ZXJuYWxDcmVhdGVBcHBsaWNhdGlvbih7cm9vdENvbXBvbmVudCwgLi4uY3JlYXRlUHJvdmlkZXJzQ29uZmlnKG9wdGlvbnMpfSk7XG59XG5cbi8qKlxuICogQ3JlYXRlIGFuIGluc3RhbmNlIG9mIGFuIEFuZ3VsYXIgYXBwbGljYXRpb24gd2l0aG91dCBib290c3RyYXBwaW5nIGFueSBjb21wb25lbnRzLiBUaGlzIGlzIHVzZWZ1bFxuICogZm9yIHRoZSBzaXR1YXRpb24gd2hlcmUgb25lIHdhbnRzIHRvIGRlY291cGxlIGFwcGxpY2F0aW9uIGVudmlyb25tZW50IGNyZWF0aW9uIChhIHBsYXRmb3JtIGFuZFxuICogYXNzb2NpYXRlZCBpbmplY3RvcnMpIGZyb20gcmVuZGVyaW5nIGNvbXBvbmVudHMgb24gYSBzY3JlZW4uIENvbXBvbmVudHMgY2FuIGJlIHN1YnNlcXVlbnRseVxuICogYm9vdHN0cmFwcGVkIG9uIHRoZSByZXR1cm5lZCBgQXBwbGljYXRpb25SZWZgLlxuICpcbiAqIEBwYXJhbSBvcHRpb25zIEV4dHJhIGNvbmZpZ3VyYXRpb24gZm9yIHRoZSBhcHBsaWNhdGlvbiBlbnZpcm9ubWVudCwgc2VlIGBBcHBsaWNhdGlvbkNvbmZpZ2AgZm9yXG4gKiAgICAgYWRkaXRpb25hbCBpbmZvLlxuICogQHJldHVybnMgQSBwcm9taXNlIHRoYXQgcmV0dXJucyBhbiBgQXBwbGljYXRpb25SZWZgIGluc3RhbmNlIG9uY2UgcmVzb2x2ZWQuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQXBwbGljYXRpb24ob3B0aW9ucz86IEFwcGxpY2F0aW9uQ29uZmlnKSB7XG4gIHJldHVybiBpbnRlcm5hbENyZWF0ZUFwcGxpY2F0aW9uKGNyZWF0ZVByb3ZpZGVyc0NvbmZpZyhvcHRpb25zKSk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVByb3ZpZGVyc0NvbmZpZyhvcHRpb25zPzogQXBwbGljYXRpb25Db25maWcpIHtcbiAgcmV0dXJuIHtcbiAgICBhcHBQcm92aWRlcnM6IFtcbiAgICAgIC4uLkJST1dTRVJfTU9EVUxFX1BST1ZJREVSUyxcbiAgICAgIC4uLihvcHRpb25zPy5wcm92aWRlcnMgPz8gW10pLFxuICAgIF0sXG4gICAgcGxhdGZvcm1Qcm92aWRlcnM6IElOVEVSTkFMX0JST1dTRVJfUExBVEZPUk1fUFJPVklERVJTXG4gIH07XG59XG5cbi8qKlxuICogUmV0dXJucyBhIHNldCBvZiBwcm92aWRlcnMgcmVxdWlyZWQgdG8gc2V0dXAgW1Rlc3RhYmlsaXR5XShhcGkvY29yZS9UZXN0YWJpbGl0eSkgZm9yIGFuXG4gKiBhcHBsaWNhdGlvbiBib290c3RyYXBwZWQgdXNpbmcgdGhlIGBib290c3RyYXBBcHBsaWNhdGlvbmAgZnVuY3Rpb24uIFRoZSBzZXQgb2YgcHJvdmlkZXJzIGlzXG4gKiBuZWVkZWQgdG8gc3VwcG9ydCB0ZXN0aW5nIGFuIGFwcGxpY2F0aW9uIHdpdGggUHJvdHJhY3RvciAod2hpY2ggcmVsaWVzIG9uIHRoZSBUZXN0YWJpbGl0eSBBUElzXG4gKiB0byBiZSBwcmVzZW50KS5cbiAqXG4gKiBAcmV0dXJucyBBbiBhcnJheSBvZiBwcm92aWRlcnMgcmVxdWlyZWQgdG8gc2V0dXAgVGVzdGFiaWxpdHkgZm9yIGFuIGFwcGxpY2F0aW9uIGFuZCBtYWtlIGl0XG4gKiAgICAgYXZhaWxhYmxlIGZvciB0ZXN0aW5nIHVzaW5nIFByb3RyYWN0b3IuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgZnVuY3Rpb24gcHJvdmlkZVByb3RyYWN0b3JUZXN0aW5nU3VwcG9ydCgpOiBQcm92aWRlcltdIHtcbiAgLy8gUmV0dXJuIGEgY29weSB0byBwcmV2ZW50IGNoYW5nZXMgdG8gdGhlIG9yaWdpbmFsIGFycmF5IGluIGNhc2UgYW55IGluLXBsYWNlXG4gIC8vIGFsdGVyYXRpb25zIGFyZSBwZXJmb3JtZWQgdG8gdGhlIGBwcm92aWRlUHJvdHJhY3RvclRlc3RpbmdTdXBwb3J0YCBjYWxsIHJlc3VsdHMgaW4gYXBwIGNvZGUuXG4gIHJldHVybiBbLi4uVEVTVEFCSUxJVFlfUFJPVklERVJTXTtcbn1cblxuLyoqXG4gKiAjIEVuYWJsZSBIeWRyYXRpb24gU3VwcG9ydFxuICpcbiAqIFJldHVybnMgYSBzZXQgb2YgcHJvdmlkZXJzIHJlcXVpcmVkIHRvIHNldHVwIGh5ZHJhdGlvbiBzdXBwb3J0IGZvciBhbiBhcHBsaWNhdGlvbiB0aGF0IGlzXG4gKiBzZXJ2ZXIgc2lkZSByZW5kZXJlZC4gSXQgY2FuIGJlIHNhZmVseSBhZGRlZCB0byBib3RoIHNlcnZlciBhbmQgY2xpZW50IHByb3ZpZGVycyBsaXN0cy5cbiAqXG4gKiAjIyBOZ01vZHVsZS1iYXNlZCBib290c3RyYXBcbiAqXG4gKiBZb3UgY2FuIGFkZCB0aGUgZnVuY3Rpb24gY2FsbCB0byB0aGUgcm9vdCBBcHBNb2R1bGUgb2YgYW4gYXBwbGljYXRpb246XG4gKiBgYGBcbiAqIGltcG9ydCB7cHJvdmlkZUh5ZHJhdGlvblN1cHBvcnR9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuICpcbiAqIEBOZ01vZHVsZSh7XG4gKiAgIHByb3ZpZGVyczogW1xuICogICAgIC8vIC4uLiBvdGhlciBwcm92aWRlcnMgLi4uXG4gKiAgICAgcHJvdmlkZUh5ZHJhdGlvblN1cHBvcnQoKVxuICogICBdLFxuICogICBkZWNsYXJhdGlvbnM6IFtBcHBDb21wb25lbnRdLFxuICogICBib290c3RyYXA6IFtBcHBDb21wb25lbnRdXG4gKiB9KVxuICogY2xhc3MgQXBwTW9kdWxlIHt9XG4gKiBgYGBcbiAqXG4gKiAjIyBTdGFuZGFsb25lLWJhc2VkIGJvb3RzdHJhcFxuICpcbiAqIEFkZCB0aGUgZnVuY3Rpb24gdG8gdGhlIGBib290c3RyYXBBcHBsaWNhdGlvbmAgY2FsbDpcbiAqIGBgYFxuICogaW1wb3J0IHtwcm92aWRlSHlkcmF0aW9uU3VwcG9ydH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG4gKlxuICogYm9vdHN0cmFwQXBwbGljYXRpb24oUm9vdENvbXBvbmVudCwge1xuICogICBwcm92aWRlcnM6IFtcbiAqICAgICAvLyAuLi4gb3RoZXIgcHJvdmlkZXJzIC4uLlxuICogICAgIHByb3ZpZGVIeWRyYXRpb25TdXBwb3J0KClcbiAqICAgXVxuICogfSk7XG4gKiBgYGBcbiAqXG4gKiBUaGUgZnVuY3Rpb24gc2V0cyB1cCBhbiBpbnRlcm5hbCBmbGFnIHRoYXQgd291bGQgYmUgcmVjb2duaXplZCBkdXJpbmcgU1NSIHRpbWUgYXMgd2VsbCxcbiAqIHNvIHRoZXJlIGlzIG5vIG5lZWQgdG8gY29uZmlndXJlIG9yIGNoYW5nZSBhbnl0aGluZyBpbiBOZ1VuaXZlcnNhbCB0byBlbmFibGUgdGhlIGZlYXR1cmUuXG4gKlxuICogIyMgSG93IHRvIHNraXAgaHlkcmF0aW9uIGZvciBhIHBhcnRpY3VsYXIgY29tcG9uZW50P1xuICpcbiAqIElmIHlvdSBuZWVkIHRvIGRpc2FibGUgaHlkcmF0aW9uIGZvciBhIGNvbXBvbmVudCBmb3IgYW55IHJlYXNvbiAoZXJyb3JzLCBET00gTWFuaXB1bGF0aW9uLFxuICogICBldGMpLCB5b3UgY2FuIGFkZCBgbmdTa2lwSHlkcmF0aW9uYCB0byB0aGUgaG9zdCBlbGVtZW50LiBZb3UgY2FuIGVpdGhlciBhZGQgaXQgYXMgYW5cbiAqICAgYXR0cmlidXRlIG9yIHNldCBpdCBhcyBhIGhvc3QgYmluZGluZy5cbiAqXG4gKiBUbyBvcHQtb3V0IGEgc3BlY2lmaWMgaW5zdGFuY2Ugb2YgYSBjb21wb25lbnQsIHlvdSBjYW4gdXNlIHRoZSBmbGFnIGluIGEgdGVtcGxhdGU6XG4gKiBgYGBcbiAqIDxncmVldGluZ3MtY21wIG5nU2tpcEh5ZHJhdGlvbiAvPlxuICogYGBgXG4gKlxuICogVG8gb3B0LW91dCBhbGwgY29tcG9uZW50IGluc3RhbmNlcywgeW91IGNhbiBzZXQgdGhpcyBmbGFnIHZpYSBob3N0IGJpbmRpbmdzOlxuICogYGBgXG4gKiBAQ29tcG9uZW50KHtcbiAqICAgc2VsZWN0b3I6ICdncmVldGluZ3MtY21wJyxcbiAqICAgdGVtcGxhdGU6IGA8aDE+SGkhPC9oMT5gLFxuICogICBob3N0OiB7J25nU2tpcEh5ZHJhdGlvbic6ICd0cnVlJ31cbiAqIH0pXG4gKiBjbGFzcyBHcmVldGluZ0NvbXBvbmVudCB7fVxuICogYGBgXG4gKlxuICogQHJldHVybnMgQW4gYXJyYXkgb2YgcHJvdmlkZXJzIHJlcXVpcmVkIHRvIHNldHVwIGFuZCBlbmFibGUgaHlkcmF0aW9uIGZvciBhIHNlcnZlciBzaWRlXG4gKiAgICAgcmVuZGVyZWQgYXBwbGljYXRpb24uXG4gKlxuICogQHB1YmxpY0FwaVxuICogQGRldmVsb3BlclByZXZpZXdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHByb3ZpZGVIeWRyYXRpb25TdXBwb3J0KCk6IEVudmlyb25tZW50UHJvdmlkZXJzIHtcbiAgcmV0dXJuIG1ha2VFbnZpcm9ubWVudFByb3ZpZGVycyhbXG4gICAgLi4uaW50ZXJuYWxQcm92aWRlSHlkcmF0aW9uU3VwcG9ydCgpLFxuICAgIHtwcm92aWRlOiBUUkFOU0ZFUl9TVEFURSwgdXNlRmFjdG9yeTogKCkgPT4gaW5qZWN0KFRyYW5zZmVyU3RhdGUpfVxuICBdKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluaXREb21BZGFwdGVyKCkge1xuICBCcm93c2VyRG9tQWRhcHRlci5tYWtlQ3VycmVudCgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZXJyb3JIYW5kbGVyKCk6IEVycm9ySGFuZGxlciB7XG4gIHJldHVybiBuZXcgRXJyb3JIYW5kbGVyKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfZG9jdW1lbnQoKTogYW55IHtcbiAgLy8gVGVsbCBpdnkgYWJvdXQgdGhlIGdsb2JhbCBkb2N1bWVudFxuICDJtXNldERvY3VtZW50KGRvY3VtZW50KTtcbiAgcmV0dXJuIGRvY3VtZW50O1xufVxuXG5leHBvcnQgY29uc3QgSU5URVJOQUxfQlJPV1NFUl9QTEFURk9STV9QUk9WSURFUlM6IFN0YXRpY1Byb3ZpZGVyW10gPSBbXG4gIHtwcm92aWRlOiBQTEFURk9STV9JRCwgdXNlVmFsdWU6IFBMQVRGT1JNX0JST1dTRVJfSUR9LFxuICB7cHJvdmlkZTogUExBVEZPUk1fSU5JVElBTElaRVIsIHVzZVZhbHVlOiBpbml0RG9tQWRhcHRlciwgbXVsdGk6IHRydWV9LFxuICB7cHJvdmlkZTogRE9DVU1FTlQsIHVzZUZhY3Rvcnk6IF9kb2N1bWVudCwgZGVwczogW119LFxuXTtcblxuLyoqXG4gKiBBIGZhY3RvcnkgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgYFBsYXRmb3JtUmVmYCBpbnN0YW5jZSBhc3NvY2lhdGVkIHdpdGggYnJvd3NlciBzZXJ2aWNlXG4gKiBwcm92aWRlcnMuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgY29uc3QgcGxhdGZvcm1Ccm93c2VyOiAoZXh0cmFQcm92aWRlcnM/OiBTdGF0aWNQcm92aWRlcltdKSA9PiBQbGF0Zm9ybVJlZiA9XG4gICAgY3JlYXRlUGxhdGZvcm1GYWN0b3J5KHBsYXRmb3JtQ29yZSwgJ2Jyb3dzZXInLCBJTlRFUk5BTF9CUk9XU0VSX1BMQVRGT1JNX1BST1ZJREVSUyk7XG5cbi8qKlxuICogSW50ZXJuYWwgbWFya2VyIHRvIHNpZ25hbCB3aGV0aGVyIHByb3ZpZGVycyBmcm9tIHRoZSBgQnJvd3Nlck1vZHVsZWAgYXJlIGFscmVhZHkgcHJlc2VudCBpbiBESS5cbiAqIFRoaXMgaXMgbmVlZGVkIHRvIGF2b2lkIGxvYWRpbmcgYEJyb3dzZXJNb2R1bGVgIHByb3ZpZGVycyB0d2ljZS4gV2UgY2FuJ3QgcmVseSBvbiB0aGVcbiAqIGBCcm93c2VyTW9kdWxlYCBwcmVzZW5jZSBpdHNlbGYsIHNpbmNlIHRoZSBzdGFuZGFsb25lLWJhc2VkIGJvb3RzdHJhcCBqdXN0IGltcG9ydHNcbiAqIGBCcm93c2VyTW9kdWxlYCBwcm92aWRlcnMgd2l0aG91dCByZWZlcmVuY2luZyB0aGUgbW9kdWxlIGl0c2VsZi5cbiAqL1xuY29uc3QgQlJPV1NFUl9NT0RVTEVfUFJPVklERVJTX01BUktFUiA9XG4gICAgbmV3IEluamVjdGlvblRva2VuKE5HX0RFVl9NT0RFID8gJ0Jyb3dzZXJNb2R1bGUgUHJvdmlkZXJzIE1hcmtlcicgOiAnJyk7XG5cbmNvbnN0IFRFU1RBQklMSVRZX1BST1ZJREVSUyA9IFtcbiAge1xuICAgIHByb3ZpZGU6IFRFU1RBQklMSVRZX0dFVFRFUixcbiAgICB1c2VDbGFzczogQnJvd3NlckdldFRlc3RhYmlsaXR5LFxuICAgIGRlcHM6IFtdLFxuICB9LFxuICB7XG4gICAgcHJvdmlkZTogVEVTVEFCSUxJVFksXG4gICAgdXNlQ2xhc3M6IFRlc3RhYmlsaXR5LFxuICAgIGRlcHM6IFtOZ1pvbmUsIFRlc3RhYmlsaXR5UmVnaXN0cnksIFRFU1RBQklMSVRZX0dFVFRFUl1cbiAgfSxcbiAge1xuICAgIHByb3ZpZGU6IFRlc3RhYmlsaXR5LCAgLy8gQWxzbyBwcm92aWRlIGFzIGBUZXN0YWJpbGl0eWAgZm9yIGJhY2t3YXJkcy1jb21wYXRpYmlsaXR5LlxuICAgIHVzZUNsYXNzOiBUZXN0YWJpbGl0eSxcbiAgICBkZXBzOiBbTmdab25lLCBUZXN0YWJpbGl0eVJlZ2lzdHJ5LCBURVNUQUJJTElUWV9HRVRURVJdXG4gIH1cbl07XG5cbmNvbnN0IEJST1dTRVJfTU9EVUxFX1BST1ZJREVSUzogUHJvdmlkZXJbXSA9IFtcbiAge3Byb3ZpZGU6IElOSkVDVE9SX1NDT1BFLCB1c2VWYWx1ZTogJ3Jvb3QnfSxcbiAge3Byb3ZpZGU6IEVycm9ySGFuZGxlciwgdXNlRmFjdG9yeTogZXJyb3JIYW5kbGVyLCBkZXBzOiBbXX0sIHtcbiAgICBwcm92aWRlOiBFVkVOVF9NQU5BR0VSX1BMVUdJTlMsXG4gICAgdXNlQ2xhc3M6IERvbUV2ZW50c1BsdWdpbixcbiAgICBtdWx0aTogdHJ1ZSxcbiAgICBkZXBzOiBbRE9DVU1FTlQsIE5nWm9uZSwgUExBVEZPUk1fSURdXG4gIH0sXG4gIHtwcm92aWRlOiBFVkVOVF9NQU5BR0VSX1BMVUdJTlMsIHVzZUNsYXNzOiBLZXlFdmVudHNQbHVnaW4sIG11bHRpOiB0cnVlLCBkZXBzOiBbRE9DVU1FTlRdfSwge1xuICAgIHByb3ZpZGU6IERvbVJlbmRlcmVyRmFjdG9yeTIsXG4gICAgdXNlQ2xhc3M6IERvbVJlbmRlcmVyRmFjdG9yeTIsXG4gICAgZGVwczogW0V2ZW50TWFuYWdlciwgRG9tU2hhcmVkU3R5bGVzSG9zdCwgQVBQX0lELCBSRU1PVkVfU1RZTEVTX09OX0NPTVBPTkVOVF9ERVNUUk9ZXVxuICB9LFxuICB7cHJvdmlkZTogUmVuZGVyZXJGYWN0b3J5MiwgdXNlRXhpc3Rpbmc6IERvbVJlbmRlcmVyRmFjdG9yeTJ9LFxuICB7cHJvdmlkZTogU2hhcmVkU3R5bGVzSG9zdCwgdXNlRXhpc3Rpbmc6IERvbVNoYXJlZFN0eWxlc0hvc3R9LCBEb21TaGFyZWRTdHlsZXNIb3N0LCBFdmVudE1hbmFnZXIsXG4gIHtwcm92aWRlOiBYaHJGYWN0b3J5LCB1c2VDbGFzczogQnJvd3NlclhociwgZGVwczogW119LFxuICBOR19ERVZfTU9ERSA/IHtwcm92aWRlOiBCUk9XU0VSX01PRFVMRV9QUk9WSURFUlNfTUFSS0VSLCB1c2VWYWx1ZTogdHJ1ZX0gOiBbXVxuXTtcblxuLyoqXG4gKiBFeHBvcnRzIHJlcXVpcmVkIGluZnJhc3RydWN0dXJlIGZvciBhbGwgQW5ndWxhciBhcHBzLlxuICogSW5jbHVkZWQgYnkgZGVmYXVsdCBpbiBhbGwgQW5ndWxhciBhcHBzIGNyZWF0ZWQgd2l0aCB0aGUgQ0xJXG4gKiBgbmV3YCBjb21tYW5kLlxuICogUmUtZXhwb3J0cyBgQ29tbW9uTW9kdWxlYCBhbmQgYEFwcGxpY2F0aW9uTW9kdWxlYCwgbWFraW5nIHRoZWlyXG4gKiBleHBvcnRzIGFuZCBwcm92aWRlcnMgYXZhaWxhYmxlIHRvIGFsbCBhcHBzLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuQE5nTW9kdWxlKHtcbiAgcHJvdmlkZXJzOiBbLi4uQlJPV1NFUl9NT0RVTEVfUFJPVklERVJTLCAuLi5URVNUQUJJTElUWV9QUk9WSURFUlNdLFxuICBleHBvcnRzOiBbQ29tbW9uTW9kdWxlLCBBcHBsaWNhdGlvbk1vZHVsZV0sXG59KVxuZXhwb3J0IGNsYXNzIEJyb3dzZXJNb2R1bGUge1xuICBjb25zdHJ1Y3RvcihAT3B0aW9uYWwoKSBAU2tpcFNlbGYoKSBASW5qZWN0KEJST1dTRVJfTU9EVUxFX1BST1ZJREVSU19NQVJLRVIpXG4gICAgICAgICAgICAgIHByb3ZpZGVyc0FscmVhZHlQcmVzZW50OiBib29sZWFufG51bGwpIHtcbiAgICBpZiAoTkdfREVWX01PREUgJiYgcHJvdmlkZXJzQWxyZWFkeVByZXNlbnQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgUHJvdmlkZXJzIGZyb20gdGhlIFxcYEJyb3dzZXJNb2R1bGVcXGAgaGF2ZSBhbHJlYWR5IGJlZW4gbG9hZGVkLiBJZiB5b3UgbmVlZCBhY2Nlc3MgYCArXG4gICAgICAgICAgYHRvIGNvbW1vbiBkaXJlY3RpdmVzIHN1Y2ggYXMgTmdJZiBhbmQgTmdGb3IsIGltcG9ydCB0aGUgXFxgQ29tbW9uTW9kdWxlXFxgIGluc3RlYWQuYCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyZXMgYSBicm93c2VyLWJhc2VkIGFwcCB0byB0cmFuc2l0aW9uIGZyb20gYSBzZXJ2ZXItcmVuZGVyZWQgYXBwLCBpZlxuICAgKiBvbmUgaXMgcHJlc2VudCBvbiB0aGUgcGFnZS5cbiAgICpcbiAgICogQHBhcmFtIHBhcmFtcyBBbiBvYmplY3QgY29udGFpbmluZyBhbiBpZGVudGlmaWVyIGZvciB0aGUgYXBwIHRvIHRyYW5zaXRpb24uXG4gICAqIFRoZSBJRCBtdXN0IG1hdGNoIGJldHdlZW4gdGhlIGNsaWVudCBhbmQgc2VydmVyIHZlcnNpb25zIG9mIHRoZSBhcHAuXG4gICAqIEByZXR1cm5zIFRoZSByZWNvbmZpZ3VyZWQgYEJyb3dzZXJNb2R1bGVgIHRvIGltcG9ydCBpbnRvIHRoZSBhcHAncyByb290IGBBcHBNb2R1bGVgLlxuICAgKi9cbiAgc3RhdGljIHdpdGhTZXJ2ZXJUcmFuc2l0aW9uKHBhcmFtczoge2FwcElkOiBzdHJpbmd9KTogTW9kdWxlV2l0aFByb3ZpZGVyczxCcm93c2VyTW9kdWxlPiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBCcm93c2VyTW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIHtwcm92aWRlOiBBUFBfSUQsIHVzZVZhbHVlOiBwYXJhbXMuYXBwSWR9LFxuICAgICAgXSxcbiAgICB9O1xuICB9XG59XG4iXX0=