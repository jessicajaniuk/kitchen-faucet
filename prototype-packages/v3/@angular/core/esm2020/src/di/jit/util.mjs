/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { RuntimeError } from '../../errors';
import { ReflectionCapabilities } from '../../reflection/reflection_capabilities';
import { Host, Inject, Optional, Self, SkipSelf } from '../metadata';
import { Attribute } from '../metadata_attr';
let _reflect = null;
export function getReflect() {
    return (_reflect = _reflect || new ReflectionCapabilities());
}
export function reflectDependencies(type) {
    return convertDependencies(getReflect().parameters(type));
}
export function convertDependencies(deps) {
    return deps.map(dep => reflectDependency(dep));
}
function reflectDependency(dep) {
    const meta = {
        token: null,
        attribute: null,
        host: false,
        optional: false,
        self: false,
        skipSelf: false,
    };
    if (Array.isArray(dep) && dep.length > 0) {
        for (let j = 0; j < dep.length; j++) {
            const param = dep[j];
            if (param === undefined) {
                // param may be undefined if type of dep is not set by ngtsc
                continue;
            }
            const proto = Object.getPrototypeOf(param);
            if (param instanceof Optional || proto.ngMetadataName === 'Optional') {
                meta.optional = true;
            }
            else if (param instanceof SkipSelf || proto.ngMetadataName === 'SkipSelf') {
                meta.skipSelf = true;
            }
            else if (param instanceof Self || proto.ngMetadataName === 'Self') {
                meta.self = true;
            }
            else if (param instanceof Host || proto.ngMetadataName === 'Host') {
                meta.host = true;
            }
            else if (param instanceof Inject) {
                meta.token = param.token;
            }
            else if (param instanceof Attribute) {
                if (param.attributeName === undefined) {
                    throw new RuntimeError(204 /* RuntimeErrorCode.INVALID_INJECTION_TOKEN */, ngDevMode && `Attribute name must be defined.`);
                }
                meta.attribute = param.attributeName;
            }
            else {
                meta.token = param;
            }
        }
    }
    else if (dep === undefined || (Array.isArray(dep) && dep.length === 0)) {
        meta.token = null;
    }
    else {
        meta.token = dep;
    }
    return meta;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL2RpL2ppdC91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUdILE9BQU8sRUFBQyxZQUFZLEVBQW1CLE1BQU0sY0FBYyxDQUFDO0FBRTVELE9BQU8sRUFBQyxzQkFBc0IsRUFBQyxNQUFNLDBDQUEwQyxDQUFDO0FBQ2hGLE9BQU8sRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQ25FLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUUzQyxJQUFJLFFBQVEsR0FBZ0MsSUFBSSxDQUFDO0FBRWpELE1BQU0sVUFBVSxVQUFVO0lBQ3hCLE9BQU8sQ0FBQyxRQUFRLEdBQUcsUUFBUSxJQUFJLElBQUksc0JBQXNCLEVBQUUsQ0FBQyxDQUFDO0FBQy9ELENBQUM7QUFFRCxNQUFNLFVBQVUsbUJBQW1CLENBQUMsSUFBZTtJQUNqRCxPQUFPLG1CQUFtQixDQUFDLFVBQVUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQzVELENBQUM7QUFFRCxNQUFNLFVBQVUsbUJBQW1CLENBQUMsSUFBVztJQUM3QyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ2pELENBQUM7QUFFRCxTQUFTLGlCQUFpQixDQUFDLEdBQWM7SUFDdkMsTUFBTSxJQUFJLEdBQStCO1FBQ3ZDLEtBQUssRUFBRSxJQUFJO1FBQ1gsU0FBUyxFQUFFLElBQUk7UUFDZixJQUFJLEVBQUUsS0FBSztRQUNYLFFBQVEsRUFBRSxLQUFLO1FBQ2YsSUFBSSxFQUFFLEtBQUs7UUFDWCxRQUFRLEVBQUUsS0FBSztLQUNoQixDQUFDO0lBRUYsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1FBQ3hDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ25DLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNyQixJQUFJLEtBQUssS0FBSyxTQUFTLEVBQUU7Z0JBQ3ZCLDREQUE0RDtnQkFDNUQsU0FBUzthQUNWO1lBRUQsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUUzQyxJQUFJLEtBQUssWUFBWSxRQUFRLElBQUksS0FBSyxDQUFDLGNBQWMsS0FBSyxVQUFVLEVBQUU7Z0JBQ3BFLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO2FBQ3RCO2lCQUFNLElBQUksS0FBSyxZQUFZLFFBQVEsSUFBSSxLQUFLLENBQUMsY0FBYyxLQUFLLFVBQVUsRUFBRTtnQkFDM0UsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7YUFDdEI7aUJBQU0sSUFBSSxLQUFLLFlBQVksSUFBSSxJQUFJLEtBQUssQ0FBQyxjQUFjLEtBQUssTUFBTSxFQUFFO2dCQUNuRSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQzthQUNsQjtpQkFBTSxJQUFJLEtBQUssWUFBWSxJQUFJLElBQUksS0FBSyxDQUFDLGNBQWMsS0FBSyxNQUFNLEVBQUU7Z0JBQ25FLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO2FBQ2xCO2lCQUFNLElBQUksS0FBSyxZQUFZLE1BQU0sRUFBRTtnQkFDbEMsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO2FBQzFCO2lCQUFNLElBQUksS0FBSyxZQUFZLFNBQVMsRUFBRTtnQkFDckMsSUFBSSxLQUFLLENBQUMsYUFBYSxLQUFLLFNBQVMsRUFBRTtvQkFDckMsTUFBTSxJQUFJLFlBQVkscURBRWxCLFNBQVMsSUFBSSxpQ0FBaUMsQ0FBQyxDQUFDO2lCQUNyRDtnQkFDRCxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUM7YUFDdEM7aUJBQU07Z0JBQ0wsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7YUFDcEI7U0FDRjtLQUNGO1NBQU0sSUFBSSxHQUFHLEtBQUssU0FBUyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxFQUFFO1FBQ3hFLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0tBQ25CO1NBQU07UUFDTCxJQUFJLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztLQUNsQjtJQUNELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1IzRGVwZW5kZW5jeU1ldGFkYXRhRmFjYWRlfSBmcm9tICcuLi8uLi9jb21waWxlci9jb21waWxlcl9mYWNhZGUnO1xuaW1wb3J0IHtSdW50aW1lRXJyb3IsIFJ1bnRpbWVFcnJvckNvZGV9IGZyb20gJy4uLy4uL2Vycm9ycyc7XG5pbXBvcnQge1R5cGV9IGZyb20gJy4uLy4uL2ludGVyZmFjZS90eXBlJztcbmltcG9ydCB7UmVmbGVjdGlvbkNhcGFiaWxpdGllc30gZnJvbSAnLi4vLi4vcmVmbGVjdGlvbi9yZWZsZWN0aW9uX2NhcGFiaWxpdGllcyc7XG5pbXBvcnQge0hvc3QsIEluamVjdCwgT3B0aW9uYWwsIFNlbGYsIFNraXBTZWxmfSBmcm9tICcuLi9tZXRhZGF0YSc7XG5pbXBvcnQge0F0dHJpYnV0ZX0gZnJvbSAnLi4vbWV0YWRhdGFfYXR0cic7XG5cbmxldCBfcmVmbGVjdDogUmVmbGVjdGlvbkNhcGFiaWxpdGllc3xudWxsID0gbnVsbDtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldFJlZmxlY3QoKTogUmVmbGVjdGlvbkNhcGFiaWxpdGllcyB7XG4gIHJldHVybiAoX3JlZmxlY3QgPSBfcmVmbGVjdCB8fCBuZXcgUmVmbGVjdGlvbkNhcGFiaWxpdGllcygpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlZmxlY3REZXBlbmRlbmNpZXModHlwZTogVHlwZTxhbnk+KTogUjNEZXBlbmRlbmN5TWV0YWRhdGFGYWNhZGVbXSB7XG4gIHJldHVybiBjb252ZXJ0RGVwZW5kZW5jaWVzKGdldFJlZmxlY3QoKS5wYXJhbWV0ZXJzKHR5cGUpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnREZXBlbmRlbmNpZXMoZGVwczogYW55W10pOiBSM0RlcGVuZGVuY3lNZXRhZGF0YUZhY2FkZVtdIHtcbiAgcmV0dXJuIGRlcHMubWFwKGRlcCA9PiByZWZsZWN0RGVwZW5kZW5jeShkZXApKTtcbn1cblxuZnVuY3Rpb24gcmVmbGVjdERlcGVuZGVuY3koZGVwOiBhbnl8YW55W10pOiBSM0RlcGVuZGVuY3lNZXRhZGF0YUZhY2FkZSB7XG4gIGNvbnN0IG1ldGE6IFIzRGVwZW5kZW5jeU1ldGFkYXRhRmFjYWRlID0ge1xuICAgIHRva2VuOiBudWxsLFxuICAgIGF0dHJpYnV0ZTogbnVsbCxcbiAgICBob3N0OiBmYWxzZSxcbiAgICBvcHRpb25hbDogZmFsc2UsXG4gICAgc2VsZjogZmFsc2UsXG4gICAgc2tpcFNlbGY6IGZhbHNlLFxuICB9O1xuXG4gIGlmIChBcnJheS5pc0FycmF5KGRlcCkgJiYgZGVwLmxlbmd0aCA+IDApIHtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IGRlcC5sZW5ndGg7IGorKykge1xuICAgICAgY29uc3QgcGFyYW0gPSBkZXBbal07XG4gICAgICBpZiAocGFyYW0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAvLyBwYXJhbSBtYXkgYmUgdW5kZWZpbmVkIGlmIHR5cGUgb2YgZGVwIGlzIG5vdCBzZXQgYnkgbmd0c2NcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHBhcmFtKTtcblxuICAgICAgaWYgKHBhcmFtIGluc3RhbmNlb2YgT3B0aW9uYWwgfHwgcHJvdG8ubmdNZXRhZGF0YU5hbWUgPT09ICdPcHRpb25hbCcpIHtcbiAgICAgICAgbWV0YS5vcHRpb25hbCA9IHRydWU7XG4gICAgICB9IGVsc2UgaWYgKHBhcmFtIGluc3RhbmNlb2YgU2tpcFNlbGYgfHwgcHJvdG8ubmdNZXRhZGF0YU5hbWUgPT09ICdTa2lwU2VsZicpIHtcbiAgICAgICAgbWV0YS5za2lwU2VsZiA9IHRydWU7XG4gICAgICB9IGVsc2UgaWYgKHBhcmFtIGluc3RhbmNlb2YgU2VsZiB8fCBwcm90by5uZ01ldGFkYXRhTmFtZSA9PT0gJ1NlbGYnKSB7XG4gICAgICAgIG1ldGEuc2VsZiA9IHRydWU7XG4gICAgICB9IGVsc2UgaWYgKHBhcmFtIGluc3RhbmNlb2YgSG9zdCB8fCBwcm90by5uZ01ldGFkYXRhTmFtZSA9PT0gJ0hvc3QnKSB7XG4gICAgICAgIG1ldGEuaG9zdCA9IHRydWU7XG4gICAgICB9IGVsc2UgaWYgKHBhcmFtIGluc3RhbmNlb2YgSW5qZWN0KSB7XG4gICAgICAgIG1ldGEudG9rZW4gPSBwYXJhbS50b2tlbjtcbiAgICAgIH0gZWxzZSBpZiAocGFyYW0gaW5zdGFuY2VvZiBBdHRyaWJ1dGUpIHtcbiAgICAgICAgaWYgKHBhcmFtLmF0dHJpYnV0ZU5hbWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoXG4gICAgICAgICAgICAgIFJ1bnRpbWVFcnJvckNvZGUuSU5WQUxJRF9JTkpFQ1RJT05fVE9LRU4sXG4gICAgICAgICAgICAgIG5nRGV2TW9kZSAmJiBgQXR0cmlidXRlIG5hbWUgbXVzdCBiZSBkZWZpbmVkLmApO1xuICAgICAgICB9XG4gICAgICAgIG1ldGEuYXR0cmlidXRlID0gcGFyYW0uYXR0cmlidXRlTmFtZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1ldGEudG9rZW4gPSBwYXJhbTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAoZGVwID09PSB1bmRlZmluZWQgfHwgKEFycmF5LmlzQXJyYXkoZGVwKSAmJiBkZXAubGVuZ3RoID09PSAwKSkge1xuICAgIG1ldGEudG9rZW4gPSBudWxsO1xuICB9IGVsc2Uge1xuICAgIG1ldGEudG9rZW4gPSBkZXA7XG4gIH1cbiAgcmV0dXJuIG1ldGE7XG59XG4iXX0=