/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { _getTextWithExcludedElements, getNoKeysSpecifiedError, } from '@angular/cdk/testing';
import * as webdriver from 'selenium-webdriver';
import { getSeleniumWebDriverModifierKeys, seleniumWebDriverKeyMap } from './selenium-webdriver-keys';
/** A `TestElement` implementation for WebDriver. */
export class SeleniumWebDriverElement {
    constructor(element, _stabilize) {
        this.element = element;
        this._stabilize = _stabilize;
    }
    /** Blur the element. */
    async blur() {
        await this._executeScript((element) => element.blur(), this.element());
        await this._stabilize();
    }
    /** Clear the element's input (for input and textarea elements only). */
    async clear() {
        await this.element().clear();
        await this._stabilize();
    }
    async click(...args) {
        await this._dispatchClickEventSequence(args, webdriver.Button.LEFT);
        await this._stabilize();
    }
    async rightClick(...args) {
        await this._dispatchClickEventSequence(args, webdriver.Button.RIGHT);
        await this._stabilize();
    }
    /** Focus the element. */
    async focus() {
        await this._executeScript((element) => element.focus(), this.element());
        await this._stabilize();
    }
    /** Get the computed value of the given CSS property for the element. */
    async getCssValue(property) {
        await this._stabilize();
        return this.element().getCssValue(property);
    }
    /** Hovers the mouse over the element. */
    async hover() {
        await this._actions().mouseMove(this.element()).perform();
        await this._stabilize();
    }
    /** Moves the mouse away from the element. */
    async mouseAway() {
        await this._actions().mouseMove(this.element(), { x: -1, y: -1 }).perform();
        await this._stabilize();
    }
    async sendKeys(...modifiersAndKeys) {
        const first = modifiersAndKeys[0];
        let modifiers;
        let rest;
        if (first !== undefined && typeof first !== 'string' && typeof first !== 'number') {
            modifiers = first;
            rest = modifiersAndKeys.slice(1);
        }
        else {
            modifiers = {};
            rest = modifiersAndKeys;
        }
        const modifierKeys = getSeleniumWebDriverModifierKeys(modifiers);
        const keys = rest
            .map(k => (typeof k === 'string' ? k.split('') : [seleniumWebDriverKeyMap[k]]))
            .reduce((arr, k) => arr.concat(k), [])
            // webdriver.Key.chord doesn't work well with geckodriver (mozilla/geckodriver#1502),
            // so avoid it if no modifier keys are required.
            .map(k => (modifierKeys.length > 0 ? webdriver.Key.chord(...modifierKeys, k) : k));
        // Throw an error if no keys have been specified. Calling this function with no
        // keys should not result in a focus event being dispatched unexpectedly.
        if (keys.length === 0) {
            throw getNoKeysSpecifiedError();
        }
        await this.element().sendKeys(...keys);
        await this._stabilize();
    }
    /**
     * Gets the text from the element.
     * @param options Options that affect what text is included.
     */
    async text(options) {
        await this._stabilize();
        if (options?.exclude) {
            return this._executeScript(_getTextWithExcludedElements, this.element(), options.exclude);
        }
        // We don't go through the WebDriver `getText`, because it excludes text from hidden elements.
        return this._executeScript((element) => (element.textContent || '').trim(), this.element());
    }
    /**
     * Sets the value of a `contenteditable` element.
     * @param value Value to be set on the element.
     */
    async setContenteditableValue(value) {
        const contenteditableAttr = await this.getAttribute('contenteditable');
        if (contenteditableAttr !== '' && contenteditableAttr !== 'true') {
            throw new Error('setContenteditableValue can only be called on a `contenteditable` element.');
        }
        await this._stabilize();
        return this._executeScript((element, valueToSet) => (element.textContent = valueToSet), this.element(), value);
    }
    /** Gets the value for the given attribute from the element. */
    async getAttribute(name) {
        await this._stabilize();
        return this._executeScript((element, attribute) => element.getAttribute(attribute), this.element(), name);
    }
    /** Checks whether the element has the given class. */
    async hasClass(name) {
        await this._stabilize();
        const classes = (await this.getAttribute('class')) || '';
        return new Set(classes.split(/\s+/).filter(c => c)).has(name);
    }
    /** Gets the dimensions of the element. */
    async getDimensions() {
        await this._stabilize();
        const { width, height } = await this.element().getSize();
        const { x: left, y: top } = await this.element().getLocation();
        return { width, height, left, top };
    }
    /** Gets the value of a property of an element. */
    async getProperty(name) {
        await this._stabilize();
        return this._executeScript((element, property) => element[property], this.element(), name);
    }
    /** Sets the value of a property of an input. */
    async setInputValue(newValue) {
        await this._executeScript((element, value) => (element.value = value), this.element(), newValue);
        await this._stabilize();
    }
    /** Selects the options at the specified indexes inside of a native `select` element. */
    async selectOptions(...optionIndexes) {
        await this._stabilize();
        const options = await this.element().findElements(webdriver.By.css('option'));
        const indexes = new Set(optionIndexes); // Convert to a set to remove duplicates.
        if (options.length && indexes.size) {
            // Reset the value so all the selected states are cleared. We can
            // reuse the input-specific method since the logic is the same.
            await this.setInputValue('');
            for (let i = 0; i < options.length; i++) {
                if (indexes.has(i)) {
                    // We have to hold the control key while clicking on options so that multiple can be
                    // selected in multi-selection mode. The key doesn't do anything for single selection.
                    await this._actions().keyDown(webdriver.Key.CONTROL).perform();
                    await options[i].click();
                    await this._actions().keyUp(webdriver.Key.CONTROL).perform();
                }
            }
            await this._stabilize();
        }
    }
    /** Checks whether this element matches the given selector. */
    async matchesSelector(selector) {
        await this._stabilize();
        return this._executeScript((element, s) => (Element.prototype.matches || Element.prototype.msMatchesSelector).call(element, s), this.element(), selector);
    }
    /** Checks whether the element is focused. */
    async isFocused() {
        await this._stabilize();
        return webdriver.WebElement.equals(this.element(), this.element().getDriver().switchTo().activeElement());
    }
    /**
     * Dispatches an event with a particular name.
     * @param name Name of the event to be dispatched.
     */
    async dispatchEvent(name, data) {
        await this._executeScript(dispatchEvent, name, this.element(), data);
        await this._stabilize();
    }
    /** Gets the webdriver action sequence. */
    _actions() {
        return this.element().getDriver().actions();
    }
    /** Executes a function in the browser. */
    async _executeScript(script, ...var_args) {
        return this.element()
            .getDriver()
            .executeScript(script, ...var_args);
    }
    /** Dispatches all the events that are part of a click event sequence. */
    async _dispatchClickEventSequence(args, button) {
        let modifiers = {};
        if (args.length && typeof args[args.length - 1] === 'object') {
            modifiers = args.pop();
        }
        const modifierKeys = getSeleniumWebDriverModifierKeys(modifiers);
        // Omitting the offset argument to mouseMove results in clicking the center.
        // This is the default behavior we want, so we use an empty array of offsetArgs if
        // no args remain after popping the modifiers from the args passed to this function.
        const offsetArgs = (args.length === 2 ? [{ x: args[0], y: args[1] }] : []);
        let actions = this._actions().mouseMove(this.element(), ...offsetArgs);
        for (const modifierKey of modifierKeys) {
            actions = actions.keyDown(modifierKey);
        }
        actions = actions.click(button);
        for (const modifierKey of modifierKeys) {
            actions = actions.keyUp(modifierKey);
        }
        await actions.perform();
    }
}
/**
 * Dispatches an event with a particular name and data to an element. Note that this needs to be a
 * pure function, because it gets stringified by WebDriver and is executed inside the browser.
 */
function dispatchEvent(name, element, data) {
    const event = document.createEvent('Event');
    event.initEvent(name);
    // tslint:disable-next-line:ban Have to use `Object.assign` to preserve the original object.
    Object.assign(event, data || {});
    element.dispatchEvent(event);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZW5pdW0td2ViLWRyaXZlci1lbGVtZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2Nkay90ZXN0aW5nL3NlbGVuaXVtLXdlYmRyaXZlci9zZWxlbml1bS13ZWItZHJpdmVyLWVsZW1lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLDRCQUE0QixFQUc1Qix1QkFBdUIsR0FLeEIsTUFBTSxzQkFBc0IsQ0FBQztBQUM5QixPQUFPLEtBQUssU0FBUyxNQUFNLG9CQUFvQixDQUFDO0FBQ2hELE9BQU8sRUFBQyxnQ0FBZ0MsRUFBRSx1QkFBdUIsRUFBQyxNQUFNLDJCQUEyQixDQUFDO0FBRXBHLG9EQUFvRDtBQUNwRCxNQUFNLE9BQU8sd0JBQXdCO0lBQ25DLFlBQ1csT0FBbUMsRUFDcEMsVUFBK0I7UUFEOUIsWUFBTyxHQUFQLE9BQU8sQ0FBNEI7UUFDcEMsZUFBVSxHQUFWLFVBQVUsQ0FBcUI7SUFDdEMsQ0FBQztJQUVKLHdCQUF3QjtJQUN4QixLQUFLLENBQUMsSUFBSTtRQUNSLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLE9BQW9CLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUNwRixNQUFNLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUMxQixDQUFDO0lBRUQsd0VBQXdFO0lBQ3hFLEtBQUssQ0FBQyxLQUFLO1FBQ1QsTUFBTSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDN0IsTUFBTSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDMUIsQ0FBQztJQWlCRCxLQUFLLENBQUMsS0FBSyxDQUNULEdBQUcsSUFBbUY7UUFFdEYsTUFBTSxJQUFJLENBQUMsMkJBQTJCLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FB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b250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBfZ2V0VGV4dFdpdGhFeGNsdWRlZEVsZW1lbnRzLFxuICBFbGVtZW50RGltZW5zaW9ucyxcbiAgRXZlbnREYXRhLFxuICBnZXROb0tleXNTcGVjaWZpZWRFcnJvcixcbiAgTW9kaWZpZXJLZXlzLFxuICBUZXN0RWxlbWVudCxcbiAgVGVzdEtleSxcbiAgVGV4dE9wdGlvbnMsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCAqIGFzIHdlYmRyaXZlciBmcm9tICdzZWxlbml1bS13ZWJkcml2ZXInO1xuaW1wb3J0IHtnZXRTZWxlbml1bVdlYkRyaXZlck1vZGlmaWVyS2V5cywgc2VsZW5pdW1XZWJEcml2ZXJLZXlNYXB9IGZyb20gJy4vc2VsZW5pdW0td2ViZHJpdmVyLWtleXMnO1xuXG4vKiogQSBgVGVzdEVsZW1lbnRgIGltcGxlbWVudGF0aW9uIGZvciBXZWJEcml2ZXIuICovXG5leHBvcnQgY2xhc3MgU2VsZW5pdW1XZWJEcml2ZXJFbGVtZW50IGltcGxlbWVudHMgVGVzdEVsZW1lbnQge1xuICBjb25zdHJ1Y3RvcihcbiAgICByZWFkb25seSBlbGVtZW50OiAoKSA9PiB3ZWJkcml2ZXIuV2ViRWxlbWVudCxcbiAgICBwcml2YXRlIF9zdGFiaWxpemU6ICgpID0+IFByb21pc2U8dm9pZD4sXG4gICkge31cblxuICAvKiogQmx1ciB0aGUgZWxlbWVudC4gKi9cbiAgYXN5bmMgYmx1cigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLl9leGVjdXRlU2NyaXB0KChlbGVtZW50OiBIVE1MRWxlbWVudCkgPT4gZWxlbWVudC5ibHVyKCksIHRoaXMuZWxlbWVudCgpKTtcbiAgICBhd2FpdCB0aGlzLl9zdGFiaWxpemUoKTtcbiAgfVxuXG4gIC8qKiBDbGVhciB0aGUgZWxlbWVudCdzIGlucHV0IChmb3IgaW5wdXQgYW5kIHRleHRhcmVhIGVsZW1lbnRzIG9ubHkpLiAqL1xuICBhc3luYyBjbGVhcigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLmVsZW1lbnQoKS5jbGVhcigpO1xuICAgIGF3YWl0IHRoaXMuX3N0YWJpbGl6ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENsaWNrIHRoZSBlbGVtZW50IGF0IHRoZSBkZWZhdWx0IGxvY2F0aW9uIGZvciB0aGUgY3VycmVudCBlbnZpcm9ubWVudC4gSWYgeW91IG5lZWQgdG8gZ3VhcmFudGVlXG4gICAqIHRoZSBlbGVtZW50IGlzIGNsaWNrZWQgYXQgYSBzcGVjaWZpYyBsb2NhdGlvbiwgY29uc2lkZXIgdXNpbmcgYGNsaWNrKCdjZW50ZXInKWAgb3JcbiAgICogYGNsaWNrKHgsIHkpYCBpbnN0ZWFkLlxuICAgKi9cbiAgY2xpY2sobW9kaWZpZXJzPzogTW9kaWZpZXJLZXlzKTogUHJvbWlzZTx2b2lkPjtcbiAgLyoqIENsaWNrIHRoZSBlbGVtZW50IGF0IHRoZSBlbGVtZW50J3MgY2VudGVyLiAqL1xuICBjbGljayhsb2NhdGlvbjogJ2NlbnRlcicsIG1vZGlmaWVycz86IE1vZGlmaWVyS2V5cyk6IFByb21pc2U8dm9pZD47XG4gIC8qKlxuICAgKiBDbGljayB0aGUgZWxlbWVudCBhdCB0aGUgc3BlY2lmaWVkIGNvb3JkaW5hdGVzIHJlbGF0aXZlIHRvIHRoZSB0b3AtbGVmdCBvZiB0aGUgZWxlbWVudC5cbiAgICogQHBhcmFtIHJlbGF0aXZlWCBDb29yZGluYXRlIHdpdGhpbiB0aGUgZWxlbWVudCwgYWxvbmcgdGhlIFgtYXhpcyBhdCB3aGljaCB0byBjbGljay5cbiAgICogQHBhcmFtIHJlbGF0aXZlWSBDb29yZGluYXRlIHdpdGhpbiB0aGUgZWxlbWVudCwgYWxvbmcgdGhlIFktYXhpcyBhdCB3aGljaCB0byBjbGljay5cbiAgICogQHBhcmFtIG1vZGlmaWVycyBNb2RpZmllciBrZXlzIGhlbGQgd2hpbGUgY2xpY2tpbmdcbiAgICovXG4gIGNsaWNrKHJlbGF0aXZlWDogbnVtYmVyLCByZWxhdGl2ZVk6IG51bWJlciwgbW9kaWZpZXJzPzogTW9kaWZpZXJLZXlzKTogUHJvbWlzZTx2b2lkPjtcbiAgYXN5bmMgY2xpY2soXG4gICAgLi4uYXJnczogW01vZGlmaWVyS2V5cz9dIHwgWydjZW50ZXInLCBNb2RpZmllcktleXM/XSB8IFtudW1iZXIsIG51bWJlciwgTW9kaWZpZXJLZXlzP11cbiAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5fZGlzcGF0Y2hDbGlja0V2ZW50U2VxdWVuY2UoYXJncywgd2ViZHJpdmVyLkJ1dHRvbi5MRUZUKTtcbiAgICBhd2FpdCB0aGlzLl9zdGFiaWxpemUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSaWdodCBjbGlja3Mgb24gdGhlIGVsZW1lbnQgYXQgdGhlIHNwZWNpZmllZCBjb29yZGluYXRlcyByZWxhdGl2ZSB0byB0aGUgdG9wLWxlZnQgb2YgaXQuXG4gICAqIEBwYXJhbSByZWxhdGl2ZVggQ29vcmRpbmF0ZSB3aXRoaW4gdGhlIGVsZW1lbnQsIGFsb25nIHRoZSBYLWF4aXMgYXQgd2hpY2ggdG8gY2xpY2suXG4gICAqIEBwYXJhbSByZWxhdGl2ZVkgQ29vcmRpbmF0ZSB3aXRoaW4gdGhlIGVsZW1lbnQsIGFsb25nIHRoZSBZLWF4aXMgYXQgd2hpY2ggdG8gY2xpY2suXG4gICAqIEBwYXJhbSBtb2RpZmllcnMgTW9kaWZpZXIga2V5cyBoZWxkIHdoaWxlIGNsaWNraW5nXG4gICAqL1xuICByaWdodENsaWNrKHJlbGF0aXZlWDogbnVtYmVyLCByZWxhdGl2ZVk6IG51bWJlciwgbW9kaWZpZXJzPzogTW9kaWZpZXJLZXlzKTogUHJvbWlzZTx2b2lkPjtcbiAgYXN5bmMgcmlnaHRDbGljayhcbiAgICAuLi5hcmdzOiBbTW9kaWZpZXJLZXlzP10gfCBbJ2NlbnRlcicsIE1vZGlmaWVyS2V5cz9dIHwgW251bWJlciwgbnVtYmVyLCBNb2RpZmllcktleXM/XVxuICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLl9kaXNwYXRjaENsaWNrRXZlbnRTZXF1ZW5jZShhcmdzLCB3ZWJkcml2ZXIuQnV0dG9uLlJJR0hUKTtcbiAgICBhd2FpdCB0aGlzLl9zdGFiaWxpemUoKTtcbiAgfVxuXG4gIC8qKiBGb2N1cyB0aGUgZWxlbWVudC4gKi9cbiAgYXN5bmMgZm9jdXMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5fZXhlY3V0ZVNjcmlwdCgoZWxlbWVudDogSFRNTEVsZW1lbnQpID0+IGVsZW1lbnQuZm9jdXMoKSwgdGhpcy5lbGVtZW50KCkpO1xuICAgIGF3YWl0IHRoaXMuX3N0YWJpbGl6ZSgpO1xuICB9XG5cbiAgLyoqIEdldCB0aGUgY29tcHV0ZWQgdmFsdWUgb2YgdGhlIGdpdmVuIENTUyBwcm9wZXJ0eSBmb3IgdGhlIGVsZW1lbnQuICovXG4gIGFzeW5jIGdldENzc1ZhbHVlKHByb3BlcnR5OiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIGF3YWl0IHRoaXMuX3N0YWJpbGl6ZSgpO1xuICAgIHJldHVybiB0aGlzLmVsZW1lbnQoKS5nZXRDc3NWYWx1ZShwcm9wZXJ0eSk7XG4gIH1cblxuICAvKiogSG92ZXJzIHRoZSBtb3VzZSBvdmVyIHRoZSBlbGVtZW50LiAqL1xuICBhc3luYyBob3ZlcigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLl9hY3Rpb25zKCkubW91c2VNb3ZlKHRoaXMuZWxlbWVudCgpKS5wZXJmb3JtKCk7XG4gICAgYXdhaXQgdGhpcy5fc3RhYmlsaXplKCk7XG4gIH1cblxuICAvKiogTW92ZXMgdGhlIG1vdXNlIGF3YXkgZnJvbSB0aGUgZWxlbWVudC4gKi9cbiAgYXN5bmMgbW91c2VBd2F5KCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMuX2FjdGlvbnMoKS5tb3VzZU1vdmUodGhpcy5lbGVtZW50KCksIHt4OiAtMSwgeTogLTF9KS5wZXJmb3JtKCk7XG4gICAgYXdhaXQgdGhpcy5fc3RhYmlsaXplKCk7XG4gIH1cblxuICAvKipcbiAgICogU2VuZHMgdGhlIGdpdmVuIHN0cmluZyB0byB0aGUgaW5wdXQgYXMgYSBzZXJpZXMgb2Yga2V5IHByZXNzZXMuIEFsc28gZmlyZXMgaW5wdXQgZXZlbnRzXG4gICAqIGFuZCBhdHRlbXB0cyB0byBhZGQgdGhlIHN0cmluZyB0byB0aGUgRWxlbWVudCdzIHZhbHVlLlxuICAgKi9cbiAgYXN5bmMgc2VuZEtleXMoLi4ua2V5czogKHN0cmluZyB8IFRlc3RLZXkpW10pOiBQcm9taXNlPHZvaWQ+O1xuICAvKipcbiAgICogU2VuZHMgdGhlIGdpdmVuIHN0cmluZyB0byB0aGUgaW5wdXQgYXMgYSBzZXJpZXMgb2Yga2V5IHByZXNzZXMuIEFsc28gZmlyZXMgaW5wdXQgZXZlbnRzXG4gICAqIGFuZCBhdHRlbXB0cyB0byBhZGQgdGhlIHN0cmluZyB0byB0aGUgRWxlbWVudCdzIHZhbHVlLlxuICAgKi9cbiAgYXN5bmMgc2VuZEtleXMobW9kaWZpZXJzOiBNb2RpZmllcktleXMsIC4uLmtleXM6IChzdHJpbmcgfCBUZXN0S2V5KVtdKTogUHJvbWlzZTx2b2lkPjtcbiAgYXN5bmMgc2VuZEtleXMoLi4ubW9kaWZpZXJzQW5kS2V5czogYW55W10pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBmaXJzdCA9IG1vZGlmaWVyc0FuZEtleXNbMF07XG4gICAgbGV0IG1vZGlmaWVyczogTW9kaWZpZXJLZXlzO1xuICAgIGxldCByZXN0OiAoc3RyaW5nIHwgVGVzdEtleSlbXTtcbiAgICBpZiAoZmlyc3QgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgZmlyc3QgIT09ICdzdHJpbmcnICYmIHR5cGVvZiBmaXJzdCAhPT0gJ251bWJlcicpIHtcbiAgICAgIG1vZGlmaWVycyA9IGZpcnN0O1xuICAgICAgcmVzdCA9IG1vZGlmaWVyc0FuZEtleXMuc2xpY2UoMSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG1vZGlmaWVycyA9IHt9O1xuICAgICAgcmVzdCA9IG1vZGlmaWVyc0FuZEtleXM7XG4gICAgfVxuXG4gICAgY29uc3QgbW9kaWZpZXJLZXlzID0gZ2V0U2VsZW5pdW1XZWJEcml2ZXJNb2RpZmllcktleXMobW9kaWZpZXJzKTtcbiAgICBjb25zdCBrZXlzID0gcmVzdFxuICAgICAgLm1hcChrID0+ICh0eXBlb2YgayA9PT0gJ3N0cmluZycgPyBrLnNwbGl0KCcnKSA6IFtzZWxlbml1bVdlYkRyaXZlcktleU1hcFtrXV0pKVxuICAgICAgLnJlZHVjZSgoYXJyLCBrKSA9PiBhcnIuY29uY2F0KGspLCBbXSlcbiAgICAgIC8vIHdlYmRyaXZlci5LZXkuY2hvcmQgZG9lc24ndCB3b3JrIHdlbGwgd2l0aCBnZWNrb2RyaXZlciAobW96aWxsYS9nZWNrb2RyaXZlciMxNTAyKSxcbiAgICAgIC8vIHNvIGF2b2lkIGl0IGlmIG5vIG1vZGlmaWVyIGtleXMgYXJlIHJlcXVpcmVkLlxuICAgICAgLm1hcChrID0+IChtb2RpZmllcktleXMubGVuZ3RoID4gMCA/IHdlYmRyaXZlci5LZXkuY2hvcmQoLi4ubW9kaWZpZXJLZXlzLCBrKSA6IGspKTtcblxuICAgIC8vIFRocm93IGFuIGVycm9yIGlmIG5vIGtleXMgaGF2ZSBiZWVuIHNwZWNpZmllZC4gQ2FsbGluZyB0aGlzIGZ1bmN0aW9uIHdpdGggbm9cbiAgICAvLyBrZXlzIHNob3VsZCBub3QgcmVzdWx0IGluIGEgZm9jdXMgZXZlbnQgYmVpbmcgZGlzcGF0Y2hlZCB1bmV4cGVjdGVkbHkuXG4gICAgaWYgKGtleXMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBnZXROb0tleXNTcGVjaWZpZWRFcnJvcigpO1xuICAgIH1cblxuICAgIGF3YWl0IHRoaXMuZWxlbWVudCgpLnNlbmRLZXlzKC4uLmtleXMpO1xuICAgIGF3YWl0IHRoaXMuX3N0YWJpbGl6ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIHRleHQgZnJvbSB0aGUgZWxlbWVudC5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyB0aGF0IGFmZmVjdCB3aGF0IHRleHQgaXMgaW5jbHVkZWQuXG4gICAqL1xuICBhc3luYyB0ZXh0KG9wdGlvbnM/OiBUZXh0T3B0aW9ucyk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgYXdhaXQgdGhpcy5fc3RhYmlsaXplKCk7XG4gICAgaWYgKG9wdGlvbnM/LmV4Y2x1ZGUpIHtcbiAgICAgIHJldHVybiB0aGlzLl9leGVjdXRlU2NyaXB0KF9nZXRUZXh0V2l0aEV4Y2x1ZGVkRWxlbWVudHMsIHRoaXMuZWxlbWVudCgpLCBvcHRpb25zLmV4Y2x1ZGUpO1xuICAgIH1cbiAgICAvLyBXZSBkb24ndCBnbyB0aHJvdWdoIHRoZSBXZWJEcml2ZXIgYGdldFRleHRgLCBiZWNhdXNlIGl0IGV4Y2x1ZGVzIHRleHQgZnJvbSBoaWRkZW4gZWxlbWVudHMuXG4gICAgcmV0dXJuIHRoaXMuX2V4ZWN1dGVTY3JpcHQoXG4gICAgICAoZWxlbWVudDogRWxlbWVudCkgPT4gKGVsZW1lbnQudGV4dENvbnRlbnQgfHwgJycpLnRyaW0oKSxcbiAgICAgIHRoaXMuZWxlbWVudCgpLFxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgdmFsdWUgb2YgYSBgY29udGVudGVkaXRhYmxlYCBlbGVtZW50LlxuICAgKiBAcGFyYW0gdmFsdWUgVmFsdWUgdG8gYmUgc2V0IG9uIHRoZSBlbGVtZW50LlxuICAgKi9cbiAgYXN5bmMgc2V0Q29udGVudGVkaXRhYmxlVmFsdWUodmFsdWU6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGNvbnRlbnRlZGl0YWJsZUF0dHIgPSBhd2FpdCB0aGlzLmdldEF0dHJpYnV0ZSgnY29udGVudGVkaXRhYmxlJyk7XG5cbiAgICBpZiAoY29udGVudGVkaXRhYmxlQXR0ciAhPT0gJycgJiYgY29udGVudGVkaXRhYmxlQXR0ciAhPT0gJ3RydWUnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldENvbnRlbnRlZGl0YWJsZVZhbHVlIGNhbiBvbmx5IGJlIGNhbGxlZCBvbiBhIGBjb250ZW50ZWRpdGFibGVgIGVsZW1lbnQuJyk7XG4gICAgfVxuXG4gICAgYXdhaXQgdGhpcy5fc3RhYmlsaXplKCk7XG4gICAgcmV0dXJuIHRoaXMuX2V4ZWN1dGVTY3JpcHQoXG4gICAgICAoZWxlbWVudDogRWxlbWVudCwgdmFsdWVUb1NldDogc3RyaW5nKSA9PiAoZWxlbWVudC50ZXh0Q29udGVudCA9IHZhbHVlVG9TZXQpLFxuICAgICAgdGhpcy5lbGVtZW50KCksXG4gICAgICB2YWx1ZSxcbiAgICApO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHZhbHVlIGZvciB0aGUgZ2l2ZW4gYXR0cmlidXRlIGZyb20gdGhlIGVsZW1lbnQuICovXG4gIGFzeW5jIGdldEF0dHJpYnV0ZShuYW1lOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZyB8IG51bGw+IHtcbiAgICBhd2FpdCB0aGlzLl9zdGFiaWxpemUoKTtcbiAgICByZXR1cm4gdGhpcy5fZXhlY3V0ZVNjcmlwdChcbiAgICAgIChlbGVtZW50OiBFbGVtZW50LCBhdHRyaWJ1dGU6IHN0cmluZykgPT4gZWxlbWVudC5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlKSxcbiAgICAgIHRoaXMuZWxlbWVudCgpLFxuICAgICAgbmFtZSxcbiAgICApO1xuICB9XG5cbiAgLyoqIENoZWNrcyB3aGV0aGVyIHRoZSBlbGVtZW50IGhhcyB0aGUgZ2l2ZW4gY2xhc3MuICovXG4gIGFzeW5jIGhhc0NsYXNzKG5hbWU6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGF3YWl0IHRoaXMuX3N0YWJpbGl6ZSgpO1xuICAgIGNvbnN0IGNsYXNzZXMgPSAoYXdhaXQgdGhpcy5nZXRBdHRyaWJ1dGUoJ2NsYXNzJykpIHx8ICcnO1xuICAgIHJldHVybiBuZXcgU2V0KGNsYXNzZXMuc3BsaXQoL1xccysvKS5maWx0ZXIoYyA9PiBjKSkuaGFzKG5hbWUpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGRpbWVuc2lvbnMgb2YgdGhlIGVsZW1lbnQuICovXG4gIGFzeW5jIGdldERpbWVuc2lvbnMoKTogUHJvbWlzZTxFbGVtZW50RGltZW5zaW9ucz4ge1xuICAgIGF3YWl0IHRoaXMuX3N0YWJpbGl6ZSgpO1xuICAgIGNvbnN0IHt3aWR0aCwgaGVpZ2h0fSA9IGF3YWl0IHRoaXMuZWxlbWVudCgpLmdldFNpemUoKTtcbiAgICBjb25zdCB7eDogbGVmdCwgeTogdG9wfSA9IGF3YWl0IHRoaXMuZWxlbWVudCgpLmdldExvY2F0aW9uKCk7XG4gICAgcmV0dXJuIHt3aWR0aCwgaGVpZ2h0LCBsZWZ0LCB0b3B9O1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHZhbHVlIG9mIGEgcHJvcGVydHkgb2YgYW4gZWxlbWVudC4gKi9cbiAgYXN5bmMgZ2V0UHJvcGVydHk8VCA9IGFueT4obmFtZTogc3RyaW5nKTogUHJvbWlzZTxUPiB7XG4gICAgYXdhaXQgdGhpcy5fc3RhYmlsaXplKCk7XG4gICAgcmV0dXJuIHRoaXMuX2V4ZWN1dGVTY3JpcHQoXG4gICAgICAoZWxlbWVudDogRWxlbWVudCwgcHJvcGVydHk6IGtleW9mIEVsZW1lbnQpID0+IGVsZW1lbnRbcHJvcGVydHldLFxuICAgICAgdGhpcy5lbGVtZW50KCksXG4gICAgICBuYW1lLFxuICAgICk7XG4gIH1cblxuICAvKiogU2V0cyB0aGUgdmFsdWUgb2YgYSBwcm9wZXJ0eSBvZiBhbiBpbnB1dC4gKi9cbiAgYXN5bmMgc2V0SW5wdXRWYWx1ZShuZXdWYWx1ZTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5fZXhlY3V0ZVNjcmlwdChcbiAgICAgIChlbGVtZW50OiBIVE1MSW5wdXRFbGVtZW50LCB2YWx1ZTogc3RyaW5nKSA9PiAoZWxlbWVudC52YWx1ZSA9IHZhbHVlKSxcbiAgICAgIHRoaXMuZWxlbWVudCgpLFxuICAgICAgbmV3VmFsdWUsXG4gICAgKTtcbiAgICBhd2FpdCB0aGlzLl9zdGFiaWxpemUoKTtcbiAgfVxuXG4gIC8qKiBTZWxlY3RzIHRoZSBvcHRpb25zIGF0IHRoZSBzcGVjaWZpZWQgaW5kZXhlcyBpbnNpZGUgb2YgYSBuYXRpdmUgYHNlbGVjdGAgZWxlbWVudC4gKi9cbiAgYXN5bmMgc2VsZWN0T3B0aW9ucyguLi5vcHRpb25JbmRleGVzOiBudW1iZXJbXSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMuX3N0YWJpbGl6ZSgpO1xuICAgIGNvbnN0IG9wdGlvbnMgPSBhd2FpdCB0aGlzLmVsZW1lbnQoKS5maW5kRWxlbWVudHMod2ViZHJpdmVyLkJ5LmNzcygnb3B0aW9uJykpO1xuICAgIGNvbnN0IGluZGV4ZXMgPSBuZXcgU2V0KG9wdGlvbkluZGV4ZXMpOyAvLyBDb252ZXJ0IHRvIGEgc2V0IHRvIHJlbW92ZSBkdXBsaWNhdGVzLlxuXG4gICAgaWYgKG9wdGlvbnMubGVuZ3RoICYmIGluZGV4ZXMuc2l6ZSkge1xuICAgICAgLy8gUmVzZXQgdGhlIHZhbHVlIHNvIGFsbCB0aGUgc2VsZWN0ZWQgc3RhdGVzIGFyZSBjbGVhcmVkLiBXZSBjYW5cbiAgICAgIC8vIHJldXNlIHRoZSBpbnB1dC1zcGVjaWZpYyBtZXRob2Qgc2luY2UgdGhlIGxvZ2ljIGlzIHRoZSBzYW1lLlxuICAgICAgYXdhaXQgdGhpcy5zZXRJbnB1dFZhbHVlKCcnKTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcHRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChpbmRleGVzLmhhcyhpKSkge1xuICAgICAgICAgIC8vIFdlIGhhdmUgdG8gaG9sZCB0aGUgY29udHJvbCBrZXkgd2hpbGUgY2xpY2tpbmcgb24gb3B0aW9ucyBzbyB0aGF0IG11bHRpcGxlIGNhbiBiZVxuICAgICAgICAgIC8vIHNlbGVjdGVkIGluIG11bHRpLXNlbGVjdGlvbiBtb2RlLiBUaGUga2V5IGRvZXNuJ3QgZG8gYW55dGhpbmcgZm9yIHNpbmdsZSBzZWxlY3Rpb24uXG4gICAgICAgICAgYXdhaXQgdGhpcy5fYWN0aW9ucygpLmtleURvd24od2ViZHJpdmVyLktleS5DT05UUk9MKS5wZXJmb3JtKCk7XG4gICAgICAgICAgYXdhaXQgb3B0aW9uc1tpXS5jbGljaygpO1xuICAgICAgICAgIGF3YWl0IHRoaXMuX2FjdGlvbnMoKS5rZXlVcCh3ZWJkcml2ZXIuS2V5LkNPTlRST0wpLnBlcmZvcm0oKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBhd2FpdCB0aGlzLl9zdGFiaWxpemUoKTtcbiAgICB9XG4gIH1cblxuICAvKiogQ2hlY2tzIHdoZXRoZXIgdGhpcyBlbGVtZW50IG1hdGNoZXMgdGhlIGdpdmVuIHNlbGVjdG9yLiAqL1xuICBhc3luYyBtYXRjaGVzU2VsZWN0b3Ioc2VsZWN0b3I6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGF3YWl0IHRoaXMuX3N0YWJpbGl6ZSgpO1xuICAgIHJldHVybiB0aGlzLl9leGVjdXRlU2NyaXB0KFxuICAgICAgKGVsZW1lbnQ6IEVsZW1lbnQsIHM6IHN0cmluZykgPT5cbiAgICAgICAgKEVsZW1lbnQucHJvdG90eXBlLm1hdGNoZXMgfHwgKEVsZW1lbnQucHJvdG90eXBlIGFzIGFueSkubXNNYXRjaGVzU2VsZWN0b3IpLmNhbGwoXG4gICAgICAgICAgZWxlbWVudCxcbiAgICAgICAgICBzLFxuICAgICAgICApLFxuICAgICAgdGhpcy5lbGVtZW50KCksXG4gICAgICBzZWxlY3RvcixcbiAgICApO1xuICB9XG5cbiAgLyoqIENoZWNrcyB3aGV0aGVyIHRoZSBlbGVtZW50IGlzIGZvY3VzZWQuICovXG4gIGFzeW5jIGlzRm9jdXNlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBhd2FpdCB0aGlzLl9zdGFiaWxpemUoKTtcbiAgICByZXR1cm4gd2ViZHJpdmVyLldlYkVsZW1lbnQuZXF1YWxzKFxuICAgICAgdGhpcy5lbGVtZW50KCksXG4gICAgICB0aGlzLmVsZW1lbnQoKS5nZXREcml2ZXIoKS5zd2l0Y2hUbygpLmFjdGl2ZUVsZW1lbnQoKSxcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoZXMgYW4gZXZlbnQgd2l0aCBhIHBhcnRpY3VsYXIgbmFtZS5cbiAgICogQHBhcmFtIG5hbWUgTmFtZSBvZiB0aGUgZXZlbnQgdG8gYmUgZGlzcGF0Y2hlZC5cbiAgICovXG4gIGFzeW5jIGRpc3BhdGNoRXZlbnQobmFtZTogc3RyaW5nLCBkYXRhPzogUmVjb3JkPHN0cmluZywgRXZlbnREYXRhPik6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMuX2V4ZWN1dGVTY3JpcHQoZGlzcGF0Y2hFdmVudCwgbmFtZSwgdGhpcy5lbGVtZW50KCksIGRhdGEpO1xuICAgIGF3YWl0IHRoaXMuX3N0YWJpbGl6ZSgpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHdlYmRyaXZlciBhY3Rpb24gc2VxdWVuY2UuICovXG4gIHByaXZhdGUgX2FjdGlvbnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudCgpLmdldERyaXZlcigpLmFjdGlvbnMoKTtcbiAgfVxuXG4gIC8qKiBFeGVjdXRlcyBhIGZ1bmN0aW9uIGluIHRoZSBicm93c2VyLiAqL1xuICBwcml2YXRlIGFzeW5jIF9leGVjdXRlU2NyaXB0PFQ+KHNjcmlwdDogRnVuY3Rpb24sIC4uLnZhcl9hcmdzOiBhbnlbXSk6IFByb21pc2U8VD4ge1xuICAgIHJldHVybiB0aGlzLmVsZW1lbnQoKVxuICAgICAgLmdldERyaXZlcigpXG4gICAgICAuZXhlY3V0ZVNjcmlwdChzY3JpcHQsIC4uLnZhcl9hcmdzKTtcbiAgfVxuXG4gIC8qKiBEaXNwYXRjaGVzIGFsbCB0aGUgZXZlbnRzIHRoYXQgYXJlIHBhcnQgb2YgYSBjbGljayBldmVudCBzZXF1ZW5jZS4gKi9cbiAgcHJpdmF0ZSBhc3luYyBfZGlzcGF0Y2hDbGlja0V2ZW50U2VxdWVuY2UoXG4gICAgYXJnczogW01vZGlmaWVyS2V5cz9dIHwgWydjZW50ZXInLCBNb2RpZmllcktleXM/XSB8IFtudW1iZXIsIG51bWJlciwgTW9kaWZpZXJLZXlzP10sXG4gICAgYnV0dG9uOiBzdHJpbmcsXG4gICkge1xuICAgIGxldCBtb2RpZmllcnM6IE1vZGlmaWVyS2V5cyA9IHt9O1xuICAgIGlmIChhcmdzLmxlbmd0aCAmJiB0eXBlb2YgYXJnc1thcmdzLmxlbmd0aCAtIDFdID09PSAnb2JqZWN0Jykge1xuICAgICAgbW9kaWZpZXJzID0gYXJncy5wb3AoKSBhcyBNb2RpZmllcktleXM7XG4gICAgfVxuICAgIGNvbnN0IG1vZGlmaWVyS2V5cyA9IGdldFNlbGVuaXVtV2ViRHJpdmVyTW9kaWZpZXJLZXlzKG1vZGlmaWVycyk7XG5cbiAgICAvLyBPbWl0dGluZyB0aGUgb2Zmc2V0IGFyZ3VtZW50IHRvIG1vdXNlTW92ZSByZXN1bHRzIGluIGNsaWNraW5nIHRoZSBjZW50ZXIuXG4gICAgLy8gVGhpcyBpcyB0aGUgZGVmYXVsdCBiZWhhdmlvciB3ZSB3YW50LCBzbyB3ZSB1c2UgYW4gZW1wdHkgYXJyYXkgb2Ygb2Zmc2V0QXJncyBpZlxuICAgIC8vIG5vIGFyZ3MgcmVtYWluIGFmdGVyIHBvcHBpbmcgdGhlIG1vZGlmaWVycyBmcm9tIHRoZSBhcmdzIHBhc3NlZCB0byB0aGlzIGZ1bmN0aW9uLlxuICAgIGNvbnN0IG9mZnNldEFyZ3MgPSAoYXJncy5sZW5ndGggPT09IDIgPyBbe3g6IGFyZ3NbMF0sIHk6IGFyZ3NbMV19XSA6IFtdKSBhcyBbXG4gICAgICB7eDogbnVtYmVyOyB5OiBudW1iZXJ9LFxuICAgIF07XG5cbiAgICBsZXQgYWN0aW9ucyA9IHRoaXMuX2FjdGlvbnMoKS5tb3VzZU1vdmUodGhpcy5lbGVtZW50KCksIC4uLm9mZnNldEFyZ3MpO1xuXG4gICAgZm9yIChjb25zdCBtb2RpZmllcktleSBvZiBtb2RpZmllcktleXMpIHtcbiAgICAgIGFjdGlvbnMgPSBhY3Rpb25zLmtleURvd24obW9kaWZpZXJLZXkpO1xuICAgIH1cbiAgICBhY3Rpb25zID0gYWN0aW9ucy5jbGljayhidXR0b24pO1xuICAgIGZvciAoY29uc3QgbW9kaWZpZXJLZXkgb2YgbW9kaWZpZXJLZXlzKSB7XG4gICAgICBhY3Rpb25zID0gYWN0aW9ucy5rZXlVcChtb2RpZmllcktleSk7XG4gICAgfVxuXG4gICAgYXdhaXQgYWN0aW9ucy5wZXJmb3JtKCk7XG4gIH1cbn1cblxuLyoqXG4gKiBEaXNwYXRjaGVzIGFuIGV2ZW50IHdpdGggYSBwYXJ0aWN1bGFyIG5hbWUgYW5kIGRhdGEgdG8gYW4gZWxlbWVudC4gTm90ZSB0aGF0IHRoaXMgbmVlZHMgdG8gYmUgYVxuICogcHVyZSBmdW5jdGlvbiwgYmVjYXVzZSBpdCBnZXRzIHN0cmluZ2lmaWVkIGJ5IFdlYkRyaXZlciBhbmQgaXMgZXhlY3V0ZWQgaW5zaWRlIHRoZSBicm93c2VyLlxuICovXG5mdW5jdGlvbiBkaXNwYXRjaEV2ZW50KG5hbWU6IHN0cmluZywgZWxlbWVudDogRWxlbWVudCwgZGF0YT86IFJlY29yZDxzdHJpbmcsIEV2ZW50RGF0YT4pIHtcbiAgY29uc3QgZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcbiAgZXZlbnQuaW5pdEV2ZW50KG5hbWUpO1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6YmFuIEhhdmUgdG8gdXNlIGBPYmplY3QuYXNzaWduYCB0byBwcmVzZXJ2ZSB0aGUgb3JpZ2luYWwgb2JqZWN0LlxuICBPYmplY3QuYXNzaWduKGV2ZW50LCBkYXRhIHx8IHt9KTtcbiAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbn1cbiJdfQ==