/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { coerceBooleanProperty } from '@angular/cdk/coercion';
/**
 * Mixin to provide a directive with a function that checks if the sticky input has been
 * changed since the last time the function was called. Essentially adds a dirty-check to the
 * sticky value.
 * @docs-private
 */
export function mixinHasStickyInput(base) {
    return class extends base {
        /** Whether sticky positioning should be applied. */
        get sticky() {
            return this._sticky;
        }
        set sticky(v) {
            const prevValue = this._sticky;
            this._sticky = coerceBooleanProperty(v);
            this._hasStickyChanged = prevValue !== this._sticky;
        }
        /** Whether the sticky value has changed since this was last called. */
        hasStickyChanged() {
            const hasStickyChanged = this._hasStickyChanged;
            this._hasStickyChanged = false;
            return hasStickyChanged;
        }
        /** Resets the dirty check for cases where the sticky state has been used without checking. */
        resetStickyChanged() {
            this._hasStickyChanged = false;
        }
        constructor(...args) {
            super(...args);
            this._sticky = false;
            /** Whether the sticky input has changed since it was last checked. */
            this._hasStickyChanged = false;
        }
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FuLXN0aWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2Nkay90YWJsZS9jYW4tc3RpY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFlLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUE0QjFFOzs7OztHQUtHO0FBQ0gsTUFBTSxVQUFVLG1CQUFtQixDQUE0QixJQUFPO0lBQ3BFLE9BQU8sS0FBTSxTQUFRLElBQUk7UUFDdkIsb0RBQW9EO1FBQ3BELElBQUksTUFBTTtZQUNSLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUN0QixDQUFDO1FBQ0QsSUFBSSxNQUFNLENBQUMsQ0FBZTtZQUN4QixNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1lBQy9CLElBQUksQ0FBQyxPQUFPLEdBQUcscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLFNBQVMsS0FBSyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ3RELENBQUM7UUFNRCx1RUFBdUU7UUFDdkUsZ0JBQWdCO1lBQ2QsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUM7WUFDaEQsSUFBSSxDQUFDLGlCQUFpQixHQUFHLEtBQUssQ0FBQztZQUMvQixPQUFPLGdCQUFnQixDQUFDO1FBQzFCLENBQUM7UUFFRCw4RkFBOEY7UUFDOUYsa0JBQWtCO1lBQ2hCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxLQUFLLENBQUM7UUFDakMsQ0FBQztRQUVELFlBQVksR0FBRyxJQUFXO1lBQ3hCLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO1lBbEJqQixZQUFPLEdBQVksS0FBSyxDQUFDO1lBRXpCLHNFQUFzRTtZQUN0RSxzQkFBaUIsR0FBWSxLQUFLLENBQUM7UUFnQm5DLENBQUM7S0FDRixDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0Jvb2xlYW5JbnB1dCwgY29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IHR5cGUgQ29uc3RydWN0b3I8VD4gPSBuZXcgKC4uLmFyZ3M6IGFueVtdKSA9PiBUO1xuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgYSBtaXhpbiB0byBwcm92aWRlIGEgZGlyZWN0aXZlIHdpdGggYSBmdW5jdGlvbiB0aGF0IGNoZWNrcyBpZiB0aGUgc3RpY2t5IGlucHV0IGhhc1xuICogYmVlbiBjaGFuZ2VkIHNpbmNlIHRoZSBsYXN0IHRpbWUgdGhlIGZ1bmN0aW9uIHdhcyBjYWxsZWQuIEVzc2VudGlhbGx5IGFkZHMgYSBkaXJ0eS1jaGVjayB0byB0aGVcbiAqIHN0aWNreSB2YWx1ZS5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDYW5TdGljayB7XG4gIC8qKiBXaGV0aGVyIHN0aWNreSBwb3NpdGlvbmluZyBzaG91bGQgYmUgYXBwbGllZC4gKi9cbiAgc3RpY2t5OiBib29sZWFuO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBzdGlja3kgaW5wdXQgaGFzIGNoYW5nZWQgc2luY2UgaXQgd2FzIGxhc3QgY2hlY2tlZC4gKi9cbiAgX2hhc1N0aWNreUNoYW5nZWQ6IGJvb2xlYW47XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHN0aWNreSB2YWx1ZSBoYXMgY2hhbmdlZCBzaW5jZSB0aGlzIHdhcyBsYXN0IGNhbGxlZC4gKi9cbiAgaGFzU3RpY2t5Q2hhbmdlZCgpOiBib29sZWFuO1xuXG4gIC8qKiBSZXNldHMgdGhlIGRpcnR5IGNoZWNrIGZvciBjYXNlcyB3aGVyZSB0aGUgc3RpY2t5IHN0YXRlIGhhcyBiZWVuIHVzZWQgd2l0aG91dCBjaGVja2luZy4gKi9cbiAgcmVzZXRTdGlja3lDaGFuZ2VkKCk6IHZvaWQ7XG59XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgdHlwZSBDYW5TdGlja0N0b3IgPSBDb25zdHJ1Y3RvcjxDYW5TdGljaz47XG5cbi8qKlxuICogTWl4aW4gdG8gcHJvdmlkZSBhIGRpcmVjdGl2ZSB3aXRoIGEgZnVuY3Rpb24gdGhhdCBjaGVja3MgaWYgdGhlIHN0aWNreSBpbnB1dCBoYXMgYmVlblxuICogY2hhbmdlZCBzaW5jZSB0aGUgbGFzdCB0aW1lIHRoZSBmdW5jdGlvbiB3YXMgY2FsbGVkLiBFc3NlbnRpYWxseSBhZGRzIGEgZGlydHktY2hlY2sgdG8gdGhlXG4gKiBzdGlja3kgdmFsdWUuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtaXhpbkhhc1N0aWNreUlucHV0PFQgZXh0ZW5kcyBDb25zdHJ1Y3Rvcjx7fT4+KGJhc2U6IFQpOiBDYW5TdGlja0N0b3IgJiBUIHtcbiAgcmV0dXJuIGNsYXNzIGV4dGVuZHMgYmFzZSB7XG4gICAgLyoqIFdoZXRoZXIgc3RpY2t5IHBvc2l0aW9uaW5nIHNob3VsZCBiZSBhcHBsaWVkLiAqL1xuICAgIGdldCBzdGlja3koKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gdGhpcy5fc3RpY2t5O1xuICAgIH1cbiAgICBzZXQgc3RpY2t5KHY6IEJvb2xlYW5JbnB1dCkge1xuICAgICAgY29uc3QgcHJldlZhbHVlID0gdGhpcy5fc3RpY2t5O1xuICAgICAgdGhpcy5fc3RpY2t5ID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHYpO1xuICAgICAgdGhpcy5faGFzU3RpY2t5Q2hhbmdlZCA9IHByZXZWYWx1ZSAhPT0gdGhpcy5fc3RpY2t5O1xuICAgIH1cbiAgICBfc3RpY2t5OiBib29sZWFuID0gZmFsc2U7XG5cbiAgICAvKiogV2hldGhlciB0aGUgc3RpY2t5IGlucHV0IGhhcyBjaGFuZ2VkIHNpbmNlIGl0IHdhcyBsYXN0IGNoZWNrZWQuICovXG4gICAgX2hhc1N0aWNreUNoYW5nZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIC8qKiBXaGV0aGVyIHRoZSBzdGlja3kgdmFsdWUgaGFzIGNoYW5nZWQgc2luY2UgdGhpcyB3YXMgbGFzdCBjYWxsZWQuICovXG4gICAgaGFzU3RpY2t5Q2hhbmdlZCgpOiBib29sZWFuIHtcbiAgICAgIGNvbnN0IGhhc1N0aWNreUNoYW5nZWQgPSB0aGlzLl9oYXNTdGlja3lDaGFuZ2VkO1xuICAgICAgdGhpcy5faGFzU3RpY2t5Q2hhbmdlZCA9IGZhbHNlO1xuICAgICAgcmV0dXJuIGhhc1N0aWNreUNoYW5nZWQ7XG4gICAgfVxuXG4gICAgLyoqIFJlc2V0cyB0aGUgZGlydHkgY2hlY2sgZm9yIGNhc2VzIHdoZXJlIHRoZSBzdGlja3kgc3RhdGUgaGFzIGJlZW4gdXNlZCB3aXRob3V0IGNoZWNraW5nLiAqL1xuICAgIHJlc2V0U3RpY2t5Q2hhbmdlZCgpIHtcbiAgICAgIHRoaXMuX2hhc1N0aWNreUNoYW5nZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvciguLi5hcmdzOiBhbnlbXSkge1xuICAgICAgc3VwZXIoLi4uYXJncyk7XG4gICAgfVxuICB9O1xufVxuIl19