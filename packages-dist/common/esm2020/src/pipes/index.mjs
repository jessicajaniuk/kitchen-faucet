/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @module
 * @description
 * This module provides a set of common Pipes.
 */
import { AsyncPipe } from './async_pipe';
import { LowerCasePipe, TitleCasePipe, UpperCasePipe } from './case_conversion_pipes';
import { DATE_PIPE_DEFAULT_OPTIONS, DATE_PIPE_DEFAULT_TIMEZONE, DatePipe } from './date_pipe';
import { I18nPluralPipe } from './i18n_plural_pipe';
import { I18nSelectPipe } from './i18n_select_pipe';
import { JsonPipe } from './json_pipe';
import { KeyValuePipe } from './keyvalue_pipe';
import { CurrencyPipe, DecimalPipe, PercentPipe } from './number_pipe';
import { SlicePipe } from './slice_pipe';
export { AsyncPipe, CurrencyPipe, DATE_PIPE_DEFAULT_OPTIONS, DATE_PIPE_DEFAULT_TIMEZONE, DatePipe, DecimalPipe, I18nPluralPipe, I18nSelectPipe, JsonPipe, KeyValuePipe, LowerCasePipe, PercentPipe, SlicePipe, TitleCasePipe, UpperCasePipe, };
/**
 * A collection of Angular pipes that are likely to be used in each and every application.
 */
export const COMMON_PIPES = [
    AsyncPipe,
    UpperCasePipe,
    LowerCasePipe,
    JsonPipe,
    SlicePipe,
    DecimalPipe,
    PercentPipe,
    TitleCasePipe,
    CurrencyPipe,
    DatePipe,
    I18nPluralPipe,
    I18nSelectPipe,
    KeyValuePipe,
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21tb24vc3JjL3BpcGVzL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVIOzs7O0dBSUc7QUFDSCxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxhQUFhLEVBQUUsYUFBYSxFQUFFLGFBQWEsRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBQ3BGLE9BQU8sRUFBQyx5QkFBeUIsRUFBRSwwQkFBMEIsRUFBRSxRQUFRLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFFNUYsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ2xELE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUNsRCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQ3JDLE9BQU8sRUFBVyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUN2RCxPQUFPLEVBQUMsWUFBWSxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDckUsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUV2QyxPQUFPLEVBQ0wsU0FBUyxFQUNULFlBQVksRUFDWix5QkFBeUIsRUFDekIsMEJBQTBCLEVBQzFCLFFBQVEsRUFFUixXQUFXLEVBQ1gsY0FBYyxFQUNkLGNBQWMsRUFDZCxRQUFRLEVBRVIsWUFBWSxFQUNaLGFBQWEsRUFDYixXQUFXLEVBQ1gsU0FBUyxFQUNULGFBQWEsRUFDYixhQUFhLEdBQ2QsQ0FBQztBQUdGOztHQUVHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sWUFBWSxHQUFHO0lBQzFCLFNBQVM7SUFDVCxhQUFhO0lBQ2IsYUFBYTtJQUNiLFFBQVE7SUFDUixTQUFTO0lBQ1QsV0FBVztJQUNYLFdBQVc7SUFDWCxhQUFhO0lBQ2IsWUFBWTtJQUNaLFFBQVE7SUFDUixjQUFjO0lBQ2QsY0FBYztJQUNkLFlBQVk7Q0FDYixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8qKlxuICogQG1vZHVsZVxuICogQGRlc2NyaXB0aW9uXG4gKiBUaGlzIG1vZHVsZSBwcm92aWRlcyBhIHNldCBvZiBjb21tb24gUGlwZXMuXG4gKi9cbmltcG9ydCB7QXN5bmNQaXBlfSBmcm9tICcuL2FzeW5jX3BpcGUnO1xuaW1wb3J0IHtMb3dlckNhc2VQaXBlLCBUaXRsZUNhc2VQaXBlLCBVcHBlckNhc2VQaXBlfSBmcm9tICcuL2Nhc2VfY29udmVyc2lvbl9waXBlcyc7XG5pbXBvcnQge0RBVEVfUElQRV9ERUZBVUxUX09QVElPTlMsIERBVEVfUElQRV9ERUZBVUxUX1RJTUVaT05FLCBEYXRlUGlwZX0gZnJvbSAnLi9kYXRlX3BpcGUnO1xuaW1wb3J0IHtEYXRlUGlwZUNvbmZpZ30gZnJvbSAnLi9kYXRlX3BpcGVfY29uZmlnJztcbmltcG9ydCB7STE4blBsdXJhbFBpcGV9IGZyb20gJy4vaTE4bl9wbHVyYWxfcGlwZSc7XG5pbXBvcnQge0kxOG5TZWxlY3RQaXBlfSBmcm9tICcuL2kxOG5fc2VsZWN0X3BpcGUnO1xuaW1wb3J0IHtKc29uUGlwZX0gZnJvbSAnLi9qc29uX3BpcGUnO1xuaW1wb3J0IHtLZXlWYWx1ZSwgS2V5VmFsdWVQaXBlfSBmcm9tICcuL2tleXZhbHVlX3BpcGUnO1xuaW1wb3J0IHtDdXJyZW5jeVBpcGUsIERlY2ltYWxQaXBlLCBQZXJjZW50UGlwZX0gZnJvbSAnLi9udW1iZXJfcGlwZSc7XG5pbXBvcnQge1NsaWNlUGlwZX0gZnJvbSAnLi9zbGljZV9waXBlJztcblxuZXhwb3J0IHtcbiAgQXN5bmNQaXBlLFxuICBDdXJyZW5jeVBpcGUsXG4gIERBVEVfUElQRV9ERUZBVUxUX09QVElPTlMsXG4gIERBVEVfUElQRV9ERUZBVUxUX1RJTUVaT05FLFxuICBEYXRlUGlwZSxcbiAgRGF0ZVBpcGVDb25maWcsXG4gIERlY2ltYWxQaXBlLFxuICBJMThuUGx1cmFsUGlwZSxcbiAgSTE4blNlbGVjdFBpcGUsXG4gIEpzb25QaXBlLFxuICBLZXlWYWx1ZSxcbiAgS2V5VmFsdWVQaXBlLFxuICBMb3dlckNhc2VQaXBlLFxuICBQZXJjZW50UGlwZSxcbiAgU2xpY2VQaXBlLFxuICBUaXRsZUNhc2VQaXBlLFxuICBVcHBlckNhc2VQaXBlLFxufTtcblxuXG4vKipcbiAqIEEgY29sbGVjdGlvbiBvZiBBbmd1bGFyIHBpcGVzIHRoYXQgYXJlIGxpa2VseSB0byBiZSB1c2VkIGluIGVhY2ggYW5kIGV2ZXJ5IGFwcGxpY2F0aW9uLlxuICovXG5leHBvcnQgY29uc3QgQ09NTU9OX1BJUEVTID0gW1xuICBBc3luY1BpcGUsXG4gIFVwcGVyQ2FzZVBpcGUsXG4gIExvd2VyQ2FzZVBpcGUsXG4gIEpzb25QaXBlLFxuICBTbGljZVBpcGUsXG4gIERlY2ltYWxQaXBlLFxuICBQZXJjZW50UGlwZSxcbiAgVGl0bGVDYXNlUGlwZSxcbiAgQ3VycmVuY3lQaXBlLFxuICBEYXRlUGlwZSxcbiAgSTE4blBsdXJhbFBpcGUsXG4gIEkxOG5TZWxlY3RQaXBlLFxuICBLZXlWYWx1ZVBpcGUsXG5dO1xuIl19