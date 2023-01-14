/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { getElementHydrationKey } from '../../hydration/keys';
import { assertDefined, assertEqual, assertIndexInRange } from '../../util/assert';
import { assertFirstCreatePass, assertHasParent } from '../assert';
import { attachPatchData } from '../context_discovery';
import { registerPostOrderHooks } from '../hooks';
import { hasClassInput, hasStyleInput } from '../interfaces/node';
import { isContentQueryHost, isDirectiveHost } from '../interfaces/type_checks';
import { HEADER_OFFSET, RENDERER } from '../interfaces/view';
import { assertTNodeType } from '../node_assert';
import { appendChild, createElementNode, setupStaticAttributes } from '../node_manipulation';
import { decreaseElementDepthCount, getBindingIndex, getCurrentTNode, getElementDepthCount, getLView, getNamespace, getTView, increaseElementDepthCount, isCurrentTNodeParent, setCurrentTNode, setCurrentTNodeAsNotParent } from '../state';
import { computeStaticStyling } from '../styling/static_styling';
import { getConstant } from '../util/view_utils';
import { validateElementIsKnown } from './element_validation';
import { setDirectiveInputsWhichShadowsStyling } from './property';
import { createDirectivesInstances, executeContentQueries, getOrCreateTNode, resolveDirectives, saveResolvedLocalsInData } from './shared';
function elementStartFirstCreatePass(index, tView, lView, native, name, attrsIndex, localRefsIndex) {
    ngDevMode && assertFirstCreatePass(tView);
    ngDevMode && ngDevMode.firstCreatePass++;
    const tViewConsts = tView.consts;
    const attrs = getConstant(tViewConsts, attrsIndex);
    const tNode = getOrCreateTNode(tView, index, 2 /* TNodeType.Element */, name, attrs);
    const hasDirectives = resolveDirectives(tView, lView, tNode, getConstant(tViewConsts, localRefsIndex));
    if (ngDevMode) {
        validateElementIsKnown(native, lView, tNode.value, tView.schemas, hasDirectives);
    }
    if (tNode.attrs !== null) {
        computeStaticStyling(tNode, tNode.attrs, false);
    }
    if (tNode.mergedAttrs !== null) {
        computeStaticStyling(tNode, tNode.mergedAttrs, true);
    }
    if (tView.queries !== null) {
        tView.queries.elementStart(tView, tNode);
    }
    return tNode;
}
/**
 * Create DOM element. The instruction must later be followed by `elementEnd()` call.
 *
 * @param index Index of the element in the LView array
 * @param name Name of the DOM Node
 * @param attrsIndex Index of the element's attributes in the `consts` array.
 * @param localRefsIndex Index of the element's local references in the `consts` array.
 * @returns This function returns itself so that it may be chained.
 *
 * Attributes and localRefs are passed as an array of strings where elements with an even index
 * hold an attribute name and elements with an odd index hold an attribute value, ex.:
 * ['id', 'warning5', 'class', 'alert']
 *
 * @codeGenApi
 */
export function ɵɵelementStart(index, name, attrsIndex, localRefsIndex) {
    const lView = getLView();
    const tView = getTView();
    const adjustedIndex = HEADER_OFFSET + index;
    ngDevMode &&
        assertEqual(getBindingIndex(), tView.bindingStartIndex, 'elements should be created before any bindings');
    ngDevMode && assertIndexInRange(lView, adjustedIndex);
    const renderer = lView[RENDERER];
    const hydrationKey = getElementHydrationKey(lView, index);
    const native = lView[adjustedIndex] =
        createElementNode(renderer, name, getNamespace(), hydrationKey);
    const tNode = tView.firstCreatePass ?
        elementStartFirstCreatePass(adjustedIndex, tView, lView, native, name, attrsIndex, localRefsIndex) :
        tView.data[adjustedIndex];
    setCurrentTNode(tNode, true);
    setupStaticAttributes(renderer, native, tNode);
    if ((tNode.flags & 32 /* TNodeFlags.isDetached */) !== 32 /* TNodeFlags.isDetached */) {
        // In the i18n case, the translation may have removed this element, so only add it if it is not
        // detached. See `TNodeType.Placeholder` and `LFrame.inI18n` for more context.
        appendChild(tView, lView, native, tNode);
    }
    // any immediate children of a component or template container must be pre-emptively
    // monkey-patched with the component view data so that the element can be inspected
    // later on using any element discovery utility methods (see `element_discovery.ts`)
    if (getElementDepthCount() === 0) {
        attachPatchData(native, lView);
    }
    increaseElementDepthCount();
    if (isDirectiveHost(tNode)) {
        createDirectivesInstances(tView, lView, tNode);
        executeContentQueries(tView, tNode, lView);
    }
    if (localRefsIndex !== null) {
        saveResolvedLocalsInData(lView, tNode);
    }
    return ɵɵelementStart;
}
/**
 * Mark the end of the element.
 * @returns This function returns itself so that it may be chained.
 *
 * @codeGenApi
 */
export function ɵɵelementEnd() {
    let currentTNode = getCurrentTNode();
    ngDevMode && assertDefined(currentTNode, 'No parent node to close.');
    if (isCurrentTNodeParent()) {
        setCurrentTNodeAsNotParent();
    }
    else {
        ngDevMode && assertHasParent(getCurrentTNode());
        currentTNode = currentTNode.parent;
        setCurrentTNode(currentTNode, false);
    }
    const tNode = currentTNode;
    ngDevMode && assertTNodeType(tNode, 3 /* TNodeType.AnyRNode */);
    decreaseElementDepthCount();
    const tView = getTView();
    if (tView.firstCreatePass) {
        registerPostOrderHooks(tView, currentTNode);
        if (isContentQueryHost(currentTNode)) {
            tView.queries.elementEnd(currentTNode);
        }
    }
    if (tNode.classesWithoutHost != null && hasClassInput(tNode)) {
        setDirectiveInputsWhichShadowsStyling(tView, tNode, getLView(), tNode.classesWithoutHost, true);
    }
    if (tNode.stylesWithoutHost != null && hasStyleInput(tNode)) {
        setDirectiveInputsWhichShadowsStyling(tView, tNode, getLView(), tNode.stylesWithoutHost, false);
    }
    return ɵɵelementEnd;
}
/**
 * Creates an empty element using {@link elementStart} and {@link elementEnd}
 *
 * @param index Index of the element in the data array
 * @param name Name of the DOM Node
 * @param attrsIndex Index of the element's attributes in the `consts` array.
 * @param localRefsIndex Index of the element's local references in the `consts` array.
 * @returns This function returns itself so that it may be chained.
 *
 * @codeGenApi
 */
export function ɵɵelement(index, name, attrsIndex, localRefsIndex) {
    ɵɵelementStart(index, name, attrsIndex, localRefsIndex);
    ɵɵelementEnd();
    return ɵɵelement;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxlbWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL3JlbmRlcjMvaW5zdHJ1Y3Rpb25zL2VsZW1lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLHNCQUFzQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDNUQsT0FBTyxFQUFDLGFBQWEsRUFBRSxXQUFXLEVBQUUsa0JBQWtCLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRixPQUFPLEVBQUMscUJBQXFCLEVBQUUsZUFBZSxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQ2pFLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUNyRCxPQUFPLEVBQUMsc0JBQXNCLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFDaEQsT0FBTyxFQUFDLGFBQWEsRUFBRSxhQUFhLEVBQW1ELE1BQU0sb0JBQW9CLENBQUM7QUFFbEgsT0FBTyxFQUFDLGtCQUFrQixFQUFFLGVBQWUsRUFBQyxNQUFNLDJCQUEyQixDQUFDO0FBQzlFLE9BQU8sRUFBQyxhQUFhLEVBQVMsUUFBUSxFQUFRLE1BQU0sb0JBQW9CLENBQUM7QUFDekUsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQy9DLE9BQU8sRUFBQyxXQUFXLEVBQUUsaUJBQWlCLEVBQUUscUJBQXFCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUMzRixPQUFPLEVBQUMseUJBQXlCLEVBQUUsZUFBZSxFQUFFLGVBQWUsRUFBRSxvQkFBb0IsRUFBRSxRQUFRLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSx5QkFBeUIsRUFBRSxvQkFBb0IsRUFBRSxlQUFlLEVBQUUsMEJBQTBCLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFDM08sT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sMkJBQTJCLENBQUM7QUFDL0QsT0FB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QUssRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLGNBQWMsQ0FBQyxDQUFDO0lBQ3hELFlBQVksRUFBRSxDQUFDO0lBQ2YsT0FBTyxTQUFTLENBQUM7QUFDbkIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2dldEVsZW1lbnRIeWRyYXRpb25LZXl9IGZyb20gJy4uLy4uL2h5ZHJhdGlvbi9rZXlzJztcbmltcG9ydCB7YXNzZXJ0RGVmaW5lZCwgYXNzZXJ0RXF1YWwsIGFzc2VydEluZGV4SW5SYW5nZX0gZnJvbSAnLi4vLi4vdXRpbC9hc3NlcnQnO1xuaW1wb3J0IHthc3NlcnRGaXJzdENyZWF0ZVBhc3MsIGFzc2VydEhhc1BhcmVudH0gZnJvbSAnLi4vYXNzZXJ0JztcbmltcG9ydCB7YXR0YWNoUGF0Y2hEYXRhfSBmcm9tICcuLi9jb250ZXh0X2Rpc2NvdmVyeSc7XG5pbXBvcnQge3JlZ2lzdGVyUG9zdE9yZGVySG9va3N9IGZyb20gJy4uL2hvb2tzJztcbmltcG9ydCB7aGFzQ2xhc3NJbnB1dCwgaGFzU3R5bGVJbnB1dCwgVEF0dHJpYnV0ZXMsIFRFbGVtZW50Tm9kZSwgVE5vZGVGbGFncywgVE5vZGVUeXBlfSBmcm9tICcuLi9pbnRlcmZhY2VzL25vZGUnO1xuaW1wb3J0IHtSRWxlbWVudH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9yZW5kZXJlcl9kb20nO1xuaW1wb3J0IHtpc0NvbnRlbnRRdWVyeUhvc3QsIGlzRGlyZWN0aXZlSG9zdH0gZnJvbSAnLi4vaW50ZXJmYWNlcy90eXBlX2NoZWNrcyc7XG5pbXBvcnQge0hFQURFUl9PRkZTRVQsIExWaWV3LCBSRU5ERVJFUiwgVFZpZXd9IGZyb20gJy4uL2ludGVyZmFjZXMvdmlldyc7XG5pbXBvcnQge2Fzc2VydFROb2RlVHlwZX0gZnJvbSAnLi4vbm9kZV9hc3NlcnQnO1xuaW1wb3J0IHthcHBlbmRDaGlsZCwgY3JlYXRlRWxlbWVudE5vZGUsIHNldHVwU3RhdGljQXR0cmlidXRlc30gZnJvbSAnLi4vbm9kZV9tYW5pcHVsYXRpb24nO1xuaW1wb3J0IHtkZWNyZWFzZUVsZW1lbnREZXB0aENvdW50LCBnZXRCaW5kaW5nSW5kZXgsIGdldEN1cnJlbnRUTm9kZSwgZ2V0RWxlbWVudERlcHRoQ291bnQsIGdldExWaWV3LCBnZXROYW1lc3BhY2UsIGdldFRWaWV3LCBpbmNyZWFzZUVsZW1lbnREZXB0aENvdW50LCBpc0N1cnJlbnRUTm9kZVBhcmVudCwgc2V0Q3VycmVudFROb2RlLCBzZXRDdXJyZW50VE5vZGVBc05vdFBhcmVudH0gZnJvbSAnLi4vc3RhdGUnO1xuaW1wb3J0IHtjb21wdXRlU3RhdGljU3R5bGluZ30gZnJvbSAnLi4vc3R5bGluZy9zdGF0aWNfc3R5bGluZyc7XG5pbXBvcnQge2dldENvbnN0YW50fSBmcm9tICcuLi91dGlsL3ZpZXdfdXRpbHMnO1xuXG5pbXBvcnQge3ZhbGlkYXRlRWxlbWVudElzS25vd259IGZyb20gJy4vZWxlbWVudF92YWxpZGF0aW9uJztcbmltcG9ydCB7c2V0RGlyZWN0aXZlSW5wdXRzV2hpY2hTaGFkb3dzU3R5bGluZ30gZnJvbSAnLi9wcm9wZXJ0eSc7XG5pbXBvcnQge2NyZWF0ZURpcmVjdGl2ZXNJbnN0YW5jZXMsIGV4ZWN1dGVDb250ZW50UXVlcmllcywgZ2V0T3JDcmVhdGVUTm9kZSwgcmVzb2x2ZURpcmVjdGl2ZXMsIHNhdmVSZXNvbHZlZExvY2Fsc0luRGF0YX0gZnJvbSAnLi9zaGFyZWQnO1xuXG5cbmZ1bmN0aW9uIGVsZW1lbnRTdGFydEZpcnN0Q3JlYXRlUGFzcyhcbiAgICBpbmRleDogbnVtYmVyLCB0VmlldzogVFZpZXcsIGxWaWV3OiBMVmlldywgbmF0aXZlOiBSRWxlbWVudCwgbmFtZTogc3RyaW5nLFxuICAgIGF0dHJzSW5kZXg/OiBudW1iZXJ8bnVsbCwgbG9jYWxSZWZzSW5kZXg/OiBudW1iZXIpOiBURWxlbWVudE5vZGUge1xuICBuZ0Rldk1vZGUgJiYgYXNzZXJ0Rmlyc3RDcmVhdGVQYXNzKHRWaWV3KTtcbiAgbmdEZXZNb2RlICYmIG5nRGV2TW9kZS5maXJzdENyZWF0ZVBhc3MrKztcblxuICBjb25zdCB0Vmlld0NvbnN0cyA9IHRWaWV3LmNvbnN0cztcbiAgY29uc3QgYXR0cnMgPSBnZXRDb25zdGFudDxUQXR0cmlidXRlcz4odFZpZXdDb25zdHMsIGF0dHJzSW5kZXgpO1xuICBjb25zdCB0Tm9kZSA9IGdldE9yQ3JlYXRlVE5vZGUodFZpZXcsIGluZGV4LCBUTm9kZVR5cGUuRWxlbWVudCwgbmFtZSwgYXR0cnMpO1xuXG4gIGNvbnN0IGhhc0RpcmVjdGl2ZXMgPVxuICAgICAgcmVzb2x2ZURpcmVjdGl2ZXModFZpZXcsIGxWaWV3LCB0Tm9kZSwgZ2V0Q29uc3RhbnQ8c3RyaW5nW10+KHRWaWV3Q29uc3RzLCBsb2NhbFJlZnNJbmRleCkpO1xuICBpZiAobmdEZXZNb2RlKSB7XG4gICAgdmFsaWRhdGVFbGVtZW50SXNLbm93bihuYXRpdmUsIGxWaWV3LCB0Tm9kZS52YWx1ZSwgdFZpZXcuc2NoZW1hcywgaGFzRGlyZWN0aXZlcyk7XG4gIH1cblxuICBpZiAodE5vZGUuYXR0cnMgIT09IG51bGwpIHtcbiAgICBjb21wdXRlU3RhdGljU3R5bGluZyh0Tm9kZSwgdE5vZGUuYXR0cnMsIGZhbHNlKTtcbiAgfVxuXG4gIGlmICh0Tm9kZS5tZXJnZWRBdHRycyAhPT0gbnVsbCkge1xuICAgIGNvbXB1dGVTdGF0aWNTdHlsaW5nKHROb2RlLCB0Tm9kZS5tZXJnZWRBdHRycywgdHJ1ZSk7XG4gIH1cblxuICBpZiAodFZpZXcucXVlcmllcyAhPT0gbnVsbCkge1xuICAgIHRWaWV3LnF1ZXJpZXMuZWxlbWVudFN0YXJ0KHRWaWV3LCB0Tm9kZSk7XG4gIH1cblxuICByZXR1cm4gdE5vZGU7XG59XG5cbi8qKlxuICogQ3JlYXRlIERPTSBlbGVtZW50LiBUaGUgaW5zdHJ1Y3Rpb24gbXVzdCBsYXRlciBiZSBmb2xsb3dlZCBieSBgZWxlbWVudEVuZCgpYCBjYWxsLlxuICpcbiAqIEBwYXJhbSBpbmRleCBJbmRleCBvZiB0aGUgZWxlbWVudCBpbiB0aGUgTFZpZXcgYXJyYXlcbiAqIEBwYXJhbSBuYW1lIE5hbWUgb2YgdGhlIERPTSBOb2RlXG4gKiBAcGFyYW0gYXR0cnNJbmRleCBJbmRleCBvZiB0aGUgZWxlbWVudCdzIGF0dHJpYnV0ZXMgaW4gdGhlIGBjb25zdHNgIGFycmF5LlxuICogQHBhcmFtIGxvY2FsUmVmc0luZGV4IEluZGV4IG9mIHRoZSBlbGVtZW50J3MgbG9jYWwgcmVmZXJlbmNlcyBpbiB0aGUgYGNvbnN0c2AgYXJyYXkuXG4gKiBAcmV0dXJucyBUaGlzIGZ1bmN0aW9uIHJldHVybnMgaXRzZWxmIHNvIHRoYXQgaXQgbWF5IGJlIGNoYWluZWQuXG4gKlxuICogQXR0cmlidXRlcyBhbmQgbG9jYWxSZWZzIGFyZSBwYXNzZWQgYXMgYW4gYXJyYXkgb2Ygc3RyaW5ncyB3aGVyZSBlbGVtZW50cyB3aXRoIGFuIGV2ZW4gaW5kZXhcbiAqIGhvbGQgYW4gYXR0cmlidXRlIG5hbWUgYW5kIGVsZW1lbnRzIHdpdGggYW4gb2RkIGluZGV4IGhvbGQgYW4gYXR0cmlidXRlIHZhbHVlLCBleC46XG4gKiBbJ2lkJywgJ3dhcm5pbmc1JywgJ2NsYXNzJywgJ2FsZXJ0J11cbiAqXG4gKiBAY29kZUdlbkFwaVxuICovXG5leHBvcnQgZnVuY3Rpb24gybXJtWVsZW1lbnRTdGFydChcbiAgICBpbmRleDogbnVtYmVyLCBuYW1lOiBzdHJpbmcsIGF0dHJzSW5kZXg/OiBudW1iZXJ8bnVsbCxcbiAgICBsb2NhbFJlZnNJbmRleD86IG51bWJlcik6IHR5cGVvZiDJtcm1ZWxlbWVudFN0YXJ0IHtcbiAgY29uc3QgbFZpZXcgPSBnZXRMVmlldygpO1xuICBjb25zdCB0VmlldyA9IGdldFRWaWV3KCk7XG4gIGNvbnN0IGFkanVzdGVkSW5kZXggPSBIRUFERVJfT0ZGU0VUICsgaW5kZXg7XG5cbiAgbmdEZXZNb2RlICYmXG4gICAgICBhc3NlcnRFcXVhbChcbiAgICAgICAgICBnZXRCaW5kaW5nSW5kZXgoKSwgdFZpZXcuYmluZGluZ1N0YXJ0SW5kZXgsXG4gICAgICAgICAgJ2VsZW1lbnRzIHNob3VsZCBiZSBjcmVhdGVkIGJlZm9yZSBhbnkgYmluZGluZ3MnKTtcbiAgbmdEZXZNb2RlICYmIGFzc2VydEluZGV4SW5SYW5nZShsVmlldywgYWRqdXN0ZWRJbmRleCk7XG5cbiAgY29uc3QgcmVuZGVyZXIgPSBsVmlld1tSRU5ERVJFUl07XG4gIGNvbnN0IGh5ZHJhdGlvbktleSA9IGdldEVsZW1lbnRIeWRyYXRpb25LZXkobFZpZXcsIGluZGV4KTtcbiAgY29uc3QgbmF0aXZlID0gbFZpZXdbYWRqdXN0ZWRJbmRleF0gPVxuICAgICAgY3JlYXRlRWxlbWVudE5vZGUocmVuZGVyZXIsIG5hbWUsIGdldE5hbWVzcGFjZSgpLCBoeWRyYXRpb25LZXkpO1xuICBjb25zdCB0Tm9kZSA9IHRWaWV3LmZpcnN0Q3JlYXRlUGFzcyA/XG4gICAgICBlbGVtZW50U3RhcnRGaXJzdENyZWF0ZVBhc3MoXG4gICAgICAgICAgYWRqdXN0ZWRJbmRleCwgdFZpZXcsIGxWaWV3LCBuYXRpdmUsIG5hbWUsIGF0dHJzSW5kZXgsIGxvY2FsUmVmc0luZGV4KSA6XG4gICAgICB0Vmlldy5kYXRhW2FkanVzdGVkSW5kZXhdIGFzIFRFbGVtZW50Tm9kZTtcbiAgc2V0Q3VycmVudFROb2RlKHROb2RlLCB0cnVlKTtcbiAgc2V0dXBTdGF0aWNBdHRyaWJ1dGVzKHJlbmRlcmVyLCBuYXRpdmUsIHROb2RlKTtcblxuICBpZiAoKHROb2RlLmZsYWdzICYgVE5vZGVGbGFncy5pc0RldGFjaGVkKSAhPT0gVE5vZGVGbGFncy5pc0RldGFjaGVkKSB7XG4gICAgLy8gSW4gdGhlIGkxOG4gY2FzZSwgdGhlIHRyYW5zbGF0aW9uIG1heSBoYXZlIHJlbW92ZWQgdGhpcyBlbGVtZW50LCBzbyBvbmx5IGFkZCBpdCBpZiBpdCBpcyBub3RcbiAgICAvLyBkZXRhY2hlZC4gU2VlIGBUTm9kZVR5cGUuUGxhY2Vob2xkZXJgIGFuZCBgTEZyYW1lLmluSTE4bmAgZm9yIG1vcmUgY29udGV4dC5cbiAgICBhcHBlbmRDaGlsZCh0VmlldywgbFZpZXcsIG5hdGl2ZSwgdE5vZGUpO1xuICB9XG5cbiAgLy8gYW55IGltbWVkaWF0ZSBjaGlsZHJlbiBvZiBhIGNvbXBvbmVudCBvciB0ZW1wbGF0ZSBjb250YWluZXIgbXVzdCBiZSBwcmUtZW1wdGl2ZWx5XG4gIC8vIG1vbmtleS1wYXRjaGVkIHdpdGggdGhlIGNvbXBvbmVudCB2aWV3IGRhdGEgc28gdGhhdCB0aGUgZWxlbWVudCBjYW4gYmUgaW5zcGVjdGVkXG4gIC8vIGxhdGVyIG9uIHVzaW5nIGFueSBlbGVtZW50IGRpc2NvdmVyeSB1dGlsaXR5IG1ldGhvZHMgKHNlZSBgZWxlbWVudF9kaXNjb3ZlcnkudHNgKVxuICBpZiAoZ2V0RWxlbWVudERlcHRoQ291bnQoKSA9PT0gMCkge1xuICAgIGF0dGFjaFBhdGNoRGF0YShuYXRpdmUsIGxWaWV3KTtcbiAgfVxuICBpbmNyZWFzZUVsZW1lbnREZXB0aENvdW50KCk7XG5cblxuICBpZiAoaXNEaXJlY3RpdmVIb3N0KHROb2RlKSkge1xuICAgIGNyZWF0ZURpcmVjdGl2ZXNJbnN0YW5jZXModFZpZXcsIGxWaWV3LCB0Tm9kZSk7XG4gICAgZXhlY3V0ZUNvbnRlbnRRdWVyaWVzKHRWaWV3LCB0Tm9kZSwgbFZpZXcpO1xuICB9XG4gIGlmIChsb2NhbFJlZnNJbmRleCAhPT0gbnVsbCkge1xuICAgIHNhdmVSZXNvbHZlZExvY2Fsc0luRGF0YShsVmlldywgdE5vZGUpO1xuICB9XG4gIHJldHVybiDJtcm1ZWxlbWVudFN0YXJ0O1xufVxuXG4vKipcbiAqIE1hcmsgdGhlIGVuZCBvZiB0aGUgZWxlbWVudC5cbiAqIEByZXR1cm5zIFRoaXMgZnVuY3Rpb24gcmV0dXJucyBpdHNlbGYgc28gdGhhdCBpdCBtYXkgYmUgY2hhaW5lZC5cbiAqXG4gKiBAY29kZUdlbkFwaVxuICovXG5leHBvcnQgZnVuY3Rpb24gybXJtWVsZW1lbnRFbmQoKTogdHlwZW9mIMm1ybVlbGVtZW50RW5kIHtcbiAgbGV0IGN1cnJlbnRUTm9kZSA9IGdldEN1cnJlbnRUTm9kZSgpITtcbiAgbmdEZXZNb2RlICYmIGFzc2VydERlZmluZWQoY3VycmVudFROb2RlLCAnTm8gcGFyZW50IG5vZGUgdG8gY2xvc2UuJyk7XG4gIGlmIChpc0N1cnJlbnRUTm9kZVBhcmVudCgpKSB7XG4gICAgc2V0Q3VycmVudFROb2RlQXNOb3RQYXJlbnQoKTtcbiAgfSBlbHNlIHtcbiAgICBuZ0Rldk1vZGUgJiYgYXNzZXJ0SGFzUGFyZW50KGdldEN1cnJlbnRUTm9kZSgpKTtcbiAgICBjdXJyZW50VE5vZGUgPSBjdXJyZW50VE5vZGUucGFyZW50ITtcbiAgICBzZXRDdXJyZW50VE5vZGUoY3VycmVudFROb2RlLCBmYWxzZSk7XG4gIH1cblxuICBjb25zdCB0Tm9kZSA9IGN1cnJlbnRUTm9kZTtcbiAgbmdEZXZNb2RlICYmIGFzc2VydFROb2RlVHlwZSh0Tm9kZSwgVE5vZGVUeXBlLkFueVJOb2RlKTtcblxuXG4gIGRlY3JlYXNlRWxlbWVudERlcHRoQ291bnQoKTtcblxuICBjb25zdCB0VmlldyA9IGdldFRWaWV3KCk7XG4gIGlmICh0Vmlldy5maXJzdENyZWF0ZVBhc3MpIHtcbiAgICByZWdpc3RlclBvc3RPcmRlckhvb2tzKHRWaWV3LCBjdXJyZW50VE5vZGUpO1xuICAgIGlmIChpc0NvbnRlbnRRdWVyeUhvc3QoY3VycmVudFROb2RlKSkge1xuICAgICAgdFZpZXcucXVlcmllcyEuZWxlbWVudEVuZChjdXJyZW50VE5vZGUpO1xuICAgIH1cbiAgfVxuXG4gIGlmICh0Tm9kZS5jbGFzc2VzV2l0aG91dEhvc3QgIT0gbnVsbCAmJiBoYXNDbGFzc0lucHV0KHROb2RlKSkge1xuICAgIHNldERpcmVjdGl2ZUlucHV0c1doaWNoU2hhZG93c1N0eWxpbmcodFZpZXcsIHROb2RlLCBnZXRMVmlldygpLCB0Tm9kZS5jbGFzc2VzV2l0aG91dEhvc3QsIHRydWUpO1xuICB9XG5cbiAgaWYgKHROb2RlLnN0eWxlc1dpdGhvdXRIb3N0ICE9IG51bGwgJiYgaGFzU3R5bGVJbnB1dCh0Tm9kZSkpIHtcbiAgICBzZXREaXJlY3RpdmVJbnB1dHNXaGljaFNoYWRvd3NTdHlsaW5nKHRWaWV3LCB0Tm9kZSwgZ2V0TFZpZXcoKSwgdE5vZGUuc3R5bGVzV2l0aG91dEhvc3QsIGZhbHNlKTtcbiAgfVxuICByZXR1cm4gybXJtWVsZW1lbnRFbmQ7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBlbXB0eSBlbGVtZW50IHVzaW5nIHtAbGluayBlbGVtZW50U3RhcnR9IGFuZCB7QGxpbmsgZWxlbWVudEVuZH1cbiAqXG4gKiBAcGFyYW0gaW5kZXggSW5kZXggb2YgdGhlIGVsZW1lbnQgaW4gdGhlIGRhdGEgYXJyYXlcbiAqIEBwYXJhbSBuYW1lIE5hbWUgb2YgdGhlIERPTSBOb2RlXG4gKiBAcGFyYW0gYXR0cnNJbmRleCBJbmRleCBvZiB0aGUgZWxlbWVudCdzIGF0dHJpYnV0ZXMgaW4gdGhlIGBjb25zdHNgIGFycmF5LlxuICogQHBhcmFtIGxvY2FsUmVmc0luZGV4IEluZGV4IG9mIHRoZSBlbGVtZW50J3MgbG9jYWwgcmVmZXJlbmNlcyBpbiB0aGUgYGNvbnN0c2AgYXJyYXkuXG4gKiBAcmV0dXJucyBUaGlzIGZ1bmN0aW9uIHJldHVybnMgaXRzZWxmIHNvIHRoYXQgaXQgbWF5IGJlIGNoYWluZWQuXG4gKlxuICogQGNvZGVHZW5BcGlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIMm1ybVlbGVtZW50KFxuICAgIGluZGV4OiBudW1iZXIsIG5hbWU6IHN0cmluZywgYXR0cnNJbmRleD86IG51bWJlcnxudWxsLFxuICAgIGxvY2FsUmVmc0luZGV4PzogbnVtYmVyKTogdHlwZW9mIMm1ybVlbGVtZW50IHtcbiAgybXJtWVsZW1lbnRTdGFydChpbmRleCwgbmFtZSwgYXR0cnNJbmRleCwgbG9jYWxSZWZzSW5kZXgpO1xuICDJtcm1ZWxlbWVudEVuZCgpO1xuICByZXR1cm4gybXJtWVsZW1lbnQ7XG59XG4iXX0=