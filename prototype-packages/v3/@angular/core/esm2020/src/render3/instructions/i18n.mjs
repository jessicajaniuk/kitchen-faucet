/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import '../../util/ng_dev_mode';
import '../../util/ng_i18n_closure_mode';
import { assertDefined } from '../../util/assert';
import { bindingUpdated } from '../bindings';
import { applyCreateOpCodes, applyI18n, setMaskBit } from '../i18n/i18n_apply';
import { i18nAttributesFirstPass, i18nStartFirstCreatePass } from '../i18n/i18n_parse';
import { i18nPostprocess } from '../i18n/i18n_postprocess';
import { HEADER_OFFSET, T_HOST } from '../interfaces/view';
import { getClosestRElement } from '../node_manipulation';
import { getCurrentParentTNode, getLView, getTView, nextBindingIndex, setInI18nBlock } from '../state';
import { getConstant } from '../util/view_utils';
/**
 * Marks a block of text as translatable.
 *
 * The instructions `i18nStart` and `i18nEnd` mark the translation block in the template.
 * The translation `message` is the value which is locale specific. The translation string may
 * contain placeholders which associate inner elements and sub-templates within the translation.
 *
 * The translation `message` placeholders are:
 * - `�{index}(:{block})�`: *Binding Placeholder*: Marks a location where an expression will be
 *   interpolated into. The placeholder `index` points to the expression binding index. An optional
 *   `block` that matches the sub-template in which it was declared.
 * - `�#{index}(:{block})�`/`�/#{index}(:{block})�`: *Element Placeholder*:  Marks the beginning
 *   and end of DOM element that were embedded in the original translation block. The placeholder
 *   `index` points to the element index in the template instructions set. An optional `block` that
 *   matches the sub-template in which it was declared.
 * - `�*{index}:{block}�`/`�/*{index}:{block}�`: *Sub-template Placeholder*: Sub-templates must be
 *   split up and translated separately in each angular template function. The `index` points to the
 *   `template` instruction index. A `block` that matches the sub-template in which it was declared.
 *
 * @param index A unique index of the translation in the static block.
 * @param messageIndex An index of the translation message from the `def.consts` array.
 * @param subTemplateIndex Optional sub-template index in the `message`.
 *
 * @codeGenApi
 */
export function ɵɵi18nStart(index, messageIndex, subTemplateIndex = -1) {
    const tView = getTView();
    const lView = getLView();
    const adjustedIndex = HEADER_OFFSET + index;
    ngDevMode && assertDefined(tView, `tView should be defined`);
    const message = getConstant(tView.consts, messageIndex);
    const parentTNode = getCurrentParentTNode();
    if (tView.firstCreatePass) {
        i18nStartFirstCreatePass(tView, parentTNode === null ? 0 : parentTNode.index, lView, adjustedIndex, message, subTemplateIndex);
    }
    const tI18n = tView.data[adjustedIndex];
    const sameViewParentTNode = parentTNode === lView[T_HOST] ? null : parentTNode;
    const parentRNode = getClosestRElement(tView, sameViewParentTNode, lView);
    // If `parentTNode` is an `ElementContainer` than it has `<!--ng-container--->`.
    // When we do inserts we have to make sure to insert in front of `<!--ng-container--->`.
    const insertInFrontOf = parentTNode && (parentTNode.type & 8 /* TNodeType.ElementContainer */) ?
        lView[parentTNode.index] :
        null;
    applyCreateOpCodes(lView, tI18n.create, parentRNode, insertInFrontOf);
    setInI18nBlock(true);
}
/**
 * Translates a translation block marked by `i18nStart` and `i18nEnd`. It inserts the text/ICU nodes
 * into the render tree, moves the placeholder nodes and removes the deleted nodes.
 *
 * @codeGenApi
 */
export function ɵɵi18nEnd() {
    setInI18nBlock(false);
}
/**
 *
 * Use this instruction to create a translation block that doesn't contain any placeholder.
 * It calls both {@link i18nStart} and {@link i18nEnd} in one instruction.
 *
 * The translation `message` is the value which is locale specific. The translation string may
 * contain placeholders which associate inner elements and sub-templates within the translation.
 *
 * The translation `message` placeholders are:
 * - `�{index}(:{block})�`: *Binding Placeholder*: Marks a location where an expression will be
 *   interpolated into. The placeholder `index` points to the expression binding index. An optional
 *   `block` that matches the sub-template in which it was declared.
 * - `�#{index}(:{block})�`/`�/#{index}(:{block})�`: *Element Placeholder*:  Marks the beginning
 *   and end of DOM element that were embedded in the original translation block. The placeholder
 *   `index` points to the element index in the template instructions set. An optional `block` that
 *   matches the sub-template in which it was declared.
 * - `�*{index}:{block}�`/`�/*{index}:{block}�`: *Sub-template Placeholder*: Sub-templates must be
 *   split up and translated separately in each angular template function. The `index` points to the
 *   `template` instruction index. A `block` that matches the sub-template in which it was declared.
 *
 * @param index A unique index of the translation in the static block.
 * @param messageIndex An index of the translation message from the `def.consts` array.
 * @param subTemplateIndex Optional sub-template index in the `message`.
 *
 * @codeGenApi
 */
export function ɵɵi18n(index, messageIndex, subTemplateIndex) {
    ɵɵi18nStart(index, messageIndex, subTemplateIndex);
    ɵɵi18nEnd();
}
/**
 * Marks a list of attributes as translatable.
 *
 * @param index A unique index in the static block
 * @param values
 *
 * @codeGenApi
 */
export function ɵɵi18nAttributes(index, attrsIndex) {
    const tView = getTView();
    ngDevMode && assertDefined(tView, `tView should be defined`);
    const attrs = getConstant(tView.consts, attrsIndex);
    i18nAttributesFirstPass(tView, index + HEADER_OFFSET, attrs);
}
/**
 * Stores the values of the bindings during each update cycle in order to determine if we need to
 * update the translated nodes.
 *
 * @param value The binding's value
 * @returns This function returns itself so that it may be chained
 * (e.g. `i18nExp(ctx.name)(ctx.title)`)
 *
 * @codeGenApi
 */
export function ɵɵi18nExp(value) {
    const lView = getLView();
    setMaskBit(bindingUpdated(lView, nextBindingIndex(), value));
    return ɵɵi18nExp;
}
/**
 * Updates a translation block or an i18n attribute when the bindings have changed.
 *
 * @param index Index of either {@link i18nStart} (translation block) or {@link i18nAttributes}
 * (i18n attribute) on which it should update the content.
 *
 * @codeGenApi
 */
export function ɵɵi18nApply(index) {
    applyI18n(getTView(), getLView(), index + HEADER_OFFSET);
}
/**
 * Handles message string post-processing for internationalization.
 *
 * Handles message string post-processing by transforming it from intermediate
 * format (that might contain some markers that we need to replace) to the final
 * form, consumable by i18nStart instruction. Post processing steps include:
 *
 * 1. Resolve all multi-value cases (like [�*1:1��#2:1�|�#4:1�|�5�])
 * 2. Replace all ICU vars (like "VAR_PLURAL")
 * 3. Replace all placeholders used inside ICUs in a form of {PLACEHOLDER}
 * 4. Replace all ICU references with corresponding values (like �ICU_EXP_ICU_1�)
 *    in case multiple ICUs have the same placeholder name
 *
 * @param message Raw translation string for post processing
 * @param replacements Set of replacements that should be applied
 *
 * @returns Transformed string that can be consumed by i18nStart instruction
 *
 * @codeGenApi
 */
export function ɵɵi18nPostprocess(message, replacements = {}) {
    return i18nPostprocess(message, replacements);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaTE4bi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL3JlbmRlcjMvaW5zdHJ1Y3Rpb25zL2kxOG4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyx3QkFBd0IsQ0FBQztBQUNoQyxPQUFPLGlDQUFpQyxDQUFDO0FBRXpDLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNoRCxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQzNDLE9BQU8sRUFBQyxrQkFBa0IsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDN0UsT0FBTyxFQUFDLHVCQUF1QixFQUFFLHdCQUF3QixFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDckYsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBR3pELE9BQU8sRUFBQyxhQUFhLEVBQUUsTUFBTSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDekQsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDeEQsT0FBTyxFQUFDLHFCQUFxQixFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQXdCLGdCQUFnQixFQUFFLGNBQWMsRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUMzSCxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFFL0M7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUNILE1BQU0sVUFBVSxXQUFXLENBQ3ZCLEtBQWEsRUFBRSxZQUFvQixFQUFFLG1CQUEyQixDQUFDLENBQUM7SUFDcEUsTUFBTSxLQUFLLEdBQUcsUUFBUSxFQUFFLENBQUM7SUFDekIsTUFBTSxLQUFLLEdBQUcsUUFBUSxFQUFFLENBQUM7SUFDekIsTUFBTSxhQUFhLEdBQUcsYUFBYSxHQUFHLEtBQUssQ0FB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QUFFLFlBQVksQ0FBQyxDQUFDO0FBQ2hELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCAnLi4vLi4vdXRpbC9uZ19kZXZfbW9kZSc7XG5pbXBvcnQgJy4uLy4uL3V0aWwvbmdfaTE4bl9jbG9zdXJlX21vZGUnO1xuXG5pbXBvcnQge2Fzc2VydERlZmluZWR9IGZyb20gJy4uLy4uL3V0aWwvYXNzZXJ0JztcbmltcG9ydCB7YmluZGluZ1VwZGF0ZWR9IGZyb20gJy4uL2JpbmRpbmdzJztcbmltcG9ydCB7YXBwbHlDcmVhdGVPcENvZGVzLCBhcHBseUkxOG4sIHNldE1hc2tCaXR9IGZyb20gJy4uL2kxOG4vaTE4bl9hcHBseSc7XG5pbXBvcnQge2kxOG5BdHRyaWJ1dGVzRmlyc3RQYXNzLCBpMThuU3RhcnRGaXJzdENyZWF0ZVBhc3N9IGZyb20gJy4uL2kxOG4vaTE4bl9wYXJzZSc7XG5pbXBvcnQge2kxOG5Qb3N0cHJvY2Vzc30gZnJvbSAnLi4vaTE4bi9pMThuX3Bvc3Rwcm9jZXNzJztcbmltcG9ydCB7VEkxOG59IGZyb20gJy4uL2ludGVyZmFjZXMvaTE4bic7XG5pbXBvcnQge1RFbGVtZW50Tm9kZSwgVE5vZGVUeXBlfSBmcm9tICcuLi9pbnRlcmZhY2VzL25vZGUnO1xuaW1wb3J0IHtIRUFERVJfT0ZGU0VULCBUX0hPU1R9IGZyb20gJy4uL2ludGVyZmFjZXMvdmlldyc7XG5pbXBvcnQge2dldENsb3Nlc3RSRWxlbWVudH0gZnJvbSAnLi4vbm9kZV9tYW5pcHVsYXRpb24nO1xuaW1wb3J0IHtnZXRDdXJyZW50UGFyZW50VE5vZGUsIGdldExWaWV3LCBnZXRUVmlldywgaXNDdXJyZW50VE5vZGVQYXJlbnQsIG5leHRCaW5kaW5nSW5kZXgsIHNldEluSTE4bkJsb2NrfSBmcm9tICcuLi9zdGF0ZSc7XG5pbXBvcnQge2dldENvbnN0YW50fSBmcm9tICcuLi91dGlsL3ZpZXdfdXRpbHMnO1xuXG4vKipcbiAqIE1hcmtzIGEgYmxvY2sgb2YgdGV4dCBhcyB0cmFuc2xhdGFibGUuXG4gKlxuICogVGhlIGluc3RydWN0aW9ucyBgaTE4blN0YXJ0YCBhbmQgYGkxOG5FbmRgIG1hcmsgdGhlIHRyYW5zbGF0aW9uIGJsb2NrIGluIHRoZSB0ZW1wbGF0ZS5cbiAqIFRoZSB0cmFuc2xhdGlvbiBgbWVzc2FnZWAgaXMgdGhlIHZhbHVlIHdoaWNoIGlzIGxvY2FsZSBzcGVjaWZpYy4gVGhlIHRyYW5zbGF0aW9uIHN0cmluZyBtYXlcbiAqIGNvbnRhaW4gcGxhY2Vob2xkZXJzIHdoaWNoIGFzc29jaWF0ZSBpbm5lciBlbGVtZW50cyBhbmQgc3ViLXRlbXBsYXRlcyB3aXRoaW4gdGhlIHRyYW5zbGF0aW9uLlxuICpcbiAqIFRoZSB0cmFuc2xhdGlvbiBgbWVzc2FnZWAgcGxhY2Vob2xkZXJzIGFyZTpcbiAqIC0gYO+/vXtpbmRleH0oOntibG9ja30p77+9YDogKkJpbmRpbmcgUGxhY2Vob2xkZXIqOiBNYXJrcyBhIGxvY2F0aW9uIHdoZXJlIGFuIGV4cHJlc3Npb24gd2lsbCBiZVxuICogICBpbnRlcnBvbGF0ZWQgaW50by4gVGhlIHBsYWNlaG9sZGVyIGBpbmRleGAgcG9pbnRzIHRvIHRoZSBleHByZXNzaW9uIGJpbmRpbmcgaW5kZXguIEFuIG9wdGlvbmFsXG4gKiAgIGBibG9ja2AgdGhhdCBtYXRjaGVzIHRoZSBzdWItdGVtcGxhdGUgaW4gd2hpY2ggaXQgd2FzIGRlY2xhcmVkLlxuICogLSBg77+9I3tpbmRleH0oOntibG9ja30p77+9YC9g77+9LyN7aW5kZXh9KDp7YmxvY2t9Ke+/vWA6ICpFbGVtZW50IFBsYWNlaG9sZGVyKjogIE1hcmtzIHRoZSBiZWdpbm5pbmdcbiAqICAgYW5kIGVuZCBvZiBET00gZWxlbWVudCB0aGF0IHdlcmUgZW1iZWRkZWQgaW4gdGhlIG9yaWdpbmFsIHRyYW5zbGF0aW9uIGJsb2NrLiBUaGUgcGxhY2Vob2xkZXJcbiAqICAgYGluZGV4YCBwb2ludHMgdG8gdGhlIGVsZW1lbnQgaW5kZXggaW4gdGhlIHRlbXBsYXRlIGluc3RydWN0aW9ucyBzZXQuIEFuIG9wdGlvbmFsIGBibG9ja2AgdGhhdFxuICogICBtYXRjaGVzIHRoZSBzdWItdGVtcGxhdGUgaW4gd2hpY2ggaXQgd2FzIGRlY2xhcmVkLlxuICogLSBg77+9KntpbmRleH06e2Jsb2Nrfe+/vWAvYO+/vS8qe2luZGV4fTp7YmxvY2t977+9YDogKlN1Yi10ZW1wbGF0ZSBQbGFjZWhvbGRlcio6IFN1Yi10ZW1wbGF0ZXMgbXVzdCBiZVxuICogICBzcGxpdCB1cCBhbmQgdHJhbnNsYXRlZCBzZXBhcmF0ZWx5IGluIGVhY2ggYW5ndWxhciB0ZW1wbGF0ZSBmdW5jdGlvbi4gVGhlIGBpbmRleGAgcG9pbnRzIHRvIHRoZVxuICogICBgdGVtcGxhdGVgIGluc3RydWN0aW9uIGluZGV4LiBBIGBibG9ja2AgdGhhdCBtYXRjaGVzIHRoZSBzdWItdGVtcGxhdGUgaW4gd2hpY2ggaXQgd2FzIGRlY2xhcmVkLlxuICpcbiAqIEBwYXJhbSBpbmRleCBBIHVuaXF1ZSBpbmRleCBvZiB0aGUgdHJhbnNsYXRpb24gaW4gdGhlIHN0YXRpYyBibG9jay5cbiAqIEBwYXJhbSBtZXNzYWdlSW5kZXggQW4gaW5kZXggb2YgdGhlIHRyYW5zbGF0aW9uIG1lc3NhZ2UgZnJvbSB0aGUgYGRlZi5jb25zdHNgIGFycmF5LlxuICogQHBhcmFtIHN1YlRlbXBsYXRlSW5kZXggT3B0aW9uYWwgc3ViLXRlbXBsYXRlIGluZGV4IGluIHRoZSBgbWVzc2FnZWAuXG4gKlxuICogQGNvZGVHZW5BcGlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIMm1ybVpMThuU3RhcnQoXG4gICAgaW5kZXg6IG51bWJlciwgbWVzc2FnZUluZGV4OiBudW1iZXIsIHN1YlRlbXBsYXRlSW5kZXg6IG51bWJlciA9IC0xKTogdm9pZCB7XG4gIGNvbnN0IHRWaWV3ID0gZ2V0VFZpZXcoKTtcbiAgY29uc3QgbFZpZXcgPSBnZXRMVmlldygpO1xuICBjb25zdCBhZGp1c3RlZEluZGV4ID0gSEVBREVSX09GRlNFVCArIGluZGV4O1xuICBuZ0Rldk1vZGUgJiYgYXNzZXJ0RGVmaW5lZCh0VmlldywgYHRWaWV3IHNob3VsZCBiZSBkZWZpbmVkYCk7XG4gIGNvbnN0IG1lc3NhZ2UgPSBnZXRDb25zdGFudDxzdHJpbmc+KHRWaWV3LmNvbnN0cywgbWVzc2FnZUluZGV4KSE7XG4gIGNvbnN0IHBhcmVudFROb2RlID0gZ2V0Q3VycmVudFBhcmVudFROb2RlKCkgYXMgVEVsZW1lbnROb2RlIHwgbnVsbDtcbiAgaWYgKHRWaWV3LmZpcnN0Q3JlYXRlUGFzcykge1xuICAgIGkxOG5TdGFydEZpcnN0Q3JlYXRlUGFzcyhcbiAgICAgICAgdFZpZXcsIHBhcmVudFROb2RlID09PSBudWxsID8gMCA6IHBhcmVudFROb2RlLmluZGV4LCBsVmlldywgYWRqdXN0ZWRJbmRleCwgbWVzc2FnZSxcbiAgICAgICAgc3ViVGVtcGxhdGVJbmRleCk7XG4gIH1cbiAgY29uc3QgdEkxOG4gPSB0Vmlldy5kYXRhW2FkanVzdGVkSW5kZXhdIGFzIFRJMThuO1xuICBjb25zdCBzYW1lVmlld1BhcmVudFROb2RlID0gcGFyZW50VE5vZGUgPT09IGxWaWV3W1RfSE9TVF0gPyBudWxsIDogcGFyZW50VE5vZGU7XG4gIGNvbnN0IHBhcmVudFJOb2RlID0gZ2V0Q2xvc2VzdFJFbGVtZW50KHRWaWV3LCBzYW1lVmlld1BhcmVudFROb2RlLCBsVmlldyk7XG4gIC8vIElmIGBwYXJlbnRUTm9kZWAgaXMgYW4gYEVsZW1lbnRDb250YWluZXJgIHRoYW4gaXQgaGFzIGA8IS0tbmctY29udGFpbmVyLS0tPmAuXG4gIC8vIFdoZW4gd2UgZG8gaW5zZXJ0cyB3ZSBoYXZlIHRvIG1ha2Ugc3VyZSB0byBpbnNlcnQgaW4gZnJvbnQgb2YgYDwhLS1uZy1jb250YWluZXItLS0+YC5cbiAgY29uc3QgaW5zZXJ0SW5Gcm9udE9mID0gcGFyZW50VE5vZGUgJiYgKHBhcmVudFROb2RlLnR5cGUgJiBUTm9kZVR5cGUuRWxlbWVudENvbnRhaW5lcikgP1xuICAgICAgbFZpZXdbcGFyZW50VE5vZGUuaW5kZXhdIDpcbiAgICAgIG51bGw7XG4gIGFwcGx5Q3JlYXRlT3BDb2RlcyhsVmlldywgdEkxOG4uY3JlYXRlLCBwYXJlbnRSTm9kZSwgaW5zZXJ0SW5Gcm9udE9mKTtcbiAgc2V0SW5JMThuQmxvY2sodHJ1ZSk7XG59XG5cblxuXG4vKipcbiAqIFRyYW5zbGF0ZXMgYSB0cmFuc2xhdGlvbiBibG9jayBtYXJrZWQgYnkgYGkxOG5TdGFydGAgYW5kIGBpMThuRW5kYC4gSXQgaW5zZXJ0cyB0aGUgdGV4dC9JQ1Ugbm9kZXNcbiAqIGludG8gdGhlIHJlbmRlciB0cmVlLCBtb3ZlcyB0aGUgcGxhY2Vob2xkZXIgbm9kZXMgYW5kIHJlbW92ZXMgdGhlIGRlbGV0ZWQgbm9kZXMuXG4gKlxuICogQGNvZGVHZW5BcGlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIMm1ybVpMThuRW5kKCk6IHZvaWQge1xuICBzZXRJbkkxOG5CbG9jayhmYWxzZSk7XG59XG5cbi8qKlxuICpcbiAqIFVzZSB0aGlzIGluc3RydWN0aW9uIHRvIGNyZWF0ZSBhIHRyYW5zbGF0aW9uIGJsb2NrIHRoYXQgZG9lc24ndCBjb250YWluIGFueSBwbGFjZWhvbGRlci5cbiAqIEl0IGNhbGxzIGJvdGgge0BsaW5rIGkxOG5TdGFydH0gYW5kIHtAbGluayBpMThuRW5kfSBpbiBvbmUgaW5zdHJ1Y3Rpb24uXG4gKlxuICogVGhlIHRyYW5zbGF0aW9uIGBtZXNzYWdlYCBpcyB0aGUgdmFsdWUgd2hpY2ggaXMgbG9jYWxlIHNwZWNpZmljLiBUaGUgdHJhbnNsYXRpb24gc3RyaW5nIG1heVxuICogY29udGFpbiBwbGFjZWhvbGRlcnMgd2hpY2ggYXNzb2NpYXRlIGlubmVyIGVsZW1lbnRzIGFuZCBzdWItdGVtcGxhdGVzIHdpdGhpbiB0aGUgdHJhbnNsYXRpb24uXG4gKlxuICogVGhlIHRyYW5zbGF0aW9uIGBtZXNzYWdlYCBwbGFjZWhvbGRlcnMgYXJlOlxuICogLSBg77+9e2luZGV4fSg6e2Jsb2NrfSnvv71gOiAqQmluZGluZyBQbGFjZWhvbGRlcio6IE1hcmtzIGEgbG9jYXRpb24gd2hlcmUgYW4gZXhwcmVzc2lvbiB3aWxsIGJlXG4gKiAgIGludGVycG9sYXRlZCBpbnRvLiBUaGUgcGxhY2Vob2xkZXIgYGluZGV4YCBwb2ludHMgdG8gdGhlIGV4cHJlc3Npb24gYmluZGluZyBpbmRleC4gQW4gb3B0aW9uYWxcbiAqICAgYGJsb2NrYCB0aGF0IG1hdGNoZXMgdGhlIHN1Yi10ZW1wbGF0ZSBpbiB3aGljaCBpdCB3YXMgZGVjbGFyZWQuXG4gKiAtIGDvv70je2luZGV4fSg6e2Jsb2NrfSnvv71gL2Dvv70vI3tpbmRleH0oOntibG9ja30p77+9YDogKkVsZW1lbnQgUGxhY2Vob2xkZXIqOiAgTWFya3MgdGhlIGJlZ2lubmluZ1xuICogICBhbmQgZW5kIG9mIERPTSBlbGVtZW50IHRoYXQgd2VyZSBlbWJlZGRlZCBpbiB0aGUgb3JpZ2luYWwgdHJhbnNsYXRpb24gYmxvY2suIFRoZSBwbGFjZWhvbGRlclxuICogICBgaW5kZXhgIHBvaW50cyB0byB0aGUgZWxlbWVudCBpbmRleCBpbiB0aGUgdGVtcGxhdGUgaW5zdHJ1Y3Rpb25zIHNldC4gQW4gb3B0aW9uYWwgYGJsb2NrYCB0aGF0XG4gKiAgIG1hdGNoZXMgdGhlIHN1Yi10ZW1wbGF0ZSBpbiB3aGljaCBpdCB3YXMgZGVjbGFyZWQuXG4gKiAtIGDvv70qe2luZGV4fTp7YmxvY2t977+9YC9g77+9Lyp7aW5kZXh9OntibG9ja33vv71gOiAqU3ViLXRlbXBsYXRlIFBsYWNlaG9sZGVyKjogU3ViLXRlbXBsYXRlcyBtdXN0IGJlXG4gKiAgIHNwbGl0IHVwIGFuZCB0cmFuc2xhdGVkIHNlcGFyYXRlbHkgaW4gZWFjaCBhbmd1bGFyIHRlbXBsYXRlIGZ1bmN0aW9uLiBUaGUgYGluZGV4YCBwb2ludHMgdG8gdGhlXG4gKiAgIGB0ZW1wbGF0ZWAgaW5zdHJ1Y3Rpb24gaW5kZXguIEEgYGJsb2NrYCB0aGF0IG1hdGNoZXMgdGhlIHN1Yi10ZW1wbGF0ZSBpbiB3aGljaCBpdCB3YXMgZGVjbGFyZWQuXG4gKlxuICogQHBhcmFtIGluZGV4IEEgdW5pcXVlIGluZGV4IG9mIHRoZSB0cmFuc2xhdGlvbiBpbiB0aGUgc3RhdGljIGJsb2NrLlxuICogQHBhcmFtIG1lc3NhZ2VJbmRleCBBbiBpbmRleCBvZiB0aGUgdHJhbnNsYXRpb24gbWVzc2FnZSBmcm9tIHRoZSBgZGVmLmNvbnN0c2AgYXJyYXkuXG4gKiBAcGFyYW0gc3ViVGVtcGxhdGVJbmRleCBPcHRpb25hbCBzdWItdGVtcGxhdGUgaW5kZXggaW4gdGhlIGBtZXNzYWdlYC5cbiAqXG4gKiBAY29kZUdlbkFwaVxuICovXG5leHBvcnQgZnVuY3Rpb24gybXJtWkxOG4oaW5kZXg6IG51bWJlciwgbWVzc2FnZUluZGV4OiBudW1iZXIsIHN1YlRlbXBsYXRlSW5kZXg/OiBudW1iZXIpOiB2b2lkIHtcbiAgybXJtWkxOG5TdGFydChpbmRleCwgbWVzc2FnZUluZGV4LCBzdWJUZW1wbGF0ZUluZGV4KTtcbiAgybXJtWkxOG5FbmQoKTtcbn1cblxuLyoqXG4gKiBNYXJrcyBhIGxpc3Qgb2YgYXR0cmlidXRlcyBhcyB0cmFuc2xhdGFibGUuXG4gKlxuICogQHBhcmFtIGluZGV4IEEgdW5pcXVlIGluZGV4IGluIHRoZSBzdGF0aWMgYmxvY2tcbiAqIEBwYXJhbSB2YWx1ZXNcbiAqXG4gKiBAY29kZUdlbkFwaVxuICovXG5leHBvcnQgZnVuY3Rpb24gybXJtWkxOG5BdHRyaWJ1dGVzKGluZGV4OiBudW1iZXIsIGF0dHJzSW5kZXg6IG51bWJlcik6IHZvaWQge1xuICBjb25zdCB0VmlldyA9IGdldFRWaWV3KCk7XG4gIG5nRGV2TW9kZSAmJiBhc3NlcnREZWZpbmVkKHRWaWV3LCBgdFZpZXcgc2hvdWxkIGJlIGRlZmluZWRgKTtcbiAgY29uc3QgYXR0cnMgPSBnZXRDb25zdGFudDxzdHJpbmdbXT4odFZpZXcuY29uc3RzLCBhdHRyc0luZGV4KSE7XG4gIGkxOG5BdHRyaWJ1dGVzRmlyc3RQYXNzKHRWaWV3LCBpbmRleCArIEhFQURFUl9PRkZTRVQsIGF0dHJzKTtcbn1cblxuXG4vKipcbiAqIFN0b3JlcyB0aGUgdmFsdWVzIG9mIHRoZSBiaW5kaW5ncyBkdXJpbmcgZWFjaCB1cGRhdGUgY3ljbGUgaW4gb3JkZXIgdG8gZGV0ZXJtaW5lIGlmIHdlIG5lZWQgdG9cbiAqIHVwZGF0ZSB0aGUgdHJhbnNsYXRlZCBub2Rlcy5cbiAqXG4gKiBAcGFyYW0gdmFsdWUgVGhlIGJpbmRpbmcncyB2YWx1ZVxuICogQHJldHVybnMgVGhpcyBmdW5jdGlvbiByZXR1cm5zIGl0c2VsZiBzbyB0aGF0IGl0IG1heSBiZSBjaGFpbmVkXG4gKiAoZS5nLiBgaTE4bkV4cChjdHgubmFtZSkoY3R4LnRpdGxlKWApXG4gKlxuICogQGNvZGVHZW5BcGlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIMm1ybVpMThuRXhwPFQ+KHZhbHVlOiBUKTogdHlwZW9mIMm1ybVpMThuRXhwIHtcbiAgY29uc3QgbFZpZXcgPSBnZXRMVmlldygpO1xuICBzZXRNYXNrQml0KGJpbmRpbmdVcGRhdGVkKGxWaWV3LCBuZXh0QmluZGluZ0luZGV4KCksIHZhbHVlKSk7XG4gIHJldHVybiDJtcm1aTE4bkV4cDtcbn1cblxuLyoqXG4gKiBVcGRhdGVzIGEgdHJhbnNsYXRpb24gYmxvY2sgb3IgYW4gaTE4biBhdHRyaWJ1dGUgd2hlbiB0aGUgYmluZGluZ3MgaGF2ZSBjaGFuZ2VkLlxuICpcbiAqIEBwYXJhbSBpbmRleCBJbmRleCBvZiBlaXRoZXIge0BsaW5rIGkxOG5TdGFydH0gKHRyYW5zbGF0aW9uIGJsb2NrKSBvciB7QGxpbmsgaTE4bkF0dHJpYnV0ZXN9XG4gKiAoaTE4biBhdHRyaWJ1dGUpIG9uIHdoaWNoIGl0IHNob3VsZCB1cGRhdGUgdGhlIGNvbnRlbnQuXG4gKlxuICogQGNvZGVHZW5BcGlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIMm1ybVpMThuQXBwbHkoaW5kZXg6IG51bWJlcikge1xuICBhcHBseUkxOG4oZ2V0VFZpZXcoKSwgZ2V0TFZpZXcoKSwgaW5kZXggKyBIRUFERVJfT0ZGU0VUKTtcbn1cblxuLyoqXG4gKiBIYW5kbGVzIG1lc3NhZ2Ugc3RyaW5nIHBvc3QtcHJvY2Vzc2luZyBmb3IgaW50ZXJuYXRpb25hbGl6YXRpb24uXG4gKlxuICogSGFuZGxlcyBtZXNzYWdlIHN0cmluZyBwb3N0LXByb2Nlc3NpbmcgYnkgdHJhbnNmb3JtaW5nIGl0IGZyb20gaW50ZXJtZWRpYXRlXG4gKiBmb3JtYXQgKHRoYXQgbWlnaHQgY29udGFpbiBzb21lIG1hcmtlcnMgdGhhdCB3ZSBuZWVkIHRvIHJlcGxhY2UpIHRvIHRoZSBmaW5hbFxuICogZm9ybSwgY29uc3VtYWJsZSBieSBpMThuU3RhcnQgaW5zdHJ1Y3Rpb24uIFBvc3QgcHJvY2Vzc2luZyBzdGVwcyBpbmNsdWRlOlxuICpcbiAqIDEuIFJlc29sdmUgYWxsIG11bHRpLXZhbHVlIGNhc2VzIChsaWtlIFvvv70qMTox77+977+9IzI6Me+/vXzvv70jNDox77+9fO+/vTXvv71dKVxuICogMi4gUmVwbGFjZSBhbGwgSUNVIHZhcnMgKGxpa2UgXCJWQVJfUExVUkFMXCIpXG4gKiAzLiBSZXBsYWNlIGFsbCBwbGFjZWhvbGRlcnMgdXNlZCBpbnNpZGUgSUNVcyBpbiBhIGZvcm0gb2Yge1BMQUNFSE9MREVSfVxuICogNC4gUmVwbGFjZSBhbGwgSUNVIHJlZmVyZW5jZXMgd2l0aCBjb3JyZXNwb25kaW5nIHZhbHVlcyAobGlrZSDvv71JQ1VfRVhQX0lDVV8x77+9KVxuICogICAgaW4gY2FzZSBtdWx0aXBsZSBJQ1VzIGhhdmUgdGhlIHNhbWUgcGxhY2Vob2xkZXIgbmFtZVxuICpcbiAqIEBwYXJhbSBtZXNzYWdlIFJhdyB0cmFuc2xhdGlvbiBzdHJpbmcgZm9yIHBvc3QgcHJvY2Vzc2luZ1xuICogQHBhcmFtIHJlcGxhY2VtZW50cyBTZXQgb2YgcmVwbGFjZW1lbnRzIHRoYXQgc2hvdWxkIGJlIGFwcGxpZWRcbiAqXG4gKiBAcmV0dXJucyBUcmFuc2Zvcm1lZCBzdHJpbmcgdGhhdCBjYW4gYmUgY29uc3VtZWQgYnkgaTE4blN0YXJ0IGluc3RydWN0aW9uXG4gKlxuICogQGNvZGVHZW5BcGlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIMm1ybVpMThuUG9zdHByb2Nlc3MoXG4gICAgbWVzc2FnZTogc3RyaW5nLCByZXBsYWNlbWVudHM6IHtba2V5OiBzdHJpbmddOiAoc3RyaW5nfHN0cmluZ1tdKX0gPSB7fSk6IHN0cmluZyB7XG4gIHJldHVybiBpMThuUG9zdHByb2Nlc3MobWVzc2FnZSwgcmVwbGFjZW1lbnRzKTtcbn1cbiJdfQ==