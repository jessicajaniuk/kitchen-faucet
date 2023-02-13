/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { assertLContainer } from '../render3/assert';
import { createLView, renderView } from '../render3/instructions/shared';
import { DECLARATION_LCONTAINER, QUERIES } from '../render3/interfaces/view';
import { getCurrentTNode, getLView } from '../render3/state';
import { ViewRef as R3_ViewRef } from '../render3/view_ref';
import { assertDefined } from '../util/assert';
import { createElementRef } from './element_ref';
/**
 * Represents an embedded template that can be used to instantiate embedded views.
 * To instantiate embedded views based on a template, use the `ViewContainerRef`
 * method `createEmbeddedView()`.
 *
 * Access a `TemplateRef` instance by placing a directive on an `<ng-template>`
 * element (or directive prefixed with `*`). The `TemplateRef` for the embedded view
 * is injected into the constructor of the directive,
 * using the `TemplateRef` token.
 *
 * You can also use a `Query` to find a `TemplateRef` associated with
 * a component or a directive.
 *
 * @see `ViewContainerRef`
 * @see [Navigate the Component Tree with DI](guide/dependency-injection-navtree)
 *
 * @publicApi
 */
export class TemplateRef {
}
/**
 * @internal
 * @nocollapse
 */
TemplateRef.__NG_ELEMENT_ID__ = injectTemplateRef;
const ViewEngineTemplateRef = TemplateRef;
// TODO(alxhub): combine interface and implementation. Currently this is challenging since something
// in g3 depends on them being separate.
const R3TemplateRef = class TemplateRef extends ViewEngineTemplateRef {
    constructor(_declarationLView, _declarationTContainer, elementRef) {
        super();
        this._declarationLView = _declarationLView;
        this._declarationTContainer = _declarationTContainer;
        this.elementRef = elementRef;
    }
    /* @internal */
    get ssrId() {
        return this._declarationTContainer.ssrId || null;
    }
    createEmbeddedView(context, injector) {
        return this.createEmbeddedViewImpl(context, injector, null);
    }
    /**
     * @internal
     */
    createEmbeddedViewImpl(context, injector, hydrationInfo) {
        const embeddedTView = this._declarationTContainer.tViews;
        const embeddedLView = createLView(this._declarationLView, embeddedTView, context, 16 /* LViewFlags.CheckAlways */, null, embeddedTView.declTNode, null, null, null, null, injector || null, hydrationInfo);
        const declarationLContainer = this._declarationLView[this._declarationTContainer.index];
        ngDevMode && assertLContainer(declarationLContainer);
        embeddedLView[DECLARATION_LCONTAINER] = declarationLContainer;
        const declarationViewLQueries = this._declarationLView[QUERIES];
        if (declarationViewLQueries !== null) {
            embeddedLView[QUERIES] = declarationViewLQueries.createEmbeddedView(embeddedTView);
        }
        renderView(embeddedTView, embeddedLView, context);
        return new R3_ViewRef(embeddedLView);
    }
};
/**
 * Creates a TemplateRef given a node.
 *
 * @returns The TemplateRef instance to use
 */
export function injectTemplateRef() {
    return createTemplateRef(getCurrentTNode(), getLView());
}
/**
 * Creates a TemplateRef and stores it on the injector.
 *
 * @param hostTNode The node on which a TemplateRef is requested
 * @param hostLView The `LView` to which the node belongs
 * @returns The TemplateRef instance or null if we can't create a TemplateRef on a given node type
 */
export function createTemplateRef(hostTNode, hostLView) {
    if (hostTNode.type & 4 /* TNodeType.Container */) {
        ngDevMode && assertDefined(hostTNode.tViews, 'TView must be allocated');
        return new R3TemplateRef(hostLView, hostTNode, createElementRef(hostTNode, hostLView));
    }
    return null;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGVfcmVmLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS9zcmMvbGlua2VyL3RlbXBsYXRlX3JlZi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFJSCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNuRCxPQUFPLEVBQUMsV0FBVyxFQUFFLFVBQVUsRUFBQyxNQUFNLGdDQUFnQyxDQUFDO0FBRXZFLE9BQU8sRUFBQyxzQkFBc0IsRUFBcUIsT0FBTyxFQUFRLE1BQU0sNEJBQTRCLENBQUM7QUFDckcsT0FBTyxFQUFDLGVBQWUsRUFBRSxRQUFRLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUMzRCxPQUFPLEVBQUMsT0FBTyxJQUFJLFVBQVUsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQzFELE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUU3QyxPQUFPLEVBQUMsZ0JBQWdCLEVBQWEsTUFBTSxlQUFlLENBQUM7QUFHM0Q7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUJHO0FBQ0gsTUFBTSxPQUFnQixXQUFXOztBQW9DL0I7OztHQUdHO0FBQ0ksNkJBQWlCLEdBQWlDLGlCQUFpQixDQUFDO0FBRzdFLE1BQU0scUJBQXFCLEdBQUcsV0FBVyxDQUFDO0FBRTFDLG9HQUFvRztBQUNwRyx3Q0FBd0M7QUFDeEMsTUFBTSxhQUFhLEdBQUcsTUFBTSxXQUFlLFNBQVEscUJBQXdCO0lBQ3pFLFlBQ1ksaUJBQXdCLEVBQVUsc0JBQXNDLEVBQ2hFLFVBQXNCO1FBQ3hDLEtBQUssRUFBRSxDQUFDO1FBRkUsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFPO1FBQVUsMkJBQXNCLEdBQXRCLHNCQUFzQixDQUFnQjtRQUNoRSxlQUFVLEdBQVYsVUFBVSxDQUFZO0lBRTFDLENBQUM7SUFFRCxlQUFlO0lBQ2YsSUFBSSxLQUFLO1FBQ1AsT0FBTyxJQUFJLENBQUMsc0JBQXNCLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQztJQUNuRCxDQUFDO0lBRVEsa0JBQWtCLENBQUMsT0FBVSxFQUFFLFFBQW1CO1FBQ3pELE9BQU8sSUFBSSxDQUFDLHNCQUFzQixDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDOUQsQ0FBQztJQUVEOztPQUVHO0lBQ0gsc0JBQXNCLENBQUMsT0FBVSxFQUFFLFFBQW1CLEVBQUUsYUFBNEI7UUFFbEYsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDLE1BQWUsQ0FBQztRQUNsRSxNQUFNLGFBQWEsR0FBRyxXQUFXLENBQzdCLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxhQUFhLEVBQUUsT0FBTyxtQ0FBMEIsSUFBSSxFQUM1RSxhQUFhLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLElBQUksSUFBSSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBRXRGLE1BQU0scUJBQXFCLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN4RixTQUFTLElBQUksZ0JBQWdCLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQUNyRCxhQUFhLENBQUMsc0JBQXNCLENBQUMsR0FBRyxxQkFBcUIsQ0FBQztRQUU5RCxNQUFNLHVCQUF1QixHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNoRSxJQUFJLHVCQUF1QixLQUFLLElBQUksRUFBRTtZQUNwQyxhQUFhLENBQUMsT0FBTyxDQUFDLEdBQUcsdUJBQXVCLENBQUMsa0JBQWtCLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDcEY7UUFFRCxVQUFVLENBQUMsYUFBYSxFQUFFLGFBQWEsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUVsRCxPQUFPLElBQUksVUFBVSxDQUFJLGFBQWEsQ0FBQyxDQUFDO0lBQzFDLENBQUM7Q0FDRixDQUFDO0FBR0Y7Ozs7R0FJRztBQUNILE1BQU0sVUFBVSxpQkFBaUI7SUFDL0IsT0FBTyxpQkFBaUIsQ0FBSSxlQUFlLEVBQUcsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO0FBQzlELENBQUM7QUFFRDs7Ozs7O0dBTUc7QUFDSCxNQUFNLFVBQVUsaUJBQWlCLENBQUksU0FBZ0IsRUFBRSxTQUFnQjtJQUNyRSxJQUFJLFNBQVMsQ0FBQyxJQUFJLDhCQUFzQixFQUFFO1FBQ3hDLFNBQVMsSUFBSSxhQUFhLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSx5QkFBeUIsQ0FBQyxDQUFDO1FBQ3hFLE9BQU8sSUFBSSxhQUFhLENBQ3BCLFNBQVMsRUFBRSxTQUEyQixFQUFFLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO0tBQ3JGO0lBQ0QsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7SW5qZWN0b3J9IGZyb20gJy4uL2RpL2luamVjdG9yJztcbmltcG9ydCB7TmdoVmlld30gZnJvbSAnLi4vaHlkcmF0aW9uL2ludGVyZmFjZXMnO1xuaW1wb3J0IHthc3NlcnRMQ29udGFpbmVyfSBmcm9tICcuLi9yZW5kZXIzL2Fzc2VydCc7XG5pbXBvcnQge2NyZWF0ZUxWaWV3LCByZW5kZXJWaWV3fSBmcm9tICcuLi9yZW5kZXIzL2luc3RydWN0aW9ucy9zaGFyZWQnO1xuaW1wb3J0IHtUQ29udGFpbmVyTm9kZSwgVE5vZGUsIFROb2RlVHlwZX0gZnJvbSAnLi4vcmVuZGVyMy9pbnRlcmZhY2VzL25vZGUnO1xuaW1wb3J0IHtERUNMQVJBVElPTl9MQ09OVEFJTkVSLCBMVmlldywgTFZpZXdGbGFncywgUVVFUklFUywgVFZpZXd9IGZyb20gJy4uL3JlbmRlcjMvaW50ZXJmYWNlcy92aWV3JztcbmltcG9ydCB7Z2V0Q3VycmVudFROb2RlLCBnZXRMVmlld30gZnJvbSAnLi4vcmVuZGVyMy9zdGF0ZSc7XG5pbXBvcnQge1ZpZXdSZWYgYXMgUjNfVmlld1JlZn0gZnJvbSAnLi4vcmVuZGVyMy92aWV3X3JlZic7XG5pbXBvcnQge2Fzc2VydERlZmluZWR9IGZyb20gJy4uL3V0aWwvYXNzZXJ0JztcblxuaW1wb3J0IHtjcmVhdGVFbGVtZW50UmVmLCBFbGVtZW50UmVmfSBmcm9tICcuL2VsZW1lbnRfcmVmJztcbmltcG9ydCB7RW1iZWRkZWRWaWV3UmVmfSBmcm9tICcuL3ZpZXdfcmVmJztcblxuLyoqXG4gKiBSZXByZXNlbnRzIGFuIGVtYmVkZGVkIHRlbXBsYXRlIHRoYXQgY2FuIGJlIHVzZWQgdG8gaW5zdGFudGlhdGUgZW1iZWRkZWQgdmlld3MuXG4gKiBUbyBpbnN0YW50aWF0ZSBlbWJlZGRlZCB2aWV3cyBiYXNlZCBvbiBhIHRlbXBsYXRlLCB1c2UgdGhlIGBWaWV3Q29udGFpbmVyUmVmYFxuICogbWV0aG9kIGBjcmVhdGVFbWJlZGRlZFZpZXcoKWAuXG4gKlxuICogQWNjZXNzIGEgYFRlbXBsYXRlUmVmYCBpbnN0YW5jZSBieSBwbGFjaW5nIGEgZGlyZWN0aXZlIG9uIGFuIGA8bmctdGVtcGxhdGU+YFxuICogZWxlbWVudCAob3IgZGlyZWN0aXZlIHByZWZpeGVkIHdpdGggYCpgKS4gVGhlIGBUZW1wbGF0ZVJlZmAgZm9yIHRoZSBlbWJlZGRlZCB2aWV3XG4gKiBpcyBpbmplY3RlZCBpbnRvIHRoZSBjb25zdHJ1Y3RvciBvZiB0aGUgZGlyZWN0aXZlLFxuICogdXNpbmcgdGhlIGBUZW1wbGF0ZVJlZmAgdG9rZW4uXG4gKlxuICogWW91IGNhbiBhbHNvIHVzZSBhIGBRdWVyeWAgdG8gZmluZCBhIGBUZW1wbGF0ZVJlZmAgYXNzb2NpYXRlZCB3aXRoXG4gKiBhIGNvbXBvbmVudCBvciBhIGRpcmVjdGl2ZS5cbiAqXG4gKiBAc2VlIGBWaWV3Q29udGFpbmVyUmVmYFxuICogQHNlZSBbTmF2aWdhdGUgdGhlIENvbXBvbmVudCBUcmVlIHdpdGggREldKGd1aWRlL2RlcGVuZGVuY3ktaW5qZWN0aW9uLW5hdnRyZWUpXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgVGVtcGxhdGVSZWY8Qz4ge1xuICAvKipcbiAgICogVGhlIGFuY2hvciBlbGVtZW50IGluIHRoZSBwYXJlbnQgdmlldyBmb3IgdGhpcyBlbWJlZGRlZCB2aWV3LlxuICAgKlxuICAgKiBUaGUgZGF0YS1iaW5kaW5nIGFuZCBpbmplY3Rpb24gY29udGV4dHMgb2YgZW1iZWRkZWQgdmlld3MgY3JlYXRlZCBmcm9tIHRoaXMgYFRlbXBsYXRlUmVmYFxuICAgKiBpbmhlcml0IGZyb20gdGhlIGNvbnRleHRzIG9mIHRoaXMgbG9jYXRpb24uXG4gICAqXG4gICAqIFR5cGljYWxseSBuZXcgZW1iZWRkZWQgdmlld3MgYXJlIGF0dGFjaGVkIHRvIHRoZSB2aWV3IGNvbnRhaW5lciBvZiB0aGlzIGxvY2F0aW9uLCBidXQgaW5cbiAgICogYWR2YW5jZWQgdXNlLWNhc2VzLCB0aGUgdmlldyBjYW4gYmUgYXR0YWNoZWQgdG8gYSBkaWZmZXJlbnQgY29udGFpbmVyIHdoaWxlIGtlZXBpbmcgdGhlXG4gICAqIGRhdGEtYmluZGluZyBhbmQgaW5qZWN0aW9uIGNvbnRleHQgZnJvbSB0aGUgb3JpZ2luYWwgbG9jYXRpb24uXG4gICAqXG4gICAqL1xuICAvLyBUT0RPKGkpOiByZW5hbWUgdG8gYW5jaG9yIG9yIGxvY2F0aW9uXG4gIGFic3RyYWN0IHJlYWRvbmx5IGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY7XG5cbiAgLyoqXG4gICAqIEluc3RhbnRpYXRlcyBhbiB1bmF0dGFjaGVkIGVtYmVkZGVkIHZpZXcgYmFzZWQgb24gdGhpcyB0ZW1wbGF0ZS5cbiAgICogQHBhcmFtIGNvbnRleHQgVGhlIGRhdGEtYmluZGluZyBjb250ZXh0IG9mIHRoZSBlbWJlZGRlZCB2aWV3LCBhcyBkZWNsYXJlZFxuICAgKiBpbiB0aGUgYDxuZy10ZW1wbGF0ZT5gIHVzYWdlLlxuICAgKiBAcGFyYW0gaW5qZWN0b3IgSW5qZWN0b3IgdG8gYmUgdXNlZCB3aXRoaW4gdGhlIGVtYmVkZGVkIHZpZXcuXG4gICAqIEByZXR1cm5zIFRoZSBuZXcgZW1iZWRkZWQgdmlldyBvYmplY3QuXG4gICAqL1xuICBhYnN0cmFjdCBjcmVhdGVFbWJlZGRlZFZpZXcoY29udGV4dDogQywgaW5qZWN0b3I/OiBJbmplY3Rvcik6IEVtYmVkZGVkVmlld1JlZjxDPjtcblxuICAvKipcbiAgICogSW1wbGVtZW50YXRpb24gb2YgdGhlIGBjcmVhdGVFbWJlZGRlZFZpZXdgIGZ1bmN0aW9uLlxuICAgKlxuICAgKiBUaGlzIGltcGxlbWVudGF0aW9uIGlzIGludGVybmFsIGFuZCBhbGxvd3MgZnJhbWV3b3JrIGNvZGVcbiAgICogdG8gaW52b2tlIGl0IHdpdGggZXh0cmEgcGFyYW1ldGVycyAoZS5nLiBmb3IgaHlkcmF0aW9uKSB3aXRob3V0XG4gICAqIGFmZmVjdGluZyBwdWJsaWMgQVBJLlxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIGFic3RyYWN0IGNyZWF0ZUVtYmVkZGVkVmlld0ltcGwoY29udGV4dDogQywgaW5qZWN0b3I/OiBJbmplY3RvciwgaHlkcmF0aW9uSW5mbz86IE5naFZpZXd8bnVsbCk6XG4gICAgICBFbWJlZGRlZFZpZXdSZWY8Qz47XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKiBAbm9jb2xsYXBzZVxuICAgKi9cbiAgc3RhdGljIF9fTkdfRUxFTUVOVF9JRF9fOiAoKSA9PiBUZW1wbGF0ZVJlZjxhbnk+fCBudWxsID0gaW5qZWN0VGVtcGxhdGVSZWY7XG59XG5cbmNvbnN0IFZpZXdFbmdpbmVUZW1wbGF0ZVJlZiA9IFRlbXBsYXRlUmVmO1xuXG4vLyBUT0RPKGFseGh1Yik6IGNvbWJpbmUgaW50ZXJmYWNlIGFuZCBpbXBsZW1lbnRhdGlvbi4gQ3VycmVudGx5IHRoaXMgaXMgY2hhbGxlbmdpbmcgc2luY2Ugc29tZXRoaW5nXG4vLyBpbiBnMyBkZXBlbmRzIG9uIHRoZW0gYmVpbmcgc2VwYXJhdGUuXG5jb25zdCBSM1RlbXBsYXRlUmVmID0gY2xhc3MgVGVtcGxhdGVSZWY8VD4gZXh0ZW5kcyBWaWV3RW5naW5lVGVtcGxhdGVSZWY8VD4ge1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgX2RlY2xhcmF0aW9uTFZpZXc6IExWaWV3LCBwcml2YXRlIF9kZWNsYXJhdGlvblRDb250YWluZXI6IFRDb250YWluZXJOb2RlLFxuICAgICAgcHVibGljIG92ZXJyaWRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgLyogQGludGVybmFsICovXG4gIGdldCBzc3JJZCgpOiBzdHJpbmd8bnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuX2RlY2xhcmF0aW9uVENvbnRhaW5lci5zc3JJZCB8fCBudWxsO1xuICB9XG5cbiAgb3ZlcnJpZGUgY3JlYXRlRW1iZWRkZWRWaWV3KGNvbnRleHQ6IFQsIGluamVjdG9yPzogSW5qZWN0b3IpOiBFbWJlZGRlZFZpZXdSZWY8VD4ge1xuICAgIHJldHVybiB0aGlzLmNyZWF0ZUVtYmVkZGVkVmlld0ltcGwoY29udGV4dCwgaW5qZWN0b3IsIG51bGwpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgY3JlYXRlRW1iZWRkZWRWaWV3SW1wbChjb250ZXh0OiBULCBpbmplY3Rvcj86IEluamVjdG9yLCBoeWRyYXRpb25JbmZvPzogTmdoVmlld3xudWxsKTpcbiAgICAgIEVtYmVkZGVkVmlld1JlZjxUPiB7XG4gICAgY29uc3QgZW1iZWRkZWRUVmlldyA9IHRoaXMuX2RlY2xhcmF0aW9uVENvbnRhaW5lci50Vmlld3MgYXMgVFZpZXc7XG4gICAgY29uc3QgZW1iZWRkZWRMVmlldyA9IGNyZWF0ZUxWaWV3KFxuICAgICAgICB0aGlzLl9kZWNsYXJhdGlvbkxWaWV3LCBlbWJlZGRlZFRWaWV3LCBjb250ZXh0LCBMVmlld0ZsYWdzLkNoZWNrQWx3YXlzLCBudWxsLFxuICAgICAgICBlbWJlZGRlZFRWaWV3LmRlY2xUTm9kZSwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgaW5qZWN0b3IgfHwgbnVsbCwgaHlkcmF0aW9uSW5mbyk7XG5cbiAgICBjb25zdCBkZWNsYXJhdGlvbkxDb250YWluZXIgPSB0aGlzLl9kZWNsYXJhdGlvbkxWaWV3W3RoaXMuX2RlY2xhcmF0aW9uVENvbnRhaW5lci5pbmRleF07XG4gICAgbmdEZXZNb2RlICYmIGFzc2VydExDb250YWluZXIoZGVjbGFyYXRpb25MQ29udGFpbmVyKTtcbiAgICBlbWJlZGRlZExWaWV3W0RFQ0xBUkFUSU9OX0xDT05UQUlORVJdID0gZGVjbGFyYXRpb25MQ29udGFpbmVyO1xuXG4gICAgY29uc3QgZGVjbGFyYXRpb25WaWV3TFF1ZXJpZXMgPSB0aGlzLl9kZWNsYXJhdGlvbkxWaWV3W1FVRVJJRVNdO1xuICAgIGlmIChkZWNsYXJhdGlvblZpZXdMUXVlcmllcyAhPT0gbnVsbCkge1xuICAgICAgZW1iZWRkZWRMVmlld1tRVUVSSUVTXSA9IGRlY2xhcmF0aW9uVmlld0xRdWVyaWVzLmNyZWF0ZUVtYmVkZGVkVmlldyhlbWJlZGRlZFRWaWV3KTtcbiAgICB9XG5cbiAgICByZW5kZXJWaWV3KGVtYmVkZGVkVFZpZXcsIGVtYmVkZGVkTFZpZXcsIGNvbnRleHQpO1xuXG4gICAgcmV0dXJuIG5ldyBSM19WaWV3UmVmPFQ+KGVtYmVkZGVkTFZpZXcpO1xuICB9XG59O1xuXG5cbi8qKlxuICogQ3JlYXRlcyBhIFRlbXBsYXRlUmVmIGdpdmVuIGEgbm9kZS5cbiAqXG4gKiBAcmV0dXJucyBUaGUgVGVtcGxhdGVSZWYgaW5zdGFuY2UgdG8gdXNlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbmplY3RUZW1wbGF0ZVJlZjxUPigpOiBUZW1wbGF0ZVJlZjxUPnxudWxsIHtcbiAgcmV0dXJuIGNyZWF0ZVRlbXBsYXRlUmVmPFQ+KGdldEN1cnJlbnRUTm9kZSgpISwgZ2V0TFZpZXcoKSk7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIFRlbXBsYXRlUmVmIGFuZCBzdG9yZXMgaXQgb24gdGhlIGluamVjdG9yLlxuICpcbiAqIEBwYXJhbSBob3N0VE5vZGUgVGhlIG5vZGUgb24gd2hpY2ggYSBUZW1wbGF0ZVJlZiBpcyByZXF1ZXN0ZWRcbiAqIEBwYXJhbSBob3N0TFZpZXcgVGhlIGBMVmlld2AgdG8gd2hpY2ggdGhlIG5vZGUgYmVsb25nc1xuICogQHJldHVybnMgVGhlIFRlbXBsYXRlUmVmIGluc3RhbmNlIG9yIG51bGwgaWYgd2UgY2FuJ3QgY3JlYXRlIGEgVGVtcGxhdGVSZWYgb24gYSBnaXZlbiBub2RlIHR5cGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVRlbXBsYXRlUmVmPFQ+KGhvc3RUTm9kZTogVE5vZGUsIGhvc3RMVmlldzogTFZpZXcpOiBUZW1wbGF0ZVJlZjxUPnxudWxsIHtcbiAgaWYgKGhvc3RUTm9kZS50eXBlICYgVE5vZGVUeXBlLkNvbnRhaW5lcikge1xuICAgIG5nRGV2TW9kZSAmJiBhc3NlcnREZWZpbmVkKGhvc3RUTm9kZS50Vmlld3MsICdUVmlldyBtdXN0IGJlIGFsbG9jYXRlZCcpO1xuICAgIHJldHVybiBuZXcgUjNUZW1wbGF0ZVJlZihcbiAgICAgICAgaG9zdExWaWV3LCBob3N0VE5vZGUgYXMgVENvbnRhaW5lck5vZGUsIGNyZWF0ZUVsZW1lbnRSZWYoaG9zdFROb2RlLCBob3N0TFZpZXcpKTtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cbiJdfQ==