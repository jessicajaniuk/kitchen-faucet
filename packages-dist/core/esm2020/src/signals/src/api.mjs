/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Symbol used to tell `Signal`s apart from other functions.
 *
 * This can be used to auto-unwrap signals in various cases, or to auto-wrap non-signal values.
 */
const SIGNAL = Symbol('SIGNAL');
/**
 * Checks if the given `value` function is a reactive `Signal`.
 */
export function isSignal(value) {
    return value[SIGNAL] ?? false;
}
/**
 * Converts `fn` into a marked signal function (where `isSignal(fn)` will be `true`), and
 * potentially add some set of extra properties (passed as an object record `extraApi`).
 */
export function createSignalFromFunction(fn, extraApi = {}) {
    fn[SIGNAL] = true;
    // Copy properties from `extraApi` to `fn` to complete the desired API of the `Signal`.
    return Object.assign(fn, extraApi);
}
/**
 * The default equality function used for `signal` and `computed`, which treats objects and arrays
 * as never equal, and all other primitive values using identity semantics.
 *
 * This allows signals to hold non-primitive values (arrays, objects, other collections) and still
 * propagate change notification upon explicit mutation without identity change.
 *
 * @developerPreview
 */
export function defaultEquals(a, b) {
    // `Object.is` compares two values using identity semantics which is desired behavior for
    // primitive values. If `Object.is` determines two values to be equal we need to make sure that
    // those don't represent objects (we want to make sure that 2 objects are always considered
    // "unequal"). The null check is needed for the special case of JavaScript reporting null values
    // as objects (`typeof null === 'object'`).
    return (a === null || typeof a !== 'object') && Object.is(a, b);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS9zcmMvc2lnbmFscy9zcmMvYXBpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVIOzs7O0dBSUc7QUFDSCxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7QUFnQmhDOztHQUVHO0FBQ0gsTUFBTSxVQUFVLFFBQVEsQ0FBQyxLQUFlO0lBQ3RDLE9BQVEsS0FBeUIsQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUM7QUFDckQsQ0FBQztBQW9CRDs7O0dBR0c7QUFDSCxNQUFNLFVBQVUsd0JBQXdCLENBQ3BDLEVBQVcsRUFBRSxXQUFlLEVBQVE7SUFDckMsRUFBVSxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQztJQUMzQix1RkFBdUY7SUFDdkYsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQW1CLENBQUM7QUFDdkQsQ0FBQztBQVNEOzs7Ozs7OztHQVFHO0FBQ0gsTUFBTSxVQUFVLGFBQWEsQ0FBSSxDQUFJLEVBQUUsQ0FBSTtJQUN6Qyx5RkFBeUY7SUFDekYsK0ZBQStGO0lBQy9GLDJGQUEyRjtJQUMzRixnR0FBZ0c7SUFDaEcsMkNBQTJDO0lBQzNDLE9BQU8sQ0FBQyxDQUFDLEtBQUssSUFBSSxJQUFJLE9BQU8sQ0FBQyxLQUFLLFFBQVEsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2xFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLyoqXG4gKiBTeW1ib2wgdXNlZCB0byB0ZWxsIGBTaWduYWxgcyBhcGFydCBmcm9tIG90aGVyIGZ1bmN0aW9ucy5cbiAqXG4gKiBUaGlzIGNhbiBiZSB1c2VkIHRvIGF1dG8tdW53cmFwIHNpZ25hbHMgaW4gdmFyaW91cyBjYXNlcywgb3IgdG8gYXV0by13cmFwIG5vbi1zaWduYWwgdmFsdWVzLlxuICovXG5jb25zdCBTSUdOQUwgPSBTeW1ib2woJ1NJR05BTCcpO1xuXG4vKipcbiAqIEEgcmVhY3RpdmUgdmFsdWUgd2hpY2ggbm90aWZpZXMgY29uc3VtZXJzIG9mIGFueSBjaGFuZ2VzLlxuICpcbiAqIFNpZ25hbHMgYXJlIGZ1bmN0aW9ucyB3aGljaCByZXR1cm5zIHRoZWlyIGN1cnJlbnQgdmFsdWUuIFRvIGFjY2VzcyB0aGUgY3VycmVudCB2YWx1ZSBvZiBhIHNpZ25hbCxcbiAqIGNhbGwgaXQuXG4gKlxuICogT3JkaW5hcnkgdmFsdWVzIGNhbiBiZSB0dXJuZWQgaW50byBgU2lnbmFsYHMgd2l0aCB0aGUgYHNpZ25hbGAgZnVuY3Rpb24uXG4gKlxuICogQGRldmVsb3BlclByZXZpZXdcbiAqL1xuZXhwb3J0IHR5cGUgU2lnbmFsPFQ+ID0gKCgpID0+IFQpJntcbiAgW1NJR05BTF06IHRydWU7XG59O1xuXG4vKipcbiAqIENoZWNrcyBpZiB0aGUgZ2l2ZW4gYHZhbHVlYCBmdW5jdGlvbiBpcyBhIHJlYWN0aXZlIGBTaWduYWxgLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNTaWduYWwodmFsdWU6IEZ1bmN0aW9uKTogdmFsdWUgaXMgU2lnbmFsPHVua25vd24+IHtcbiAgcmV0dXJuICh2YWx1ZSBhcyBTaWduYWw8dW5rbm93bj4pW1NJR05BTF0gPz8gZmFsc2U7XG59XG5cbi8qKlxuICogQ29udmVydHMgYGZuYCBpbnRvIGEgbWFya2VkIHNpZ25hbCBmdW5jdGlvbiAod2hlcmUgYGlzU2lnbmFsKGZuKWAgd2lsbCBiZSBgdHJ1ZWApLlxuICpcbiAqIEBwYXJhbSBmbiBBIHplcm8tYXJndW1lbnQgZnVuY3Rpb24gd2hpY2ggd2lsbCBiZSBjb252ZXJ0ZWQgaW50byBhIGBTaWduYWxgLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU2lnbmFsRnJvbUZ1bmN0aW9uPFQ+KGZuOiAoKSA9PiBUKTogU2lnbmFsPFQ+O1xuXG4vKipcbiAqIENvbnZlcnRzIGBmbmAgaW50byBhIG1hcmtlZCBzaWduYWwgZnVuY3Rpb24gKHdoZXJlIGBpc1NpZ25hbChmbilgIHdpbGwgYmUgYHRydWVgKSwgYW5kXG4gKiBwb3RlbnRpYWxseSBhZGQgc29tZSBzZXQgb2YgZXh0cmEgcHJvcGVydGllcyAocGFzc2VkIGFzIGFuIG9iamVjdCByZWNvcmQgYGV4dHJhQXBpYCkuXG4gKlxuICogQHBhcmFtIGZuIEEgemVyby1hcmd1bWVudCBmdW5jdGlvbiB3aGljaCB3aWxsIGJlIGNvbnZlcnRlZCBpbnRvIGEgYFNpZ25hbGAuXG4gKiBAcGFyYW0gZXh0cmFBcGkgQW4gb2JqZWN0IHdob3NlIHByb3BlcnRpZXMgd2lsbCBiZSBjb3BpZWQgb250byBgZm5gIGluIG9yZGVyIHRvIGNyZWF0ZSBhIHNwZWNpZmljXG4gKiAgICAgZGVzaXJlZCBpbnRlcmZhY2UgZm9yIHRoZSBgU2lnbmFsYC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVNpZ25hbEZyb21GdW5jdGlvbjxULCBVIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4+KFxuICAgIGZuOiAoKSA9PiBULCBleHRyYUFwaTogVSk6IFNpZ25hbDxUPiZVO1xuXG4vKipcbiAqIENvbnZlcnRzIGBmbmAgaW50byBhIG1hcmtlZCBzaWduYWwgZnVuY3Rpb24gKHdoZXJlIGBpc1NpZ25hbChmbilgIHdpbGwgYmUgYHRydWVgKSwgYW5kXG4gKiBwb3RlbnRpYWxseSBhZGQgc29tZSBzZXQgb2YgZXh0cmEgcHJvcGVydGllcyAocGFzc2VkIGFzIGFuIG9iamVjdCByZWNvcmQgYGV4dHJhQXBpYCkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTaWduYWxGcm9tRnVuY3Rpb248VCwgVSBleHRlbmRzIFJlY29yZDxzdHJpbmcsIHVua25vd24+ID0ge30+KFxuICAgIGZuOiAoKSA9PiBULCBleHRyYUFwaTogVSA9ICh7fSBhcyBVKSk6IFNpZ25hbDxUPiZVIHtcbiAgKGZuIGFzIGFueSlbU0lHTkFMXSA9IHRydWU7XG4gIC8vIENvcHkgcHJvcGVydGllcyBmcm9tIGBleHRyYUFwaWAgdG8gYGZuYCB0byBjb21wbGV0ZSB0aGUgZGVzaXJlZCBBUEkgb2YgdGhlIGBTaWduYWxgLlxuICByZXR1cm4gT2JqZWN0LmFzc2lnbihmbiwgZXh0cmFBcGkpIGFzIChTaWduYWw8VD4mIFUpO1xufVxuXG4vKipcbiAqIEEgY29tcGFyaXNvbiBmdW5jdGlvbiB3aGljaCBjYW4gZGV0ZXJtaW5lIGlmIHR3byB2YWx1ZXMgYXJlIGVxdWFsLlxuICpcbiAqIEBkZXZlbG9wZXJQcmV2aWV3XG4gKi9cbmV4cG9ydCB0eXBlIFZhbHVlRXF1YWxpdHlGbjxUPiA9IChhOiBULCBiOiBUKSA9PiBib29sZWFuO1xuXG4vKipcbiAqIFRoZSBkZWZhdWx0IGVxdWFsaXR5IGZ1bmN0aW9uIHVzZWQgZm9yIGBzaWduYWxgIGFuZCBgY29tcHV0ZWRgLCB3aGljaCB0cmVhdHMgb2JqZWN0cyBhbmQgYXJyYXlzXG4gKiBhcyBuZXZlciBlcXVhbCwgYW5kIGFsbCBvdGhlciBwcmltaXRpdmUgdmFsdWVzIHVzaW5nIGlkZW50aXR5IHNlbWFudGljcy5cbiAqXG4gKiBUaGlzIGFsbG93cyBzaWduYWxzIHRvIGhvbGQgbm9uLXByaW1pdGl2ZSB2YWx1ZXMgKGFycmF5cywgb2JqZWN0cywgb3RoZXIgY29sbGVjdGlvbnMpIGFuZCBzdGlsbFxuICogcHJvcGFnYXRlIGNoYW5nZSBub3RpZmljYXRpb24gdXBvbiBleHBsaWNpdCBtdXRhdGlvbiB3aXRob3V0IGlkZW50aXR5IGNoYW5nZS5cbiAqXG4gKiBAZGV2ZWxvcGVyUHJldmlld1xuICovXG5leHBvcnQgZnVuY3Rpb24gZGVmYXVsdEVxdWFsczxUPihhOiBULCBiOiBUKSB7XG4gIC8vIGBPYmplY3QuaXNgIGNvbXBhcmVzIHR3byB2YWx1ZXMgdXNpbmcgaWRlbnRpdHkgc2VtYW50aWNzIHdoaWNoIGlzIGRlc2lyZWQgYmVoYXZpb3IgZm9yXG4gIC8vIHByaW1pdGl2ZSB2YWx1ZXMuIElmIGBPYmplY3QuaXNgIGRldGVybWluZXMgdHdvIHZhbHVlcyB0byBiZSBlcXVhbCB3ZSBuZWVkIHRvIG1ha2Ugc3VyZSB0aGF0XG4gIC8vIHRob3NlIGRvbid0IHJlcHJlc2VudCBvYmplY3RzICh3ZSB3YW50IHRvIG1ha2Ugc3VyZSB0aGF0IDIgb2JqZWN0cyBhcmUgYWx3YXlzIGNvbnNpZGVyZWRcbiAgLy8gXCJ1bmVxdWFsXCIpLiBUaGUgbnVsbCBjaGVjayBpcyBuZWVkZWQgZm9yIHRoZSBzcGVjaWFsIGNhc2Ugb2YgSmF2YVNjcmlwdCByZXBvcnRpbmcgbnVsbCB2YWx1ZXNcbiAgLy8gYXMgb2JqZWN0cyAoYHR5cGVvZiBudWxsID09PSAnb2JqZWN0J2ApLlxuICByZXR1cm4gKGEgPT09IG51bGwgfHwgdHlwZW9mIGEgIT09ICdvYmplY3QnKSAmJiBPYmplY3QuaXMoYSwgYik7XG59XG4iXX0=