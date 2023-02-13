/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { locateNextRNode } from '../../hydration/node_lookup_utils';
import { isNodeDisconnected, markRNodeAsClaimedForHydration } from '../../hydration/utils';
import { assertEqual, assertIndexInRange } from '../../util/assert';
import { assertRText } from '../assert';
import { HEADER_OFFSET, HYDRATION_INFO, RENDERER } from '../interfaces/view';
import { appendChild, createTextNode } from '../node_manipulation';
import { getBindingIndex, getCurrentTNode, getLView, getTView, isCurrentTNodeParent, isInSkipHydrationBlock, setCurrentTNode } from '../state';
import { getOrCreateTNode } from './shared';
/**
 * Create static text node
 *
 * @param index Index of the node in the data array
 * @param value Static string value to write.
 *
 * @codeGenApi
 */
export function ɵɵtext(index, value = '') {
    const lView = getLView();
    const tView = getTView();
    const adjustedIndex = index + HEADER_OFFSET;
    ngDevMode &&
        assertEqual(getBindingIndex(), tView.bindingStartIndex, 'text nodes should be created before any bindings');
    ngDevMode && assertIndexInRange(lView, adjustedIndex);
    const previousTNode = getCurrentTNode();
    const previousTNodeParent = isCurrentTNodeParent();
    const tNode = tView.firstCreatePass ?
        getOrCreateTNode(tView, adjustedIndex, 1 /* TNodeType.Text */, value, null) :
        tView.data[adjustedIndex];
    const [isNewlyCreatedNode, textNative] = _locateOrCreateTextNode(tView, lView, tNode, adjustedIndex, value, previousTNode, previousTNodeParent);
    lView[adjustedIndex] = textNative;
    isNewlyCreatedNode && appendChild(tView, lView, textNative, tNode);
    // Text nodes are self closing.
    setCurrentTNode(tNode, false);
}
let _locateOrCreateTextNode = (tView, lView, tNode, adjustedIndex, value, previousTNode, previousTNodeParent) => {
    return [true, createTextNode(lView[RENDERER], value)];
};
function locateOrCreateTextNodeImpl(tView, lView, tNode, adjustedIndex, value, previousTNode, previousTNodeParent) {
    const ngh = lView[HYDRATION_INFO];
    const index = adjustedIndex - HEADER_OFFSET;
    const isCreating = !ngh || isInSkipHydrationBlock() || isNodeDisconnected(ngh, index);
    let textNative;
    if (isCreating) {
        textNative = createTextNode(lView[RENDERER], value);
    }
    else {
        // hydrating
        textNative =
            locateNextRNode(ngh, tView, lView, tNode, previousTNode, previousTNodeParent);
        ngDevMode &&
            assertRText(textNative, `Expecting a text node (with the '${value}' value) in the text instruction`);
        ngDevMode && markRNodeAsClaimedForHydration(textNative);
    }
    return [isCreating, textNative];
}
export function enableLocateOrCreateTextNodeImpl() {
    _locateOrCreateTextNode = locateOrCreateTextNodeImpl;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV4dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL3JlbmRlcjMvaW5zdHJ1Y3Rpb25zL3RleHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG1DQUFtQyxDQUFDO0FBQ2xFLE9BQU8sRUFBQyxrQkFBa0IsRUFBRSw4QkFBOEIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ3pGLE9BQU8sRUFBQyxXQUFXLEVBQUUsa0JBQWtCLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNsRSxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBR3RDLE9BQU8sRUFBQyxhQUFhLEVBQUUsY0FBYyxFQUFTLFFBQVEsRUFBUSxNQUFNLG9CQUFvQixDQUFDO0FBQ3pGLE9BQU8sRUFBQyxXQUFXLEVBQUUsY0FBYyxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDakUsT0FBTyxFQUFDLGVBQWUsRUFBRSxlQUFlLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxvQkFBb0IsRUFBRSxzQkFBc0IsRUFBRSxlQUFlLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFFN0ksT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sVUFBVSxDQUFDO0FBSTFDOzs7Ozs7O0dBT0c7QUFDSCxNQUFNLFVBQVUsTUFBTSxDQUFDLEtBQWEsRUFBRSxRQUFnQixFQUFFO0lBQ3RELE1BQU0sS0FBSyxHQUFHLFFBQVEsRUFBRSxDQUFDO0lBQ3pCLE1BQU0sS0FBSyxHQUFHLFFBQVEsRUFBRSxDQUFDO0lBQ3pCLE1BQU0sYUFBYSxHQUFHLEtBQUssR0FBRyxhQUFhLENBQUM7SUFFNUMsU0FBUztRQUNMLFdBQVcsQ0FDUCxlQUFlLEVBQUUsRUFBRSxLQUFLLENBQUMsaUJBQWlCLEVBQzFDLGtEQUFrRCxDQUFDLENBQUM7SUFDNUQsU0FBUyxJQUFJLGtCQUFrQixDQUFDLEtBQUssRUFBRSxhQUFhLENBQUMsQ0FBQztJQUV0RCxNQUFNLGFBQWEsR0FBRyxlQUFlLEVBQUUsQ0FBQztJQUN4QyxNQUFNLG1CQUFtQixHQUFHLG9CQUFvQixFQUFFLENBQUM7SUFFbkQsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ2pDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxhQUFhLDBCQUFrQixLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNyRSxLQUFLLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBaUIsQ0FBQztJQUU5QyxNQUFNLENBQUMsa0JBQWtCLEVBQUUsVUFBVSxDQUFDLEdBQUcsdUJBQXVCLENBQzVELEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQUUsYUFBYyxFQUFFLG1CQUFtQixDQUFDLENBQUM7SUFFcEYsS0FBSyxDQUFDLGFBQWEsQ0FBQyxHQUFHLFVBQVUsQ0FBQztJQUNsQyxrQkFBa0IsSUFBSSxXQUFXLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFFbkUsK0JBQStCO0lBQy9CLGVBQWUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDaEMsQ0FBQztBQUVELElBQUksdUJBQXVCLEdBQ3ZCLENBQUMsS0FBWSxFQUFFLEtBQVksRUFBRSxLQUFZLEVBQUUsYUFBcUIsRUFBRSxLQUFhLEVBQzlFLGFBQW9CLEVBQUUsbUJBQTRCLEVBQUUsRUFBRTtJQUNyRCxPQUFPLENBQUMsSUFBSSxFQUFFLGNBQWMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUN4RCxDQUFDLENBQUE7QUFFTCxTQUFTLDBCQUEwQixDQUMvQixLQUFZLEVBQUUsS0FBWSxFQUFFLEtBQVksRUFBRSxhQUFxQixFQUFFLEtBQWEsRUFDOUUsYUFBb0IsRUFBRSxtQkFBNEI7SUFDcEQsTUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQ2xDLE1BQU0sS0FBSyxHQUFHLGFBQWEsR0FBRyxhQUFhLENBQUM7SUFDNUMsTUFBTSxVQUFVLEdBQUcsQ0FBQyxHQUFHLElBQUksc0JBQXNCLEVBQUUsSUFBSSxrQkFBa0IsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDdEYsSUFBSSxVQUFpQixDQUFDO0lBQ3RCLElBQUksVUFBVSxFQUFFO1FBQ2QsVUFBVSxHQUFHLGNBQWMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDckQ7U0FBTTtRQUNMLFlBQVk7UUFDWixVQUFVO1lBQ04sZUFBZSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxhQUFhLEVBQUUsbUJBQW1CLENBQVUsQ0FBQztRQUMzRixTQUFTO1lBQ0wsV0FBVyxDQUNQLFVBQVUsRUFDVixvQ0FBb0MsS0FBSyxrQ0FBa0MsQ0FBQyxDQUFDO1FBQ3JGLFNBQVMsSUFBSSw4QkFBOEIsQ0FBQyxVQUFVLENBQUMsQ0FBQztLQUN6RDtJQUNELE9BQU8sQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDbEMsQ0FBQztBQUVELE1BQU0sVUFBVSxnQ0FBZ0M7SUFDOUMsdUJBQXVCLEdBQUcsMEJBQTBCLENBQUM7QUFDdkQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtsb2NhdGVOZXh0Uk5vZGV9IGZyb20gJy4uLy4uL2h5ZHJhdGlvbi9ub2RlX2xvb2t1cF91dGlscyc7XG5pbXBvcnQge2lzTm9kZURpc2Nvbm5lY3RlZCwgbWFya1JOb2RlQXNDbGFpbWVkRm9ySHlkcmF0aW9ufSBmcm9tICcuLi8uLi9oeWRyYXRpb24vdXRpbHMnO1xuaW1wb3J0IHthc3NlcnRFcXVhbCwgYXNzZXJ0SW5kZXhJblJhbmdlfSBmcm9tICcuLi8uLi91dGlsL2Fzc2VydCc7XG5pbXBvcnQge2Fzc2VydFJUZXh0fSBmcm9tICcuLi9hc3NlcnQnO1xuaW1wb3J0IHtURWxlbWVudE5vZGUsIFROb2RlLCBUTm9kZVR5cGV9IGZyb20gJy4uL2ludGVyZmFjZXMvbm9kZSc7XG5pbXBvcnQge1JUZXh0fSBmcm9tICcuLi9pbnRlcmZhY2VzL3JlbmRlcmVyX2RvbSc7XG5pbXBvcnQge0hFQURFUl9PRkZTRVQsIEhZRFJBVElPTl9JTkZPLCBMVmlldywgUkVOREVSRVIsIFRWaWV3fSBmcm9tICcuLi9pbnRlcmZhY2VzL3ZpZXcnO1xuaW1wb3J0IHthcHBlbmRDaGlsZCwgY3JlYXRlVGV4dE5vZGV9IGZyb20gJy4uL25vZGVfbWFuaXB1bGF0aW9uJztcbmltcG9ydCB7Z2V0QmluZGluZ0luZGV4LCBnZXRDdXJyZW50VE5vZGUsIGdldExWaWV3LCBnZXRUVmlldywgaXNDdXJyZW50VE5vZGVQYXJlbnQsIGlzSW5Ta2lwSHlkcmF0aW9uQmxvY2ssIHNldEN1cnJlbnRUTm9kZX0gZnJvbSAnLi4vc3RhdGUnO1xuXG5pbXBvcnQge2dldE9yQ3JlYXRlVE5vZGV9IGZyb20gJy4vc2hhcmVkJztcblxuXG5cbi8qKlxuICogQ3JlYXRlIHN0YXRpYyB0ZXh0IG5vZGVcbiAqXG4gKiBAcGFyYW0gaW5kZXggSW5kZXggb2YgdGhlIG5vZGUgaW4gdGhlIGRhdGEgYXJyYXlcbiAqIEBwYXJhbSB2YWx1ZSBTdGF0aWMgc3RyaW5nIHZhbHVlIHRvIHdyaXRlLlxuICpcbiAqIEBjb2RlR2VuQXBpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiDJtcm1dGV4dChpbmRleDogbnVtYmVyLCB2YWx1ZTogc3RyaW5nID0gJycpOiB2b2lkIHtcbiAgY29uc3QgbFZpZXcgPSBnZXRMVmlldygpO1xuICBjb25zdCB0VmlldyA9IGdldFRWaWV3KCk7XG4gIGNvbnN0IGFkanVzdGVkSW5kZXggPSBpbmRleCArIEhFQURFUl9PRkZTRVQ7XG5cbiAgbmdEZXZNb2RlICYmXG4gICAgICBhc3NlcnRFcXVhbChcbiAgICAgICAgICBnZXRCaW5kaW5nSW5kZXgoKSwgdFZpZXcuYmluZGluZ1N0YXJ0SW5kZXgsXG4gICAgICAgICAgJ3RleHQgbm9kZXMgc2hvdWxkIGJlIGNyZWF0ZWQgYmVmb3JlIGFueSBiaW5kaW5ncycpO1xuICBuZ0Rldk1vZGUgJiYgYXNzZXJ0SW5kZXhJblJhbmdlKGxWaWV3LCBhZGp1c3RlZEluZGV4KTtcblxuICBjb25zdCBwcmV2aW91c1ROb2RlID0gZ2V0Q3VycmVudFROb2RlKCk7XG4gIGNvbnN0IHByZXZpb3VzVE5vZGVQYXJlbnQgPSBpc0N1cnJlbnRUTm9kZVBhcmVudCgpO1xuXG4gIGNvbnN0IHROb2RlID0gdFZpZXcuZmlyc3RDcmVhdGVQYXNzID9cbiAgICAgIGdldE9yQ3JlYXRlVE5vZGUodFZpZXcsIGFkanVzdGVkSW5kZXgsIFROb2RlVHlwZS5UZXh0LCB2YWx1ZSwgbnVsbCkgOlxuICAgICAgdFZpZXcuZGF0YVthZGp1c3RlZEluZGV4XSBhcyBURWxlbWVudE5vZGU7XG5cbiAgY29uc3QgW2lzTmV3bHlDcmVhdGVkTm9kZSwgdGV4dE5hdGl2ZV0gPSBfbG9jYXRlT3JDcmVhdGVUZXh0Tm9kZShcbiAgICAgIHRWaWV3LCBsVmlldywgdE5vZGUsIGFkanVzdGVkSW5kZXgsIHZhbHVlLCBwcmV2aW91c1ROb2RlISwgcHJldmlvdXNUTm9kZVBhcmVudCk7XG5cbiAgbFZpZXdbYWRqdXN0ZWRJbmRleF0gPSB0ZXh0TmF0aXZlO1xuICBpc05ld2x5Q3JlYXRlZE5vZGUgJiYgYXBwZW5kQ2hpbGQodFZpZXcsIGxWaWV3LCB0ZXh0TmF0aXZlLCB0Tm9kZSk7XG5cbiAgLy8gVGV4dCBub2RlcyBhcmUgc2VsZiBjbG9zaW5nLlxuICBzZXRDdXJyZW50VE5vZGUodE5vZGUsIGZhbHNlKTtcbn1cblxubGV0IF9sb2NhdGVPckNyZWF0ZVRleHROb2RlOiB0eXBlb2YgbG9jYXRlT3JDcmVhdGVUZXh0Tm9kZUltcGwgPVxuICAgICh0VmlldzogVFZpZXcsIGxWaWV3OiBMVmlldywgdE5vZGU6IFROb2RlLCBhZGp1c3RlZEluZGV4OiBudW1iZXIsIHZhbHVlOiBzdHJpbmcsXG4gICAgIHByZXZpb3VzVE5vZGU6IFROb2RlLCBwcmV2aW91c1ROb2RlUGFyZW50OiBib29sZWFuKSA9PiB7XG4gICAgICByZXR1cm4gW3RydWUsIGNyZWF0ZVRleHROb2RlKGxWaWV3W1JFTkRFUkVSXSwgdmFsdWUpXTtcbiAgICB9XG5cbmZ1bmN0aW9uIGxvY2F0ZU9yQ3JlYXRlVGV4dE5vZGVJbXBsKFxuICAgIHRWaWV3OiBUVmlldywgbFZpZXc6IExWaWV3LCB0Tm9kZTogVE5vZGUsIGFkanVzdGVkSW5kZXg6IG51bWJlciwgdmFsdWU6IHN0cmluZyxcbiAgICBwcmV2aW91c1ROb2RlOiBUTm9kZSwgcHJldmlvdXNUTm9kZVBhcmVudDogYm9vbGVhbik6IFtib29sZWFuLCBSVGV4dF0ge1xuICBjb25zdCBuZ2ggPSBsVmlld1tIWURSQVRJT05fSU5GT107XG4gIGNvbnN0IGluZGV4ID0gYWRqdXN0ZWRJbmRleCAtIEhFQURFUl9PRkZTRVQ7XG4gIGNvbnN0IGlzQ3JlYXRpbmcgPSAhbmdoIHx8IGlzSW5Ta2lwSHlkcmF0aW9uQmxvY2soKSB8fCBpc05vZGVEaXNjb25uZWN0ZWQobmdoLCBpbmRleCk7XG4gIGxldCB0ZXh0TmF0aXZlOiBSVGV4dDtcbiAgaWYgKGlzQ3JlYXRpbmcpIHtcbiAgICB0ZXh0TmF0aXZlID0gY3JlYXRlVGV4dE5vZGUobFZpZXdbUkVOREVSRVJdLCB2YWx1ZSk7XG4gIH0gZWxzZSB7XG4gICAgLy8gaHlkcmF0aW5nXG4gICAgdGV4dE5hdGl2ZSA9XG4gICAgICAgIGxvY2F0ZU5leHRSTm9kZShuZ2gsIHRWaWV3LCBsVmlldywgdE5vZGUsIHByZXZpb3VzVE5vZGUsIHByZXZpb3VzVE5vZGVQYXJlbnQpIGFzIFJUZXh0O1xuICAgIG5nRGV2TW9kZSAmJlxuICAgICAgICBhc3NlcnRSVGV4dChcbiAgICAgICAgICAgIHRleHROYXRpdmUsXG4gICAgICAgICAgICBgRXhwZWN0aW5nIGEgdGV4dCBub2RlICh3aXRoIHRoZSAnJHt2YWx1ZX0nIHZhbHVlKSBpbiB0aGUgdGV4dCBpbnN0cnVjdGlvbmApO1xuICAgIG5nRGV2TW9kZSAmJiBtYXJrUk5vZGVBc0NsYWltZWRGb3JIeWRyYXRpb24odGV4dE5hdGl2ZSk7XG4gIH1cbiAgcmV0dXJuIFtpc0NyZWF0aW5nLCB0ZXh0TmF0aXZlXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVuYWJsZUxvY2F0ZU9yQ3JlYXRlVGV4dE5vZGVJbXBsKCkge1xuICBfbG9jYXRlT3JDcmVhdGVUZXh0Tm9kZSA9IGxvY2F0ZU9yQ3JlYXRlVGV4dE5vZGVJbXBsO1xufVxuIl19