/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ɵNG_MOD_DEF } from '@angular/core';
import { element as angularElement } from './angular1';
import { $ROOT_ELEMENT, $ROOT_SCOPE, DOWNGRADED_MODULE_COUNT_KEY, UPGRADE_APP_TYPE_KEY } from './constants';
const DIRECTIVE_PREFIX_REGEXP = /^(?:x|data)[:\-_]/i;
const DIRECTIVE_SPECIAL_CHARS_REGEXP = /[:\-_]+(.)/g;
export function onError(e) {
    // TODO: (misko): We seem to not have a stack trace here!
    if (console.error) {
        console.error(e, e.stack);
    }
    else {
        // tslint:disable-next-line:no-console
        console.log(e, e.stack);
    }
    throw e;
}
/**
 * Clean the jqLite/jQuery data on the element and all its descendants.
 * Equivalent to how jqLite/jQuery invoke `cleanData()` on an Element when removed:
 *   https://github.com/angular/angular.js/blob/2e72ea13fa98bebf6ed4b5e3c45eaf5f990ed16f/src/jqLite.js#L349-L355
 *   https://github.com/jquery/jquery/blob/6984d1747623dbc5e87fd6c261a5b6b1628c107c/src/manipulation.js#L182
 *
 * NOTE:
 * `cleanData()` will also invoke the AngularJS `$destroy` DOM event on the element:
 *   https://github.com/angular/angular.js/blob/2e72ea13fa98bebf6ed4b5e3c45eaf5f990ed16f/src/Angular.js#L1932-L1945
 *
 * @param node The DOM node whose data needs to be cleaned.
 */
export function cleanData(node) {
    angularElement.cleanData([node]);
    if (isParentNode(node)) {
        angularElement.cleanData(node.querySelectorAll('*'));
    }
}
export function controllerKey(name) {
    return '$' + name + 'Controller';
}
/**
 * Destroy an AngularJS app given the app `$injector`.
 *
 * NOTE: Destroying an app is not officially supported by AngularJS, but try to do our best by
 *       destroying `$rootScope` and clean the jqLite/jQuery data on `$rootElement` and all
 *       descendants.
 *
 * @param $injector The `$injector` of the AngularJS app to destroy.
 */
export function destroyApp($injector) {
    const $rootElement = $injector.get($ROOT_ELEMENT);
    const $rootScope = $injector.get($ROOT_SCOPE);
    $rootScope.$destroy();
    cleanData($rootElement[0]);
}
export function directiveNormalize(name) {
    return name.replace(DIRECTIVE_PREFIX_REGEXP, '')
        .replace(DIRECTIVE_SPECIAL_CHARS_REGEXP, (_, letter) => letter.toUpperCase());
}
export function getTypeName(type) {
    // Return the name of the type or the first line of its stringified version.
    return type.overriddenName || type.name || type.toString().split('\n')[0];
}
export function getDowngradedModuleCount($injector) {
    return $injector.has(DOWNGRADED_MODULE_COUNT_KEY) ? $injector.get(DOWNGRADED_MODULE_COUNT_KEY) :
        0;
}
export function getUpgradeAppType($injector) {
    return $injector.has(UPGRADE_APP_TYPE_KEY) ? $injector.get(UPGRADE_APP_TYPE_KEY) :
        0 /* UpgradeAppType.None */;
}
export function isFunction(value) {
    return typeof value === 'function';
}
export function isNgModuleType(value) {
    // NgModule class should have the `ɵmod` static property attached by AOT or JIT compiler.
    return isFunction(value) && !!value[ɵNG_MOD_DEF];
}
function isParentNode(node) {
    return isFunction(node.querySelectorAll);
}
export function validateInjectionKey($injector, downgradedModule, injectionKey, attemptedAction) {
    const upgradeAppType = getUpgradeAppType($injector);
    const downgradedModuleCount = getDowngradedModuleCount($injector);
    // Check for common errors.
    switch (upgradeAppType) {
        case 1 /* UpgradeAppType.Dynamic */:
        case 2 /* UpgradeAppType.Static */:
            if (downgradedModule) {
                throw new Error(`Error while ${attemptedAction}: 'downgradedModule' unexpectedly specified.\n` +
                    'You should not specify a value for \'downgradedModule\', unless you are downgrading ' +
                    'more than one Angular module (via \'downgradeModule()\').');
            }
            break;
        case 3 /* UpgradeAppType.Lite */:
            if (!downgradedModule && (downgradedModuleCount >= 2)) {
                throw new Error(`Error while ${attemptedAction}: 'downgradedModule' not specified.\n` +
                    'This application contains more than one downgraded Angular module, thus you need to ' +
                    'always specify \'downgradedModule\' when downgrading components and injectables.');
            }
            if (!$injector.has(injectionKey)) {
                throw new Error(`Error while ${attemptedAction}: Unable to find the specified downgraded module.\n` +
                    'Did you forget to downgrade an Angular module or include it in the AngularJS ' +
                    'application?');
            }
            break;
        default:
            throw new Error(`Error while ${attemptedAction}: Not a valid '@angular/upgrade' application.\n` +
                'Did you forget to downgrade an Angular module or include it in the AngularJS ' +
                'application?');
    }
}
export class Deferred {
    constructor() {
        this.promise = new Promise((res, rej) => {
            this.resolve = res;
            this.reject = rej;
        });
    }
}
/**
 * @return Whether the passed-in component implements the subset of the
 *     `ControlValueAccessor` interface needed for AngularJS `ng-model`
 *     compatibility.
 */
function supportsNgModel(component) {
    return typeof component.writeValue === 'function' &&
        typeof component.registerOnChange === 'function';
}
/**
 * Glue the AngularJS `NgModelController` (if it exists) to the component
 * (if it implements the needed subset of the `ControlValueAccessor` interface).
 */
export function hookupNgModel(ngModel, component) {
    if (ngModel && supportsNgModel(component)) {
        ngModel.$render = () => {
            component.writeValue(ngModel.$viewValue);
        };
        component.registerOnChange(ngModel.$setViewValue.bind(ngModel));
        if (typeof component.registerOnTouched === 'function') {
            component.registerOnTouched(ngModel.$setTouched.bind(ngModel));
        }
    }
}
/**
 * Test two values for strict equality, accounting for the fact that `NaN !== NaN`.
 */
export function strictEquals(val1, val2) {
    return val1 === val2 || (val1 !== val1 && val2 !== val2);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3VwZ3JhZGUvc3JjL2NvbW1vbi9zcmMvdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQWlCLFdBQVcsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUUxRCxPQUFPLEVBQUMsT0FBTyxJQUFJLGNBQWMsRUFBNEUsTUFBTSxZQUFZLENBQUM7QUFDaEksT0FBTyxFQUFDLGFBQWEsRUFBRSxXQUFXLEVBQUUsMkJBQTJCLEVBQUUsb0JBQW9CLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFFMUcsTUFBTSx1QkFBdUIsR0FBRyxvQkFBb0IsQ0FBQztBQUNyRCxNQUFNLDhCQUE4QixHQUFHLGFBQWEsQ0FBQztBQUVyRCxNQUFNLFVBQVUsT0FBTyxDQUFDLENBQU07SUFDNUIseURBQXlEO0lBQ3pELElBQUksT0FBTyxDQUFDLEtBQUssRUFBRTtRQUNqQixPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDM0I7U0FBTTtRQUNMLHNDQUFzQztRQUN0QyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDekI7SUFDRCxNQUFNLENBQUMsQ0FBQztBQUNWLENBQUM7QUFFRDs7Ozs7Ozs7Ozs7R0FXRztBQUNILE1BQU0sVUFBVSxTQUFTLENBQUMsSUFBVTtJQUNsQyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUNqQyxJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUN0QixjQUFjLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0tBQ3REO0FBQ0gsQ0FBQztBQUVELE1BQU0sVUFBVSxhQUFhLENBQUMs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T0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztTQUNoRTtLQUNGO0FBQ0gsQ0FBQztBQUVEOztHQUVHO0FBQ0gsTUFBTSxVQUFVLFlBQVksQ0FBQyxJQUFTLEVBQUUsSUFBUztJQUMvQyxPQUFPLElBQUksS0FBSyxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssSUFBSSxJQUFJLElBQUksS0FBSyxJQUFJLENBQUMsQ0FBQztBQUMzRCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7SW5qZWN0b3IsIFR5cGUsIMm1TkdfTU9EX0RFRn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7ZWxlbWVudCBhcyBhbmd1bGFyRWxlbWVudCwgSUF1Z21lbnRlZEpRdWVyeSwgSUluamVjdG9yU2VydmljZSwgSU5nTW9kZWxDb250cm9sbGVyLCBJUm9vdFNjb3BlU2VydmljZX0gZnJvbSAnLi9hbmd1bGFyMSc7XG5pbXBvcnQgeyRST09UX0VMRU1FTlQsICRST09UX1NDT1BFLCBET1dOR1JBREVEX01PRFVMRV9DT1VOVF9LRVksIFVQR1JBREVfQVBQX1RZUEVfS0VZfSBmcm9tICcuL2NvbnN0YW50cyc7XG5cbmNvbnN0IERJUkVDVElWRV9QUkVGSVhfUkVHRVhQID0gL14oPzp4fGRhdGEpWzpcXC1fXS9pO1xuY29uc3QgRElSRUNUSVZFX1NQRUNJQUxfQ0hBUlNfUkVHRVhQID0gL1s6XFwtX10rKC4pL2c7XG5cbmV4cG9ydCBmdW5jdGlvbiBvbkVycm9yKGU6IGFueSkge1xuICAvLyBUT0RPOiAobWlza28pOiBXZSBzZWVtIHRvIG5vdCBoYXZlIGEgc3RhY2sgdHJhY2UgaGVyZSFcbiAgaWYgKGNvbnNvbGUuZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKGUsIGUuc3RhY2spO1xuICB9IGVsc2Uge1xuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1jb25zb2xlXG4gICAgY29uc29sZS5sb2coZSwgZS5zdGFjayk7XG4gIH1cbiAgdGhyb3cgZTtcbn1cblxuLyoqXG4gKiBDbGVhbiB0aGUganFMaXRlL2pRdWVyeSBkYXRhIG9uIHRoZSBlbGVtZW50IGFuZCBhbGwgaXRzIGRlc2NlbmRhbnRzLlxuICogRXF1aXZhbGVudCB0byBob3cganFMaXRlL2pRdWVyeSBpbnZva2UgYGNsZWFuRGF0YSgpYCBvbiBhbiBFbGVtZW50IHdoZW4gcmVtb3ZlZDpcbiAqICAgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci5qcy9ibG9iLzJlNzJlYTEzZmE5OGJlYmY2ZWQ0YjVlM2M0NWVhZjVmOTkwZWQxNmYvc3JjL2pxTGl0ZS5qcyNMMzQ5LUwzNTVcbiAqICAgaHR0cHM6Ly9naXRodWIuY29tL2pxdWVyeS9qcXVlcnkvYmxvYi82OTg0ZDE3NDc2MjNkYmM1ZTg3ZmQ2YzI2MWE1YjZiMTYyOGMxMDdjL3NyYy9tYW5pcHVsYXRpb24uanMjTDE4MlxuICpcbiAqIE5PVEU6XG4gKiBgY2xlYW5EYXRhKClgIHdpbGwgYWxzbyBpbnZva2UgdGhlIEFuZ3VsYXJKUyBgJGRlc3Ryb3lgIERPTSBldmVudCBvbiB0aGUgZWxlbWVudDpcbiAqICAgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci5qcy9ibG9iLzJlNzJlYTEzZmE5OGJlYmY2ZWQ0YjVlM2M0NWVhZjVmOTkwZWQxNmYvc3JjL0FuZ3VsYXIuanMjTDE5MzItTDE5NDVcbiAqXG4gKiBAcGFyYW0gbm9kZSBUaGUgRE9NIG5vZGUgd2hvc2UgZGF0YSBuZWVkcyB0byBiZSBjbGVhbmVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY2xlYW5EYXRhKG5vZGU6IE5vZGUpOiB2b2lkIHtcbiAgYW5ndWxhckVsZW1lbnQuY2xlYW5EYXRhKFtub2RlXSk7XG4gIGlmIChpc1BhcmVudE5vZGUobm9kZSkpIHtcbiAgICBhbmd1bGFyRWxlbWVudC5jbGVhbkRhdGEobm9kZS5xdWVyeVNlbGVjdG9yQWxsKCcqJykpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb250cm9sbGVyS2V5KG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiAnJCcgKyBuYW1lICsgJ0NvbnRyb2xsZXInO1xufVxuXG4vKipcbiAqIERlc3Ryb3kgYW4gQW5ndWxhckpTIGFwcCBnaXZlbiB0aGUgYXBwIGAkaW5qZWN0b3JgLlxuICpcbiAqIE5PVEU6IERlc3Ryb3lpbmcgYW4gYXBwIGlzIG5vdCBvZmZpY2lhbGx5IHN1cHBvcnRlZCBieSBBbmd1bGFySlMsIGJ1dCB0cnkgdG8gZG8gb3VyIGJlc3QgYnlcbiAqICAgICAgIGRlc3Ryb3lpbmcgYCRyb290U2NvcGVgIGFuZCBjbGVhbiB0aGUganFMaXRlL2pRdWVyeSBkYXRhIG9uIGAkcm9vdEVsZW1lbnRgIGFuZCBhbGxcbiAqICAgICAgIGRlc2NlbmRhbnRzLlxuICpcbiAqIEBwYXJhbSAkaW5qZWN0b3IgVGhlIGAkaW5qZWN0b3JgIG9mIHRoZSBBbmd1bGFySlMgYXBwIHRvIGRlc3Ryb3kuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZXN0cm95QXBwKCRpbmplY3RvcjogSUluamVjdG9yU2VydmljZSk6IHZvaWQge1xuICBjb25zdCAkcm9vdEVsZW1lbnQ6IElBdWdtZW50ZWRKUXVlcnkgPSAkaW5qZWN0b3IuZ2V0KCRST09UX0VMRU1FTlQpO1xuICBjb25zdCAkcm9vdFNjb3BlOiBJUm9vdFNjb3BlU2VydmljZSA9ICRpbmplY3Rvci5nZXQoJFJPT1RfU0NPUEUpO1xuXG4gICRyb290U2NvcGUuJGRlc3Ryb3koKTtcbiAgY2xlYW5EYXRhKCRyb290RWxlbWVudFswXSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkaXJlY3RpdmVOb3JtYWxpemUobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIG5hbWUucmVwbGFjZShESVJFQ1RJVkVfUFJFRklYX1JFR0VYUCwgJycpXG4gICAgICAucmVwbGFjZShESVJFQ1RJVkVfU1BFQ0lBTF9DSEFSU19SRUdFWFAsIChfLCBsZXR0ZXIpID0+IGxldHRlci50b1VwcGVyQ2FzZSgpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFR5cGVOYW1lKHR5cGU6IFR5cGU8YW55Pik6IHN0cmluZyB7XG4gIC8vIFJldHVybiB0aGUgbmFtZSBvZiB0aGUgdHlwZSBvciB0aGUgZmlyc3QgbGluZSBvZiBpdHMgc3RyaW5naWZpZWQgdmVyc2lvbi5cbiAgcmV0dXJuICh0eXBlIGFzIGFueSkub3ZlcnJpZGRlbk5hbWUgfHwgdHlwZS5uYW1lIHx8IHR5cGUudG9TdHJpbmcoKS5zcGxpdCgnXFxuJylbMF07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXREb3duZ3JhZGVkTW9kdWxlQ291bnQoJGluamVjdG9yOiBJSW5qZWN0b3JTZXJ2aWNlKTogbnVtYmVyIHtcbiAgcmV0dXJuICRpbmplY3Rvci5oYXMoRE9XTkdSQURFRF9NT0RVTEVfQ09VTlRfS0VZKSA/ICRpbmplY3Rvci5nZXQoRE9XTkdSQURFRF9NT0RVTEVfQ09VTlRfS0VZKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAwO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VXBncmFkZUFwcFR5cGUoJGluamVjdG9yOiBJSW5qZWN0b3JTZXJ2aWNlKTogVXBncmFkZUFwcFR5cGUge1xuICByZXR1cm4gJGluamVjdG9yLmhhcyhVUEdSQURFX0FQUF9UWVBFX0tFWSkgPyAkaW5qZWN0b3IuZ2V0KFVQR1JBREVfQVBQX1RZUEVfS0VZKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFVwZ3JhZGVBcHBUeXBlLk5vbmU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlOiBhbnkpOiB2YWx1ZSBpcyBGdW5jdGlvbiB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbic7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc05nTW9kdWxlVHlwZSh2YWx1ZTogYW55KTogdmFsdWUgaXMgVHlwZTx1bmtub3duPiB7XG4gIC8vIE5nTW9kdWxlIGNsYXNzIHNob3VsZCBoYXZlIHRoZSBgybVtb2RgIHN0YXRpYyBwcm9wZXJ0eSBhdHRhY2hlZCBieSBBT1Qgb3IgSklUIGNvbXBpbGVyLlxuICByZXR1cm4gaXNGdW5jdGlvbih2YWx1ZSkgJiYgISF2YWx1ZVvJtU5HX01PRF9ERUZdO1xufVxuXG5mdW5jdGlvbiBpc1BhcmVudE5vZGUobm9kZTogTm9kZXxQYXJlbnROb2RlKTogbm9kZSBpcyBQYXJlbnROb2RlIHtcbiAgcmV0dXJuIGlzRnVuY3Rpb24oKG5vZGUgYXMgdW5rbm93biBhcyBQYXJlbnROb2RlKS5xdWVyeVNlbGVjdG9yQWxsKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlSW5qZWN0aW9uS2V5KFxuICAgICRpbmplY3RvcjogSUluamVjdG9yU2VydmljZSwgZG93bmdyYWRlZE1vZHVsZTogc3RyaW5nLCBpbmplY3Rpb25LZXk6IHN0cmluZyxcbiAgICBhdHRlbXB0ZWRBY3Rpb246IHN0cmluZyk6IHZvaWQge1xuICBjb25zdCB1cGdyYWRlQXBwVHlwZSA9IGdldFVwZ3JhZGVBcHBUeXBlKCRpbmplY3Rvcik7XG4gIGNvbnN0IGRvd25ncmFkZWRNb2R1bGVDb3VudCA9IGdldERvd25ncmFkZWRNb2R1bGVDb3VudCgkaW5qZWN0b3IpO1xuXG4gIC8vIENoZWNrIGZvciBjb21tb24gZXJyb3JzLlxuICBzd2l0Y2ggKHVwZ3JhZGVBcHBUeXBlKSB7XG4gICAgY2FzZSBVcGdyYWRlQXBwVHlwZS5EeW5hbWljOlxuICAgIGNhc2UgVXBncmFkZUFwcFR5cGUuU3RhdGljOlxuICAgICAgaWYgKGRvd25ncmFkZWRNb2R1bGUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgYEVycm9yIHdoaWxlICR7YXR0ZW1wdGVkQWN0aW9ufTogJ2Rvd25ncmFkZWRNb2R1bGUnIHVuZXhwZWN0ZWRseSBzcGVjaWZpZWQuXFxuYCArXG4gICAgICAgICAgICAnWW91IHNob3VsZCBub3Qgc3BlY2lmeSBhIHZhbHVlIGZvciBcXCdkb3duZ3JhZGVkTW9kdWxlXFwnLCB1bmxlc3MgeW91IGFyZSBkb3duZ3JhZGluZyAnICtcbiAgICAgICAgICAgICdtb3JlIHRoYW4gb25lIEFuZ3VsYXIgbW9kdWxlICh2aWEgXFwnZG93bmdyYWRlTW9kdWxlKClcXCcpLicpO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSBVcGdyYWRlQXBwVHlwZS5MaXRlOlxuICAgICAgaWYgKCFkb3duZ3JhZGVkTW9kdWxlICYmIChkb3duZ3JhZGVkTW9kdWxlQ291bnQgPj0gMikpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgYEVycm9yIHdoaWxlICR7YXR0ZW1wdGVkQWN0aW9ufTogJ2Rvd25ncmFkZWRNb2R1bGUnIG5vdCBzcGVjaWZpZWQuXFxuYCArXG4gICAgICAgICAgICAnVGhpcyBhcHBsaWNhdGlvbiBjb250YWlucyBtb3JlIHRoYW4gb25lIGRvd25ncmFkZWQgQW5ndWxhciBtb2R1bGUsIHRodXMgeW91IG5lZWQgdG8gJyArXG4gICAgICAgICAgICAnYWx3YXlzIHNwZWNpZnkgXFwnZG93bmdyYWRlZE1vZHVsZVxcJyB3aGVuIGRvd25ncmFkaW5nIGNvbXBvbmVudHMgYW5kIGluamVjdGFibGVzLicpO1xuICAgICAgfVxuXG4gICAgICBpZiAoISRpbmplY3Rvci5oYXMoaW5qZWN0aW9uS2V5KSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICBgRXJyb3Igd2hpbGUgJHthdHRlbXB0ZWRBY3Rpb259OiBVbmFibGUgdG8gZmluZCB0aGUgc3BlY2lmaWVkIGRvd25ncmFkZWQgbW9kdWxlLlxcbmAgK1xuICAgICAgICAgICAgJ0RpZCB5b3UgZm9yZ2V0IHRvIGRvd25ncmFkZSBhbiBBbmd1bGFyIG1vZHVsZSBvciBpbmNsdWRlIGl0IGluIHRoZSBBbmd1bGFySlMgJyArXG4gICAgICAgICAgICAnYXBwbGljYXRpb24/Jyk7XG4gICAgICB9XG5cbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYEVycm9yIHdoaWxlICR7YXR0ZW1wdGVkQWN0aW9ufTogTm90IGEgdmFsaWQgJ0Bhbmd1bGFyL3VwZ3JhZGUnIGFwcGxpY2F0aW9uLlxcbmAgK1xuICAgICAgICAgICdEaWQgeW91IGZvcmdldCB0byBkb3duZ3JhZGUgYW4gQW5ndWxhciBtb2R1bGUgb3IgaW5jbHVkZSBpdCBpbiB0aGUgQW5ndWxhckpTICcgK1xuICAgICAgICAgICdhcHBsaWNhdGlvbj8nKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRGVmZXJyZWQ8Uj4ge1xuICBwcm9taXNlOiBQcm9taXNlPFI+O1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgcmVzb2x2ZSE6ICh2YWx1ZTogUnxQcm9taXNlTGlrZTxSPikgPT4gdm9pZDtcbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIHJlamVjdCE6IChlcnJvcj86IGFueSkgPT4gdm9pZDtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzLCByZWopID0+IHtcbiAgICAgIHRoaXMucmVzb2x2ZSA9IHJlcztcbiAgICAgIHRoaXMucmVqZWN0ID0gcmVqO1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGF6eU1vZHVsZVJlZiB7XG4gIGluamVjdG9yPzogSW5qZWN0b3I7XG4gIHByb21pc2U/OiBQcm9taXNlPEluamVjdG9yPjtcbn1cblxuZXhwb3J0IGNvbnN0IGVudW0gVXBncmFkZUFwcFR5cGUge1xuICAvLyBBcHAgTk9UIHVzaW5nIGBAYW5ndWxhci91cGdyYWRlYC4gKFRoaXMgc2hvdWxkIG5ldmVyIGhhcHBlbiBpbiBhbiBgbmdVcGdyYWRlYCBhcHAuKVxuICBOb25lLFxuXG4gIC8vIEFwcCB1c2luZyB0aGUgZGVwcmVjYXRlZCBgQGFuZ3VsYXIvdXBncmFkZWAgQVBJcyAoYS5rLmEuIGR5bmFtaWMgYG5nVXBncmFkZWApLlxuICBEeW5hbWljLFxuXG4gIC8vIEFwcCB1c2luZyBgQGFuZ3VsYXIvdXBncmFkZS9zdGF0aWNgIHdpdGggYFVwZ3JhZGVNb2R1bGVgLlxuICBTdGF0aWMsXG5cbiAgLy8gQXBwIHVzaW5nIEBhbmd1bGFyL3VwZ3JhZGUvc3RhdGljYCB3aXRoIGBkb3duZ3JhZGVNb2R1bGUoKWAgKGEuay5hIGBuZ1VwZ3JhZGVgLWxpdGUgKS5cbiAgTGl0ZSxcbn1cblxuLyoqXG4gKiBAcmV0dXJuIFdoZXRoZXIgdGhlIHBhc3NlZC1pbiBjb21wb25lbnQgaW1wbGVtZW50cyB0aGUgc3Vic2V0IG9mIHRoZVxuICogICAgIGBDb250cm9sVmFsdWVBY2Nlc3NvcmAgaW50ZXJmYWNlIG5lZWRlZCBmb3IgQW5ndWxhckpTIGBuZy1tb2RlbGBcbiAqICAgICBjb21wYXRpYmlsaXR5LlxuICovXG5mdW5jdGlvbiBzdXBwb3J0c05nTW9kZWwoY29tcG9uZW50OiBhbnkpIHtcbiAgcmV0dXJuIHR5cGVvZiBjb21wb25lbnQud3JpdGVWYWx1ZSA9PT0gJ2Z1bmN0aW9uJyAmJlxuICAgICAgdHlwZW9mIGNvbXBvbmVudC5yZWdpc3Rlck9uQ2hhbmdlID09PSAnZnVuY3Rpb24nO1xufVxuXG4vKipcbiAqIEdsdWUgdGhlIEFuZ3VsYXJKUyBgTmdNb2RlbENvbnRyb2xsZXJgIChpZiBpdCBleGlzdHMpIHRvIHRoZSBjb21wb25lbnRcbiAqIChpZiBpdCBpbXBsZW1lbnRzIHRoZSBuZWVkZWQgc3Vic2V0IG9mIHRoZSBgQ29udHJvbFZhbHVlQWNjZXNzb3JgIGludGVyZmFjZSkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBob29rdXBOZ01vZGVsKG5nTW9kZWw6IElOZ01vZGVsQ29udHJvbGxlciwgY29tcG9uZW50OiBhbnkpIHtcbiAgaWYgKG5nTW9kZWwgJiYgc3VwcG9ydHNOZ01vZGVsKGNvbXBvbmVudCkpIHtcbiAgICBuZ01vZGVsLiRyZW5kZXIgPSAoKSA9PiB7XG4gICAgICBjb21wb25lbnQud3JpdGVWYWx1ZShuZ01vZGVsLiR2aWV3VmFsdWUpO1xuICAgIH07XG4gICAgY29tcG9uZW50LnJlZ2lzdGVyT25DaGFuZ2UobmdNb2RlbC4kc2V0Vmlld1ZhbHVlLmJpbmQobmdNb2RlbCkpO1xuICAgIGlmICh0eXBlb2YgY29tcG9uZW50LnJlZ2lzdGVyT25Ub3VjaGVkID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjb21wb25lbnQucmVnaXN0ZXJPblRvdWNoZWQobmdNb2RlbC4kc2V0VG91Y2hlZC5iaW5kKG5nTW9kZWwpKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBUZXN0IHR3byB2YWx1ZXMgZm9yIHN0cmljdCBlcXVhbGl0eSwgYWNjb3VudGluZyBmb3IgdGhlIGZhY3QgdGhhdCBgTmFOICE9PSBOYU5gLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc3RyaWN0RXF1YWxzKHZhbDE6IGFueSwgdmFsMjogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiB2YWwxID09PSB2YWwyIHx8ICh2YWwxICE9PSB2YWwxICYmIHZhbDIgIT09IHZhbDIpO1xufVxuIl19