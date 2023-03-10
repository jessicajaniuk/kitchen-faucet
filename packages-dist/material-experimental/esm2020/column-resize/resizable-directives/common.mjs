/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Resizable } from '@angular/cdk-experimental/column-resize';
import { MatColumnResizeOverlayHandle } from '../overlay-handle';
export class AbstractMatResizable extends Resizable {
    constructor() {
        super(...arguments);
        this.minWidthPxInternal = 32;
    }
    getInlineHandleCssClassName() {
        return 'mat-resizable-handle';
    }
    getOverlayHandleComponentType() {
        return MatColumnResizeOverlayHandle;
    }
}
export const RESIZABLE_HOST_BINDINGS = {
    'class': 'mat-resizable',
};
export const RESIZABLE_INPUTS = [
    'minWidthPx: matResizableMinWidthPx',
    'maxWidthPx: matResizableMaxWidthPx',
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsLWV4cGVyaW1lbnRhbC9jb2x1bW4tcmVzaXplL3Jlc2l6YWJsZS1kaXJlY3RpdmVzL2NvbW1vbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFHSCxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0seUNBQXlDLENBQUM7QUFDbEUsT0FBTyxFQUFDLDRCQUE0QixFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFFL0QsTUFBTSxPQUFnQixvQkFBcUIsU0FBUSxTQUF1QztJQUExRjs7UUFDVyx1QkFBa0IsR0FBRyxFQUFFLENBQUM7SUFTbkMsQ0FBQztJQVBvQiwyQkFBMkI7UUFDNUMsT0FBTyxzQkFBc0IsQ0FBQztJQUNoQyxDQUFDO0lBRWtCLDZCQUE2QjtRQUM5QyxPQUFPLDRCQUE0QixDQUFDO0lBQ3RDLENBQUM7Q0FDRjtBQUVELE1BQU0sQ0FBQyxNQUFNLHVCQUF1QixHQUFHO0lBQ3JDLE9BQU8sRUFBRSxlQUFlO0NBQ3pCLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSxnQkFBZ0IsR0FBRztJQUM5QixvQ0FBb0M7SUFDcEMsb0NBQW9DO0NBQ3JDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtUeXBlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7UmVzaXphYmxlfSBmcm9tICdAYW5ndWxhci9jZGstZXhwZXJpbWVudGFsL2NvbHVtbi1yZXNpemUnO1xuaW1wb3J0IHtNYXRDb2x1bW5SZXNpemVPdmVybGF5SGFuZGxlfSBmcm9tICcuLi9vdmVybGF5LWhhbmRsZSc7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBBYnN0cmFjdE1hdFJlc2l6YWJsZSBleHRlbmRzIFJlc2l6YWJsZTxNYXRDb2x1bW5SZXNpemVPdmVybGF5SGFuZGxlPiB7XG4gIG92ZXJyaWRlIG1pbldpZHRoUHhJbnRlcm5hbCA9IDMyO1xuXG4gIHByb3RlY3RlZCBvdmVycmlkZSBnZXRJbmxpbmVIYW5kbGVDc3NDbGFzc05hbWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gJ21hdC1yZXNpemFibGUtaGFuZGxlJztcbiAgfVxuXG4gIHByb3RlY3RlZCBvdmVycmlkZSBnZXRPdmVybGF5SGFuZGxlQ29tcG9uZW50VHlwZSgpOiBUeXBlPE1hdENvbHVtblJlc2l6ZU92ZXJsYXlIYW5kbGU+IHtcbiAgICByZXR1cm4gTWF0Q29sdW1uUmVzaXplT3ZlcmxheUhhbmRsZTtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgUkVTSVpBQkxFX0hPU1RfQklORElOR1MgPSB7XG4gICdjbGFzcyc6ICdtYXQtcmVzaXphYmxlJyxcbn07XG5cbmV4cG9ydCBjb25zdCBSRVNJWkFCTEVfSU5QVVRTID0gW1xuICAnbWluV2lkdGhQeDogbWF0UmVzaXphYmxlTWluV2lkdGhQeCcsXG4gICdtYXhXaWR0aFB4OiBtYXRSZXNpemFibGVNYXhXaWR0aFB4Jyxcbl07XG4iXX0=