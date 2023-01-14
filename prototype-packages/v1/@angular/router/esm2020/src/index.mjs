/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export { createUrlTreeFromSnapshot } from './create_url_tree';
export { RouterLink, RouterLinkWithHref } from './directives/router_link';
export { RouterLinkActive } from './directives/router_link_active';
export { RouterOutlet } from './directives/router_outlet';
export { ActivationEnd, ActivationStart, ChildActivationEnd, ChildActivationStart, GuardsCheckEnd, GuardsCheckStart, NavigationCancel, NavigationEnd, NavigationError, NavigationSkipped, NavigationStart, ResolveEnd, ResolveStart, RouteConfigLoadEnd, RouteConfigLoadStart, RouterEvent, RoutesRecognized, Scroll } from './events';
export { DefaultTitleStrategy, TitleStrategy } from './page_title_strategy';
export { provideRouter, provideRoutes, withDebugTracing, withDisabledInitialNavigation, withEnabledBlockingInitialNavigation, withInMemoryScrolling, withPreloading, withRouterConfig } from './provide_router';
export { BaseRouteReuseStrategy, RouteReuseStrategy } from './route_reuse_strategy';
export { Router } from './router';
export { ROUTER_CONFIGURATION } from './router_config';
export { ROUTES } from './router_config_loader';
export { ROUTER_INITIALIZER, RouterModule } from './router_module';
export { ChildrenOutletContexts, OutletContext } from './router_outlet_context';
export { NoPreloading, PreloadAllModules, PreloadingStrategy, RouterPreloader } from './router_preloader';
export { ActivatedRoute, ActivatedRouteSnapshot, RouterState, RouterStateSnapshot } from './router_state';
export { convertToParamMap, defaultUrlMatcher, PRIMARY_OUTLET } from './shared';
export { UrlHandlingStrategy } from './url_handling_strategy';
export { DefaultUrlSerializer, UrlSegment, UrlSegmentGroup, UrlSerializer, UrlTree } from './url_tree';
export { VERSION } from './version';
export * from './private_export';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9yb3V0ZXIvc3JjL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUdILE9BQU8sRUFBQyx5QkFBeUIsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQzVELE9BQU8sRUFBQyxVQUFVLEVBQUUsa0JBQWtCLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUN4RSxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxpQ0FBaUMsQ0FBQztBQUNqRSxPQUFPLEVBQUMsWUFBWSxFQUF1QixNQUFNLDRCQUE0QixDQUFDO0FBQzlFLE9BQU8sRUFBQyxhQUFhLEVBQUUsZUFBZSxFQUFFLGtCQUFrQixFQUFFLG9CQUFvQixFQUFvQixjQUFjLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQTRELGFBQWEsRUFBRSxlQUFlLEVBQUUsaUJBQWlCLEVBQXlCLGVBQWUsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLGtCQUFrQixFQUFFLG9CQUFvQixFQUFFLFdBQVcsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFHeGEsT0FBTyxFQUFDLG9CQUFvQixFQUFFLGFBQWEsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzFFLE9BQU8sRUFBd0ssYUFBYSxFQUFFLGFBQWEsRUFBNkQsZ0JBQWdCLEVBQUUsNkJBQTZCLEVBQUUsb0NBQW9DLEVBQUUscUJBQXFCLEVBQUUsY0FBYyxFQUFFLGdCQUFnQixFQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFDaGIsT0FBTyxFQUFDLHNCQUFzQixFQUF1QixrQkFBa0IsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZHLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFDaEMsT0FBTyxFQUE0RCxvQkFBb0IsRUFBc0IsTUFBTSxpQkFBaUIsQ0FBQztBQUNySSxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDOUMsT0FBTyxFQUFDLGtCQUFrQixFQUFFLFlBQVksRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ2pFLE9BQU8sRUFBQyxzQkFBc0IsRUFBRSxhQUFhLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUM5RSxPQUFPLEVBQUMsWUFBWSxFQUFFLGlCQUFpQixFQUFFLGtCQUFrQixFQUFFLGVBQWUsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ3hHLE9BQU8sRUFBQyxjQUFjLEVBQUUsc0JBQXNCLEVBQUUsV0FBVyxFQUFFLG1CQUFtQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDeEcsT0FBTyxFQUFDLGlCQUFpQixFQUFFLGlCQUFpQixFQUFvQixjQUFjLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFDaEcsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0seUJBQXlCLENBQUM7QUFDNUQsT0FBTyxFQUFDLG9CQUFvQixFQUF3QixVQUFVLEVBQUUsZUFBZSxFQUFFLGFBQWEsRUFBRSxPQUFPLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDM0gsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUVsQyxjQUFjLGtCQUFrQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cblxuZXhwb3J0IHtjcmVhdGVVcmxUcmVlRnJvbVNuYXBzaG90fSBmcm9tICcuL2NyZWF0ZV91cmxfdHJlZSc7XG5leHBvcnQge1JvdXRlckxpbmssIFJvdXRlckxpbmtXaXRoSHJlZn0gZnJvbSAnLi9kaXJlY3RpdmVzL3JvdXRlcl9saW5rJztcbmV4cG9ydCB7Um91dGVyTGlua0FjdGl2ZX0gZnJvbSAnLi9kaXJlY3RpdmVzL3JvdXRlcl9saW5rX2FjdGl2ZSc7XG5leHBvcnQge1JvdXRlck91dGxldCwgUm91dGVyT3V0bGV0Q29udHJhY3R9IGZyb20gJy4vZGlyZWN0aXZlcy9yb3V0ZXJfb3V0bGV0JztcbmV4cG9ydCB7QWN0aXZhdGlvbkVuZCwgQWN0aXZhdGlvblN0YXJ0LCBDaGlsZEFjdGl2YXRpb25FbmQsIENoaWxkQWN0aXZhdGlvblN0YXJ0LCBFdmVudCwgRXZlbnRUeXBlLCBHdWFyZHNDaGVja0VuZCwgR3VhcmRzQ2hlY2tTdGFydCwgTmF2aWdhdGlvbkNhbmNlbCwgTmF2aWdhdGlvbkNhbmNlbGxhdGlvbkNvZGUgYXMgTmF2aWdhdGlvbkNhbmNlbGxhdGlvbkNvZGUsIE5hdmlnYXRpb25FbmQsIE5hdmlnYXRpb25FcnJvciwgTmF2aWdhdGlvblNraXBwZWQsIE5hdmlnYXRpb25Ta2lwcGVkQ29kZSwgTmF2aWdhdGlvblN0YXJ0LCBSZXNvbHZlRW5kLCBSZXNvbHZlU3RhcnQsIFJvdXRlQ29uZmlnTG9hZEVuZCwgUm91dGVDb25maWdMb2FkU3RhcnQsIFJvdXRlckV2ZW50LCBSb3V0ZXNSZWNvZ25pemVkLCBTY3JvbGx9IGZyb20gJy4vZXZlbnRzJztcbmV4cG9ydCB7Q2FuQWN0aXZhdGUsIENhbkFjdGl2YXRlQ2hpbGQsIENhbkFjdGl2YXRlQ2hpbGRGbiwgQ2FuQWN0aXZhdGVGbiwgQ2FuRGVhY3RpdmF0ZSwgQ2FuRGVhY3RpdmF0ZUZuLCBDYW5Mb2FkLCBDYW5Mb2FkRm4sIENhbk1hdGNoLCBDYW5NYXRjaEZuLCBEYXRhLCBEZWZhdWx0RXhwb3J0LCBMb2FkQ2hpbGRyZW4sIExvYWRDaGlsZHJlbkNhbGxiYWNrLCBOYXZpZ2F0aW9uQmVoYXZpb3JPcHRpb25zLCBPblNhbWVVcmxOYXZpZ2F0aW9uLCBRdWVyeVBhcmFtc0hhbmRsaW5nLCBSZXNvbHZlLCBSZXNvbHZlRGF0YSwgUmVzb2x2ZUZuLCBSb3V0ZSwgUm91dGVzLCBSdW5HdWFyZHNBbmRSZXNvbHZlcnMsIFVybE1hdGNoZXIsIFVybE1hdGNoUmVzdWx0fSBmcm9tICcuL21vZGVscyc7XG5leHBvcnQge05hdmlnYXRpb24sIE5hdmlnYXRpb25FeHRyYXMsIFVybENyZWF0aW9uT3B0aW9uc30gZnJvbSAnLi9uYXZpZ2F0aW9uX3RyYW5zaXRpb24nO1xuZXhwb3J0IHtEZWZhdWx0VGl0bGVTdHJhdGVneSwgVGl0bGVTdHJhdGVneX0gZnJvbSAnLi9wYWdlX3RpdGxlX3N0cmF0ZWd5JztcbmV4cG9ydCB7RGVidWdUcmFjaW5nRmVhdHVyZSwgRGlzYWJsZWRJbml0aWFsTmF2aWdhdGlvbkZlYXR1cmUsIEVuYWJsZWRCbG9ja2luZ0luaXRpYWxOYXZpZ2F0aW9uRmVhdHVyZSwgSW5pdGlhbE5hdmlnYXRpb25GZWF0dXJlLCBJbk1lbW9yeVNjcm9sbGluZ0ZlYXR1cmUsIFByZWxvYWRpbmdGZWF0dXJlLCBwcm92aWRlUm91dGVyLCBwcm92aWRlUm91dGVzLCBSb3V0ZXJDb25maWd1cmF0aW9uRmVhdHVyZSwgUm91dGVyRmVhdHVyZSwgUm91dGVyRmVhdHVyZXMsIHdpdGhEZWJ1Z1RyYWNpbmcsIHdpdGhEaXNhYmxlZEluaXRpYWxOYXZpZ2F0aW9uLCB3aXRoRW5hYmxlZEJsb2NraW5nSW5pdGlhbE5hdmlnYXRpb24sIHdpdGhJbk1lbW9yeVNjcm9sbGluZywgd2l0aFByZWxvYWRpbmcsIHdpdGhSb3V0ZXJDb25maWd9IGZyb20gJy4vcHJvdmlkZV9yb3V0ZXInO1xuZXhwb3J0IHtCYXNlUm91dGVSZXVzZVN0cmF0ZWd5LCBEZXRhY2hlZFJvdXRlSGFuZGxlLCBSb3V0ZVJldXNlU3RyYXRlZ3l9IGZyb20gJy4vcm91dGVfcmV1c2Vfc3RyYXRlZ3knO1xuZXhwb3J0IHtSb3V0ZXJ9IGZyb20gJy4vcm91dGVyJztcbmV4cG9ydCB7RXh0cmFPcHRpb25zLCBJbml0aWFsTmF2aWdhdGlvbiwgSW5NZW1vcnlTY3JvbGxpbmdPcHRpb25zLCBST1VURVJfQ09ORklHVVJBVElPTiwgUm91dGVyQ29uZmlnT3B0aW9uc30gZnJvbSAnLi9yb3V0ZXJfY29uZmlnJztcbmV4cG9ydCB7Uk9VVEVTfSBmcm9tICcuL3JvdXRlcl9jb25maWdfbG9hZGVyJztcbmV4cG9ydCB7Uk9VVEVSX0lOSVRJQUxJWkVSLCBSb3V0ZXJNb2R1bGV9IGZyb20gJy4vcm91dGVyX21vZHVsZSc7XG5leHBvcnQge0NoaWxkcmVuT3V0bGV0Q29udGV4dHMsIE91dGxldENvbnRleHR9IGZyb20gJy4vcm91dGVyX291dGxldF9jb250ZXh0JztcbmV4cG9ydCB7Tm9QcmVsb2FkaW5nLCBQcmVsb2FkQWxsTW9kdWxlcywgUHJlbG9hZGluZ1N0cmF0ZWd5LCBSb3V0ZXJQcmVsb2FkZXJ9IGZyb20gJy4vcm91dGVyX3ByZWxvYWRlcic7XG5leHBvcnQge0FjdGl2YXRlZFJvdXRlLCBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90LCBSb3V0ZXJTdGF0ZSwgUm91dGVyU3RhdGVTbmFwc2hvdH0gZnJvbSAnLi9yb3V0ZXJfc3RhdGUnO1xuZXhwb3J0IHtjb252ZXJ0VG9QYXJhbU1hcCwgZGVmYXVsdFVybE1hdGNoZXIsIFBhcmFtTWFwLCBQYXJhbXMsIFBSSU1BUllfT1VUTEVUfSBmcm9tICcuL3NoYXJlZCc7XG5leHBvcnQge1VybEhhbmRsaW5nU3RyYXRlZ3l9IGZyb20gJy4vdXJsX2hhbmRsaW5nX3N0cmF0ZWd5JztcbmV4cG9ydCB7RGVmYXVsdFVybFNlcmlhbGl6ZXIsIElzQWN0aXZlTWF0Y2hPcHRpb25zLCBVcmxTZWdtZW50LCBVcmxTZWdtZW50R3JvdXAsIFVybFNlcmlhbGl6ZXIsIFVybFRyZWV9IGZyb20gJy4vdXJsX3RyZWUnO1xuZXhwb3J0IHtWRVJTSU9OfSBmcm9tICcuL3ZlcnNpb24nO1xuXG5leHBvcnQgKiBmcm9tICcuL3ByaXZhdGVfZXhwb3J0JztcbiJdfQ==