/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export { PlatformState } from './platform_state';
export { platformDynamicServer, platformServer, ServerModule } from './server';
export { BEFORE_APP_SERIALIZED, INITIAL_CONFIG } from './tokens';
export { ServerTransferStateModule } from './transfer_state';
export { renderApplication, renderModule, renderModuleFactory } from './utils';
export * from './private_export';
export { VERSION } from './version';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhdGZvcm0tc2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcGxhdGZvcm0tc2VydmVyL3NyYy9wbGF0Zm9ybS1zZXJ2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBQy9DLE9BQU8sRUFBQyxxQkFBcUIsRUFBRSxjQUFjLEVBQUUsWUFBWSxFQUFDLE1BQU0sVUFBVSxDQUFDO0FBQzdFLE9BQU8sRUFBQyxxQkFBcUIsRUFBRSxjQUFjLEVBQWlCLE1BQU0sVUFBVSxDQUFDO0FBQy9FLE9BQU8sRUFBQyx5QkFBeUIsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBQzNELE9BQU8sRUFBQyxpQkFBaUIsRUFBRSxZQUFZLEVBQUUsbUJBQW1CLEVBQUMsTUFBTSxTQUFTLENBQUM7QUFFN0UsY0FBYyxrQkFBa0IsQ0FBQztBQUNqQyxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sV0FBVyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmV4cG9ydCB7UGxhdGZvcm1TdGF0ZX0gZnJvbSAnLi9wbGF0Zm9ybV9zdGF0ZSc7XG5leHBvcnQge3BsYXRmb3JtRHluYW1pY1NlcnZlciwgcGxhdGZvcm1TZXJ2ZXIsIFNlcnZlck1vZHVsZX0gZnJvbSAnLi9zZXJ2ZXInO1xuZXhwb3J0IHtCRUZPUkVfQVBQX1NFUklBTElaRUQsIElOSVRJQUxfQ09ORklHLCBQbGF0Zm9ybUNvbmZpZ30gZnJvbSAnLi90b2tlbnMnO1xuZXhwb3J0IHtTZXJ2ZXJUcmFuc2ZlclN0YXRlTW9kdWxlfSBmcm9tICcuL3RyYW5zZmVyX3N0YXRlJztcbmV4cG9ydCB7cmVuZGVyQXBwbGljYXRpb24sIHJlbmRlck1vZHVsZSwgcmVuZGVyTW9kdWxlRmFjdG9yeX0gZnJvbSAnLi91dGlscyc7XG5cbmV4cG9ydCAqIGZyb20gJy4vcHJpdmF0ZV9leHBvcnQnO1xuZXhwb3J0IHtWRVJTSU9OfSBmcm9tICcuL3ZlcnNpb24nO1xuIl19