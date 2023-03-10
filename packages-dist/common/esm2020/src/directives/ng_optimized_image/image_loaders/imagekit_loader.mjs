/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { createImageLoader } from './image_loader';
/**
 * Name and URL tester for ImageKit.
 */
export const imageKitLoaderInfo = {
    name: 'ImageKit',
    testUrl: isImageKitUrl
};
const IMAGE_KIT_LOADER_REGEX = /https?\:\/\/[^\/]+\.imagekit\.io\/.+/;
/**
 * Tests whether a URL is from ImageKit CDN.
 */
function isImageKitUrl(url) {
    return IMAGE_KIT_LOADER_REGEX.test(url);
}
/**
 * Function that generates an ImageLoader for ImageKit and turns it into an Angular provider.
 *
 * @param path Base URL of your ImageKit images
 * This URL should match one of the following formats:
 * https://ik.imagekit.io/myaccount
 * https://subdomain.mysite.com
 * @returns Set of providers to configure the ImageKit loader.
 *
 * @publicApi
 */
export const provideImageKitLoader = createImageLoader(createImagekitUrl, ngDevMode ? ['https://ik.imagekit.io/mysite', 'https://subdomain.mysite.com'] : undefined);
export function createImagekitUrl(path, config) {
    // Example of an ImageKit image URL:
    // https://ik.imagekit.io/demo/tr:w-300,h-300/medium_cafe_B1iTdD0C.jpg
    let params = `tr:q-auto`; // applies the "auto quality" transformation
    if (config.width) {
        params += `,w-${config.width}`;
    }
    return `${path}/${params}/${config.src}`;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1hZ2VraXRfbG9hZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tbW9uL3NyYy9kaXJlY3RpdmVzL25nX29wdGltaXplZF9pbWFnZS9pbWFnZV9sb2FkZXJzL2ltYWdla2l0X2xvYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsaUJBQWlCLEVBQXFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFckY7O0dBRUc7QUFDSCxNQUFNLENBQUMsTUFBTSxrQkFBa0IsR0FBb0I7SUFDakQsSUFBSSxFQUFFLFVBQVU7SUFDaEIsT0FBTyxFQUFFLGFBQWE7Q0FDdkIsQ0FBQztBQUVGLE1BQU0sc0JBQXNCLEdBQUcsc0NBQXNDLENBQUM7QUFDdEU7O0dBRUc7QUFDSCxTQUFTLGFBQWEsQ0FBQyxHQUFXO0lBQ2hDLE9BQU8sc0JBQXNCLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzFDLENBQUM7QUFFRDs7Ozs7Ozs7OztHQVVHO0FBQ0gsTUFBTSxDQUFDLE1BQU0scUJBQXFCLEdBQUcsaUJBQWlCLENBQ2xELGlCQUFpQixFQUNqQixTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsK0JBQStCLEVBQUUsOEJBQThCLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7QUFFL0YsTUFBTSxVQUFVLGlCQUFpQixDQUFDLElBQVksRUFBRSxNQUF5QjtJQUN2RSxvQ0FBb0M7SUFDcEMsc0VBQXNFO0lBQ3RFLElBQUksTUFBTSxHQUFHLFdBQVcsQ0FBQyxDQUFFLDRDQUE0QztJQUN2RSxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUU7UUFDaEIsTUFBTSxJQUFJLE1BQU0sTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQ2hDO0lBQ0QsT0FBTyxHQUFHLElBQUksSUFBSSxNQUFNLElBQUksTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzNDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtjcmVhdGVJbWFnZUxvYWRlciwgSW1hZ2VMb2FkZXJDb25maWcsIEltYWdlTG9hZGVySW5mb30gZnJvbSAnLi9pbWFnZV9sb2FkZXInO1xuXG4vKipcbiAqIE5hbWUgYW5kIFVSTCB0ZXN0ZXIgZm9yIEltYWdlS2l0LlxuICovXG5leHBvcnQgY29uc3QgaW1hZ2VLaXRMb2FkZXJJbmZvOiBJbWFnZUxvYWRlckluZm8gPSB7XG4gIG5hbWU6ICdJbWFnZUtpdCcsXG4gIHRlc3RVcmw6IGlzSW1hZ2VLaXRVcmxcbn07XG5cbmNvbnN0IElNQUdFX0tJVF9MT0FERVJfUkVHRVggPSAvaHR0cHM/XFw6XFwvXFwvW15cXC9dK1xcLmltYWdla2l0XFwuaW9cXC8uKy87XG4vKipcbiAqIFRlc3RzIHdoZXRoZXIgYSBVUkwgaXMgZnJvbSBJbWFnZUtpdCBDRE4uXG4gKi9cbmZ1bmN0aW9uIGlzSW1hZ2VLaXRVcmwodXJsOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIElNQUdFX0tJVF9MT0FERVJfUkVHRVgudGVzdCh1cmwpO1xufVxuXG4vKipcbiAqIEZ1bmN0aW9uIHRoYXQgZ2VuZXJhdGVzIGFuIEltYWdlTG9hZGVyIGZvciBJbWFnZUtpdCBhbmQgdHVybnMgaXQgaW50byBhbiBBbmd1bGFyIHByb3ZpZGVyLlxuICpcbiAqIEBwYXJhbSBwYXRoIEJhc2UgVVJMIG9mIHlvdXIgSW1hZ2VLaXQgaW1hZ2VzXG4gKiBUaGlzIFVSTCBzaG91bGQgbWF0Y2ggb25lIG9mIHRoZSBmb2xsb3dpbmcgZm9ybWF0czpcbiAqIGh0dHBzOi8vaWsuaW1hZ2VraXQuaW8vbXlhY2NvdW50XG4gKiBodHRwczovL3N1YmRvbWFpbi5teXNpdGUuY29tXG4gKiBAcmV0dXJucyBTZXQgb2YgcHJvdmlkZXJzIHRvIGNvbmZpZ3VyZSB0aGUgSW1hZ2VLaXQgbG9hZGVyLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGNvbnN0IHByb3ZpZGVJbWFnZUtpdExvYWRlciA9IGNyZWF0ZUltYWdlTG9hZGVyKFxuICAgIGNyZWF0ZUltYWdla2l0VXJsLFxuICAgIG5nRGV2TW9kZSA/IFsnaHR0cHM6Ly9pay5pbWFnZWtpdC5pby9teXNpdGUnLCAnaHR0cHM6Ly9zdWJkb21haW4ubXlzaXRlLmNvbSddIDogdW5kZWZpbmVkKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUltYWdla2l0VXJsKHBhdGg6IHN0cmluZywgY29uZmlnOiBJbWFnZUxvYWRlckNvbmZpZykge1xuICAvLyBFeGFtcGxlIG9mIGFuIEltYWdlS2l0IGltYWdlIFVSTDpcbiAgLy8gaHR0cHM6Ly9pay5pbWFnZWtpdC5pby9kZW1vL3RyOnctMzAwLGgtMzAwL21lZGl1bV9jYWZlX0IxaVRkRDBDLmpwZ1xuICBsZXQgcGFyYW1zID0gYHRyOnEtYXV0b2A7ICAvLyBhcHBsaWVzIHRoZSBcImF1dG8gcXVhbGl0eVwiIHRyYW5zZm9ybWF0aW9uXG4gIGlmIChjb25maWcud2lkdGgpIHtcbiAgICBwYXJhbXMgKz0gYCx3LSR7Y29uZmlnLndpZHRofWA7XG4gIH1cbiAgcmV0dXJuIGAke3BhdGh9LyR7cGFyYW1zfS8ke2NvbmZpZy5zcmN9YDtcbn1cbiJdfQ==