/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { createInjectorWithoutInjectorInstances } from '../di/create_injector';
import { getNullInjector, R3Injector } from '../di/r3_injector';
import { ComponentFactoryResolver as viewEngine_ComponentFactoryResolver } from '../linker/component_factory_resolver';
import { NgModuleFactory as viewEngine_NgModuleFactory, NgModuleRef as viewEngine_NgModuleRef } from '../linker/ng_module_factory';
import { assertDefined } from '../util/assert';
import { stringify } from '../util/stringify';
import { ComponentFactoryResolver } from './component_ref';
import { getNgModuleDef } from './definition';
import { maybeUnwrapFn } from './util/misc_utils';
/**
 * Returns a new NgModuleRef instance based on the NgModule class and parent injector provided.
 *
 * @param ngModule NgModule class.
 * @param parentInjector Optional injector instance to use as a parent for the module injector. If
 *     not provided, `NullInjector` will be used instead.
 * @returns NgModuleRef that represents an NgModule instance.
 *
 * @publicApi
 */
export function createNgModule(ngModule, parentInjector) {
    return new NgModuleRef(ngModule, parentInjector ?? null);
}
/**
 * The `createNgModule` function alias for backwards-compatibility.
 * Please avoid using it directly and use `createNgModule` instead.
 *
 * @deprecated Use `createNgModule` instead.
 */
export const createNgModuleRef = createNgModule;
export class NgModuleRef extends viewEngine_NgModuleRef {
    constructor(ngModuleType, _parent) {
        super();
        this._parent = _parent;
        // tslint:disable-next-line:require-internal-with-underscore
        this._bootstrapComponents = [];
        this.destroyCbs = [];
        // When bootstrapping a module we have a dependency graph that looks like this:
        // ApplicationRef -> ComponentFactoryResolver -> NgModuleRef. The problem is that if the
        // module being resolved tries to inject the ComponentFactoryResolver, it'll create a
        // circular dependency which will result in a runtime error, because the injector doesn't
        // exist yet. We work around the issue by creating the ComponentFactoryResolver ourselves
        // and providing it, rather than letting the injector resolve it.
        this.componentFactoryResolver = new ComponentFactoryResolver(this);
        const ngModuleDef = getNgModuleDef(ngModuleType);
        ngDevMode &&
            assertDefined(ngModuleDef, `NgModule '${stringify(ngModuleType)}' is not a subtype of 'NgModuleType'.`);
        this._bootstrapComponents = maybeUnwrapFn(ngModuleDef.bootstrap);
        this._r3Injector = createInjectorWithoutInjectorInstances(ngModuleType, _parent, [
            { provide: viewEngine_NgModuleRef, useValue: this }, {
                provide: viewEngine_ComponentFactoryResolver,
                useValue: this.componentFactoryResolver
            }
        ], stringify(ngModuleType), new Set(['environment']));
        // We need to resolve the injector types separately from the injector creation, because
        // the module might be trying to use this ref in its constructor for DI which will cause a
        // circular error that will eventually error out, because the injector isn't created yet.
        this._r3Injector.resolveInjectorInitializers();
        this.instance = this._r3Injector.get(ngModuleType);
    }
    get injector() {
        return this._r3Injector;
    }
    destroy() {
        ngDevMode && assertDefined(this.destroyCbs, 'NgModule already destroyed');
        const injector = this._r3Injector;
        !injector.destroyed && injector.destroy();
        this.destroyCbs.forEach(fn => fn());
        this.destroyCbs = null;
    }
    onDestroy(callback) {
        ngDevMode && assertDefined(this.destroyCbs, 'NgModule already destroyed');
        this.destroyCbs.push(callback);
    }
}
export class NgModuleFactory extends viewEngine_NgModuleFactory {
    constructor(moduleType) {
        super();
        this.moduleType = moduleType;
    }
    create(parentInjector) {
        return new NgModuleRef(this.moduleType, parentInjector);
    }
}
class EnvironmentNgModuleRefAdapter extends viewEngine_NgModuleRef {
    constructor(providers, parent, source) {
        super();
        this.componentFactoryResolver = new ComponentFactoryResolver(this);
        this.instance = null;
        const injector = new R3Injector([
            ...providers,
            { provide: viewEngine_NgModuleRef, useValue: this },
            { provide: viewEngine_ComponentFactoryResolver, useValue: this.componentFactoryResolver },
        ], parent || getNullInjector(), source, new Set(['environment']));
        this.injector = injector;
        injector.resolveInjectorInitializers();
    }
    destroy() {
        this.injector.destroy();
    }
    onDestroy(callback) {
        this.injector.onDestroy(callback);
    }
}
/**
 * Create a new environment injector.
 *
 * Learn more about environment injectors in
 * [this guide](guide/standalone-components#environment-injectors).
 *
 * @param providers An array of providers.
 * @param parent A parent environment injector.
 * @param debugName An optional name for this injector instance, which will be used in error
 *     messages.
 *
 * @publicApi
 */
export function createEnvironmentInjector(providers, parent, debugName = null) {
    const adapter = new EnvironmentNgModuleRefAdapter(providers, parent, debugName);
    return adapter.injector;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfbW9kdWxlX3JlZi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL3JlbmRlcjMvbmdfbW9kdWxlX3JlZi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsc0NBQXNDLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUc3RSxPQUFPLEVBQXNCLGVBQWUsRUFBRSxVQUFVLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUVuRixPQUFPLEVBQUMsd0JBQXdCLElBQUksbUNBQW1DLEVBQUMsTUFBTSxzQ0FBc0MsQ0FBQztBQUNySCxPQUFPLEVBQXNCLGVBQWUsSUFBSSwwQkFBMEIsRUFBRSxXQUFXLElBQUksc0JBQXNCLEVBQUMsTUFBTSw2QkFBNkIsQ0FBQztBQUN0SixPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDN0MsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBRTVDLE9BQU8sRUFBQyx3QkFBd0IsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pELE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFDNUMsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBRWhEOzs7Ozs7Ozs7R0FTRztBQUNILE1BQU0sVUFBVSxjQUFjLENBQzFCLFFBQWlCLEVBQUUsY0FBeUI7SUFDOUMsT0FBTyxJQUFJLFdBQVcsQ0FBSSxRQUFRLEVBQUUsY0FBYyxJQUFJLElBQUksQ0FBQyxDQUFDO0FBQzlELENBQUM7QUFFRDs7Ozs7R0FLRztBQUNILE1BQU0sQ0FBQyxNQUFNLGlCQUFpQixHQUFHLGNBQWMsQ0FBQztBQUNoRCxNQUFNLE9BQU8sV0FBZSxTQUFRLHNCQUF5QjtJQWlCM0QsWUFBWSxZQUFxQixFQUFTLE9BQXNCO1FBQzlELEtBQUssRUFBRSxDQUFDO1FBRGdDLFlB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RUFBQztZQUNqRCxFQUFDLE9BQU8sRUFBRSxtQ0FBbUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLHdCQUF3QixFQUFDO1NBQ3hGLEVBQ0QsTUFBTSxJQUFJLGVBQWUsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuRSxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixRQUFRLENBQUMsMkJBQTJCLEVBQUUsQ0FBQztJQUN6QyxDQUFDO0lBRVEsT0FBTztRQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDMUIsQ0FBQztJQUVRLFNBQVMsQ0FBQyxRQUFvQjtRQUNyQyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNwQyxDQUFDO0NBQ0Y7QUFFRDs7Ozs7Ozs7Ozs7O0dBWUc7QUFDSCxNQUFNLFVBQVUseUJBQXlCLENBQ3JDLFNBQStDLEVBQUUsTUFBMkIsRUFDNUUsWUFBeUIsSUFBSTtJQUMvQixNQUFNLE9BQU8sR0FBRyxJQUFJLDZCQUE2QixDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDaEYsT0FBTyxPQUFPLENBQUMsUUFBUSxDQUFDO0FBQzFCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtjcmVhdGVJbmplY3RvcldpdGhvdXRJbmplY3Rvckluc3RhbmNlc30gZnJvbSAnLi4vZGkvY3JlYXRlX2luamVjdG9yJztcbmltcG9ydCB7SW5qZWN0b3J9IGZyb20gJy4uL2RpL2luamVjdG9yJztcbmltcG9ydCB7RW52aXJvbm1lbnRQcm92aWRlcnMsIFByb3ZpZGVyfSBmcm9tICcuLi9kaS9pbnRlcmZhY2UvcHJvdmlkZXInO1xuaW1wb3J0IHtFbnZpcm9ubWVudEluamVjdG9yLCBnZXROdWxsSW5qZWN0b3IsIFIzSW5qZWN0b3J9IGZyb20gJy4uL2RpL3IzX2luamVjdG9yJztcbmltcG9ydCB7VHlwZX0gZnJvbSAnLi4vaW50ZXJmYWNlL3R5cGUnO1xuaW1wb3J0IHtDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIgYXMgdmlld0VuZ2luZV9Db21wb25lbnRGYWN0b3J5UmVzb2x2ZXJ9IGZyb20gJy4uL2xpbmtlci9jb21wb25lbnRfZmFjdG9yeV9yZXNvbHZlcic7XG5pbXBvcnQge0ludGVybmFsTmdNb2R1bGVSZWYsIE5nTW9kdWxlRmFjdG9yeSBhcyB2aWV3RW5naW5lX05nTW9kdWxlRmFjdG9yeSwgTmdNb2R1bGVSZWYgYXMgdmlld0VuZ2luZV9OZ01vZHVsZVJlZn0gZnJvbSAnLi4vbGlua2VyL25nX21vZHVsZV9mYWN0b3J5JztcbmltcG9ydCB7YXNzZXJ0RGVmaW5lZH0gZnJvbSAnLi4vdXRpbC9hc3NlcnQnO1xuaW1wb3J0IHtzdHJpbmdpZnl9IGZyb20gJy4uL3V0aWwvc3RyaW5naWZ5JztcblxuaW1wb3J0IHtDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXJ9IGZyb20gJy4vY29tcG9uZW50X3JlZic7XG5pbXBvcnQge2dldE5nTW9kdWxlRGVmfSBmcm9tICcuL2RlZmluaXRpb24nO1xuaW1wb3J0IHttYXliZVVud3JhcEZufSBmcm9tICcuL3V0aWwvbWlzY191dGlscyc7XG5cbi8qKlxuICogUmV0dXJucyBhIG5ldyBOZ01vZHVsZVJlZiBpbnN0YW5jZSBiYXNlZCBvbiB0aGUgTmdNb2R1bGUgY2xhc3MgYW5kIHBhcmVudCBpbmplY3RvciBwcm92aWRlZC5cbiAqXG4gKiBAcGFyYW0gbmdNb2R1bGUgTmdNb2R1bGUgY2xhc3MuXG4gKiBAcGFyYW0gcGFyZW50SW5qZWN0b3IgT3B0aW9uYWwgaW5qZWN0b3IgaW5zdGFuY2UgdG8gdXNlIGFzIGEgcGFyZW50IGZvciB0aGUgbW9kdWxlIGluamVjdG9yLiBJZlxuICogICAgIG5vdCBwcm92aWRlZCwgYE51bGxJbmplY3RvcmAgd2lsbCBiZSB1c2VkIGluc3RlYWQuXG4gKiBAcmV0dXJucyBOZ01vZHVsZVJlZiB0aGF0IHJlcHJlc2VudHMgYW4gTmdNb2R1bGUgaW5zdGFuY2UuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTmdNb2R1bGU8VD4oXG4gICAgbmdNb2R1bGU6IFR5cGU8VD4sIHBhcmVudEluamVjdG9yPzogSW5qZWN0b3IpOiB2aWV3RW5naW5lX05nTW9kdWxlUmVmPFQ+IHtcbiAgcmV0dXJuIG5ldyBOZ01vZHVsZVJlZjxUPihuZ01vZHVsZSwgcGFyZW50SW5qZWN0b3IgPz8gbnVsbCk7XG59XG5cbi8qKlxuICogVGhlIGBjcmVhdGVOZ01vZHVsZWAgZnVuY3Rpb24gYWxpYXMgZm9yIGJhY2t3YXJkcy1jb21wYXRpYmlsaXR5LlxuICogUGxlYXNlIGF2b2lkIHVzaW5nIGl0IGRpcmVjdGx5IGFuZCB1c2UgYGNyZWF0ZU5nTW9kdWxlYCBpbnN0ZWFkLlxuICpcbiAqIEBkZXByZWNhdGVkIFVzZSBgY3JlYXRlTmdNb2R1bGVgIGluc3RlYWQuXG4gKi9cbmV4cG9ydCBjb25zdCBjcmVhdGVOZ01vZHVsZVJlZiA9IGNyZWF0ZU5nTW9kdWxlO1xuZXhwb3J0IGNsYXNzIE5nTW9kdWxlUmVmPFQ+IGV4dGVuZHMgdmlld0VuZ2luZV9OZ01vZHVsZVJlZjxUPiBpbXBsZW1lbnRzIEludGVybmFsTmdNb2R1bGVSZWY8VD4ge1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6cmVxdWlyZS1pbnRlcm5hbC13aXRoLXVuZGVyc2NvcmVcbiAgX2Jvb3RzdHJhcENvbXBvbmVudHM6IFR5cGU8YW55PltdID0gW107XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpyZXF1aXJlLWludGVybmFsLXdpdGgtdW5kZXJzY29yZVxuICBfcjNJbmplY3RvcjogUjNJbmplY3RvcjtcbiAgb3ZlcnJpZGUgaW5zdGFuY2U6IFQ7XG4gIGRlc3Ryb3lDYnM6ICgoKSA9PiB2b2lkKVtdfG51bGwgPSBbXTtcblxuICAvLyBXaGVuIGJvb3RzdHJhcHBpbmcgYSBtb2R1bGUgd2UgaGF2ZSBhIGRlcGVuZGVuY3kgZ3JhcGggdGhhdCBsb29rcyBsaWtlIHRoaXM6XG4gIC8vIEFwcGxpY2F0aW9uUmVmIC0+IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlciAtPiBOZ01vZHVsZVJlZi4gVGhlIHByb2JsZW0gaXMgdGhhdCBpZiB0aGVcbiAgLy8gbW9kdWxlIGJlaW5nIHJlc29sdmVkIHRyaWVzIHRvIGluamVjdCB0aGUgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLCBpdCdsbCBjcmVhdGUgYVxuICAvLyBjaXJjdWxhciBkZXBlbmRlbmN5IHdoaWNoIHdpbGwgcmVzdWx0IGluIGEgcnVudGltZSBlcnJvciwgYmVjYXVzZSB0aGUgaW5qZWN0b3IgZG9lc24ndFxuICAvLyBleGlzdCB5ZXQuIFdlIHdvcmsgYXJvdW5kIHRoZSBpc3N1ZSBieSBjcmVhdGluZyB0aGUgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyIG91cnNlbHZlc1xuICAvLyBhbmQgcHJvdmlkaW5nIGl0LCByYXRoZXIgdGhhbiBsZXR0aW5nIHRoZSBpbmplY3RvciByZXNvbHZlIGl0LlxuICBvdmVycmlkZSByZWFkb25seSBjb21wb25lbnRGYWN0b3J5UmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlciA9XG4gICAgICBuZXcgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyKHRoaXMpO1xuXG4gIGNvbnN0cnVjdG9yKG5nTW9kdWxlVHlwZTogVHlwZTxUPiwgcHVibGljIF9wYXJlbnQ6IEluamVjdG9yfG51bGwpIHtcbiAgICBzdXBlcigpO1xuICAgIGNvbnN0IG5nTW9kdWxlRGVmID0gZ2V0TmdNb2R1bGVEZWYobmdNb2R1bGVUeXBlKTtcbiAgICBuZ0Rldk1vZGUgJiZcbiAgICAgICAgYXNzZXJ0RGVmaW5lZChcbiAgICAgICAgICAgIG5nTW9kdWxlRGVmLFxuICAgICAgICAgICAgYE5nTW9kdWxlICcke3N0cmluZ2lmeShuZ01vZHVsZVR5cGUpfScgaXMgbm90IGEgc3VidHlwZSBvZiAnTmdNb2R1bGVUeXBlJy5gKTtcblxuICAgIHRoaXMuX2Jvb3RzdHJhcENvbXBvbmVudHMgPSBtYXliZVVud3JhcEZuKG5nTW9kdWxlRGVmIS5ib290c3RyYXApO1xuICAgIHRoaXMuX3IzSW5qZWN0b3IgPSBjcmVhdGVJbmplY3RvcldpdGhvdXRJbmplY3Rvckluc3RhbmNlcyhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG5nTW9kdWxlVHlwZSwgX3BhcmVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3Byb3ZpZGU6IHZpZXdFbmdpbmVfTmdNb2R1bGVSZWYsIHVzZVZhbHVlOiB0aGlzfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3ZpZGU6IHZpZXdFbmdpbmVfQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZVZhbHVlOiB0aGlzLmNvbXBvbmVudEZhY3RvcnlSZXNvbHZlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyaW5naWZ5KG5nTW9kdWxlVHlwZSksIG5ldyBTZXQoWydlbnZpcm9ubWVudCddKSkgYXMgUjNJbmplY3RvcjtcblxuICAgIC8vIFdlIG5lZWQgdG8gcmVzb2x2ZSB0aGUgaW5qZWN0b3IgdHlwZXMgc2VwYXJhdGVseSBmcm9tIHRoZSBpbmplY3RvciBjcmVhdGlvbiwgYmVjYXVzZVxuICAgIC8vIHRoZSBtb2R1bGUgbWlnaHQgYmUgdHJ5aW5nIHRvIHVzZSB0aGlzIHJlZiBpbiBpdHMgY29uc3RydWN0b3IgZm9yIERJIHdoaWNoIHdpbGwgY2F1c2UgYVxuICAgIC8vIGNpcmN1bGFyIGVycm9yIHRoYXQgd2lsbCBldmVudHVhbGx5IGVycm9yIG91dCwgYmVjYXVzZSB0aGUgaW5qZWN0b3IgaXNuJ3QgY3JlYXRlZCB5ZXQuXG4gICAgdGhpcy5fcjNJbmplY3Rvci5yZXNvbHZlSW5qZWN0b3JJbml0aWFsaXplcnMoKTtcbiAgICB0aGlzLmluc3RhbmNlID0gdGhpcy5fcjNJbmplY3Rvci5nZXQobmdNb2R1bGVUeXBlKTtcbiAgfVxuXG4gIG92ZXJyaWRlIGdldCBpbmplY3RvcigpOiBFbnZpcm9ubWVudEluamVjdG9yIHtcbiAgICByZXR1cm4gdGhpcy5fcjNJbmplY3RvcjtcbiAgfVxuXG4gIG92ZXJyaWRlIGRlc3Ryb3koKTogdm9pZCB7XG4gICAgbmdEZXZNb2RlICYmIGFzc2VydERlZmluZWQodGhpcy5kZXN0cm95Q2JzLCAnTmdNb2R1bGUgYWxyZWFkeSBkZXN0cm95ZWQnKTtcbiAgICBjb25zdCBpbmplY3RvciA9IHRoaXMuX3IzSW5qZWN0b3I7XG4gICAgIWluamVjdG9yLmRlc3Ryb3llZCAmJiBpbmplY3Rvci5kZXN0cm95KCk7XG4gICAgdGhpcy5kZXN0cm95Q2JzIS5mb3JFYWNoKGZuID0+IGZuKCkpO1xuICAgIHRoaXMuZGVzdHJveUNicyA9IG51bGw7XG4gIH1cbiAgb3ZlcnJpZGUgb25EZXN0cm95KGNhbGxiYWNrOiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgbmdEZXZNb2RlICYmIGFzc2VydERlZmluZWQodGhpcy5kZXN0cm95Q2JzLCAnTmdNb2R1bGUgYWxyZWFkeSBkZXN0cm95ZWQnKTtcbiAgICB0aGlzLmRlc3Ryb3lDYnMhLnB1c2goY2FsbGJhY2spO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBOZ01vZHVsZUZhY3Rvcnk8VD4gZXh0ZW5kcyB2aWV3RW5naW5lX05nTW9kdWxlRmFjdG9yeTxUPiB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBtb2R1bGVUeXBlOiBUeXBlPFQ+KSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIG92ZXJyaWRlIGNyZWF0ZShwYXJlbnRJbmplY3RvcjogSW5qZWN0b3J8bnVsbCk6IHZpZXdFbmdpbmVfTmdNb2R1bGVSZWY8VD4ge1xuICAgIHJldHVybiBuZXcgTmdNb2R1bGVSZWYodGhpcy5tb2R1bGVUeXBlLCBwYXJlbnRJbmplY3Rvcik7XG4gIH1cbn1cblxuY2xhc3MgRW52aXJvbm1lbnROZ01vZHVsZVJlZkFkYXB0ZXIgZXh0ZW5kcyB2aWV3RW5naW5lX05nTW9kdWxlUmVmPG51bGw+IHtcbiAgb3ZlcnJpZGUgcmVhZG9ubHkgaW5qZWN0b3I6IEVudmlyb25tZW50SW5qZWN0b3I7XG4gIG92ZXJyaWRlIHJlYWRvbmx5IGNvbXBvbmVudEZhY3RvcnlSZXNvbHZlcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyID1cbiAgICAgIG5ldyBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIodGhpcyk7XG4gIG92ZXJyaWRlIHJlYWRvbmx5IGluc3RhbmNlID0gbnVsbDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByb3ZpZGVyczogQXJyYXk8UHJvdmlkZXJ8RW52aXJvbm1lbnRQcm92aWRlcnM+LCBwYXJlbnQ6IEVudmlyb25tZW50SW5qZWN0b3J8bnVsbCxcbiAgICAgIHNvdXJjZTogc3RyaW5nfG51bGwpIHtcbiAgICBzdXBlcigpO1xuICAgIGNvbnN0IGluamVjdG9yID0gbmV3IFIzSW5qZWN0b3IoXG4gICAgICAgIFtcbiAgICAgICAgICAuLi5wcm92aWRlcnMsXG4gICAgICAgICAge3Byb3ZpZGU6IHZpZXdFbmdpbmVfTmdNb2R1bGVSZWYsIHVzZVZhbHVlOiB0aGlzfSxcbiAgICAgICAgICB7cHJvdmlkZTogdmlld0VuZ2luZV9Db21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsIHVzZVZhbHVlOiB0aGlzLmNvbXBvbmVudEZhY3RvcnlSZXNvbHZlcn0sXG4gICAgICAgIF0sXG4gICAgICAgIHBhcmVudCB8fCBnZXROdWxsSW5qZWN0b3IoKSwgc291cmNlLCBuZXcgU2V0KFsnZW52aXJvbm1lbnQnXSkpO1xuICAgIHRoaXMuaW5qZWN0b3IgPSBpbmplY3RvcjtcbiAgICBpbmplY3Rvci5yZXNvbHZlSW5qZWN0b3JJbml0aWFsaXplcnMoKTtcbiAgfVxuXG4gIG92ZXJyaWRlIGRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5pbmplY3Rvci5kZXN0cm95KCk7XG4gIH1cblxuICBvdmVycmlkZSBvbkRlc3Ryb3koY2FsbGJhY2s6ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgICB0aGlzLmluamVjdG9yLm9uRGVzdHJveShjYWxsYmFjayk7XG4gIH1cbn1cblxuLyoqXG4gKiBDcmVhdGUgYSBuZXcgZW52aXJvbm1lbnQgaW5qZWN0b3IuXG4gKlxuICogTGVhcm4gbW9yZSBhYm91dCBlbnZpcm9ubWVudCBpbmplY3RvcnMgaW5cbiAqIFt0aGlzIGd1aWRlXShndWlkZS9zdGFuZGFsb25lLWNvbXBvbmVudHMjZW52aXJvbm1lbnQtaW5qZWN0b3JzKS5cbiAqXG4gKiBAcGFyYW0gcHJvdmlkZXJzIEFuIGFycmF5IG9mIHByb3ZpZGVycy5cbiAqIEBwYXJhbSBwYXJlbnQgQSBwYXJlbnQgZW52aXJvbm1lbnQgaW5qZWN0b3IuXG4gKiBAcGFyYW0gZGVidWdOYW1lIEFuIG9wdGlvbmFsIG5hbWUgZm9yIHRoaXMgaW5qZWN0b3IgaW5zdGFuY2UsIHdoaWNoIHdpbGwgYmUgdXNlZCBpbiBlcnJvclxuICogICAgIG1lc3NhZ2VzLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUVudmlyb25tZW50SW5qZWN0b3IoXG4gICAgcHJvdmlkZXJzOiBBcnJheTxQcm92aWRlcnxFbnZpcm9ubWVudFByb3ZpZGVycz4sIHBhcmVudDogRW52aXJvbm1lbnRJbmplY3RvcixcbiAgICBkZWJ1Z05hbWU6IHN0cmluZ3xudWxsID0gbnVsbCk6IEVudmlyb25tZW50SW5qZWN0b3Ige1xuICBjb25zdCBhZGFwdGVyID0gbmV3IEVudmlyb25tZW50TmdNb2R1bGVSZWZBZGFwdGVyKHByb3ZpZGVycywgcGFyZW50LCBkZWJ1Z05hbWUpO1xuICByZXR1cm4gYWRhcHRlci5pbmplY3Rvcjtcbn1cbiJdfQ==