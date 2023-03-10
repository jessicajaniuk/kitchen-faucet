/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { $INJECTOR, INJECTOR_KEY } from './constants';
import { getTypeName, isFunction, validateInjectionKey } from './util';
/**
 * @description
 *
 * A helper function to allow an Angular service to be accessible from AngularJS.
 *
 * *Part of the [upgrade/static](api?query=upgrade%2Fstatic)
 * library for hybrid upgrade apps that support AOT compilation*
 *
 * This helper function returns a factory function that provides access to the Angular
 * service identified by the `token` parameter.
 *
 * @usageNotes
 * ### Examples
 *
 * First ensure that the service to be downgraded is provided in an `NgModule`
 * that will be part of the upgrade application. For example, let's assume we have
 * defined `HeroesService`
 *
 * {@example upgrade/static/ts/full/module.ts region="ng2-heroes-service"}
 *
 * and that we have included this in our upgrade app `NgModule`
 *
 * {@example upgrade/static/ts/full/module.ts region="ng2-module"}
 *
 * Now we can register the `downgradeInjectable` factory function for the service
 * on an AngularJS module.
 *
 * {@example upgrade/static/ts/full/module.ts region="downgrade-ng2-heroes-service"}
 *
 * Inside an AngularJS component's controller we can get hold of the
 * downgraded service via the name we gave when downgrading.
 *
 * {@example upgrade/static/ts/full/module.ts region="example-app"}
 *
 * <div class="alert is-important">
 *
 *   When using `downgradeModule()`, downgraded injectables will not be available until the Angular
 *   module that provides them is instantiated. In order to be safe, you need to ensure that the
 *   downgraded injectables are not used anywhere _outside_ the part of the app where it is
 *   guaranteed that their module has been instantiated.
 *
 *   For example, it is _OK_ to use a downgraded service in an upgraded component that is only used
 *   from a downgraded Angular component provided by the same Angular module as the injectable, but
 *   it is _not OK_ to use it in an AngularJS component that may be used independently of Angular or
 *   use it in a downgraded Angular component from a different module.
 *
 * </div>
 *
 * @param token an `InjectionToken` that identifies a service provided from Angular.
 * @param downgradedModule the name of the downgraded module (if any) that the injectable
 * "belongs to", as returned by a call to `downgradeModule()`. It is the module, whose injector will
 * be used for instantiating the injectable.<br />
 * (This option is only necessary when using `downgradeModule()` to downgrade more than one Angular
 * module.)
 *
 * @returns a [factory function](https://docs.angularjs.org/guide/di) that can be
 * used to register the service on an AngularJS module.
 *
 * @publicApi
 */
export function downgradeInjectable(token, downgradedModule = '') {
    const factory = function ($injector) {
        const injectorKey = `${INJECTOR_KEY}${downgradedModule}`;
        const injectableName = isFunction(token) ? getTypeName(token) : String(token);
        const attemptedAction = `instantiating injectable '${injectableName}'`;
        validateInjectionKey($injector, downgradedModule, injectorKey, attemptedAction);
        try {
            const injector = $injector.get(injectorKey);
            return injector.get(token);
        }
        catch (err) {
            throw new Error(`Error while ${attemptedAction}: ${err.message || err}`);
        }
    };
    factory['$inject'] = [$INJECTOR];
    return factory;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG93bmdyYWRlX2luamVjdGFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy91cGdyYWRlL3NyYy9jb21tb24vc3JjL2Rvd25ncmFkZV9pbmplY3RhYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUtILE9BQU8sRUFBQyxTQUFTLEVBQUUsWUFBWSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQ3BELE9BQU8sRUFBQyxXQUFXLEVBQUUsVUFBVSxFQUFFLG9CQUFvQixFQUFDLE1BQU0sUUFBUSxDQUFDO0FBRXJFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTJERztBQUNILE1BQU0sVUFBVSxtQkFBbUIsQ0FBQyxLQUFVLEVBQUUsbUJBQTJCLEVBQUU7SUFDM0UsTUFBTSxPQUFPLEdBQUcsVUFBUyxTQUEyQjtRQUNsRCxNQUFNLFdBQVcsR0FBRyxHQUFHLFlBQVksR0FBRyxnQkFBZ0IsRUFBRSxDQUFDO1FBQ3pELE1BQU0sY0FBYyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUUsTUFBTSxlQUFlLEdBQUcsNkJBQTZCLGNBQWMsR0FBRyxDQUFDO1FBRXZFLG9CQUFvQixDQUFDLFNBQVMsRUFBRSxnQkFBZ0IsRUFBRSxXQUFXLEVBQUUsZUFBZSxDQUFDLENBQUM7UUFFaEYsSUFBSTtZQUNGLE1BQU0sUUFBUSxHQUFhLFNBQVMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDdEQsT0FBTyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzVCO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDWixNQUFNLElBQUksS0FBSyxDQUFDLGVBQWUsZUFBZSxLQUFNLEdBQWEsQ0FBQyxPQUFPLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBQztTQUNyRjtJQUNILENBQUMsQ0FBQztJQUNELE9BQWUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBRTFDLE9BQU8sT0FBTyxDQUFDO0FBQ2pCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtJbmplY3Rvcn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7SUluamVjdG9yU2VydmljZX0gZnJvbSAnLi9hbmd1bGFyMSc7XG5pbXBvcnQgeyRJTkpFQ1RPUiwgSU5KRUNUT1JfS0VZfSBmcm9tICcuL2NvbnN0YW50cyc7XG5pbXBvcnQge2dldFR5cGVOYW1lLCBpc0Z1bmN0aW9uLCB2YWxpZGF0ZUluamVjdGlvbktleX0gZnJvbSAnLi91dGlsJztcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqXG4gKiBBIGhlbHBlciBmdW5jdGlvbiB0byBhbGxvdyBhbiBBbmd1bGFyIHNlcnZpY2UgdG8gYmUgYWNjZXNzaWJsZSBmcm9tIEFuZ3VsYXJKUy5cbiAqXG4gKiAqUGFydCBvZiB0aGUgW3VwZ3JhZGUvc3RhdGljXShhcGk/cXVlcnk9dXBncmFkZSUyRnN0YXRpYylcbiAqIGxpYnJhcnkgZm9yIGh5YnJpZCB1cGdyYWRlIGFwcHMgdGhhdCBzdXBwb3J0IEFPVCBjb21waWxhdGlvbipcbiAqXG4gKiBUaGlzIGhlbHBlciBmdW5jdGlvbiByZXR1cm5zIGEgZmFjdG9yeSBmdW5jdGlvbiB0aGF0IHByb3ZpZGVzIGFjY2VzcyB0byB0aGUgQW5ndWxhclxuICogc2VydmljZSBpZGVudGlmaWVkIGJ5IHRoZSBgdG9rZW5gIHBhcmFtZXRlci5cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICogIyMjIEV4YW1wbGVzXG4gKlxuICogRmlyc3QgZW5zdXJlIHRoYXQgdGhlIHNlcnZpY2UgdG8gYmUgZG93bmdyYWRlZCBpcyBwcm92aWRlZCBpbiBhbiBgTmdNb2R1bGVgXG4gKiB0aGF0IHdpbGwgYmUgcGFydCBvZiB0aGUgdXBncmFkZSBhcHBsaWNhdGlvbi4gRm9yIGV4YW1wbGUsIGxldCdzIGFzc3VtZSB3ZSBoYXZlXG4gKiBkZWZpbmVkIGBIZXJvZXNTZXJ2aWNlYFxuICpcbiAqIHtAZXhhbXBsZSB1cGdyYWRlL3N0YXRpYy90cy9mdWxsL21vZHVsZS50cyByZWdpb249XCJuZzItaGVyb2VzLXNlcnZpY2VcIn1cbiAqXG4gKiBhbmQgdGhhdCB3ZSBoYXZlIGluY2x1ZGVkIHRoaXMgaW4gb3VyIHVwZ3JhZGUgYXBwIGBOZ01vZHVsZWBcbiAqXG4gKiB7QGV4YW1wbGUgdXBncmFkZS9zdGF0aWMvdHMvZnVsbC9tb2R1bGUudHMgcmVnaW9uPVwibmcyLW1vZHVsZVwifVxuICpcbiAqIE5vdyB3ZSBjYW4gcmVnaXN0ZXIgdGhlIGBkb3duZ3JhZGVJbmplY3RhYmxlYCBmYWN0b3J5IGZ1bmN0aW9uIGZvciB0aGUgc2VydmljZVxuICogb24gYW4gQW5ndWxhckpTIG1vZHVsZS5cbiAqXG4gKiB7QGV4YW1wbGUgdXBncmFkZS9zdGF0aWMvdHMvZnVsbC9tb2R1bGUudHMgcmVnaW9uPVwiZG93bmdyYWRlLW5nMi1oZXJvZXMtc2VydmljZVwifVxuICpcbiAqIEluc2lkZSBhbiBBbmd1bGFySlMgY29tcG9uZW50J3MgY29udHJvbGxlciB3ZSBjYW4gZ2V0IGhvbGQgb2YgdGhlXG4gKiBkb3duZ3JhZGVkIHNlcnZpY2UgdmlhIHRoZSBuYW1lIHdlIGdhdmUgd2hlbiBkb3duZ3JhZGluZy5cbiAqXG4gKiB7QGV4YW1wbGUgdXBncmFkZS9zdGF0aWMvdHMvZnVsbC9tb2R1bGUudHMgcmVnaW9uPVwiZXhhbXBsZS1hcHBcIn1cbiAqXG4gKiA8ZGl2IGNsYXNzPVwiYWxlcnQgaXMtaW1wb3J0YW50XCI+XG4gKlxuICogICBXaGVuIHVzaW5nIGBkb3duZ3JhZGVNb2R1bGUoKWAsIGRvd25ncmFkZWQgaW5qZWN0YWJsZXMgd2lsbCBub3QgYmUgYXZhaWxhYmxlIHVudGlsIHRoZSBBbmd1bGFyXG4gKiAgIG1vZHVsZSB0aGF0IHByb3ZpZGVzIHRoZW0gaXMgaW5zdGFudGlhdGVkLiBJbiBvcmRlciB0byBiZSBzYWZlLCB5b3UgbmVlZCB0byBlbnN1cmUgdGhhdCB0aGVcbiAqICAgZG93bmdyYWRlZCBpbmplY3RhYmxlcyBhcmUgbm90IHVzZWQgYW55d2hlcmUgX291dHNpZGVfIHRoZSBwYXJ0IG9mIHRoZSBhcHAgd2hlcmUgaXQgaXNcbiAqICAgZ3VhcmFudGVlZCB0aGF0IHRoZWlyIG1vZHVsZSBoYXMgYmVlbiBpbnN0YW50aWF0ZWQuXG4gKlxuICogICBGb3IgZXhhbXBsZSwgaXQgaXMgX09LXyB0byB1c2UgYSBkb3duZ3JhZGVkIHNlcnZpY2UgaW4gYW4gdXBncmFkZWQgY29tcG9uZW50IHRoYXQgaXMgb25seSB1c2VkXG4gKiAgIGZyb20gYSBkb3duZ3JhZGVkIEFuZ3VsYXIgY29tcG9uZW50IHByb3ZpZGVkIGJ5IHRoZSBzYW1lIEFuZ3VsYXIgbW9kdWxlIGFzIHRoZSBpbmplY3RhYmxlLCBidXRcbiAqICAgaXQgaXMgX25vdCBPS18gdG8gdXNlIGl0IGluIGFuIEFuZ3VsYXJKUyBjb21wb25lbnQgdGhhdCBtYXkgYmUgdXNlZCBpbmRlcGVuZGVudGx5IG9mIEFuZ3VsYXIgb3JcbiAqICAgdXNlIGl0IGluIGEgZG93bmdyYWRlZCBBbmd1bGFyIGNvbXBvbmVudCBmcm9tIGEgZGlmZmVyZW50IG1vZHVsZS5cbiAqXG4gKiA8L2Rpdj5cbiAqXG4gKiBAcGFyYW0gdG9rZW4gYW4gYEluamVjdGlvblRva2VuYCB0aGF0IGlkZW50aWZpZXMgYSBzZXJ2aWNlIHByb3ZpZGVkIGZyb20gQW5ndWxhci5cbiAqIEBwYXJhbSBkb3duZ3JhZGVkTW9kdWxlIHRoZSBuYW1lIG9mIHRoZSBkb3duZ3JhZGVkIG1vZHVsZSAoaWYgYW55KSB0aGF0IHRoZSBpbmplY3RhYmxlXG4gKiBcImJlbG9uZ3MgdG9cIiwgYXMgcmV0dXJuZWQgYnkgYSBjYWxsIHRvIGBkb3duZ3JhZGVNb2R1bGUoKWAuIEl0IGlzIHRoZSBtb2R1bGUsIHdob3NlIGluamVjdG9yIHdpbGxcbiAqIGJlIHVzZWQgZm9yIGluc3RhbnRpYXRpbmcgdGhlIGluamVjdGFibGUuPGJyIC8+XG4gKiAoVGhpcyBvcHRpb24gaXMgb25seSBuZWNlc3Nhcnkgd2hlbiB1c2luZyBgZG93bmdyYWRlTW9kdWxlKClgIHRvIGRvd25ncmFkZSBtb3JlIHRoYW4gb25lIEFuZ3VsYXJcbiAqIG1vZHVsZS4pXG4gKlxuICogQHJldHVybnMgYSBbZmFjdG9yeSBmdW5jdGlvbl0oaHR0cHM6Ly9kb2NzLmFuZ3VsYXJqcy5vcmcvZ3VpZGUvZGkpIHRoYXQgY2FuIGJlXG4gKiB1c2VkIHRvIHJlZ2lzdGVyIHRoZSBzZXJ2aWNlIG9uIGFuIEFuZ3VsYXJKUyBtb2R1bGUuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgZnVuY3Rpb24gZG93bmdyYWRlSW5qZWN0YWJsZSh0b2tlbjogYW55LCBkb3duZ3JhZGVkTW9kdWxlOiBzdHJpbmcgPSAnJyk6IEZ1bmN0aW9uIHtcbiAgY29uc3QgZmFjdG9yeSA9IGZ1bmN0aW9uKCRpbmplY3RvcjogSUluamVjdG9yU2VydmljZSkge1xuICAgIGNvbnN0IGluamVjdG9yS2V5ID0gYCR7SU5KRUNUT1JfS0VZfSR7ZG93bmdyYWRlZE1vZHVsZX1gO1xuICAgIGNvbnN0IGluamVjdGFibGVOYW1lID0gaXNGdW5jdGlvbih0b2tlbikgPyBnZXRUeXBlTmFtZSh0b2tlbikgOiBTdHJpbmcodG9rZW4pO1xuICAgIGNvbnN0IGF0dGVtcHRlZEFjdGlvbiA9IGBpbnN0YW50aWF0aW5nIGluamVjdGFibGUgJyR7aW5qZWN0YWJsZU5hbWV9J2A7XG5cbiAgICB2YWxpZGF0ZUluamVjdGlvbktleSgkaW5qZWN0b3IsIGRvd25ncmFkZWRNb2R1bGUsIGluamVjdG9yS2V5LCBhdHRlbXB0ZWRBY3Rpb24pO1xuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGluamVjdG9yOiBJbmplY3RvciA9ICRpbmplY3Rvci5nZXQoaW5qZWN0b3JLZXkpO1xuICAgICAgcmV0dXJuIGluamVjdG9yLmdldCh0b2tlbik7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEVycm9yIHdoaWxlICR7YXR0ZW1wdGVkQWN0aW9ufTogJHsoZXJyIGFzIEVycm9yKS5tZXNzYWdlIHx8IGVycn1gKTtcbiAgICB9XG4gIH07XG4gIChmYWN0b3J5IGFzIGFueSlbJyRpbmplY3QnXSA9IFskSU5KRUNUT1JdO1xuXG4gIHJldHVybiBmYWN0b3J5O1xufVxuIl19