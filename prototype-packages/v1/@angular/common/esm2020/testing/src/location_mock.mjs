import { EventEmitter, Injectable } from '@angular/core';
import { normalizeQueryParams } from '../../src/location/util';
import * as i0 from "@angular/core";
/**
 * A spy for {@link Location} that allows tests to fire simulated location events.
 *
 * @publicApi
 */
export class SpyLocation {
    constructor() {
        this.urlChanges = [];
        this._history = [new LocationState('', '', null)];
        this._historyIndex = 0;
        /** @internal */
        this._subject = new EventEmitter();
        /** @internal */
        this._baseHref = '';
        /** @internal */
        this._locationStrategy = null;
        /** @internal */
        this._urlChangeListeners = [];
        /** @internal */
        this._urlChangeSubscription = null;
    }
    ngOnDestroy() {
        this._urlChangeSubscription?.unsubscribe();
        this._urlChangeListeners = [];
    }
    setInitialPath(url) {
        this._history[this._historyIndex].path = url;
    }
    setBaseHref(url) {
        this._baseHref = url;
    }
    path() {
        return this._history[this._historyIndex].path;
    }
    getState() {
        return this._history[this._historyIndex].state;
    }
    isCurrentPathEqualTo(path, query = '') {
        const givenPath = path.endsWith('/') ? path.substring(0, path.length - 1) : path;
        const currPath = this.path().endsWith('/') ? this.path().substring(0, this.path().length - 1) : this.path();
        return currPath == givenPath + (query.length > 0 ? ('?' + query) : '');
    }
    simulateUrlPop(pathname) {
        this._subject.emit({ 'url': pathname, 'pop': true, 'type': 'popstate' });
    }
    simulateHashChange(pathname) {
        const path = this.prepareExternalUrl(pathname);
        this.pushHistory(path, '', null);
        this.urlChanges.push('hash: ' + pathname);
        // the browser will automatically fire popstate event before each `hashchange` event, so we need
        // to simulate it.
        this._subject.emit({ 'url': pathname, 'pop': true, 'type': 'popstate' });
        this._subject.emit({ 'url': pathname, 'pop': true, 'type': 'hashchange' });
    }
    prepareExternalUrl(url) {
        if (url.length > 0 && !url.startsWith('/')) {
            url = '/' + url;
        }
        return this._baseHref + url;
    }
    go(path, query = '', state = null) {
        path = this.prepareExternalUrl(path);
        this.pushHistory(path, query, state);
        const locationState = this._history[this._historyIndex - 1];
        if (locationState.path == path && locationState.query == query) {
            return;
        }
        const url = path + (query.length > 0 ? ('?' + query) : '');
        this.urlChanges.push(url);
        this._notifyUrlChangeListeners(path + normalizeQueryParams(query), state);
    }
    replaceState(path, query = '', state = null) {
        path = this.prepareExternalUrl(path);
        const history = this._history[this._historyIndex];
        history.state = state;
        if (history.path == path && history.query == query) {
            return;
        }
        history.path = path;
        history.query = query;
        const url = path + (query.length > 0 ? ('?' + query) : '');
        this.urlChanges.push('replace: ' + url);
        this._notifyUrlChangeListeners(path + normalizeQueryParams(query), state);
    }
    forward() {
        if (this._historyIndex < (this._history.length - 1)) {
            this._historyIndex++;
            this._subject.emit({ 'url': this.path(), 'state': this.getState(), 'pop': true, 'type': 'popstate' });
        }
    }
    back() {
        if (this._historyIndex > 0) {
            this._historyIndex--;
            this._subject.emit({ 'url': this.path(), 'state': this.getState(), 'pop': true, 'type': 'popstate' });
        }
    }
    historyGo(relativePosition = 0) {
        const nextPageIndex = this._historyIndex + relativePosition;
        if (nextPageIndex >= 0 && nextPageIndex < this._history.length) {
            this._historyIndex = nextPageIndex;
            this._subject.emit({ 'url': this.path(), 'state': this.getState(), 'pop': true, 'type': 'popstate' });
        }
    }
    onUrlChange(fn) {
        this._urlChangeListeners.push(fn);
        if (!this._urlChangeSubscription) {
            this._urlChangeSubscription = this.subscribe(v => {
                this._notifyUrlChangeListeners(v.url, v.state);
            });
        }
        return () => {
            const fnIndex = this._urlChangeListeners.indexOf(fn);
            this._urlChangeListeners.splice(fnIndex, 1);
            if (this._urlChangeListeners.length === 0) {
                this._urlChangeSubscription?.unsubscribe();
                this._urlChangeSubscription = null;
            }
        };
    }
    /** @internal */
    _notifyUrlChangeListeners(url = '', state) {
        this._urlChangeListeners.forEach(fn => fn(url, state));
    }
    subscribe(onNext, onThrow, onReturn) {
        return this._subject.subscribe({ next: onNext, error: onThrow, complete: onReturn });
    }
    normalize(url) {
        return null;
    }
    pushHistory(path, query, state) {
        if (this._historyIndex > 0) {
            this._history.splice(this._historyIndex + 1);
        }
        this._history.push(new LocationState(path, query, state));
        this._historyIndex = this._history.length - 1;
    }
}
SpyLocation.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.0-next.1+sha-5179b64", ngImport: i0, type: SpyLocation, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
SpyLocation.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.1.0-next.1+sha-5179b64", ngImport: i0, type: SpyLocation });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.0-next.1+sha-5179b64", ngImport: i0, type: SpyLocation, decorators: [{
            type: Injectable
        }] });
class LocationState {
    constructor(path, query, state) {
        this.path = path;
        this.query = query;
        this.state = state;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYXRpb25fbW9jay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbW1vbi90ZXN0aW5nL3NyYy9sb2NhdGlvbl9tb2NrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVNBLE9BQU8sRUFBQyxZQUFZLEVBQUUsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBR3ZELE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLHlCQUF5QixDQUFDOztBQUU3RDs7OztHQUlHO0FBRUgsTUFBTSxPQUFPLFdBQVc7SUFEeEI7UUFFRSxlQUFVLEdBQWEsRUFBRSxDQUFDO1FBQ2xCLGFBQVEsR0FBb0IsQ0FBQyxJQUFJLGFBQWEsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDOUQsa0JBQWEsR0FBVyxDQUFDLENBQUM7UUFDbEMsZ0JBQWdCO1FBQ2hCLGFBQVEsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUNqRCxnQkFBZ0I7UUFDaEIsY0FBUyxHQUFXLEVBQUUsQ0FBQztRQUN2QixnQkFBZ0I7UUFDaEIsc0JBQWlCLEdBQXFCLElBQUssQ0FBQztRQUM1QyxnQkFBZ0I7UUFDaEIsd0JBQW1CLEdBQThDLEVBQUUsQ0FBQztRQUNwRSxnQkFBZ0I7UUFDaEIsMkJBQXNCLEdBQTBCLElBQUksQ0FBQztLQTBKdEQ7SUF4SkMsV0FBVztRQUNULElBQUksQ0FBQyxzQkFBc0IsRUFBRSxXQUFXLEVBQUUsQ0FBQztRQUMzQyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsRUFBRSxDQUFDO0lBQ2hDLENBQUM7SUFFRCxjQUFjLENBQUMsR0FBVztRQUN4QixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO0lBQy9DLENBQUM7SUFFRCxXQUFXLENBQUMsR0FBVztRQUNyQixJQUFJLENBQUMsU0FBUyxHQUFHLEdBQUcs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QUFPLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUMsQ0FBQyxDQUFDO0lBQ3JGLENBQUM7SUFFRCxTQUFTLENBQUMsR0FBVztRQUNuQixPQUFPLElBQUssQ0FBQztJQUNmLENBQUM7SUFFTyxXQUFXLENBQUMsSUFBWSxFQUFFLEtBQWEsRUFBRSxLQUFVO1FBQ3pELElBQUksSUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLEVBQUU7WUFDMUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUMsQ0FBQztTQUM5QztRQUNELElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksYUFBYSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUMxRCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUNoRCxDQUFDOzttSEF0S1UsV0FBVzt1SEFBWCxXQUFXO3NHQUFYLFdBQVc7a0JBRHZCLFVBQVU7O0FBMEtYLE1BQU0sYUFBYTtJQUNqQixZQUFtQixJQUFZLEVBQVMsS0FBYSxFQUFTLEtBQVU7UUFBckQsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUFTLFVBQUssR0FBTCxLQUFLLENBQVE7UUFBUyxVQUFLLEdBQUwsS0FBSyxDQUFLO0lBQUcsQ0FBQztDQUM3RSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0xvY2F0aW9uLCBMb2NhdGlvblN0cmF0ZWd5fSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtFdmVudEVtaXR0ZXIsIEluamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtTdWJzY3JpcHRpb25MaWtlfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHtub3JtYWxpemVRdWVyeVBhcmFtc30gZnJvbSAnLi4vLi4vc3JjL2xvY2F0aW9uL3V0aWwnO1xuXG4vKipcbiAqIEEgc3B5IGZvciB7QGxpbmsgTG9jYXRpb259IHRoYXQgYWxsb3dzIHRlc3RzIHRvIGZpcmUgc2ltdWxhdGVkIGxvY2F0aW9uIGV2ZW50cy5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBTcHlMb2NhdGlvbiBpbXBsZW1lbnRzIExvY2F0aW9uIHtcbiAgdXJsQ2hhbmdlczogc3RyaW5nW10gPSBbXTtcbiAgcHJpdmF0ZSBfaGlzdG9yeTogTG9jYXRpb25TdGF0ZVtdID0gW25ldyBMb2NhdGlvblN0YXRlKCcnLCAnJywgbnVsbCldO1xuICBwcml2YXRlIF9oaXN0b3J5SW5kZXg6IG51bWJlciA9IDA7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3N1YmplY3Q6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAvKiogQGludGVybmFsICovXG4gIF9iYXNlSHJlZjogc3RyaW5nID0gJyc7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2xvY2F0aW9uU3RyYXRlZ3k6IExvY2F0aW9uU3RyYXRlZ3kgPSBudWxsITtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfdXJsQ2hhbmdlTGlzdGVuZXJzOiAoKHVybDogc3RyaW5nLCBzdGF0ZTogdW5rbm93bikgPT4gdm9pZClbXSA9IFtdO1xuICAvKiogQGludGVybmFsICovXG4gIF91cmxDaGFuZ2VTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbkxpa2V8bnVsbCA9IG51bGw7XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5fdXJsQ2hhbmdlU3Vic2NyaXB0aW9uPy51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuX3VybENoYW5nZUxpc3RlbmVycyA9IFtdO1xuICB9XG5cbiAgc2V0SW5pdGlhbFBhdGgodXJsOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9oaXN0b3J5W3RoaXMuX2hpc3RvcnlJbmRleF0ucGF0aCA9IHVybDtcbiAgfVxuXG4gIHNldEJhc2VIcmVmKHVybDogc3RyaW5nKSB7XG4gICAgdGhpcy5fYmFzZUhyZWYgPSB1cmw7XG4gIH1cblxuICBwYXRoKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2hpc3RvcnlbdGhpcy5faGlzdG9yeUluZGV4XS5wYXRoO1xuICB9XG5cbiAgZ2V0U3RhdGUoKTogdW5rbm93biB7XG4gICAgcmV0dXJuIHRoaXMuX2hpc3RvcnlbdGhpcy5faGlzdG9yeUluZGV4XS5zdGF0ZTtcbiAgfVxuXG4gIGlzQ3VycmVudFBhdGhFcXVhbFRvKHBhdGg6IHN0cmluZywgcXVlcnk6IHN0cmluZyA9ICcnKTogYm9vbGVhbiB7XG4gICAgY29uc3QgZ2l2ZW5QYXRoID0gcGF0aC5lbmRzV2l0aCgnLycpID8gcGF0aC5zdWJzdHJpbmcoMCwgcGF0aC5sZW5ndGggLSAxKSA6IHBhdGg7XG4gICAgY29uc3QgY3VyclBhdGggPVxuICAgICAgICB0aGlzLnBhdGgoKS5lbmRzV2l0aCgnLycpID8gdGhpcy5wYXRoKCkuc3Vic3RyaW5nKDAsIHRoaXMucGF0aCgpLmxlbmd0aCAtIDEpIDogdGhpcy5wYXRoKCk7XG5cbiAgICByZXR1cm4gY3VyclBhdGggPT0gZ2l2ZW5QYXRoICsgKHF1ZXJ5Lmxlbmd0aCA+IDAgPyAoJz8nICsgcXVlcnkpIDogJycpO1xuICB9XG5cbiAgc2ltdWxhdGVVcmxQb3AocGF0aG5hbWU6IHN0cmluZykge1xuICAgIHRoaXMuX3N1YmplY3QuZW1pdCh7J3VybCc6IHBhdGhuYW1lLCAncG9wJzogdHJ1ZSwgJ3R5cGUnOiAncG9wc3RhdGUnfSk7XG4gIH1cblxuICBzaW11bGF0ZUhhc2hDaGFuZ2UocGF0aG5hbWU6IHN0cmluZykge1xuICAgIGNvbnN0IHBhdGggPSB0aGlzLnByZXBhcmVFeHRlcm5hbFVybChwYXRobmFtZSk7XG4gICAgdGhpcy5wdXNoSGlzdG9yeShwYXRoLCAnJywgbnVsbCk7XG5cbiAgICB0aGlzLnVybENoYW5nZXMucHVzaCgnaGFzaDogJyArIHBhdGhuYW1lKTtcbiAgICAvLyB0aGUgYnJvd3NlciB3aWxsIGF1dG9tYXRpY2FsbHkgZmlyZSBwb3BzdGF0ZSBldmVudCBiZWZvcmUgZWFjaCBgaGFzaGNoYW5nZWAgZXZlbnQsIHNvIHdlIG5lZWRcbiAgICAvLyB0byBzaW11bGF0ZSBpdC5cbiAgICB0aGlzLl9zdWJqZWN0LmVtaXQoeyd1cmwnOiBwYXRobmFtZSwgJ3BvcCc6IHRydWUsICd0eXBlJzogJ3BvcHN0YXRlJ30pO1xuICAgIHRoaXMuX3N1YmplY3QuZW1pdCh7J3VybCc6IHBhdGhuYW1lLCAncG9wJzogdHJ1ZSwgJ3R5cGUnOiAnaGFzaGNoYW5nZSd9KTtcbiAgfVxuXG4gIHByZXBhcmVFeHRlcm5hbFVybCh1cmw6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgaWYgKHVybC5sZW5ndGggPiAwICYmICF1cmwuc3RhcnRzV2l0aCgnLycpKSB7XG4gICAgICB1cmwgPSAnLycgKyB1cmw7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9iYXNlSHJlZiArIHVybDtcbiAgfVxuXG4gIGdvKHBhdGg6IHN0cmluZywgcXVlcnk6IHN0cmluZyA9ICcnLCBzdGF0ZTogYW55ID0gbnVsbCkge1xuICAgIHBhdGggPSB0aGlzLnByZXBhcmVFeHRlcm5hbFVybChwYXRoKTtcblxuICAgIHRoaXMucHVzaEhpc3RvcnkocGF0aCwgcXVlcnksIHN0YXRlKTtcblxuICAgIGNvbnN0IGxvY2F0aW9uU3RhdGUgPSB0aGlzLl9oaXN0b3J5W3RoaXMuX2hpc3RvcnlJbmRleCAtIDFdO1xuICAgIGlmIChsb2NhdGlvblN0YXRlLnBhdGggPT0gcGF0aCAmJiBsb2NhdGlvblN0YXRlLnF1ZXJ5ID09IHF1ZXJ5KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgdXJsID0gcGF0aCArIChxdWVyeS5sZW5ndGggPiAwID8gKCc/JyArIHF1ZXJ5KSA6ICcnKTtcbiAgICB0aGlzLnVybENoYW5nZXMucHVzaCh1cmwpO1xuICAgIHRoaXMuX25vdGlmeVVybENoYW5nZUxpc3RlbmVycyhwYXRoICsgbm9ybWFsaXplUXVlcnlQYXJhbXMocXVlcnkpLCBzdGF0ZSk7XG4gIH1cblxuICByZXBsYWNlU3RhdGUocGF0aDogc3RyaW5nLCBxdWVyeTogc3RyaW5nID0gJycsIHN0YXRlOiBhbnkgPSBudWxsKSB7XG4gICAgcGF0aCA9IHRoaXMucHJlcGFyZUV4dGVybmFsVXJsKHBhdGgpO1xuXG4gICAgY29uc3QgaGlzdG9yeSA9IHRoaXMuX2hpc3RvcnlbdGhpcy5faGlzdG9yeUluZGV4XTtcblxuICAgIGhpc3Rvcnkuc3RhdGUgPSBzdGF0ZTtcblxuICAgIGlmIChoaXN0b3J5LnBhdGggPT0gcGF0aCAmJiBoaXN0b3J5LnF1ZXJ5ID09IHF1ZXJ5KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaGlzdG9yeS5wYXRoID0gcGF0aDtcbiAgICBoaXN0b3J5LnF1ZXJ5ID0gcXVlcnk7XG5cbiAgICBjb25zdCB1cmwgPSBwYXRoICsgKHF1ZXJ5Lmxlbmd0aCA+IDAgPyAoJz8nICsgcXVlcnkpIDogJycpO1xuICAgIHRoaXMudXJsQ2hhbmdlcy5wdXNoKCdyZXBsYWNlOiAnICsgdXJsKTtcbiAgICB0aGlzLl9ub3RpZnlVcmxDaGFuZ2VMaXN0ZW5lcnMocGF0aCArIG5vcm1hbGl6ZVF1ZXJ5UGFyYW1zKHF1ZXJ5KSwgc3RhdGUpO1xuICB9XG5cbiAgZm9yd2FyZCgpIHtcbiAgICBpZiAodGhpcy5faGlzdG9yeUluZGV4IDwgKHRoaXMuX2hpc3RvcnkubGVuZ3RoIC0gMSkpIHtcbiAgICAgIHRoaXMuX2hpc3RvcnlJbmRleCsrO1xuICAgICAgdGhpcy5fc3ViamVjdC5lbWl0KFxuICAgICAgICAgIHsndXJsJzogdGhpcy5wYXRoKCksICdzdGF0ZSc6IHRoaXMuZ2V0U3RhdGUoKSwgJ3BvcCc6IHRydWUsICd0eXBlJzogJ3BvcHN0YXRlJ30pO1xuICAgIH1cbiAgfVxuXG4gIGJhY2soKSB7XG4gICAgaWYgKHRoaXMuX2hpc3RvcnlJbmRleCA+IDApIHtcbiAgICAgIHRoaXMuX2hpc3RvcnlJbmRleC0tO1xuICAgICAgdGhpcy5fc3ViamVjdC5lbWl0KFxuICAgICAgICAgIHsndXJsJzogdGhpcy5wYXRoKCksICdzdGF0ZSc6IHRoaXMuZ2V0U3RhdGUoKSwgJ3BvcCc6IHRydWUsICd0eXBlJzogJ3BvcHN0YXRlJ30pO1xuICAgIH1cbiAgfVxuXG4gIGhpc3RvcnlHbyhyZWxhdGl2ZVBvc2l0aW9uOiBudW1iZXIgPSAwKTogdm9pZCB7XG4gICAgY29uc3QgbmV4dFBhZ2VJbmRleCA9IHRoaXMuX2hpc3RvcnlJbmRleCArIHJlbGF0aXZlUG9zaXRpb247XG4gICAgaWYgKG5leHRQYWdlSW5kZXggPj0gMCAmJiBuZXh0UGFnZUluZGV4IDwgdGhpcy5faGlzdG9yeS5sZW5ndGgpIHtcbiAgICAgIHRoaXMuX2hpc3RvcnlJbmRleCA9IG5leHRQYWdlSW5kZXg7XG4gICAgICB0aGlzLl9zdWJqZWN0LmVtaXQoXG4gICAgICAgICAgeyd1cmwnOiB0aGlzLnBhdGgoKSwgJ3N0YXRlJzogdGhpcy5nZXRTdGF0ZSgpLCAncG9wJzogdHJ1ZSwgJ3R5cGUnOiAncG9wc3RhdGUnfSk7XG4gICAgfVxuICB9XG5cbiAgb25VcmxDaGFuZ2UoZm46ICh1cmw6IHN0cmluZywgc3RhdGU6IHVua25vd24pID0+IHZvaWQpOiBWb2lkRnVuY3Rpb24ge1xuICAgIHRoaXMuX3VybENoYW5nZUxpc3RlbmVycy5wdXNoKGZuKTtcblxuICAgIGlmICghdGhpcy5fdXJsQ2hhbmdlU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLl91cmxDaGFuZ2VTdWJzY3JpcHRpb24gPSB0aGlzLnN1YnNjcmliZSh2ID0+IHtcbiAgICAgICAgdGhpcy5fbm90aWZ5VXJsQ2hhbmdlTGlzdGVuZXJzKHYudXJsLCB2LnN0YXRlKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBjb25zdCBmbkluZGV4ID0gdGhpcy5fdXJsQ2hhbmdlTGlzdGVuZXJzLmluZGV4T2YoZm4pO1xuICAgICAgdGhpcy5fdXJsQ2hhbmdlTGlzdGVuZXJzLnNwbGljZShmbkluZGV4LCAxKTtcblxuICAgICAgaWYgKHRoaXMuX3VybENoYW5nZUxpc3RlbmVycy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdGhpcy5fdXJsQ2hhbmdlU3Vic2NyaXB0aW9uPy51bnN1YnNjcmliZSgpO1xuICAgICAgICB0aGlzLl91cmxDaGFuZ2VTdWJzY3JpcHRpb24gPSBudWxsO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9ub3RpZnlVcmxDaGFuZ2VMaXN0ZW5lcnModXJsOiBzdHJpbmcgPSAnJywgc3RhdGU6IHVua25vd24pIHtcbiAgICB0aGlzLl91cmxDaGFuZ2VMaXN0ZW5lcnMuZm9yRWFjaChmbiA9PiBmbih1cmwsIHN0YXRlKSk7XG4gIH1cblxuICBzdWJzY3JpYmUoXG4gICAgICBvbk5leHQ6ICh2YWx1ZTogYW55KSA9PiB2b2lkLCBvblRocm93PzogKChlcnJvcjogYW55KSA9PiB2b2lkKXxudWxsLFxuICAgICAgb25SZXR1cm4/OiAoKCkgPT4gdm9pZCl8bnVsbCk6IFN1YnNjcmlwdGlvbkxpa2Uge1xuICAgIHJldHVybiB0aGlzLl9zdWJqZWN0LnN1YnNjcmliZSh7bmV4dDogb25OZXh0LCBlcnJvcjogb25UaHJvdywgY29tcGxldGU6IG9uUmV0dXJufSk7XG4gIH1cblxuICBub3JtYWxpemUodXJsOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBudWxsITtcbiAgfVxuXG4gIHByaXZhdGUgcHVzaEhpc3RvcnkocGF0aDogc3RyaW5nLCBxdWVyeTogc3RyaW5nLCBzdGF0ZTogYW55KSB7XG4gICAgaWYgKHRoaXMuX2hpc3RvcnlJbmRleCA+IDApIHtcbiAgICAgIHRoaXMuX2hpc3Rvcnkuc3BsaWNlKHRoaXMuX2hpc3RvcnlJbmRleCArIDEpO1xuICAgIH1cbiAgICB0aGlzLl9oaXN0b3J5LnB1c2gobmV3IExvY2F0aW9uU3RhdGUocGF0aCwgcXVlcnksIHN0YXRlKSk7XG4gICAgdGhpcy5faGlzdG9yeUluZGV4ID0gdGhpcy5faGlzdG9yeS5sZW5ndGggLSAxO1xuICB9XG59XG5cbmNsYXNzIExvY2F0aW9uU3RhdGUge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgcGF0aDogc3RyaW5nLCBwdWJsaWMgcXVlcnk6IHN0cmluZywgcHVibGljIHN0YXRlOiBhbnkpIHt9XG59XG4iXX0=