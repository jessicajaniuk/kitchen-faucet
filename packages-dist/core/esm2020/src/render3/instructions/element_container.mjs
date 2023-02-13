/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CONTAINERS, NUM_ROOT_NODES, VIEWS } from '../../hydration/interfaces';
import { locateNextRNode, siblingAfter } from '../../hydration/node_lookup_utils';
import { isNodeDisconnected, markRNodeAsClaimedForHydration } from '../../hydration/utils';
import { locateDehydratedViewsInContainer } from '../../hydration/views';
import { assertDefined, assertEqual, assertIndexInRange } from '../../util/assert';
import { assertHasParent, assertRComment } from '../assert';
import { attachPatchData } from '../context_discovery';
import { registerPostOrderHooks } from '../hooks';
import { isContentQueryHost, isDirectiveHost } from '../interfaces/type_checks';
import { HEADER_OFFSET, HYDRATION_INFO, RENDERER } from '../interfaces/view';
import { assertTNodeType } from '../node_assert';
import { appendChild } from '../node_manipulation';
import { getBindingIndex, getCurrentTNode, getLView, getTView, isCurrentTNodeParent, isInSkipHydrationBlock, setCurrentTNode, setCurrentTNodeAsNotParent } from '../state';
import { computeStaticStyling } from '../styling/static_styling';
import { getConstant } from '../util/view_utils';
import { createDirectivesInstances, executeContentQueries, getOrCreateTNode, resolveDirectives, saveResolvedLocalsInData } from './shared';
function elementContainerStartFirstCreatePass(index, tView, lView, attrsIndex, localRefsIndex) {
    ngDevMode && ngDevMode.firstCreatePass++;
    const tViewConsts = tView.consts;
    const attrs = getConstant(tViewConsts, attrsIndex);
    const tNode = getOrCreateTNode(tView, index, 8 /* TNodeType.ElementContainer */, 'ng-container', attrs);
    // While ng-container doesn't necessarily support styling, we use the style context to identify
    // and execute directives on the ng-container.
    if (attrs !== null) {
        computeStaticStyling(tNode, attrs, true);
    }
    const localRefs = getConstant(tViewConsts, localRefsIndex);
    resolveDirectives(tView, lView, tNode, localRefs);
    if (tView.queries !== null) {
        tView.queries.elementStart(tView, tNode);
    }
    return tNode;
}
/**
 * Creates a logical container for other nodes (<ng-container>) backed by a comment node in the DOM.
 * The instruction must later be followed by `elementContainerEnd()` call.
 *
 * @param index Index of the element in the LView array
 * @param attrsIndex Index of the container attributes in the `consts` array.
 * @param localRefsIndex Index of the container's local references in the `consts` array.
 * @returns This function returns itself so that it may be chained.
 *
 * Even if this instruction accepts a set of attributes no actual attribute values are propagated to
 * the DOM (as a comment node can't have attributes). Attributes are here only for directive
 * matching purposes and setting initial inputs of directives.
 *
 * @codeGenApi
 */
export function ɵɵelementContainerStart(index, attrsIndex, localRefsIndex) {
    const lView = getLView();
    const tView = getTView();
    const adjustedIndex = index + HEADER_OFFSET;
    ngDevMode && assertIndexInRange(lView, adjustedIndex);
    ngDevMode &&
        assertEqual(getBindingIndex(), tView.bindingStartIndex, 'element containers should be created before any bindings');
    const previousTNode = getCurrentTNode();
    const previousTNodeParent = isCurrentTNodeParent();
    const tNode = tView.firstCreatePass ?
        elementContainerStartFirstCreatePass(adjustedIndex, tView, lView, attrsIndex, localRefsIndex) :
        tView.data[adjustedIndex];
    const [isNewlyCreatedNode, comment] = _locateOrCreateElementContainerNode(tView, lView, tNode, adjustedIndex, previousTNode, previousTNodeParent);
    lView[adjustedIndex] = comment;
    setCurrentTNode(tNode, true);
    isNewlyCreatedNode && appendChild(tView, lView, comment, tNode);
    attachPatchData(comment, lView);
    if (isDirectiveHost(tNode)) {
        createDirectivesInstances(tView, lView, tNode);
        executeContentQueries(tView, tNode, lView);
    }
    if (localRefsIndex != null) {
        saveResolvedLocalsInData(lView, tNode);
    }
    return ɵɵelementContainerStart;
}
/**
 * Mark the end of the <ng-container>.
 * @returns This function returns itself so that it may be chained.
 *
 * @codeGenApi
 */
export function ɵɵelementContainerEnd() {
    let currentTNode = getCurrentTNode();
    const tView = getTView();
    if (isCurrentTNodeParent()) {
        setCurrentTNodeAsNotParent();
    }
    else {
        ngDevMode && assertHasParent(currentTNode);
        currentTNode = currentTNode.parent;
        setCurrentTNode(currentTNode, false);
    }
    ngDevMode && assertTNodeType(currentTNode, 8 /* TNodeType.ElementContainer */);
    if (tView.firstCreatePass) {
        registerPostOrderHooks(tView, currentTNode);
        if (isContentQueryHost(currentTNode)) {
            tView.queries.elementEnd(currentTNode);
        }
    }
    return ɵɵelementContainerEnd;
}
/**
 * Creates an empty logical container using {@link elementContainerStart}
 * and {@link elementContainerEnd}
 *
 * @param index Index of the element in the LView array
 * @param attrsIndex Index of the container attributes in the `consts` array.
 * @param localRefsIndex Index of the container's local references in the `consts` array.
 * @returns This function returns itself so that it may be chained.
 *
 * @codeGenApi
 */
export function ɵɵelementContainer(index, attrsIndex, localRefsIndex) {
    ɵɵelementContainerStart(index, attrsIndex, localRefsIndex);
    ɵɵelementContainerEnd();
    return ɵɵelementContainer;
}
let _locateOrCreateElementContainerNode = (tView, lView, tNode, adjustedIndex, previousTNode, previousTNodeParent) => {
    const comment = lView[RENDERER].createComment(ngDevMode ? 'ng-container' : '');
    return [true, comment];
};
function locateOrCreateElementContainerNode(tView, lView, tNode, adjustedIndex, previousTNode, previousTNodeParent) {
    let comment;
    const index = adjustedIndex - HEADER_OFFSET;
    const ngh = lView[HYDRATION_INFO];
    const isCreating = !ngh || isInSkipHydrationBlock() || isNodeDisconnected(ngh, index);
    if (isCreating) {
        ngDevMode && ngDevMode.rendererCreateComment++;
        comment = lView[RENDERER].createComment(ngDevMode ? 'ng-container' : '');
    }
    else {
        const nghContainer = ngh[CONTAINERS]?.[index];
        ngDevMode &&
            assertDefined(nghContainer, 'There is no hydration info available for this element container');
        const currentRNode = locateNextRNode(ngh, tView, lView, tNode, previousTNode, previousTNodeParent);
        if (nghContainer[VIEWS] && nghContainer[VIEWS].length > 0) {
            // This <ng-container> is also annotated as a view container.
            // Extract all dehydrated views following instructions from ngh
            // and store this info for later reuse in `createContainerRef`.
            const [anchorRNode, views] = locateDehydratedViewsInContainer(currentRNode, nghContainer);
            comment = anchorRNode;
            if (views.length > 0) {
                // Store dehydrated views info in ngh data structure for later reuse
                // while creating a ViewContainerRef instance, see `createContainerRef`.
                nghContainer.dehydratedViews = views;
            }
        }
        else {
            // This is a plain `<ng-container>`, which is *not* used
            // as the ViewContainerRef anchor, so we can rely on `numRootNodes`.
            //
            // Store a reference to the first node in a container,
            // so it can be referenced while invoking further instructions.
            nghContainer.firstChild = currentRNode;
            comment = siblingAfter(nghContainer[NUM_ROOT_NODES], currentRNode);
        }
        ngDevMode &&
            assertRComment(comment, 'Expecting a comment node in elementContainer instruction');
        ngDevMode && markRNodeAsClaimedForHydration(comment);
    }
    return [isCreating, comment];
}
export function enableLocateOrCreateElementContainerNodeImpl() {
    _locateOrCreateElementContainerNode = locateOrCreateElementContainerNode;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxlbWVudF9jb250YWluZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy9yZW5kZXIzL2luc3RydWN0aW9ucy9lbGVtZW50X2NvbnRhaW5lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsVUFBVSxFQUFFLGNBQWMsRUFBRSxLQUFLLEVBQUMsTUFBTSw0QkFBNEIsQ0FBQztBQUM3RSxPQUFPLEVBQUMsZUFBZSxFQUFFLFlBQVksRUFBQyxNQUFNLG1DQUFtQyxDQUFDO0FBQ2hGLE9BQU8sRUFBQyxrQkFBa0IsRUFBRSw4QkFBOEIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ3pGLE9BQU8sRUFBQyxnQ0FBZ0MsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ3ZFLE9BQU8sRUFBQyxhQUFhLEVBQUUsV0FBVyxFQUFFLGtCQUFrQixFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDakYsT0FBTyxFQUFDLGVBQWUsRUFBRSxjQUFjLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDMUQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3JELE9BQU8sRUFBQyxzQkFBc0IsRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUdoRCxPQUFPLEVBQUMsa0JBQWtCLEVBQUUsZUFBZSxFQUFDLE1BQU0sMkJBQTJCLENBQUM7QUFDOUUsT0FBTyxFQUFDLGFBQWEsRUFBRSxjQUFjLEVBQVMsUUFBUSxFQUFRLE1BQU0sb0JBQW9CLENBQUM7QUFDekYsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQy9DLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUNqRCxPQUFPLEVBQUMsZUFBZSxFQUFFLGVBQWUsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLG9CQUFvQixFQUFFLHNCQUFzQixFQUFFLGVBQWUsRUFBRSwwQkFBMEIsRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUN6SyxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQztBQUMvRCxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFFL0MsT0FBTyxFQUFDLHlCQUF5QixFQUFFLHFCQUFxQixFQUFFLGdCQUFnQixFQUFFLGlCQUFpQixFQUFFLHdCQUF3QixFQUFDLE1BQU0sVUFBVSxDQUFDO0FBRXpJLFNBQVMsb0NBQW9DLENBQ3pDLEtBQWEsRUFBRSxLQUFZLEVBQUUsS0FBWSxFQUFFLFVBQXdCLEVBQ25FLGNBQXVCO0lBQ3pCLFNBQVMsSUFBSSxTQUFTLENBQUMsZUFBZSxFQUFFLENBQUM7SUFFekMsTUFBTSxXQUFXLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztJQUNqQyxNQUFNLEtBQUssR0FBRyxXQUFXLENBQWMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQ2hFLE1BQU0sS0FBSyxHQUFHLGdCQUFnQixDQUFDLEtBQUssRUFBRSxLQUFLLHNDQUE4QixjQUFjLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFFaEcsK0ZBQStGO0lBQy9GLDhDQUE4QztJQUM5QyxJQUFJLEtBQUssS0FBSyxJQUFJLEVBQUU7UUFDbEIsb0JBQW9CLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztLQUMxQztJQUVELE1BQU0sU0FBUyxHQUFHLFdBQVcsQ0FBVyxXQUFXLEVBQUUsY0FBYyxDQUFDLENBQUM7SUFDckUsaUJBQWlCLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFFbEQsSUFBSSxLQUFLLENBQUMsT0FBTyxLQUFLLElBQUksRUFBRTtRQUMxQixLQUFLLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDMUM7SUFFRCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUM7QUFFRDs7Ozs7Ozs7Ozs7Ozs7R0FjRztBQUNILE1BQU0sVUFBVSx1QkFBdUIsQ0FDbkMsS0FBYSxFQUFFLFVBQXdCLEVBQ3ZDLGNBQXVCO0lBQ3pCLE1BQU0sS0FBSyxHQUFHLFFBQVEsRUFBRSxDQUFDO0lBQ3pCLE1BQU0sS0FBSyxHQUFHLFFBQVEsRUFBRSxDQUFDO0lBQ3pCLE1BQU0sYUFBYSxHQUFHLEtBQUssR0FBRyxhQUFhLENBQUM7SUFFNUMsU0FBUyxJQUFJLGtCQUFrQixDQUFDLEtBQUssRUFBRSxhQUFhLENBQUMsQ0FBQztJQUN0RCxTQUFTO1FBQ0wsV0FBVyxDQUNQLGVBQWUsRUFBRSxFQUFFLEtBQUssQ0FBQyxpQkFBaUIsRUFDMUMsMERBQTBELENBQUMsQ0FBQztJQUVwRSxNQUFNLGFBQWEsR0FBRyxlQUFlLEVBQUUsQ0FBQztJQUN4QyxNQUFNLG1CQUFtQixHQUFHLG9CQUFvQixFQUFFLENBQUM7SUFFbkQsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ2pDLG9DQUFvQyxDQUNoQyxhQUFhLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQztRQUM5RCxLQUFLLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBMEIsQ0FBQztJQUV2RCxNQUFNLENBQUMsa0JBQWtCLEVBQUUsT0FBTyxDQUFDLEdBQUcsbUNBQW1DLENBQ3JFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLGFBQWEsRUFBRSxhQUFjLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztJQUM3RSxLQUFLLENBQUMsYUFBYSxDQUFDLEdBQUcsT0FBTyxDQUFDO0lBRS9CLGVBQWUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFFN0Isa0JBQWtCLElBQUksV0FBVyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ2hFLGVBQWUsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFFaEMsSUFBSSxlQUFlLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDMUIseUJBQXlCLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUMvQyxxQkFBcUIsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQzVDO0lBRUQsSUFBSSxjQUFjLElBQUksSUFBSSxFQUFFO1FBQzFCLHdCQUF3QixDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztLQUN4QztJQUVELE9BQU8sdUJBQXVCLENBQUM7QUFDakMsQ0FBQztBQUVEOzs7OztHQUtHO0FBQ0gsTUFBTSxVQUFVLHFCQUFxQjtJQUNuQyxJQUFJLFlBQVksR0FBRyxlQUFlLEVBQUcsQ0FBQztJQUN0QyxNQUFNLEtBQUssR0FBRyxRQUFRLEVBQUUsQ0FBQztJQUN6QixJQUFJLG9CQUFvQixFQUFFLEVBQUU7UUFDMUIsMEJBQTBCLEVBQUUsQ0FBQztLQUM5QjtTQUFNO1FBQ0wsU0FBUyxJQUFJLGVBQWUsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUMzQyxZQUFZLEdBQUcsWUFBWSxDQUFDLE1BQU8sQ0FBQztRQUNwQyxlQUFlLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQ3RDO0lBRUQsU0FBUyxJQUFJLGVBQWUsQ0FBQyxZQUFZLHFDQUE2QixDQUFDO0lBRXZFLElBQUksS0FBSyxDQUFDLGVBQWUsRUFBRTtRQUN6QixzQkFBc0IsQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDNUMsSUFBSSxrQkFBa0IsQ0FBQyxZQUFZLENBQUMsRUFBRTtZQUNwQyxLQUFLLENBQUMsT0FBUSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQztTQUN6QztLQUNGO0lBQ0QsT0FBTyxxQkFBcUIsQ0FBQztBQUMvQixDQUFDO0FBRUQ7Ozs7Ozs7Ozs7R0FVRztBQUNILE1BQU0sVUFBVSxrQkFBa0IsQ0FDOUIsS0FBYSxFQUFFLFVBQXdCLEVBQUUsY0FBdUI7SUFDbEUsdUJBQXVCLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRSxjQUFjLENBQUMsQ0FBQztJQUMzRCxxQkFBcUIsRUFBRSxDQUFDO0lBQ3hCLE9BQU8sa0JBQWtCLENBQUM7QUFDNUIsQ0FBQztBQUVELElBQUksbUNBQW1DLEdBQ25DLENBQUMsS0FBWSxFQUFFLEtBQVksRUFBRSxLQUFZLEVBQUUsYUFBcUIsRUFBRSxhQUFvQixFQUNyRixtQkFBNEIsRUFBRSxFQUFFO0lBQy9CLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQy9FLE9BQU8sQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDekIsQ0FBQyxDQUFBO0FBRUwsU0FBUyxrQ0FBa0MsQ0FDdkMsS0FBWSxFQUFFLEtBQVksRUFBRSxLQUFZLEVBQUUsYUFBcUIsRUFBRSxhQUFvQixFQUNyRixtQkFBNEI7SUFDOUIsSUFBSSxPQUFpQixDQUFDO0lBQ3RCLE1BQU0sS0FBSyxHQUFHLGFBQWEsR0FBRyxhQUFhLENBQUM7SUFDNUMsTUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQ2xDLE1BQU0sVUFBVSxHQUFHLENBQUMsR0FBRyxJQUFJLHNCQUFzQixFQUFFLElBQUksa0JBQWtCLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3RGLElBQUksVUFBVSxFQUFFO1FBQ2QsU0FBUyxJQUFJLFNBQVMsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBQy9DLE9BQU8sR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUMxRTtTQUFNO1FBQ0wsTUFBTSxZQUFZLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFFLENBQUM7UUFDL0MsU0FBUztZQUNMLGFBQWEsQ0FDVCxZQUFZLEVBQUUsaUVBQWlFLENBQUMsQ0FBQztRQUV6RixNQUFNLFlBQVksR0FDZCxlQUFlLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLGFBQWEsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1FBRWxGLElBQUksWUFBWSxDQUFDLEtBQUssQ0FBQyxJQUFJLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ3pELDZEQUE2RDtZQUM3RCwrREFBK0Q7WUFDL0QsK0RBQStEO1lBQy9ELE1BQU0sQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLEdBQUcsZ0NBQWdDLENBQUMsWUFBYSxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBRTNGLE9BQU8sR0FBRyxXQUF1QixDQUFDO1lBRWxDLElBQUksS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQ3BCLG9FQUFvRTtnQkFDcEUsd0VBQXdFO2dCQUN4RSxZQUFZLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQzthQUN0QztTQUNGO2FBQU07WUFDTCx3REFBd0Q7WUFDeEQsb0VBQW9FO1lBQ3BFLEVBQUU7WUFDRixzREFBc0Q7WUFDdEQsK0RBQStEO1lBQy9ELFlBQVksQ0FBQyxVQUFVLEdBQUcsWUFBMkIsQ0FBQztZQUV0RCxPQUFPLEdBQUcsWUFBWSxDQUFXLFlBQVksQ0FBQyxjQUFjLENBQUUsRUFBRSxZQUFhLENBQUUsQ0FBQztTQUNqRjtRQUVELFNBQVM7WUFDTCxjQUFjLENBQUMsT0FBTyxFQUFFLDBEQUEwRCxDQUFDLENBQUM7UUFDeEYsU0FBUyxJQUFJLDhCQUE4QixDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQ3REO0lBQ0QsT0FBTyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUMvQixDQUFDO0FBRUQsTUFBTSxVQUFVLDRDQUE0QztJQUMxRCxtQ0FBbUMsR0FBRyxrQ0FBa0MsQ0FBQztBQUMzRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q09OVEFJTkVSUywgTlVNX1JPT1RfTk9ERVMsIFZJRVdTfSBmcm9tICcuLi8uLi9oeWRyYXRpb24vaW50ZXJmYWNlcyc7XG5pbXBvcnQge2xvY2F0ZU5leHRSTm9kZSwgc2libGluZ0FmdGVyfSBmcm9tICcuLi8uLi9oeWRyYXRpb24vbm9kZV9sb29rdXBfdXRpbHMnO1xuaW1wb3J0IHtpc05vZGVEaXNjb25uZWN0ZWQsIG1hcmtSTm9kZUFzQ2xhaW1lZEZvckh5ZHJhdGlvbn0gZnJvbSAnLi4vLi4vaHlkcmF0aW9uL3V0aWxzJztcbmltcG9ydCB7bG9jYXRlRGVoeWRyYXRlZFZpZXdzSW5Db250YWluZXJ9IGZyb20gJy4uLy4uL2h5ZHJhdGlvbi92aWV3cyc7XG5pbXBvcnQge2Fzc2VydERlZmluZWQsIGFzc2VydEVxdWFsLCBhc3NlcnRJbmRleEluUmFuZ2V9IGZyb20gJy4uLy4uL3V0aWwvYXNzZXJ0JztcbmltcG9ydCB7YXNzZXJ0SGFzUGFyZW50LCBhc3NlcnRSQ29tbWVudH0gZnJvbSAnLi4vYXNzZXJ0JztcbmltcG9ydCB7YXR0YWNoUGF0Y2hEYXRhfSBmcm9tICcuLi9jb250ZXh0X2Rpc2NvdmVyeSc7XG5pbXBvcnQge3JlZ2lzdGVyUG9zdE9yZGVySG9va3N9IGZyb20gJy4uL2hvb2tzJztcbmltcG9ydCB7VEF0dHJpYnV0ZXMsIFRFbGVtZW50Q29udGFpbmVyTm9kZSwgVE5vZGUsIFROb2RlVHlwZX0gZnJvbSAnLi4vaW50ZXJmYWNlcy9ub2RlJztcbmltcG9ydCB7UkNvbW1lbnR9IGZyb20gJy4uL2ludGVyZmFjZXMvcmVuZGVyZXJfZG9tJztcbmltcG9ydCB7aXNDb250ZW50UXVlcnlIb3N0LCBpc0RpcmVjdGl2ZUhvc3R9IGZyb20gJy4uL2ludGVyZmFjZXMvdHlwZV9jaGVja3MnO1xuaW1wb3J0IHtIRUFERVJfT0ZGU0VULCBIWURSQVRJT05fSU5GTywgTFZpZXcsIFJFTkRFUkVSLCBUVmlld30gZnJvbSAnLi4vaW50ZXJmYWNlcy92aWV3JztcbmltcG9ydCB7YXNzZXJ0VE5vZGVUeXBlfSBmcm9tICcuLi9ub2RlX2Fzc2VydCc7XG5pbXBvcnQge2FwcGVuZENoaWxkfSBmcm9tICcuLi9ub2RlX21hbmlwdWxhdGlvbic7XG5pbXBvcnQge2dldEJpbmRpbmdJbmRleCwgZ2V0Q3VycmVudFROb2RlLCBnZXRMVmlldywgZ2V0VFZpZXcsIGlzQ3VycmVudFROb2RlUGFyZW50LCBpc0luU2tpcEh5ZHJhdGlvbkJsb2NrLCBzZXRDdXJyZW50VE5vZGUsIHNldEN1cnJlbnRUTm9kZUFzTm90UGFyZW50fSBmcm9tICcuLi9zdGF0ZSc7XG5pbXBvcnQge2NvbXB1dGVTdGF0aWNTdHlsaW5nfSBmcm9tICcuLi9zdHlsaW5nL3N0YXRpY19zdHlsaW5nJztcbmltcG9ydCB7Z2V0Q29uc3RhbnR9IGZyb20gJy4uL3V0aWwvdmlld191dGlscyc7XG5cbmltcG9ydCB7Y3JlYXRlRGlyZWN0aXZlc0luc3RhbmNlcywgZXhlY3V0ZUNvbnRlbnRRdWVyaWVzLCBnZXRPckNyZWF0ZVROb2RlLCByZXNvbHZlRGlyZWN0aXZlcywgc2F2ZVJlc29sdmVkTG9jYWxzSW5EYXRhfSBmcm9tICcuL3NoYXJlZCc7XG5cbmZ1bmN0aW9uIGVsZW1lbnRDb250YWluZXJTdGFydEZpcnN0Q3JlYXRlUGFzcyhcbiAgICBpbmRleDogbnVtYmVyLCB0VmlldzogVFZpZXcsIGxWaWV3OiBMVmlldywgYXR0cnNJbmRleD86IG51bWJlcnxudWxsLFxuICAgIGxvY2FsUmVmc0luZGV4PzogbnVtYmVyKTogVEVsZW1lbnRDb250YWluZXJOb2RlIHtcbiAgbmdEZXZNb2RlICYmIG5nRGV2TW9kZS5maXJzdENyZWF0ZVBhc3MrKztcblxuICBjb25zdCB0Vmlld0NvbnN0cyA9IHRWaWV3LmNvbnN0cztcbiAgY29uc3QgYXR0cnMgPSBnZXRDb25zdGFudDxUQXR0cmlidXRlcz4odFZpZXdDb25zdHMsIGF0dHJzSW5kZXgpO1xuICBjb25zdCB0Tm9kZSA9IGdldE9yQ3JlYXRlVE5vZGUodFZpZXcsIGluZGV4LCBUTm9kZVR5cGUuRWxlbWVudENvbnRhaW5lciwgJ25nLWNvbnRhaW5lcicsIGF0dHJzKTtcblxuICAvLyBXaGlsZSBuZy1jb250YWluZXIgZG9lc24ndCBuZWNlc3NhcmlseSBzdXBwb3J0IHN0eWxpbmcsIHdlIHVzZSB0aGUgc3R5bGUgY29udGV4dCB0byBpZGVudGlmeVxuICAvLyBhbmQgZXhlY3V0ZSBkaXJlY3RpdmVzIG9uIHRoZSBuZy1jb250YWluZXIuXG4gIGlmIChhdHRycyAhPT0gbnVsbCkge1xuICAgIGNvbXB1dGVTdGF0aWNTdHlsaW5nKHROb2RlLCBhdHRycywgdHJ1ZSk7XG4gIH1cblxuICBjb25zdCBsb2NhbFJlZnMgPSBnZXRDb25zdGFudDxzdHJpbmdbXT4odFZpZXdDb25zdHMsIGxvY2FsUmVmc0luZGV4KTtcbiAgcmVzb2x2ZURpcmVjdGl2ZXModFZpZXcsIGxWaWV3LCB0Tm9kZSwgbG9jYWxSZWZzKTtcblxuICBpZiAodFZpZXcucXVlcmllcyAhPT0gbnVsbCkge1xuICAgIHRWaWV3LnF1ZXJpZXMuZWxlbWVudFN0YXJ0KHRWaWV3LCB0Tm9kZSk7XG4gIH1cblxuICByZXR1cm4gdE5vZGU7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIGxvZ2ljYWwgY29udGFpbmVyIGZvciBvdGhlciBub2RlcyAoPG5nLWNvbnRhaW5lcj4pIGJhY2tlZCBieSBhIGNvbW1lbnQgbm9kZSBpbiB0aGUgRE9NLlxuICogVGhlIGluc3RydWN0aW9uIG11c3QgbGF0ZXIgYmUgZm9sbG93ZWQgYnkgYGVsZW1lbnRDb250YWluZXJFbmQoKWAgY2FsbC5cbiAqXG4gKiBAcGFyYW0gaW5kZXggSW5kZXggb2YgdGhlIGVsZW1lbnQgaW4gdGhlIExWaWV3IGFycmF5XG4gKiBAcGFyYW0gYXR0cnNJbmRleCBJbmRleCBvZiB0aGUgY29udGFpbmVyIGF0dHJpYnV0ZXMgaW4gdGhlIGBjb25zdHNgIGFycmF5LlxuICogQHBhcmFtIGxvY2FsUmVmc0luZGV4IEluZGV4IG9mIHRoZSBjb250YWluZXIncyBsb2NhbCByZWZlcmVuY2VzIGluIHRoZSBgY29uc3RzYCBhcnJheS5cbiAqIEByZXR1cm5zIFRoaXMgZnVuY3Rpb24gcmV0dXJucyBpdHNlbGYgc28gdGhhdCBpdCBtYXkgYmUgY2hhaW5lZC5cbiAqXG4gKiBFdmVuIGlmIHRoaXMgaW5zdHJ1Y3Rpb24gYWNjZXB0cyBhIHNldCBvZiBhdHRyaWJ1dGVzIG5vIGFjdHVhbCBhdHRyaWJ1dGUgdmFsdWVzIGFyZSBwcm9wYWdhdGVkIHRvXG4gKiB0aGUgRE9NIChhcyBhIGNvbW1lbnQgbm9kZSBjYW4ndCBoYXZlIGF0dHJpYnV0ZXMpLiBBdHRyaWJ1dGVzIGFyZSBoZXJlIG9ubHkgZm9yIGRpcmVjdGl2ZVxuICogbWF0Y2hpbmcgcHVycG9zZXMgYW5kIHNldHRpbmcgaW5pdGlhbCBpbnB1dHMgb2YgZGlyZWN0aXZlcy5cbiAqXG4gKiBAY29kZUdlbkFwaVxuICovXG5leHBvcnQgZnVuY3Rpb24gybXJtWVsZW1lbnRDb250YWluZXJTdGFydChcbiAgICBpbmRleDogbnVtYmVyLCBhdHRyc0luZGV4PzogbnVtYmVyfG51bGwsXG4gICAgbG9jYWxSZWZzSW5kZXg/OiBudW1iZXIpOiB0eXBlb2YgybXJtWVsZW1lbnRDb250YWluZXJTdGFydCB7XG4gIGNvbnN0IGxWaWV3ID0gZ2V0TFZpZXcoKTtcbiAgY29uc3QgdFZpZXcgPSBnZXRUVmlldygpO1xuICBjb25zdCBhZGp1c3RlZEluZGV4ID0gaW5kZXggKyBIRUFERVJfT0ZGU0VUO1xuXG4gIG5nRGV2TW9kZSAmJiBhc3NlcnRJbmRleEluUmFuZ2UobFZpZXcsIGFkanVzdGVkSW5kZXgpO1xuICBuZ0Rldk1vZGUgJiZcbiAgICAgIGFzc2VydEVxdWFsKFxuICAgICAgICAgIGdldEJpbmRpbmdJbmRleCgpLCB0Vmlldy5iaW5kaW5nU3RhcnRJbmRleCxcbiAgICAgICAgICAnZWxlbWVudCBjb250YWluZXJzIHNob3VsZCBiZSBjcmVhdGVkIGJlZm9yZSBhbnkgYmluZGluZ3MnKTtcblxuICBjb25zdCBwcmV2aW91c1ROb2RlID0gZ2V0Q3VycmVudFROb2RlKCk7XG4gIGNvbnN0IHByZXZpb3VzVE5vZGVQYXJlbnQgPSBpc0N1cnJlbnRUTm9kZVBhcmVudCgpO1xuXG4gIGNvbnN0IHROb2RlID0gdFZpZXcuZmlyc3RDcmVhdGVQYXNzID9cbiAgICAgIGVsZW1lbnRDb250YWluZXJTdGFydEZpcnN0Q3JlYXRlUGFzcyhcbiAgICAgICAgICBhZGp1c3RlZEluZGV4LCB0VmlldywgbFZpZXcsIGF0dHJzSW5kZXgsIGxvY2FsUmVmc0luZGV4KSA6XG4gICAgICB0Vmlldy5kYXRhW2FkanVzdGVkSW5kZXhdIGFzIFRFbGVtZW50Q29udGFpbmVyTm9kZTtcblxuICBjb25zdCBbaXNOZXdseUNyZWF0ZWROb2RlLCBjb21tZW50XSA9IF9sb2NhdGVPckNyZWF0ZUVsZW1lbnRDb250YWluZXJOb2RlKFxuICAgICAgdFZpZXcsIGxWaWV3LCB0Tm9kZSwgYWRqdXN0ZWRJbmRleCwgcHJldmlvdXNUTm9kZSEsIHByZXZpb3VzVE5vZGVQYXJlbnQpO1xuICBsVmlld1thZGp1c3RlZEluZGV4XSA9IGNvbW1lbnQ7XG5cbiAgc2V0Q3VycmVudFROb2RlKHROb2RlLCB0cnVlKTtcblxuICBpc05ld2x5Q3JlYXRlZE5vZGUgJiYgYXBwZW5kQ2hpbGQodFZpZXcsIGxWaWV3LCBjb21tZW50LCB0Tm9kZSk7XG4gIGF0dGFjaFBhdGNoRGF0YShjb21tZW50LCBsVmlldyk7XG5cbiAgaWYgKGlzRGlyZWN0aXZlSG9zdCh0Tm9kZSkpIHtcbiAgICBjcmVhdGVEaXJlY3RpdmVzSW5zdGFuY2VzKHRWaWV3LCBsVmlldywgdE5vZGUpO1xuICAgIGV4ZWN1dGVDb250ZW50UXVlcmllcyh0VmlldywgdE5vZGUsIGxWaWV3KTtcbiAgfVxuXG4gIGlmIChsb2NhbFJlZnNJbmRleCAhPSBudWxsKSB7XG4gICAgc2F2ZVJlc29sdmVkTG9jYWxzSW5EYXRhKGxWaWV3LCB0Tm9kZSk7XG4gIH1cblxuICByZXR1cm4gybXJtWVsZW1lbnRDb250YWluZXJTdGFydDtcbn1cblxuLyoqXG4gKiBNYXJrIHRoZSBlbmQgb2YgdGhlIDxuZy1jb250YWluZXI+LlxuICogQHJldHVybnMgVGhpcyBmdW5jdGlvbiByZXR1cm5zIGl0c2VsZiBzbyB0aGF0IGl0IG1heSBiZSBjaGFpbmVkLlxuICpcbiAqIEBjb2RlR2VuQXBpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiDJtcm1ZWxlbWVudENvbnRhaW5lckVuZCgpOiB0eXBlb2YgybXJtWVsZW1lbnRDb250YWluZXJFbmQge1xuICBsZXQgY3VycmVudFROb2RlID0gZ2V0Q3VycmVudFROb2RlKCkhO1xuICBjb25zdCB0VmlldyA9IGdldFRWaWV3KCk7XG4gIGlmIChpc0N1cnJlbnRUTm9kZVBhcmVudCgpKSB7XG4gICAgc2V0Q3VycmVudFROb2RlQXNOb3RQYXJlbnQoKTtcbiAgfSBlbHNlIHtcbiAgICBuZ0Rldk1vZGUgJiYgYXNzZXJ0SGFzUGFyZW50KGN1cnJlbnRUTm9kZSk7XG4gICAgY3VycmVudFROb2RlID0gY3VycmVudFROb2RlLnBhcmVudCE7XG4gICAgc2V0Q3VycmVudFROb2RlKGN1cnJlbnRUTm9kZSwgZmFsc2UpO1xuICB9XG5cbiAgbmdEZXZNb2RlICYmIGFzc2VydFROb2RlVHlwZShjdXJyZW50VE5vZGUsIFROb2RlVHlwZS5FbGVtZW50Q29udGFpbmVyKTtcblxuICBpZiAodFZpZXcuZmlyc3RDcmVhdGVQYXNzKSB7XG4gICAgcmVnaXN0ZXJQb3N0T3JkZXJIb29rcyh0VmlldywgY3VycmVudFROb2RlKTtcbiAgICBpZiAoaXNDb250ZW50UXVlcnlIb3N0KGN1cnJlbnRUTm9kZSkpIHtcbiAgICAgIHRWaWV3LnF1ZXJpZXMhLmVsZW1lbnRFbmQoY3VycmVudFROb2RlKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIMm1ybVlbGVtZW50Q29udGFpbmVyRW5kO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYW4gZW1wdHkgbG9naWNhbCBjb250YWluZXIgdXNpbmcge0BsaW5rIGVsZW1lbnRDb250YWluZXJTdGFydH1cbiAqIGFuZCB7QGxpbmsgZWxlbWVudENvbnRhaW5lckVuZH1cbiAqXG4gKiBAcGFyYW0gaW5kZXggSW5kZXggb2YgdGhlIGVsZW1lbnQgaW4gdGhlIExWaWV3IGFycmF5XG4gKiBAcGFyYW0gYXR0cnNJbmRleCBJbmRleCBvZiB0aGUgY29udGFpbmVyIGF0dHJpYnV0ZXMgaW4gdGhlIGBjb25zdHNgIGFycmF5LlxuICogQHBhcmFtIGxvY2FsUmVmc0luZGV4IEluZGV4IG9mIHRoZSBjb250YWluZXIncyBsb2NhbCByZWZlcmVuY2VzIGluIHRoZSBgY29uc3RzYCBhcnJheS5cbiAqIEByZXR1cm5zIFRoaXMgZnVuY3Rpb24gcmV0dXJucyBpdHNlbGYgc28gdGhhdCBpdCBtYXkgYmUgY2hhaW5lZC5cbiAqXG4gKiBAY29kZUdlbkFwaVxuICovXG5leHBvcnQgZnVuY3Rpb24gybXJtWVsZW1lbnRDb250YWluZXIoXG4gICAgaW5kZXg6IG51bWJlciwgYXR0cnNJbmRleD86IG51bWJlcnxudWxsLCBsb2NhbFJlZnNJbmRleD86IG51bWJlcik6IHR5cGVvZiDJtcm1ZWxlbWVudENvbnRhaW5lciB7XG4gIMm1ybVlbGVtZW50Q29udGFpbmVyU3RhcnQoaW5kZXgsIGF0dHJzSW5kZXgsIGxvY2FsUmVmc0luZGV4KTtcbiAgybXJtWVsZW1lbnRDb250YWluZXJFbmQoKTtcbiAgcmV0dXJuIMm1ybVlbGVtZW50Q29udGFpbmVyO1xufVxuXG5sZXQgX2xvY2F0ZU9yQ3JlYXRlRWxlbWVudENvbnRhaW5lck5vZGU6IHR5cGVvZiBsb2NhdGVPckNyZWF0ZUVsZW1lbnRDb250YWluZXJOb2RlID1cbiAgICAodFZpZXc6IFRWaWV3LCBsVmlldzogTFZpZXcsIHROb2RlOiBUTm9kZSwgYWRqdXN0ZWRJbmRleDogbnVtYmVyLCBwcmV2aW91c1ROb2RlOiBUTm9kZSxcbiAgICAgcHJldmlvdXNUTm9kZVBhcmVudDogYm9vbGVhbikgPT4ge1xuICAgICAgY29uc3QgY29tbWVudCA9IGxWaWV3W1JFTkRFUkVSXS5jcmVhdGVDb21tZW50KG5nRGV2TW9kZSA/ICduZy1jb250YWluZXInIDogJycpO1xuICAgICAgcmV0dXJuIFt0cnVlLCBjb21tZW50XTtcbiAgICB9XG5cbmZ1bmN0aW9uIGxvY2F0ZU9yQ3JlYXRlRWxlbWVudENvbnRhaW5lck5vZGUoXG4gICAgdFZpZXc6IFRWaWV3LCBsVmlldzogTFZpZXcsIHROb2RlOiBUTm9kZSwgYWRqdXN0ZWRJbmRleDogbnVtYmVyLCBwcmV2aW91c1ROb2RlOiBUTm9kZSxcbiAgICBwcmV2aW91c1ROb2RlUGFyZW50OiBib29sZWFuKTogW2Jvb2xlYW4sIFJDb21tZW50XSB7XG4gIGxldCBjb21tZW50OiBSQ29tbWVudDtcbiAgY29uc3QgaW5kZXggPSBhZGp1c3RlZEluZGV4IC0gSEVBREVSX09GRlNFVDtcbiAgY29uc3QgbmdoID0gbFZpZXdbSFlEUkFUSU9OX0lORk9dO1xuICBjb25zdCBpc0NyZWF0aW5nID0gIW5naCB8fCBpc0luU2tpcEh5ZHJhdGlvbkJsb2NrKCkgfHwgaXNOb2RlRGlzY29ubmVjdGVkKG5naCwgaW5kZXgpO1xuICBpZiAoaXNDcmVhdGluZykge1xuICAgIG5nRGV2TW9kZSAmJiBuZ0Rldk1vZGUucmVuZGVyZXJDcmVhdGVDb21tZW50Kys7XG4gICAgY29tbWVudCA9IGxWaWV3W1JFTkRFUkVSXS5jcmVhdGVDb21tZW50KG5nRGV2TW9kZSA/ICduZy1jb250YWluZXInIDogJycpO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IG5naENvbnRhaW5lciA9IG5naFtDT05UQUlORVJTXT8uW2luZGV4XSE7XG4gICAgbmdEZXZNb2RlICYmXG4gICAgICAgIGFzc2VydERlZmluZWQoXG4gICAgICAgICAgICBuZ2hDb250YWluZXIsICdUaGVyZSBpcyBubyBoeWRyYXRpb24gaW5mbyBhdmFpbGFibGUgZm9yIHRoaXMgZWxlbWVudCBjb250YWluZXInKTtcblxuICAgIGNvbnN0IGN1cnJlbnRSTm9kZSA9XG4gICAgICAgIGxvY2F0ZU5leHRSTm9kZShuZ2gsIHRWaWV3LCBsVmlldywgdE5vZGUsIHByZXZpb3VzVE5vZGUsIHByZXZpb3VzVE5vZGVQYXJlbnQpO1xuXG4gICAgaWYgKG5naENvbnRhaW5lcltWSUVXU10gJiYgbmdoQ29udGFpbmVyW1ZJRVdTXS5sZW5ndGggPiAwKSB7XG4gICAgICAvLyBUaGlzIDxuZy1jb250YWluZXI+IGlzIGFsc28gYW5ub3RhdGVkIGFzIGEgdmlldyBjb250YWluZXIuXG4gICAgICAvLyBFeHRyYWN0IGFsbCBkZWh5ZHJhdGVkIHZpZXdzIGZvbGxvd2luZyBpbnN0cnVjdGlvbnMgZnJvbSBuZ2hcbiAgICAgIC8vIGFuZCBzdG9yZSB0aGlzIGluZm8gZm9yIGxhdGVyIHJldXNlIGluIGBjcmVhdGVDb250YWluZXJSZWZgLlxuICAgICAgY29uc3QgW2FuY2hvclJOb2RlLCB2aWV3c10gPSBsb2NhdGVEZWh5ZHJhdGVkVmlld3NJbkNvbnRhaW5lcihjdXJyZW50Uk5vZGUhLCBuZ2hDb250YWluZXIpO1xuXG4gICAgICBjb21tZW50ID0gYW5jaG9yUk5vZGUgYXMgUkNvbW1lbnQ7XG5cbiAgICAgIGlmICh2aWV3cy5sZW5ndGggPiAwKSB7XG4gICAgICAgIC8vIFN0b3JlIGRlaHlkcmF0ZWQgdmlld3MgaW5mbyBpbiBuZ2ggZGF0YSBzdHJ1Y3R1cmUgZm9yIGxhdGVyIHJldXNlXG4gICAgICAgIC8vIHdoaWxlIGNyZWF0aW5nIGEgVmlld0NvbnRhaW5lclJlZiBpbnN0YW5jZSwgc2VlIGBjcmVhdGVDb250YWluZXJSZWZgLlxuICAgICAgICBuZ2hDb250YWluZXIuZGVoeWRyYXRlZFZpZXdzID0gdmlld3M7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFRoaXMgaXMgYSBwbGFpbiBgPG5nLWNvbnRhaW5lcj5gLCB3aGljaCBpcyAqbm90KiB1c2VkXG4gICAgICAvLyBhcyB0aGUgVmlld0NvbnRhaW5lclJlZiBhbmNob3IsIHNvIHdlIGNhbiByZWx5IG9uIGBudW1Sb290Tm9kZXNgLlxuICAgICAgLy9cbiAgICAgIC8vIFN0b3JlIGEgcmVmZXJlbmNlIHRvIHRoZSBmaXJzdCBub2RlIGluIGEgY29udGFpbmVyLFxuICAgICAgLy8gc28gaXQgY2FuIGJlIHJlZmVyZW5jZWQgd2hpbGUgaW52b2tpbmcgZnVydGhlciBpbnN0cnVjdGlvbnMuXG4gICAgICBuZ2hDb250YWluZXIuZmlyc3RDaGlsZCA9IGN1cnJlbnRSTm9kZSBhcyBIVE1MRWxlbWVudDtcblxuICAgICAgY29tbWVudCA9IHNpYmxpbmdBZnRlcjxSQ29tbWVudD4obmdoQ29udGFpbmVyW05VTV9ST09UX05PREVTXSEsIGN1cnJlbnRSTm9kZSEpITtcbiAgICB9XG5cbiAgICBuZ0Rldk1vZGUgJiZcbiAgICAgICAgYXNzZXJ0UkNvbW1lbnQoY29tbWVudCwgJ0V4cGVjdGluZyBhIGNvbW1lbnQgbm9kZSBpbiBlbGVtZW50Q29udGFpbmVyIGluc3RydWN0aW9uJyk7XG4gICAgbmdEZXZNb2RlICYmIG1hcmtSTm9kZUFzQ2xhaW1lZEZvckh5ZHJhdGlvbihjb21tZW50KTtcbiAgfVxuICByZXR1cm4gW2lzQ3JlYXRpbmcsIGNvbW1lbnRdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZW5hYmxlTG9jYXRlT3JDcmVhdGVFbGVtZW50Q29udGFpbmVyTm9kZUltcGwoKSB7XG4gIF9sb2NhdGVPckNyZWF0ZUVsZW1lbnRDb250YWluZXJOb2RlID0gbG9jYXRlT3JDcmVhdGVFbGVtZW50Q29udGFpbmVyTm9kZTtcbn1cbiJdfQ==