"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVirtualAstObject = void 0;
const json_1 = require("../../json");
function createVirtualAstObject(root, options = {}) {
    var _a;
    const reporter = (path, target, oldValue, newValue) => {
        if (!options.listener) {
            return;
        }
        if (oldValue === newValue || JSON.stringify(oldValue) === JSON.stringify(newValue)) {
            // same value
            return;
        }
        if (Array.isArray(target)) {
            // For arrays we remove the index and update the entire value as keeping
            // track of changes by indices can be rather complex.
            options.listener(path.slice(0, -1), target);
        }
        else {
            options.listener(path, newValue);
        }
    };
    return create(Array.isArray(root) ? [...root] : { ...root }, [], reporter, new Set(options.exclude), ((_a = options.include) === null || _a === void 0 ? void 0 : _a.length) ? new Set(options.include) : undefined);
}
exports.createVirtualAstObject = createVirtualAstObject;
function create(obj, path, reporter, excluded = new Set(), included) {
    return new Proxy(obj, {
        getOwnPropertyDescriptor(target, p) {
            if (excluded.has(p) || (included && !included.has(p))) {
                return undefined;
            }
            return Reflect.getOwnPropertyDescriptor(target, p);
        },
        has(target, p) {
            if (typeof p === 'symbol' || excluded.has(p)) {
                return false;
            }
            return Reflect.has(target, p);
        },
        get(target, p) {
            if (excluded.has(p) || (included && !included.has(p))) {
                return undefined;
            }
            const value = Reflect.get(target, p);
            if (typeof p === 'symbol') {
                return value;
            }
            if (((0, json_1.isJsonObject)(value) && !(value instanceof Map)) || Array.isArray(value)) {
                return create(value, [...path, p], reporter);
            }
            else {
                return value;
            }
        },
        set(target, p, value) {
            var _a, _b;
            if (excluded.has(p) || (included && !included.has(p))) {
                return false;
            }
            if (value === undefined) {
                // setting to undefined is equivalent to a delete.
                return (_b = (_a = this.deleteProperty) === null || _a === void 0 ? void 0 : _a.call(this, target, p)) !== null && _b !== void 0 ? _b : false;
            }
            if (typeof p === 'symbol') {
                return Reflect.set(target, p, value);
            }
            const existingValue = getCurrentValue(target, p);
            if (Reflect.set(target, p, value)) {
                reporter([...path, p], target, existingValue, value);
                return true;
            }
            return false;
        },
        deleteProperty(target, p) {
            if (excluded.has(p)) {
                return false;
            }
            if (typeof p === 'symbol') {
                return Reflect.deleteProperty(target, p);
            }
            const existingValue = getCurrentValue(target, p);
            if (Reflect.deleteProperty(target, p)) {
                reporter([...path, p], target, existingValue, undefined);
                return true;
            }
            return true;
        },
        defineProperty(target, p, attributes) {
            if (typeof p === 'symbol') {
                return Reflect.defineProperty(target, p, attributes);
            }
            return false;
        },
        ownKeys(target) {
            return Reflect.ownKeys(target).filter((p) => !excluded.has(p) && (!included || included.has(p)));
        },
    });
}
function getCurrentValue(target, property) {
    if (Array.isArray(target) && isFinite(+property)) {
        return target[+property];
    }
    if (target && property in target) {
        return target[property];
    }
    return undefined;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbGl0aWVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvYW5ndWxhcl9kZXZraXQvY29yZS9zcmMvd29ya3NwYWNlL2pzb24vdXRpbGl0aWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7OztBQUVILHFDQUE0RTtBQWU1RSxTQUFnQixzQkFBc0IsQ0FDcEMsSUFBNEIsRUFDNUIsVUFJSSxFQUFFOztJQUVOLE1BQU0sUUFBUSxHQUFtQixDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxFQUFFO1FBQ3BFLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFO1lBQ3JCLE9BQU87U0FDUjtRQUVELElBQUksUUFBUSxLQUFLLFFBQVEsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxLQUFLLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDbEYsYUFBYTtZQUNiLE9BQU87U0FDUjtRQUVELElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUN6Qix3RUFBd0U7WUFDeEUscURBQXFEO1lBQ3JELE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztTQUM3QzthQUFNO1lBQ0wsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7U0FDbEM7SUFDSCxDQUFDLENBQUM7SUFFRixPQUFPLE1BQU0sQ0FDWCxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxJQUFJLEVBQUUsRUFDN0MsRUFBRSxFQUNGLFFBQVEsRUFDUixJQUFJLEdB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Q0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsSUFBSSxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQzFELENBQUM7UUFDSixDQUFDO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVELFNBQVMsZUFBZSxDQUFDLE1BQWMsRUFBRSxRQUFnQjtJQUN2RCxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUU7UUFDaEQsT0FBTyxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUMxQjtJQUVELElBQUksTUFBTSxJQUFJLFFBQVEsSUFBSSxNQUFNLEVBQUU7UUFDaEMsT0FBUSxNQUFxQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQ3pDO0lBRUQsT0FBTyxTQUFTLENBQUM7QUFDbkIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgeyBKc29uQXJyYXksIEpzb25PYmplY3QsIEpzb25WYWx1ZSwgaXNKc29uT2JqZWN0IH0gZnJvbSAnLi4vLi4vanNvbic7XG5cbmV4cG9ydCB0eXBlIENoYW5nZUxpc3RlbmVyID0gKHBhdGg6IHN0cmluZ1tdLCBuZXdWYWx1ZTogSnNvblZhbHVlIHwgdW5kZWZpbmVkKSA9PiB2b2lkO1xuXG50eXBlIENoYW5nZVJlcG9ydGVyID0gKFxuICBwYXRoOiBzdHJpbmdbXSxcbiAgdGFyZ2V0OiBKc29uT2JqZWN0IHwgSnNvbkFycmF5LFxuICBvbGRWYWx1ZTogSnNvblZhbHVlIHwgdW5kZWZpbmVkLFxuICBuZXdWYWx1ZTogSnNvblZhbHVlIHwgdW5kZWZpbmVkLFxuKSA9PiB2b2lkO1xuXG4vLyBsaWIuZXM1IFByb3BlcnR5S2V5IGlzIHN0cmluZyB8IG51bWJlciB8IHN5bWJvbCB3aGljaCBkb2Vzbid0IG92ZXJsYXAgUHJveHlIYW5kbGVyIFByb3BlcnR5S2V5IHdoaWNoIGlzIHN0cmluZyB8IHN5bWJvbC5cbi8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vbWljcm9zb2Z0L1R5cGVTY3JpcHQvaXNzdWVzLzQyODk0XG50eXBlIFByb3h5UHJvcGVydHlLZXkgPSBzdHJpbmcgfCBzeW1ib2w7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVWaXJ0dWFsQXN0T2JqZWN0PFQgZXh0ZW5kcyBvYmplY3QgPSBKc29uT2JqZWN0PihcbiAgcm9vdDogSnNvbk9iamVjdCB8IEpzb25BcnJheSxcbiAgb3B0aW9uczoge1xuICAgIGV4Y2x1ZGU/OiBzdHJpbmdbXTtcbiAgICBpbmNsdWRlPzogc3RyaW5nW107XG4gICAgbGlzdGVuZXI/OiBDaGFuZ2VMaXN0ZW5lcjtcbiAgfSA9IHt9LFxuKTogVCB7XG4gIGNvbnN0IHJlcG9ydGVyOiBDaGFuZ2VSZXBvcnRlciA9IChwYXRoLCB0YXJnZXQsIG9sZFZhbHVlLCBuZXdWYWx1ZSkgPT4ge1xuICAgIGlmICghb3B0aW9ucy5saXN0ZW5lcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChvbGRWYWx1ZSA9PT0gbmV3VmFsdWUgfHwgSlNPTi5zdHJpbmdpZnkob2xkVmFsdWUpID09PSBKU09OLnN0cmluZ2lmeShuZXdWYWx1ZSkpIHtcbiAgICAgIC8vIHNhbWUgdmFsdWVcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheSh0YXJnZXQpKSB7XG4gICAgICAvLyBGb3IgYXJyYXlzIHdlIHJlbW92ZSB0aGUgaW5kZXggYW5kIHVwZGF0ZSB0aGUgZW50aXJlIHZhbHVlIGFzIGtlZXBpbmdcbiAgICAgIC8vIHRyYWNrIG9mIGNoYW5nZXMgYnkgaW5kaWNlcyBjYW4gYmUgcmF0aGVyIGNvbXBsZXguXG4gICAgICBvcHRpb25zLmxpc3RlbmVyKHBhdGguc2xpY2UoMCwgLTEpLCB0YXJnZXQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvcHRpb25zLmxpc3RlbmVyKHBhdGgsIG5ld1ZhbHVlKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIGNyZWF0ZShcbiAgICBBcnJheS5pc0FycmF5KHJvb3QpID8gWy4uLnJvb3RdIDogeyAuLi5yb290IH0sXG4gICAgW10sXG4gICAgcmVwb3J0ZXIsXG4gICAgbmV3IFNldChvcHRpb25zLmV4Y2x1ZGUpLFxuICAgIG9wdGlvbnMuaW5jbHVkZT8ubGVuZ3RoID8gbmV3IFNldChvcHRpb25zLmluY2x1ZGUpIDogdW5kZWZpbmVkLFxuICApIGFzIFQ7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZShcbiAgb2JqOiBKc29uT2JqZWN0IHwgSnNvbkFycmF5LFxuICBwYXRoOiBzdHJpbmdbXSxcbiAgcmVwb3J0ZXI6IENoYW5nZVJlcG9ydGVyLFxuICBleGNsdWRlZCA9IG5ldyBTZXQ8UHJveHlQcm9wZXJ0eUtleT4oKSxcbiAgaW5jbHVkZWQ/OiBTZXQ8UHJveHlQcm9wZXJ0eUtleT4sXG4pIHtcbiAgcmV0dXJuIG5ldyBQcm94eShvYmosIHtcbiAgICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0OiB7fSwgcDogUHJveHlQcm9wZXJ0eUtleSk6IFByb3BlcnR5RGVzY3JpcHRvciB8IHVuZGVmaW5lZCB7XG4gICAgICBpZiAoZXhjbHVkZWQuaGFzKHApIHx8IChpbmNsdWRlZCAmJiAhaW5jbHVkZWQuaGFzKHApKSkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gUmVmbGVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBwKTtcbiAgICB9LFxuICAgIGhhcyh0YXJnZXQ6IHt9LCBwOiBQcm94eVByb3BlcnR5S2V5KTogYm9vbGVhbiB7XG4gICAgICBpZiAodHlwZW9mIHAgPT09ICdzeW1ib2wnIHx8IGV4Y2x1ZGVkLmhhcyhwKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBSZWZsZWN0Lmhhcyh0YXJnZXQsIHApO1xuICAgIH0sXG4gICAgZ2V0KHRhcmdldDoge30sIHA6IFByb3h5UHJvcGVydHlLZXkpOiB1bmtub3duIHtcbiAgICAgIGlmIChleGNsdWRlZC5oYXMocCkgfHwgKGluY2x1ZGVkICYmICFpbmNsdWRlZC5oYXMocCkpKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHZhbHVlID0gUmVmbGVjdC5nZXQodGFyZ2V0LCBwKTtcbiAgICAgIGlmICh0eXBlb2YgcCA9PT0gJ3N5bWJvbCcpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoKGlzSnNvbk9iamVjdCh2YWx1ZSkgJiYgISh2YWx1ZSBpbnN0YW5jZW9mIE1hcCkpIHx8IEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBjcmVhdGUodmFsdWUsIFsuLi5wYXRoLCBwXSwgcmVwb3J0ZXIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgfVxuICAgIH0sXG4gICAgc2V0KHRhcmdldDoge30sIHA6IFByb3h5UHJvcGVydHlLZXksIHZhbHVlOiB1bmtub3duKTogYm9vbGVhbiB7XG4gICAgICBpZiAoZXhjbHVkZWQuaGFzKHApIHx8IChpbmNsdWRlZCAmJiAhaW5jbHVkZWQuaGFzKHApKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vIHNldHRpbmcgdG8gdW5kZWZpbmVkIGlzIGVxdWl2YWxlbnQgdG8gYSBkZWxldGUuXG4gICAgICAgIHJldHVybiB0aGlzLmRlbGV0ZVByb3BlcnR5Py4odGFyZ2V0LCBwKSA/PyBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBwID09PSAnc3ltYm9sJykge1xuICAgICAgICByZXR1cm4gUmVmbGVjdC5zZXQodGFyZ2V0LCBwLCB2YWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGV4aXN0aW5nVmFsdWUgPSBnZXRDdXJyZW50VmFsdWUodGFyZ2V0LCBwKTtcbiAgICAgIGlmIChSZWZsZWN0LnNldCh0YXJnZXQsIHAsIHZhbHVlKSkge1xuICAgICAgICByZXBvcnRlcihbLi4ucGF0aCwgcF0sIHRhcmdldCwgZXhpc3RpbmdWYWx1ZSwgdmFsdWUgYXMgSnNvblZhbHVlKTtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG4gICAgZGVsZXRlUHJvcGVydHkodGFyZ2V0OiB7fSwgcDogUHJveHlQcm9wZXJ0eUtleSk6IGJvb2xlYW4ge1xuICAgICAgaWYgKGV4Y2x1ZGVkLmhhcyhwKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgcCA9PT0gJ3N5bWJvbCcpIHtcbiAgICAgICAgcmV0dXJuIFJlZmxlY3QuZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBwKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZXhpc3RpbmdWYWx1ZSA9IGdldEN1cnJlbnRWYWx1ZSh0YXJnZXQsIHApO1xuICAgICAgaWYgKFJlZmxlY3QuZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBwKSkge1xuICAgICAgICByZXBvcnRlcihbLi4ucGF0aCwgcF0sIHRhcmdldCwgZXhpc3RpbmdWYWx1ZSwgdW5kZWZpbmVkKTtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICBkZWZpbmVQcm9wZXJ0eSh0YXJnZXQ6IHt9LCBwOiBQcm94eVByb3BlcnR5S2V5LCBhdHRyaWJ1dGVzOiBQcm9wZXJ0eURlc2NyaXB0b3IpOiBib29sZWFuIHtcbiAgICAgIGlmICh0eXBlb2YgcCA9PT0gJ3N5bWJvbCcpIHtcbiAgICAgICAgcmV0dXJuIFJlZmxlY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBwLCBhdHRyaWJ1dGVzKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG4gICAgb3duS2V5cyh0YXJnZXQ6IHt9KTogUHJveHlQcm9wZXJ0eUtleVtdIHtcbiAgICAgIHJldHVybiBSZWZsZWN0Lm93bktleXModGFyZ2V0KS5maWx0ZXIoXG4gICAgICAgIChwKSA9PiAhZXhjbHVkZWQuaGFzKHApICYmICghaW5jbHVkZWQgfHwgaW5jbHVkZWQuaGFzKHApKSxcbiAgICAgICk7XG4gICAgfSxcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGdldEN1cnJlbnRWYWx1ZSh0YXJnZXQ6IG9iamVjdCwgcHJvcGVydHk6IHN0cmluZyk6IEpzb25WYWx1ZSB8IHVuZGVmaW5lZCB7XG4gIGlmIChBcnJheS5pc0FycmF5KHRhcmdldCkgJiYgaXNGaW5pdGUoK3Byb3BlcnR5KSkge1xuICAgIHJldHVybiB0YXJnZXRbK3Byb3BlcnR5XTtcbiAgfVxuXG4gIGlmICh0YXJnZXQgJiYgcHJvcGVydHkgaW4gdGFyZ2V0KSB7XG4gICAgcmV0dXJuICh0YXJnZXQgYXMgSnNvbk9iamVjdClbcHJvcGVydHldO1xuICB9XG5cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cbiJdfQ==