/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate, } from '@angular/cdk/testing';
import { MatChipInputHarness } from './chip-input-harness';
import { MatChipRowHarness } from './chip-row-harness';
/** Harness for interacting with a mat-chip-grid in tests. */
export class MatChipGridHarness extends ComponentHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a chip grid with specific attributes.
     * @param options Options for filtering which chip grid instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(this, options).addOption('disabled', options.disabled, async (harness, disabled) => {
            return (await harness.isDisabled()) === disabled;
        });
    }
    /** Gets whether the chip grid is disabled. */
    async isDisabled() {
        return (await (await this.host()).getAttribute('aria-disabled')) === 'true';
    }
    /** Gets whether the chip grid is required. */
    async isRequired() {
        return await (await this.host()).hasClass('mat-mdc-chip-list-required');
    }
    /** Gets whether the chip grid is invalid. */
    async isInvalid() {
        return (await (await this.host()).getAttribute('aria-invalid')) === 'true';
    }
    /** Gets promise of the harnesses for the chip rows. */
    getRows(filter = {}) {
        return this.locatorForAll(MatChipRowHarness.with(filter))();
    }
    /** Gets promise of the chip text input harness. */
    getInput(filter = {}) {
        return this.locatorFor(MatChipInputHarness.with(filter))();
    }
}
MatChipGridHarness.hostSelector = '.mat-mdc-chip-grid';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpcC1ncmlkLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvY2hpcHMvdGVzdGluZy9jaGlwLWdyaWQtaGFybmVzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQ0wsZ0JBQWdCLEVBRWhCLGdCQUFnQixHQUNqQixNQUFNLHNCQUFzQixDQUFDO0FBTTlCLE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3pELE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBRXJELDZEQUE2RDtBQUM3RCxNQUFNLE9BQU8sa0JBQW1CLFNBQVEsZ0JBQWdCO0lBR3REOzs7O09BSUc7SUFDSCxNQUFNLENBQUMsSUFBSSxDQUVULFVBQWtDLEVBQUU7UUFFcEMsT0FBTyxJQUFJLGdCQUFnQixDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQ2xELFVBQVUsRUFDVixPQUFPLENBQUMsUUFBUSxFQUNoQixLQUFLLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxFQUFFO1lBQzFCLE9BQU8sQ0FBQyxNQUFNLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxLQUFLLFFBQVEsQ0FBQztRQUNuRCxDQUFDLENBQ0YsQ0FBQztJQUNKLENBQUM7SUFFRCw4Q0FBOEM7SUFDOUMsS0FBSyxDQUFDLFVBQVU7UUFDZCxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxDQUFDLEtBQUssTUFBTSxDQUFDO0lBQzlFLENBQUM7SUFFRCw4Q0FBOEM7SUFDOUMsS0FBSyxDQUFDLFVBQVU7UUFDZCxPQUFPLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0lBQzFFLENBQUM7SUFFRCw2Q0FBNkM7SUFDN0MsS0FBSyxDQUFDLFNBQVM7UUFDYixPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEtBQUssTUFBTSxDQUFDO0lBQzdFLENBQUM7SUFFRCx1REFBdUQ7SUFDdkQsT0FBTyxDQUFDLFNBQWdDLEVBQUU7UUFDeEMsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDOUQsQ0FBQztJQUVELG1EQUFtRDtJQUNuRCxRQUFRLENBQUMsU0FBa0MsRUFBRTtRQUMzQyxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUM3RCxDQUFDOztBQTNDTSwrQkFBWSxHQUFHLG9CQUFvQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIENvbXBvbmVudEhhcm5lc3MsXG4gIENvbXBvbmVudEhhcm5lc3NDb25zdHJ1Y3RvcixcbiAgSGFybmVzc1ByZWRpY2F0ZSxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtcbiAgQ2hpcEdyaWRIYXJuZXNzRmlsdGVycyxcbiAgQ2hpcElucHV0SGFybmVzc0ZpbHRlcnMsXG4gIENoaXBSb3dIYXJuZXNzRmlsdGVycyxcbn0gZnJvbSAnLi9jaGlwLWhhcm5lc3MtZmlsdGVycyc7XG5pbXBvcnQge01hdENoaXBJbnB1dEhhcm5lc3N9IGZyb20gJy4vY2hpcC1pbnB1dC1oYXJuZXNzJztcbmltcG9ydCB7TWF0Q2hpcFJvd0hhcm5lc3N9IGZyb20gJy4vY2hpcC1yb3ctaGFybmVzcyc7XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgbWF0LWNoaXAtZ3JpZCBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRDaGlwR3JpZEhhcm5lc3MgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzIHtcbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LW1kYy1jaGlwLWdyaWQnO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIGNoaXAgZ3JpZCB3aXRoIHNwZWNpZmljIGF0dHJpYnV0ZXMuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIGZpbHRlcmluZyB3aGljaCBjaGlwIGdyaWQgaW5zdGFuY2VzIGFyZSBjb25zaWRlcmVkIGEgbWF0Y2guXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGg8VCBleHRlbmRzIE1hdENoaXBHcmlkSGFybmVzcz4oXG4gICAgdGhpczogQ29tcG9uZW50SGFybmVzc0NvbnN0cnVjdG9yPFQ+LFxuICAgIG9wdGlvbnM6IENoaXBHcmlkSGFybmVzc0ZpbHRlcnMgPSB7fSxcbiAgKTogSGFybmVzc1ByZWRpY2F0ZTxUPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKHRoaXMsIG9wdGlvbnMpLmFkZE9wdGlvbihcbiAgICAgICdkaXNhYmxlZCcsXG4gICAgICBvcHRpb25zLmRpc2FibGVkLFxuICAgICAgYXN5bmMgKGhhcm5lc3MsIGRpc2FibGVkKSA9PiB7XG4gICAgICAgIHJldHVybiAoYXdhaXQgaGFybmVzcy5pc0Rpc2FibGVkKCkpID09PSBkaXNhYmxlZDtcbiAgICAgIH0sXG4gICAgKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHdoZXRoZXIgdGhlIGNoaXAgZ3JpZCBpcyBkaXNhYmxlZC4gKi9cbiAgYXN5bmMgaXNEaXNhYmxlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdhcmlhLWRpc2FibGVkJykpID09PSAndHJ1ZSc7XG4gIH1cblxuICAvKiogR2V0cyB3aGV0aGVyIHRoZSBjaGlwIGdyaWQgaXMgcmVxdWlyZWQuICovXG4gIGFzeW5jIGlzUmVxdWlyZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIGF3YWl0IChhd2FpdCB0aGlzLmhvc3QoKSkuaGFzQ2xhc3MoJ21hdC1tZGMtY2hpcC1saXN0LXJlcXVpcmVkJyk7XG4gIH1cblxuICAvKiogR2V0cyB3aGV0aGVyIHRoZSBjaGlwIGdyaWQgaXMgaW52YWxpZC4gKi9cbiAgYXN5bmMgaXNJbnZhbGlkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAoYXdhaXQgKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2FyaWEtaW52YWxpZCcpKSA9PT0gJ3RydWUnO1xuICB9XG5cbiAgLyoqIEdldHMgcHJvbWlzZSBvZiB0aGUgaGFybmVzc2VzIGZvciB0aGUgY2hpcCByb3dzLiAqL1xuICBnZXRSb3dzKGZpbHRlcjogQ2hpcFJvd0hhcm5lc3NGaWx0ZXJzID0ge30pOiBQcm9taXNlPE1hdENoaXBSb3dIYXJuZXNzW10+IHtcbiAgICByZXR1cm4gdGhpcy5sb2NhdG9yRm9yQWxsKE1hdENoaXBSb3dIYXJuZXNzLndpdGgoZmlsdGVyKSkoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHByb21pc2Ugb2YgdGhlIGNoaXAgdGV4dCBpbnB1dCBoYXJuZXNzLiAqL1xuICBnZXRJbnB1dChmaWx0ZXI6IENoaXBJbnB1dEhhcm5lc3NGaWx0ZXJzID0ge30pOiBQcm9taXNlPE1hdENoaXBJbnB1dEhhcm5lc3MgfCBudWxsPiB7XG4gICAgcmV0dXJuIHRoaXMubG9jYXRvckZvcihNYXRDaGlwSW5wdXRIYXJuZXNzLndpdGgoZmlsdGVyKSkoKTtcbiAgfVxufVxuIl19