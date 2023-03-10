/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { DOCUMENT, ɵgetDOM as getDOM } from '@angular/common';
import { APP_ID, Inject, Injectable } from '@angular/core';
import { ɵSharedStylesHost as SharedStylesHost } from '@angular/platform-browser';
import * as i0 from "@angular/core";
export class ServerStylesHost extends SharedStylesHost {
    constructor(doc, appId) {
        super();
        this.doc = doc;
        this.appId = appId;
        this.head = null;
        this._styleNodes = new Set();
        this.head = doc.getElementsByTagName('head')[0];
    }
    onStyleAdded(style) {
        const adapter = getDOM();
        const el = adapter.createElement('style');
        el.textContent = style;
        if (!!this.appId) {
            el.setAttribute('ng-transition', this.appId);
        }
        this.head.appendChild(el);
        this._styleNodes.add(el);
    }
    ngOnDestroy() {
        this._styleNodes.forEach(styleNode => styleNode.remove());
        this._styleNodes.clear();
        super.ngOnDestroy();
    }
}
ServerStylesHost.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0-next.0+sha-ba2c1d8", ngImport: i0, type: ServerStylesHost, deps: [{ token: DOCUMENT }, { token: APP_ID }], target: i0.ɵɵFactoryTarget.Injectable });
ServerStylesHost.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.0.0-next.0+sha-ba2c1d8", ngImport: i0, type: ServerStylesHost });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0-next.0+sha-ba2c1d8", ngImport: i0, type: ServerStylesHost, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [APP_ID]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3R5bGVzX2hvc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS1zZXJ2ZXIvc3JjL3N0eWxlc19ob3N0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxRQUFRLEVBQUUsT0FBTyxJQUFJLE1BQU0sRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzVELE9BQU8sRUFBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN6RCxPQUFPLEVBQUMsaUJBQWlCLElBQUksZ0JBQWdCLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQzs7QUFHaEYsTUFBTSxPQUFPLGdCQUFpQixTQUFRLGdCQUFnQjtJQUlwRCxZQUFzQyxHQUFRLEVBQTBCLEtBQWE7UUFDbkYsS0FBSyxFQUFFLENBQUM7UUFENEIsUUFBRyxHQUFILEdBQUcsQ0FBSztRQUEwQixVQUFLLEdBQUwsS0FBSyxDQUFRO1FBSDdFLFNBQUksR0FBUSxJQUFJLENBQUM7UUFDakIsZ0JBQVcsR0FBRyxJQUFJLEdBQUcsRUFBZSxDQUFDO1FBSTNDLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFFUSxZQUFZLENBQUMsS0FBYTtRQUNqQyxNQUFNLE9BQU8sR0FBRyxNQUFNLEVBQUUsQ0FBQztRQUN6QixNQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzFDLEVBQUUsQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDaEIsRUFBRSxDQUFDLFlBQVksQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzlDO1FBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDMUIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDM0IsQ0FBQztJQUVRLFdBQVc7UUFDbEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUMxRCxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3pCLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUN0QixDQUFDOzt3SEF4QlUsZ0JBQWdCLGtCQUlQLFFBQVEsYUFBNEIsTUFBTTs0SEFKbkQsZ0JBQWdCO3NHQUFoQixnQkFBZ0I7a0JBRDVCLFVBQVU7OzBCQUtJLE1BQU07MkJBQUMsUUFBUTs7MEJBQXFCLE1BQU07MkJBQUMsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RPQ1VNRU5ULCDJtWdldERPTSBhcyBnZXRET019IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0FQUF9JRCwgSW5qZWN0LCBJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7ybVTaGFyZWRTdHlsZXNIb3N0IGFzIFNoYXJlZFN0eWxlc0hvc3R9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU2VydmVyU3R5bGVzSG9zdCBleHRlbmRzIFNoYXJlZFN0eWxlc0hvc3Qge1xuICBwcml2YXRlIGhlYWQ6IGFueSA9IG51bGw7XG4gIHByaXZhdGUgX3N0eWxlTm9kZXMgPSBuZXcgU2V0PEhUTUxFbGVtZW50PigpO1xuXG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgZG9jOiBhbnksIEBJbmplY3QoQVBQX0lEKSBwcml2YXRlIGFwcElkOiBzdHJpbmcpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuaGVhZCA9IGRvYy5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xuICB9XG5cbiAgb3ZlcnJpZGUgb25TdHlsZUFkZGVkKHN0eWxlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCBhZGFwdGVyID0gZ2V0RE9NKCk7XG4gICAgY29uc3QgZWwgPSBhZGFwdGVyLmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgZWwudGV4dENvbnRlbnQgPSBzdHlsZTtcbiAgICBpZiAoISF0aGlzLmFwcElkKSB7XG4gICAgICBlbC5zZXRBdHRyaWJ1dGUoJ25nLXRyYW5zaXRpb24nLCB0aGlzLmFwcElkKTtcbiAgICB9XG4gICAgdGhpcy5oZWFkLmFwcGVuZENoaWxkKGVsKTtcbiAgICB0aGlzLl9zdHlsZU5vZGVzLmFkZChlbCk7XG4gIH1cblxuICBvdmVycmlkZSBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9zdHlsZU5vZGVzLmZvckVhY2goc3R5bGVOb2RlID0+IHN0eWxlTm9kZS5yZW1vdmUoKSk7XG4gICAgdGhpcy5fc3R5bGVOb2Rlcy5jbGVhcigpO1xuICAgIHN1cGVyLm5nT25EZXN0cm95KCk7XG4gIH1cbn1cbiJdfQ==