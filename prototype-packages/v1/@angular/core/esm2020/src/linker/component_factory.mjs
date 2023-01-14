/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Represents a component created by a `ComponentFactory`.
 * Provides access to the component instance and related objects,
 * and provides the means of destroying the instance.
 *
 * @publicApi
 */
export class ComponentRef {
}
/**
 * Base class for a factory that can create a component dynamically.
 * Instantiate a factory for a given type of component with `resolveComponentFactory()`.
 * Use the resulting `ComponentFactory.create()` method to create a component of that type.
 *
 * @see [Dynamic Components](guide/dynamic-component-loader)
 *
 * @publicApi
 *
 * @deprecated Angular no longer requires Component factories. Please use other APIs where
 *     Component class can be used directly.
 */
export class ComponentFactory {
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcG9uZW50X2ZhY3RvcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy9saW5rZXIvY29tcG9uZW50X2ZhY3RvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBV0g7Ozs7OztHQU1HO0FBQ0gsTUFBTSxPQUFnQixZQUFZO0NBc0RqQztBQUVEOzs7Ozs7Ozs7OztHQVdHO0FBQ0gsTUFBTSxPQUFnQixnQkFBZ0I7Q0E0QnJDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q2hhbmdlRGV0ZWN0b3JSZWZ9IGZyb20gJy4uL2NoYW5nZV9kZXRlY3Rpb24vY2hhbmdlX2RldGVjdGlvbic7XG5pbXBvcnQge0luamVjdG9yfSBmcm9tICcuLi9kaS9pbmplY3Rvcic7XG5pbXBvcnQge0Vudmlyb25tZW50SW5qZWN0b3J9IGZyb20gJy4uL2RpL3IzX2luamVjdG9yJztcbmltcG9ydCB7VHlwZX0gZnJvbSAnLi4vaW50ZXJmYWNlL3R5cGUnO1xuXG5pbXBvcnQge0VsZW1lbnRSZWZ9IGZyb20gJy4vZWxlbWVudF9yZWYnO1xuaW1wb3J0IHtOZ01vZHVsZVJlZn0gZnJvbSAnLi9uZ19tb2R1bGVfZmFjdG9yeSc7XG5pbXBvcnQge1ZpZXdSZWZ9IGZyb20gJy4vdmlld19yZWYnO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgYSBjb21wb25lbnQgY3JlYXRlZCBieSBhIGBDb21wb25lbnRGYWN0b3J5YC5cbiAqIFByb3ZpZGVzIGFjY2VzcyB0byB0aGUgY29tcG9uZW50IGluc3RhbmNlIGFuZCByZWxhdGVkIG9iamVjdHMsXG4gKiBhbmQgcHJvdmlkZXMgdGhlIG1lYW5zIG9mIGRlc3Ryb3lpbmcgdGhlIGluc3RhbmNlLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIENvbXBvbmVudFJlZjxDPiB7XG4gIC8qKlxuICAgKiBVcGRhdGVzIGEgc3BlY2lmaWVkIGlucHV0IG5hbWUgdG8gYSBuZXcgdmFsdWUuIFVzaW5nIHRoaXMgbWV0aG9kIHdpbGwgcHJvcGVybHkgbWFyayBmb3IgY2hlY2tcbiAgICogY29tcG9uZW50IHVzaW5nIHRoZSBgT25QdXNoYCBjaGFuZ2UgZGV0ZWN0aW9uIHN0cmF0ZWd5LiBJdCB3aWxsIGFsc28gYXNzdXJlIHRoYXQgdGhlXG4gICAqIGBPbkNoYW5nZXNgIGxpZmVjeWNsZSBob29rIHJ1bnMgd2hlbiBhIGR5bmFtaWNhbGx5IGNyZWF0ZWQgY29tcG9uZW50IGlzIGNoYW5nZS1kZXRlY3RlZC5cbiAgICpcbiAgICogQHBhcmFtIG5hbWUgVGhlIG5hbWUgb2YgYW4gaW5wdXQuXG4gICAqIEBwYXJhbSB2YWx1ZSBUaGUgbmV3IHZhbHVlIG9mIGFuIGlucHV0LlxuICAgKi9cbiAgYWJzdHJhY3Qgc2V0SW5wdXQobmFtZTogc3RyaW5nLCB2YWx1ZTogdW5rbm93bik6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFRoZSBob3N0IG9yIGFuY2hvciBbZWxlbWVudF0oZ3VpZGUvZ2xvc3NhcnkjZWxlbWVudCkgZm9yIHRoaXMgY29tcG9uZW50IGluc3RhbmNlLlxuICAgKi9cbiAgYWJzdHJhY3QgZ2V0IGxvY2F0aW9uKCk6IEVsZW1lbnRSZWY7XG5cbiAgLyoqXG4gICAqIFRoZSBbZGVwZW5kZW5jeSBpbmplY3Rvcl0oZ3VpZGUvZ2xvc3NhcnkjaW5qZWN0b3IpIGZvciB0aGlzIGNvbXBvbmVudCBpbnN0YW5jZS5cbiAgICovXG4gIGFic3RyYWN0IGdldCBpbmplY3RvcigpOiBJbmplY3RvcjtcblxuICAvKipcbiAgICogVGhpcyBjb21wb25lbnQgaW5zdGFuY2UuXG4gICAqL1xuICBhYnN0cmFjdCBnZXQgaW5zdGFuY2UoKTogQztcblxuICAvKipcbiAgICogVGhlIFtob3N0IHZpZXddKGd1aWRlL2dsb3NzYXJ5I3ZpZXctdHJlZSkgZGVmaW5lZCBieSB0aGUgdGVtcGxhdGVcbiAgICogZm9yIHRoaXMgY29tcG9uZW50IGluc3RhbmNlLlxuICAgKi9cbiAgYWJzdHJhY3QgZ2V0IGhvc3RWaWV3KCk6IFZpZXdSZWY7XG5cbiAgLyoqXG4gICAqIFRoZSBjaGFuZ2UgZGV0ZWN0b3IgZm9yIHRoaXMgY29tcG9uZW50IGluc3RhbmNlLlxuICAgKi9cbiAgYWJzdHJhY3QgZ2V0IGNoYW5nZURldGVjdG9yUmVmKCk6IENoYW5nZURldGVjdG9yUmVmO1xuXG4gIC8qKlxuICAgKiBUaGUgdHlwZSBvZiB0aGlzIGNvbXBvbmVudCAoYXMgY3JlYXRlZCBieSBhIGBDb21wb25lbnRGYWN0b3J5YCBjbGFzcykuXG4gICAqL1xuICBhYnN0cmFjdCBnZXQgY29tcG9uZW50VHlwZSgpOiBUeXBlPGFueT47XG5cbiAgLyoqXG4gICAqIERlc3Ryb3lzIHRoZSBjb21wb25lbnQgaW5zdGFuY2UgYW5kIGFsbCBvZiB0aGUgZGF0YSBzdHJ1Y3R1cmVzIGFzc29jaWF0ZWQgd2l0aCBpdC5cbiAgICovXG4gIGFic3RyYWN0IGRlc3Ryb3koKTogdm9pZDtcblxuICAvKipcbiAgICogQSBsaWZlY3ljbGUgaG9vayB0aGF0IHByb3ZpZGVzIGFkZGl0aW9uYWwgZGV2ZWxvcGVyLWRlZmluZWQgY2xlYW51cFxuICAgKiBmdW5jdGlvbmFsaXR5IGZvciB0aGUgY29tcG9uZW50LlxuICAgKiBAcGFyYW0gY2FsbGJhY2sgQSBoYW5kbGVyIGZ1bmN0aW9uIHRoYXQgY2xlYW5zIHVwIGRldmVsb3Blci1kZWZpbmVkIGRhdGFcbiAgICogYXNzb2NpYXRlZCB3aXRoIHRoaXMgY29tcG9uZW50LiBDYWxsZWQgd2hlbiB0aGUgYGRlc3Ryb3koKWAgbWV0aG9kIGlzIGludm9rZWQuXG4gICAqL1xuICBhYnN0cmFjdCBvbkRlc3Ryb3koY2FsbGJhY2s6IEZ1bmN0aW9uKTogdm9pZDtcbn1cblxuLyoqXG4gKiBCYXNlIGNsYXNzIGZvciBhIGZhY3RvcnkgdGhhdCBjYW4gY3JlYXRlIGEgY29tcG9uZW50IGR5bmFtaWNhbGx5LlxuICogSW5zdGFudGlhdGUgYSBmYWN0b3J5IGZvciBhIGdpdmVuIHR5cGUgb2YgY29tcG9uZW50IHdpdGggYHJlc29sdmVDb21wb25lbnRGYWN0b3J5KClgLlxuICogVXNlIHRoZSByZXN1bHRpbmcgYENvbXBvbmVudEZhY3RvcnkuY3JlYXRlKClgIG1ldGhvZCB0byBjcmVhdGUgYSBjb21wb25lbnQgb2YgdGhhdCB0eXBlLlxuICpcbiAqIEBzZWUgW0R5bmFtaWMgQ29tcG9uZW50c10oZ3VpZGUvZHluYW1pYy1jb21wb25lbnQtbG9hZGVyKVxuICpcbiAqIEBwdWJsaWNBcGlcbiAqXG4gKiBAZGVwcmVjYXRlZCBBbmd1bGFyIG5vIGxvbmdlciByZXF1aXJlcyBDb21wb25lbnQgZmFjdG9yaWVzLiBQbGVhc2UgdXNlIG90aGVyIEFQSXMgd2hlcmVcbiAqICAgICBDb21wb25lbnQgY2xhc3MgY2FuIGJlIHVzZWQgZGlyZWN0bHkuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBDb21wb25lbnRGYWN0b3J5PEM+IHtcbiAgLyoqXG4gICAqIFRoZSBjb21wb25lbnQncyBIVE1MIHNlbGVjdG9yLlxuICAgKi9cbiAgYWJzdHJhY3QgZ2V0IHNlbGVjdG9yKCk6IHN0cmluZztcbiAgLyoqXG4gICAqIFRoZSB0eXBlIG9mIGNvbXBvbmVudCB0aGUgZmFjdG9yeSB3aWxsIGNyZWF0ZS5cbiAgICovXG4gIGFic3RyYWN0IGdldCBjb21wb25lbnRUeXBlKCk6IFR5cGU8YW55PjtcbiAgLyoqXG4gICAqIFNlbGVjdG9yIGZvciBhbGwgPG5nLWNvbnRlbnQ+IGVsZW1lbnRzIGluIHRoZSBjb21wb25lbnQuXG4gICAqL1xuICBhYnN0cmFjdCBnZXQgbmdDb250ZW50U2VsZWN0b3JzKCk6IHN0cmluZ1tdO1xuICAvKipcbiAgICogVGhlIGlucHV0cyBvZiB0aGUgY29tcG9uZW50LlxuICAgKi9cbiAgYWJzdHJhY3QgZ2V0IGlucHV0cygpOiB7cHJvcE5hbWU6IHN0cmluZywgdGVtcGxhdGVOYW1lOiBzdHJpbmd9W107XG4gIC8qKlxuICAgKiBUaGUgb3V0cHV0cyBvZiB0aGUgY29tcG9uZW50LlxuICAgKi9cbiAgYWJzdHJhY3QgZ2V0IG91dHB1dHMoKToge3Byb3BOYW1lOiBzdHJpbmcsIHRlbXBsYXRlTmFtZTogc3RyaW5nfVtdO1xuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBjb21wb25lbnQuXG4gICAqL1xuICBhYnN0cmFjdCBjcmVhdGUoXG4gICAgICBpbmplY3RvcjogSW5qZWN0b3IsIHByb2plY3RhYmxlTm9kZXM/OiBhbnlbXVtdLCByb290U2VsZWN0b3JPck5vZGU/OiBzdHJpbmd8YW55LFxuICAgICAgZW52aXJvbm1lbnRJbmplY3Rvcj86IEVudmlyb25tZW50SW5qZWN0b3J8TmdNb2R1bGVSZWY8YW55PixcbiAgICAgIGh5ZHJhdGlvbktleT86IHN0cmluZyk6IENvbXBvbmVudFJlZjxDPjtcbn1cbiJdfQ==