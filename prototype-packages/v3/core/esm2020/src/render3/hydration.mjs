/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { first } from 'rxjs/operators';
import { ApplicationRef } from '../application_ref';
import { ENVIRONMENT_INITIALIZER, inject, InjectionToken } from '@angular/core';
import { assertDefined } from '../util/assert';
import { readPatchedLView } from './context_discovery';
import { CONTAINER_HEADER_OFFSET, DEHYDRATED_VIEWS } from './interfaces/container';
import { isLContainer, isRootView } from './interfaces/type_checks';
import { HEADER_OFFSET, TVIEW } from './interfaces/view';
import { getNativeByTNode, unwrapRNode } from './util/view_utils';
export const IS_HYDRATION_ENABLED = new InjectionToken("IS_HYDRATION_ENABLED");
/**
 * @publicApi
 * @developerPreview
 */
export function provideHydrationSupport() {
    // Note: this function can also bring more functionality in a tree-shakable way.
    // For example, by providing hydration-aware implementation of finding nodes vs
    // creating them.
    return [{
            provide: ENVIRONMENT_INITIALIZER,
            useValue: () => {
                const appRef = inject(ApplicationRef);
                // FIXME: there is no need to use a timeout, we need to
                // use a lifecycle hook to start the cleanup after an app
                // becomes stable (similar to how this is handled at SSR time).
                setTimeout(() => {
                    cleanupDehydratedViews(appRef);
                }, 0);
            },
            multi: true,
        },
        {
            provide: IS_HYDRATION_ENABLED,
            useValue: true,
        }];
}
export function getLViewFromRootElement(element) {
    let lView = readPatchedLView(element);
    if (lView && isRootView(lView)) {
        lView = lView[HEADER_OFFSET];
    }
    return lView;
}
function cleanupLContainer(lContainer) {
    // TODO: we may consider doing it an error instead?
    if (lContainer[DEHYDRATED_VIEWS]) {
        for (const view of lContainer[DEHYDRATED_VIEWS]) {
            removeDehydratedView(view);
        }
    }
    for (let i = CONTAINER_HEADER_OFFSET; i < lContainer.length; i++) {
        const childView = lContainer[i];
        cleanupLView(childView);
    }
}
function cleanupLView(lView) {
    const tView = lView[TVIEW];
    for (let i = HEADER_OFFSET; i < tView.bindingStartIndex; i++) {
        if (isLContainer(lView[i])) {
            // this is a container
            const lContainer = lView[i];
            cleanupLContainer(lContainer);
        }
    }
}
function cleanupDehydratedViews(appRef) {
    // Wait once an app becomes stable and cleanup all views that
    // were not claimed during the application bootstrap process.
    return appRef.isStable.pipe(first((isStable) => isStable)).toPromise().then(() => {
        appRef.components.forEach((componentRef) => {
            const element = componentRef.location.nativeElement;
            if (element) {
                const lView = getLViewFromRootElement(element);
                if (lView !== null) {
                    cleanupLView(lView);
                }
            }
        });
    });
}
/**
 * Helper function to remove all nodes from a dehydrated view.
 */
function removeDehydratedView(dehydratedView) {
    let nodesRemoved = 0;
    let currentRNode = dehydratedView.firstChild;
    const numNodes = dehydratedView.numRootNodes;
    while (nodesRemoved < numNodes) {
        currentRNode.remove();
        currentRNode = currentRNode.nextSibling;
        nodesRemoved++;
    }
}
// TODO: consider using WeakMap instead.
export function markRNodeAsClaimedForHydration(node) {
    if (!ngDevMode) {
        throw new Error('Calling `claimNode` in prod mode is not supported and likely a mistake.');
    }
    if (isRNodeClaimedForHydration(node)) {
        throw new Error('Trying to claim a node, which was claimed already.');
    }
    node.__claimed = true;
}
export function isRNodeClaimedForHydration(node) {
    return !!node.__claimed;
}
export function findExistingNode(host, path) {
    let node = host;
    for (const op of path) {
        if (!node) {
            // TODO: add a dev-mode assertion here.
            debugger;
            throw new Error(`findExistingNode: failed to find node at ${path}.`);
        }
        switch (op) {
            case 'firstChild':
                node = node.firstChild;
                break;
            case 'nextSibling':
                node = node.nextSibling;
                break;
        }
    }
    if (!node) {
        // TODO: add a dev-mode assertion here.
        debugger;
        throw new Error(`findExistingNode: failed to find node at ${path}.`);
    }
    return node;
}
function locateRNodeByPath(path, lView) {
    const pathParts = path.split('.');
    // First element is a parent node id: `12.nextSibling...`.
    const firstPathPart = pathParts.shift();
    if (firstPathPart === 'host') {
        return findExistingNode(lView[0], pathParts);
    }
    else {
        const parentElementId = Number(firstPathPart);
        const parentRNode = unwrapRNode(lView[parentElementId + HEADER_OFFSET]);
        return findExistingNode(parentRNode, pathParts);
    }
}
export function locateNextRNode(hydrationInfo, tView, lView, tNode, previousTNode, previousTNodeParent) {
    let native = null;
    const adjustedIndex = tNode.index - HEADER_OFFSET;
    if (hydrationInfo.nodes[adjustedIndex]) {
        // We know exact location of the node.
        native = locateRNodeByPath(hydrationInfo.nodes[adjustedIndex], lView);
        debugger;
    }
    else if (tView.firstChild === tNode) {
        // We create a first node in this view.
        native = hydrationInfo.firstChild;
    }
    else {
        ngDevMode && assertDefined(previousTNode, 'Unexpected state: no current TNode found.');
        const previousRElement = getNativeByTNode(previousTNode, lView);
        // TODO: we may want to use this instead?
        // const closest = getClosestRElement(tView, previousTNode, lView);
        if (previousTNodeParent && previousTNode.type === 8 /* TNodeType.ElementContainer */) {
            // Previous node was an `<ng-container>`, so this node is a first child
            // within an element container, so we can locate the container in ngh data
            // structure and use its first child.
            const sContainer = hydrationInfo.containers[previousTNode.index - HEADER_OFFSET];
            if (ngDevMode && !sContainer) {
                throw new Error('Invalid state.');
            }
            native = sContainer.firstChild;
        }
        else {
            // FIXME: this doesn't work for i18n :(
            // In i18n case, previous tNode is a parent element,
            // when in fact, it might be a text node in front of it.
            if (previousTNodeParent) {
                native = previousRElement.firstChild;
            }
            else {
                native = previousRElement.nextSibling;
            }
        }
    }
    return native;
}
export function siblingAfter(skip, from) {
    let currentNode = from;
    for (let i = 0; i < skip; i++) {
        currentNode = currentNode.nextSibling;
        ngDevMode && assertDefined(currentNode, 'Expected more siblings to be present');
    }
    return currentNode;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHlkcmF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS9zcmMvcmVuZGVyMy9oeWRyYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLEtBQUssRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRXJDLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUNsRCxPQUFPLEVBQUMsdUJBQXVCLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM5RSxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFN0MsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDckQsT0FBTyxFQUFDLHVCQUF1QixFQUFFLGdCQUFnQixFQUFhLE1BQU0sd0JBQXdCLENBQUM7QUFHN0YsT0FBTyxFQUFDLFlBQVksRUFBRSxVQUFVLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUNsRSxPQUFPLEVBQUMsYUFBYSxFQUFpQyxLQUFLLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUN0RixPQUFPLEVBQUMsZ0JBQWdCLEVBQUUsV0FBVyxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFFaEUsTUFBTSxDQUFDLE1BQU0sb0JBQW9CLEdBQUcsSUFBSSxjQUFjLENBQVUsc0JBQXNCLENBQUMsQ0FBQztBQUV4Rjs7O0dBR0c7QUFDSCxNQUFNLFVBQVUsdUJBQXVCO0lBQ3JDLGdGQUFnRjtJQUNoRiwrRUFBK0U7SUFDL0UsaUJBQWlCO0lBQ2pCLE9BQU8sQ0FBQztZQUNOLE9BQU8sRUFBRSx1QkFBdUI7WUFDaEMsUUFBUSxFQUFFLEdBQUcsRUFBRTtnQkFDYixNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUM7Z0JBQ3RDLHVEQUF1RDtnQkFDdkQseURBQXlEO2dCQUN6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dCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtmaXJzdH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQge0FwcGxpY2F0aW9uUmVmfSBmcm9tICcuLi9hcHBsaWNhdGlvbl9yZWYnO1xuaW1wb3J0IHtFTlZJUk9OTUVOVF9JTklUSUFMSVpFUiwgaW5qZWN0LCBJbmplY3Rpb25Ub2tlbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge2Fzc2VydERlZmluZWR9IGZyb20gJy4uL3V0aWwvYXNzZXJ0JztcblxuaW1wb3J0IHtyZWFkUGF0Y2hlZExWaWV3fSBmcm9tICcuL2NvbnRleHRfZGlzY292ZXJ5JztcbmltcG9ydCB7Q09OVEFJTkVSX0hFQURFUl9PRkZTRVQsIERFSFlEUkFURURfVklFV1MsIExDb250YWluZXJ9IGZyb20gJy4vaW50ZXJmYWNlcy9jb250YWluZXInO1xuaW1wb3J0IHtUTm9kZSwgVE5vZGVUeXBlfSBmcm9tICcuL2ludGVyZmFjZXMvbm9kZSc7XG5pbXBvcnQge1JFbGVtZW50LCBSTm9kZX0gZnJvbSAnLi9pbnRlcmZhY2VzL3JlbmRlcmVyX2RvbSc7XG5pbXBvcnQge2lzTENvbnRhaW5lciwgaXNSb290Vmlld30gZnJvbSAnLi9pbnRlcmZhY2VzL3R5cGVfY2hlY2tzJztcbmltcG9ydCB7SEVBREVSX09GRlNFVCwgTFZpZXcsIE5naERvbSwgTmdoVmlldywgVFZpZXcsIFRWSUVXfSBmcm9tICcuL2ludGVyZmFjZXMvdmlldyc7XG5pbXBvcnQge2dldE5hdGl2ZUJ5VE5vZGUsIHVud3JhcFJOb2RlfSBmcm9tICcuL3V0aWwvdmlld191dGlscyc7XG5cbmV4cG9ydCBjb25zdCBJU19IWURSQVRJT05fRU5BQkxFRCA9IG5ldyBJbmplY3Rpb25Ub2tlbjxib29sZWFuPihcIklTX0hZRFJBVElPTl9FTkFCTEVEXCIpO1xuXG4vKipcbiAqIEBwdWJsaWNBcGlcbiAqIEBkZXZlbG9wZXJQcmV2aWV3XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwcm92aWRlSHlkcmF0aW9uU3VwcG9ydCgpIHtcbiAgLy8gTm90ZTogdGhpcyBmdW5jdGlvbiBjYW4gYWxzbyBicmluZyBtb3JlIGZ1bmN0aW9uYWxpdHkgaW4gYSB0cmVlLXNoYWthYmxlIHdheS5cbiAgLy8gRm9yIGV4YW1wbGUsIGJ5IHByb3ZpZGluZyBoeWRyYXRpb24tYXdhcmUgaW1wbGVtZW50YXRpb24gb2YgZmluZGluZyBub2RlcyB2c1xuICAvLyBjcmVhdGluZyB0aGVtLlxuICByZXR1cm4gW3tcbiAgICBwcm92aWRlOiBFTlZJUk9OTUVOVF9JTklUSUFMSVpFUixcbiAgICB1c2VWYWx1ZTogKCkgPT4ge1xuICAgICAgY29uc3QgYXBwUmVmID0gaW5qZWN0KEFwcGxpY2F0aW9uUmVmKTtcbiAgICAgIC8vIEZJWE1FOiB0aGVyZSBpcyBubyBuZWVkIHRvIHVzZSBhIHRpbWVvdXQsIHdlIG5lZWQgdG9cbiAgICAgIC8vIHVzZSBhIGxpZmVjeWNsZSBob29rIHRvIHN0YXJ0IHRoZSBjbGVhbnVwIGFmdGVyIGFuIGFwcFxuICAgICAgLy8gYmVjb21lcyBzdGFibGUgKHNpbWlsYXIgdG8gaG93IHRoaXMgaXMgaGFuZGxlZCBhdCBTU1IgdGltZSkuXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgY2xlYW51cERlaHlkcmF0ZWRWaWV3cyhhcHBSZWYpO1xuICAgICAgfSwgMCk7XG4gICAgfSxcbiAgICBtdWx0aTogdHJ1ZSxcbiAgfSxcbiAge1xuICAgIHByb3ZpZGU6IElTX0hZRFJBVElPTl9FTkFCTEVELFxuICAgIHVzZVZhbHVlOiB0cnVlLFxuICB9XTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldExWaWV3RnJvbVJvb3RFbGVtZW50KGVsZW1lbnQ6IEVsZW1lbnQpOiBMVmlld3xudWxsIHtcbiAgbGV0IGxWaWV3ID0gcmVhZFBhdGNoZWRMVmlldyhlbGVtZW50KTtcbiAgaWYgKGxWaWV3ICYmIGlzUm9vdFZpZXcobFZpZXcpKSB7XG4gICAgbFZpZXcgPSBsVmlld1tIRUFERVJfT0ZGU0VUXTtcbiAgfVxuICByZXR1cm4gbFZpZXc7XG59XG5cbmZ1bmN0aW9uIGNsZWFudXBMQ29udGFpbmVyKGxDb250YWluZXI6IExDb250YWluZXIpIHtcbiAgLy8gVE9ETzogd2UgbWF5IGNvbnNpZGVyIGRvaW5nIGl0IGFuIGVycm9yIGluc3RlYWQ/XG4gIGlmIChsQ29udGFpbmVyW0RFSFlEUkFURURfVklFV1NdKSB7XG4gICAgZm9yIChjb25zdCB2aWV3IG9mIGxDb250YWluZXJbREVIWURSQVRFRF9WSUVXU10pIHtcbiAgICAgIHJlbW92ZURlaHlkcmF0ZWRWaWV3KHZpZXcpO1xuICAgIH1cbiAgfVxuICBmb3IgKGxldCBpID0gQ09OVEFJTkVSX0hFQURFUl9PRkZTRVQ7IGkgPCBsQ29udGFpbmVyLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgY2hpbGRWaWV3ID0gbENvbnRhaW5lcltpXSBhcyBMVmlldztcbiAgICBjbGVhbnVwTFZpZXcoY2hpbGRWaWV3KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjbGVhbnVwTFZpZXcobFZpZXc6IExWaWV3KSB7XG4gIGNvbnN0IHRWaWV3ID0gbFZpZXdbVFZJRVddO1xuICBmb3IgKGxldCBpID0gSEVBREVSX09GRlNFVDsgaSA8IHRWaWV3LmJpbmRpbmdTdGFydEluZGV4OyBpKyspIHtcbiAgICBpZiAoaXNMQ29udGFpbmVyKGxWaWV3W2ldKSkge1xuICAgICAgLy8gdGhpcyBpcyBhIGNvbnRhaW5lclxuICAgICAgY29uc3QgbENvbnRhaW5lciA9IGxWaWV3W2ldO1xuICAgICAgY2xlYW51cExDb250YWluZXIobENvbnRhaW5lcik7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGNsZWFudXBEZWh5ZHJhdGVkVmlld3MoYXBwUmVmOiBBcHBsaWNhdGlvblJlZikge1xuICAvLyBXYWl0IG9uY2UgYW4gYXBwIGJlY29tZXMgc3RhYmxlIGFuZCBjbGVhbnVwIGFsbCB2aWV3cyB0aGF0XG4gIC8vIHdlcmUgbm90IGNsYWltZWQgZHVyaW5nIHRoZSBhcHBsaWNhdGlvbiBib290c3RyYXAgcHJvY2Vzcy5cbiAgcmV0dXJuIGFwcFJlZi5pc1N0YWJsZS5waXBlKGZpcnN0KChpc1N0YWJsZTogYm9vbGVhbikgPT4gaXNTdGFibGUpKS50b1Byb21pc2UoKS50aGVuKCgpID0+IHtcbiAgICBhcHBSZWYuY29tcG9uZW50cy5mb3JFYWNoKChjb21wb25lbnRSZWYpID0+IHtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSBjb21wb25lbnRSZWYubG9jYXRpb24ubmF0aXZlRWxlbWVudDtcbiAgICAgIGlmIChlbGVtZW50KSB7XG4gICAgICAgIGNvbnN0IGxWaWV3ID0gZ2V0TFZpZXdGcm9tUm9vdEVsZW1lbnQoZWxlbWVudCk7XG4gICAgICAgIGlmIChsVmlldyAhPT0gbnVsbCkge1xuICAgICAgICAgIGNsZWFudXBMVmlldyhsVmlldyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59XG5cbi8qKlxuICogSGVscGVyIGZ1bmN0aW9uIHRvIHJlbW92ZSBhbGwgbm9kZXMgZnJvbSBhIGRlaHlkcmF0ZWQgdmlldy5cbiAqL1xuZnVuY3Rpb24gcmVtb3ZlRGVoeWRyYXRlZFZpZXcoZGVoeWRyYXRlZFZpZXc6IE5naFZpZXcpIHtcbiAgbGV0IG5vZGVzUmVtb3ZlZCA9IDA7XG4gIGxldCBjdXJyZW50Uk5vZGUgPSBkZWh5ZHJhdGVkVmlldy5maXJzdENoaWxkO1xuICBjb25zdCBudW1Ob2RlcyA9IGRlaHlkcmF0ZWRWaWV3Lm51bVJvb3ROb2RlcztcbiAgd2hpbGUgKG5vZGVzUmVtb3ZlZCA8IG51bU5vZGVzKSB7XG4gICAgY3VycmVudFJOb2RlLnJlbW92ZSgpO1xuICAgIGN1cnJlbnRSTm9kZSA9IGN1cnJlbnRSTm9kZS5uZXh0U2libGluZyBhcyBIVE1MRWxlbWVudDtcbiAgICBub2Rlc1JlbW92ZWQrKztcbiAgfVxufVxuXG50eXBlIENsYWltZWROb2RlID0ge1xuICBfX2NsYWltZWQ/OiBib29sZWFuXG59O1xuXG4vLyBUT0RPOiBjb25zaWRlciB1c2luZyBXZWFrTWFwIGluc3RlYWQuXG5leHBvcnQgZnVuY3Rpb24gbWFya1JOb2RlQXNDbGFpbWVkRm9ySHlkcmF0aW9uKG5vZGU6IFJOb2RlKSB7XG4gIGlmICghbmdEZXZNb2RlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDYWxsaW5nIGBjbGFpbU5vZGVgIGluIHByb2QgbW9kZSBpcyBub3Qgc3VwcG9ydGVkIGFuZCBsaWtlbHkgYSBtaXN0YWtlLicpO1xuICB9XG4gIGlmIChpc1JOb2RlQ2xhaW1lZEZvckh5ZHJhdGlvbihub2RlKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignVHJ5aW5nIHRvIGNsYWltIGEgbm9kZSwgd2hpY2ggd2FzIGNsYWltZWQgYWxyZWFkeS4nKTtcbiAgfVxuICAobm9kZSBhcyBDbGFpbWVkTm9kZSkuX19jbGFpbWVkID0gdHJ1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzUk5vZGVDbGFpbWVkRm9ySHlkcmF0aW9uKG5vZGU6IFJOb2RlKTogYm9vbGVhbiB7XG4gIHJldHVybiAhIShub2RlIGFzIENsYWltZWROb2RlKS5fX2NsYWltZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kRXhpc3RpbmdOb2RlKGhvc3Q6IE5vZGUsIHBhdGg6IHN0cmluZ1tdKTogUk5vZGUge1xuICBsZXQgbm9kZSA9IGhvc3Q7XG4gIGZvciAoY29uc3Qgb3Agb2YgcGF0aCkge1xuICAgIGlmICghbm9kZSkge1xuICAgICAgLy8gVE9ETzogYWRkIGEgZGV2LW1vZGUgYXNzZXJ0aW9uIGhlcmUuXG4gICAgICBkZWJ1Z2dlcjtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgZmluZEV4aXN0aW5nTm9kZTogZmFpbGVkIHRvIGZpbmQgbm9kZSBhdCAke3BhdGh9LmApO1xuICAgIH1cbiAgICBzd2l0Y2ggKG9wKSB7XG4gICAgICBjYXNlICdmaXJzdENoaWxkJzpcbiAgICAgICAgbm9kZSA9IG5vZGUuZmlyc3RDaGlsZCE7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbmV4dFNpYmxpbmcnOlxuICAgICAgICBub2RlID0gbm9kZS5uZXh0U2libGluZyE7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICBpZiAoIW5vZGUpIHtcbiAgICAvLyBUT0RPOiBhZGQgYSBkZXYtbW9kZSBhc3NlcnRpb24gaGVyZS5cbiAgICBkZWJ1Z2dlcjtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYGZpbmRFeGlzdGluZ05vZGU6IGZhaWxlZCB0byBmaW5kIG5vZGUgYXQgJHtwYXRofS5gKTtcbiAgfVxuICByZXR1cm4gbm9kZSBhcyB1bmtub3duIGFzIFJOb2RlO1xufVxuXG5mdW5jdGlvbiBsb2NhdGVSTm9kZUJ5UGF0aChwYXRoOiBzdHJpbmcsIGxWaWV3OiBMVmlldyk6IFJOb2RlIHtcbiAgY29uc3QgcGF0aFBhcnRzID0gcGF0aC5zcGxpdCgnLicpO1xuICAvLyBGaXJzdCBlbGVtZW50IGlzIGEgcGFyZW50IG5vZGUgaWQ6IGAxMi5uZXh0U2libGluZy4uLmAuXG4gIGNvbnN0IGZpcnN0UGF0aFBhcnQgPSBwYXRoUGFydHMuc2hpZnQoKTtcbiAgaWYgKGZpcnN0UGF0aFBhcnQgPT09ICdob3N0Jykge1xuICAgIHJldHVybiBmaW5kRXhpc3RpbmdOb2RlKGxWaWV3WzBdIGFzIHVua25vd24gYXMgRWxlbWVudCwgcGF0aFBhcnRzKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBwYXJlbnRFbGVtZW50SWQgPSBOdW1iZXIoZmlyc3RQYXRoUGFydCEpO1xuICAgIGNvbnN0IHBhcmVudFJOb2RlID0gdW53cmFwUk5vZGUoKGxWaWV3IGFzIGFueSlbcGFyZW50RWxlbWVudElkICsgSEVBREVSX09GRlNFVF0pO1xuICAgIHJldHVybiBmaW5kRXhpc3RpbmdOb2RlKHBhcmVudFJOb2RlIGFzIEVsZW1lbnQsIHBhdGhQYXJ0cyk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxvY2F0ZU5leHRSTm9kZTxUIGV4dGVuZHMgUk5vZGU+KFxuICAgIGh5ZHJhdGlvbkluZm86IE5naERvbSwgdFZpZXc6IFRWaWV3LCBsVmlldzogTFZpZXc8dW5rbm93bj4sIHROb2RlOiBUTm9kZSxcbiAgICBwcmV2aW91c1ROb2RlOiBUTm9kZXxudWxsLCBwcmV2aW91c1ROb2RlUGFyZW50OiBib29sZWFuKTogVHxudWxsIHtcbiAgbGV0IG5hdGl2ZTogUk5vZGV8bnVsbCA9IG51bGw7XG4gIGNvbnN0IGFkanVzdGVkSW5kZXggPSB0Tm9kZS5pbmRleCAtIEhFQURFUl9PRkZTRVQ7XG4gIGlmIChoeWRyYXRpb25JbmZvLm5vZGVzW2FkanVzdGVkSW5kZXhdKSB7XG4gICAgLy8gV2Uga25vdyBleGFjdCBsb2NhdGlvbiBvZiB0aGUgbm9kZS5cbiAgICBuYXRpdmUgPSBsb2NhdGVSTm9kZUJ5UGF0aChoeWRyYXRpb25JbmZvLm5vZGVzW2FkanVzdGVkSW5kZXhdLCBsVmlldyk7XG4gICAgZGVidWdnZXI7XG4gIH0gZWxzZSBpZiAodFZpZXcuZmlyc3RDaGlsZCA9PT0gdE5vZGUpIHtcbiAgICAvLyBXZSBjcmVhdGUgYSBmaXJzdCBub2RlIGluIHRoaXMgdmlldy5cbiAgICBuYXRpdmUgPSBoeWRyYXRpb25JbmZvLmZpcnN0Q2hpbGQ7XG4gIH0gZWxzZSB7XG4gICAgbmdEZXZNb2RlICYmIGFzc2VydERlZmluZWQocHJldmlvdXNUTm9kZSwgJ1VuZXhwZWN0ZWQgc3RhdGU6IG5vIGN1cnJlbnQgVE5vZGUgZm91bmQuJyk7XG4gICAgY29uc3QgcHJldmlvdXNSRWxlbWVudCA9IGdldE5hdGl2ZUJ5VE5vZGUocHJldmlvdXNUTm9kZSEsIGxWaWV3KSBhcyBSRWxlbWVudDtcbiAgICAvLyBUT0RPOiB3ZSBtYXkgd2FudCB0byB1c2UgdGhpcyBpbnN0ZWFkP1xuICAgIC8vIGNvbnN0IGNsb3Nlc3QgPSBnZXRDbG9zZXN0UkVsZW1lbnQodFZpZXcsIHByZXZpb3VzVE5vZGUsIGxWaWV3KTtcbiAgICBpZiAocHJldmlvdXNUTm9kZVBhcmVudCAmJiBwcmV2aW91c1ROb2RlIS50eXBlID09PSBUTm9kZVR5cGUuRWxlbWVudENvbnRhaW5lcikge1xuICAgICAgLy8gUHJldmlvdXMgbm9kZSB3YXMgYW4gYDxuZy1jb250YWluZXI+YCwgc28gdGhpcyBub2RlIGlzIGEgZmlyc3QgY2hpbGRcbiAgICAgIC8vIHdpdGhpbiBhbiBlbGVtZW50IGNvbnRhaW5lciwgc28gd2UgY2FuIGxvY2F0ZSB0aGUgY29udGFpbmVyIGluIG5naCBkYXRhXG4gICAgICAvLyBzdHJ1Y3R1cmUgYW5kIHVzZSBpdHMgZmlyc3QgY2hpbGQuXG4gICAgICBjb25zdCBzQ29udGFpbmVyID0gaHlkcmF0aW9uSW5mby5jb250YWluZXJzW3ByZXZpb3VzVE5vZGUhLmluZGV4IC0gSEVBREVSX09GRlNFVF07XG4gICAgICBpZiAobmdEZXZNb2RlICYmICFzQ29udGFpbmVyKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBzdGF0ZS4nKTtcbiAgICAgIH1cbiAgICAgIG5hdGl2ZSA9IHNDb250YWluZXIuZmlyc3RDaGlsZCE7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEZJWE1FOiB0aGlzIGRvZXNuJ3Qgd29yayBmb3IgaTE4biA6KFxuICAgICAgLy8gSW4gaTE4biBjYXNlLCBwcmV2aW91cyB0Tm9kZSBpcyBhIHBhcmVudCBlbGVtZW50LFxuICAgICAgLy8gd2hlbiBpbiBmYWN0LCBpdCBtaWdodCBiZSBhIHRleHQgbm9kZSBpbiBmcm9udCBvZiBpdC5cbiAgICAgIGlmIChwcmV2aW91c1ROb2RlUGFyZW50KSB7XG4gICAgICAgIG5hdGl2ZSA9IChwcmV2aW91c1JFbGVtZW50IGFzIGFueSkuZmlyc3RDaGlsZDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5hdGl2ZSA9IHByZXZpb3VzUkVsZW1lbnQubmV4dFNpYmxpbmcgYXMgUkVsZW1lbnQ7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBuYXRpdmUgYXMgVDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNpYmxpbmdBZnRlcjxUIGV4dGVuZHMgUk5vZGU+KHNraXA6IG51bWJlciwgZnJvbTogUk5vZGUpOiBUfG51bGwge1xuICBsZXQgY3VycmVudE5vZGUgPSBmcm9tO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHNraXA7IGkrKykge1xuICAgIGN1cnJlbnROb2RlID0gY3VycmVudE5vZGUubmV4dFNpYmxpbmchO1xuICAgIG5nRGV2TW9kZSAmJiBhc3NlcnREZWZpbmVkKGN1cnJlbnROb2RlLCAnRXhwZWN0ZWQgbW9yZSBzaWJsaW5ncyB0byBiZSBwcmVzZW50Jyk7XG4gIH1cbiAgcmV0dXJuIGN1cnJlbnROb2RlIGFzIFQ7XG59XG4iXX0=