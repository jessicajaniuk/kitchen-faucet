/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ERROR_DETAILS_PAGE_BASE_URL } from './error_details_base_url';
/**
 * Class that represents a runtime error.
 * Formats and outputs the error message in a consistent way.
 *
 * Example:
 * ```
 *  throw new RuntimeError(
 *    RuntimeErrorCode.INJECTOR_ALREADY_DESTROYED,
 *    ngDevMode && 'Injector has already been destroyed.');
 * ```
 *
 * Note: the `message` argument contains a descriptive error message as a string in development
 * mode (when the `ngDevMode` is defined). In production mode (after tree-shaking pass), the
 * `message` argument becomes `false`, thus we account for it in the typings and the runtime logic.
 */
export class RuntimeError extends Error {
    constructor(code, message) {
        super(formatRuntimeError(code, message));
        this.code = code;
    }
}
/**
 * Called to format a runtime error.
 * See additional info on the `message` argument type in the `RuntimeError` class description.
 */
export function formatRuntimeError(code, message) {
    // Error code might be a negative number, which is a special marker that instructs the logic to
    // generate a link to the error details page on angular.io.
    // We also prepend `0` to non-compile-time errors.
    const fullCode = `NG0${Math.abs(code)}`;
    let errorMessage = `${fullCode}${message ? ': ' + message.trim() : ''}`;
    if (ngDevMode && code < 0) {
        const addPeriodSeparator = !errorMessage.match(/[.,;!?]$/);
        const separator = addPeriodSeparator ? '.' : '';
        errorMessage =
            `${errorMessage}${separator} Find more at ${ERROR_DETAILS_PAGE_BASE_URL}/${fullCode}`;
    }
    return errorMessage;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3JzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS9zcmMvZXJyb3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQywyQkFBMkIsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBK0VyRTs7Ozs7Ozs7Ozs7Ozs7R0FjRztBQUNILE1BQU0sT0FBTyxZQUFrRCxTQUFRLEtBQUs7SUFDMUUsWUFBbUIsSUFBTyxFQUFFLE9BQTBCO1FBQ3BELEtBQUssQ0FBQyxrQkFBa0IsQ0FBSSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUQzQixTQUFJLEdBQUosSUFBSSxDQUFHO0lBRTFCLENBQUM7Q0FDRjtBQUVEOzs7R0FHRztBQUNILE1BQU0sVUFBVSxrQkFBa0IsQ0FDOUIsSUFBTyxFQUFFLE9BQTBCO0lBQ3JDLCtGQUErRjtJQUMvRiwyREFBMkQ7SUFDM0Qsa0RBQWtEO0lBQ2xELE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO0lBRXhDLElBQUksWUFBWSxHQUFHLEdBQUcsUUFBUSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7SUFFeEUsSUFBSSxTQUFTLElBQUksSUFBSSxHQUFHLENBQUMsRUFBRTtRQUN6QixNQUFNLGtCQUFrQixHQUFHLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUMzRCxNQUFNLFNBQVMsR0FBRyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDaEQsWUFBWTtZQUNSLEdBQUcsWUFBWSxHQUFHLFNBQVMsaUJBQWlCLDJCQUEyQixJQUFJLFFBQVEsRUFBRSxDQUFDO0tBQzNGO0lBQ0QsT0FBTyxZQUFZLENBQUM7QUFDdEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0VSUk9SX0RFVEFJTFNfUEFHRV9CQVNFX1VSTH0gZnJvbSAnLi9lcnJvcl9kZXRhaWxzX2Jhc2VfdXJsJztcblxuLyoqXG4gKiBUaGUgbGlzdCBvZiBlcnJvciBjb2RlcyB1c2VkIGluIHJ1bnRpbWUgY29kZSBvZiB0aGUgYGNvcmVgIHBhY2thZ2UuXG4gKiBSZXNlcnZlZCBlcnJvciBjb2RlIHJhbmdlOiAxMDAtOTk5LlxuICpcbiAqIE5vdGU6IHRoZSBtaW51cyBzaWduIGRlbm90ZXMgdGhlIGZhY3QgdGhhdCBhIHBhcnRpY3VsYXIgY29kZSBoYXMgYSBkZXRhaWxlZCBndWlkZSBvblxuICogYW5ndWxhci5pby4gVGhpcyBleHRyYSBhbm5vdGF0aW9uIGlzIG5lZWRlZCB0byBhdm9pZCBpbnRyb2R1Y2luZyBhIHNlcGFyYXRlIHNldCB0byBzdG9yZVxuICogZXJyb3IgY29kZXMgd2hpY2ggaGF2ZSBndWlkZXMsIHdoaWNoIG1pZ2h0IGxlYWsgaW50byBydW50aW1lIGNvZGUuXG4gKlxuICogRnVsbCBsaXN0IG9mIGF2YWlsYWJsZSBlcnJvciBndWlkZXMgY2FuIGJlIGZvdW5kIGF0IGh0dHBzOi8vYW5ndWxhci5pby9lcnJvcnMuXG4gKi9cbmV4cG9ydCBjb25zdCBlbnVtIFJ1bnRpbWVFcnJvckNvZGUge1xuICAvLyBDaGFuZ2UgRGV0ZWN0aW9uIEVycm9yc1xuICBFWFBSRVNTSU9OX0NIQU5HRURfQUZURVJfQ0hFQ0tFRCA9IC0xMDAsXG4gIFJFQ1VSU0lWRV9BUFBMSUNBVElPTl9SRUZfVElDSyA9IDEwMSxcblxuICAvLyBEZXBlbmRlbmN5IEluamVjdGlvbiBFcnJvcnNcbiAgQ1lDTElDX0RJX0RFUEVOREVOQ1kgPSAtMjAwLFxuICBQUk9WSURFUl9OT1RfRk9VTkQgPSAtMjAxLFxuICBJTlZBTElEX0ZBQ1RPUllfREVQRU5ERU5DWSA9IDIwMixcbiAgTUlTU0lOR19JTkpFQ1RJT05fQ09OVEVYVCA9IC0yMDMsXG4gIElOVkFMSURfSU5KRUNUSU9OX1RPS0VOID0gMjA0LFxuICBJTkpFQ1RPUl9BTFJFQURZX0RFU1RST1lFRCA9IDIwNSxcbiAgUFJPVklERVJfSU5fV1JPTkdfQ09OVEVYVCA9IDIwNyxcbiAgTUlTU0lOR19JTkpFQ1RJT05fVE9LRU4gPSAyMDgsXG4gIElOVkFMSURfTVVMVElfUFJPVklERVIgPSAyMDksXG5cbiAgLy8gVGVtcGxhdGUgRXJyb3JzXG4gIE1VTFRJUExFX0NPTVBPTkVOVFNfTUFUQ0ggPSAtMzAwLFxuICBFWFBPUlRfTk9UX0ZPVU5EID0gLTMwMSxcbiAgUElQRV9OT1RfRk9VTkQgPSAtMzAyLFxuICBVTktOT1dOX0JJTkRJTkcgPSAzMDMsXG4gIFVOS05PV05fRUxFTUVOVCA9IDMwNCxcbiAgVEVNUExBVEVfU1RSVUNUVVJFX0VSUk9SID0gMzA1LFxuICBJTlZBTElEX0VWRU5UX0JJTkRJTkcgPSAzMDYsXG4gIEhPU1RfRElSRUNUSVZFX1VOUkVTT0xWQUJMRSA9IDMwNyxcbiAgSE9TVF9ESVJFQ1RJVkVfTk9UX1NUQU5EQUxPTkUgPSAzMDgsXG4gIERVUExJQ0FURV9ESVJFQ1RJVFZFID0gMzA5LFxuICBIT1NUX0RJUkVDVElWRV9DT01QT05FTlQgPSAzMTAsXG4gIEhPU1RfRElSRUNUSVZFX1VOREVGSU5FRF9CSU5ESU5HID0gMzExLFxuICBIT1NUX0RJUkVDVElWRV9DT05GTElDVElOR19BTElBUyA9IDMxMixcblxuICAvLyBCb290c3RyYXAgRXJyb3JzXG4gIE1VTFRJUExFX1BMQVRGT1JNUyA9IDQwMCxcbiAgUExBVEZPUk1fTk9UX0ZPVU5EID0gNDAxLFxuICBFUlJPUl9IQU5ETEVSX05PVF9GT1VORCA9IDQwMixcbiAgQk9PVFNUUkFQX0NPTVBPTkVOVFNfTk9UX0ZPVU5EID0gNDAzLFxuICBQTEFURk9STV9BTFJFQURZX0RFU1RST1lFRCA9IDQwNCxcbiAgQVNZTkNfSU5JVElBTElaRVJTX1NUSUxMX1JVTk5JTkcgPSA0MDUsXG4gIEFQUExJQ0FUSU9OX1JFRl9BTFJFQURZX0RFU1RST1lFRCA9IDQwNixcbiAgUkVOREVSRVJfTk9UX0ZPVU5EID0gNDA3LFxuXG4gIC8vIFN0eWxpbmcgRXJyb3JzXG5cbiAgLy8gRGVjbGFyYXRpb25zIEVycm9yc1xuXG4gIC8vIGkxOG4gRXJyb3JzXG4gIElOVkFMSURfSTE4Tl9TVFJVQ1RVUkUgPSA3MDAsXG4gIE1JU1NJTkdfTE9DQUxFX0RBVEEgPSA3MDEsXG5cbiAgLy8gc3RhbmRhbG9uZSBlcnJvcnNcbiAgSU1QT1JUX1BST1ZJREVSU19GUk9NX1NUQU5EQUxPTkUgPSA4MDAsXG5cbiAgLy8gSklUIENvbXBpbGF0aW9uIEVycm9yc1xuICAvLyBPdGhlclxuICBJTlZBTElEX0RJRkZFUl9JTlBVVCA9IDkwMCxcbiAgTk9fU1VQUE9SVElOR19ESUZGRVJfRkFDVE9SWSA9IDkwMSxcbiAgVklFV19BTFJFQURZX0FUVEFDSEVEID0gOTAyLFxuICBJTlZBTElEX0lOSEVSSVRBTkNFID0gOTAzLFxuICBVTlNBRkVfVkFMVUVfSU5fUkVTT1VSQ0VfVVJMID0gOTA0LFxuICBVTlNBRkVfVkFMVUVfSU5fU0NSSVBUID0gOTA1LFxuICBNSVNTSU5HX0dFTkVSQVRFRF9ERUYgPSA5MDYsXG4gIFRZUEVfSVNfTk9UX1NUQU5EQUxPTkUgPSA5MDcsXG4gIE1JU1NJTkdfWk9ORUpTID0gOTA4LFxuICBVTkVYUEVDVEVEX1pPTkVfU1RBVEUgPSA5MDksXG4gIFVOU0FGRV9JRlJBTUVfQVRUUlMgPSAtOTEwLFxufVxuXG4vKipcbiAqIENsYXNzIHRoYXQgcmVwcmVzZW50cyBhIHJ1bnRpbWUgZXJyb3IuXG4gKiBGb3JtYXRzIGFuZCBvdXRwdXRzIHRoZSBlcnJvciBtZXNzYWdlIGluIGEgY29uc2lzdGVudCB3YXkuXG4gKlxuICogRXhhbXBsZTpcbiAqIGBgYFxuICogIHRocm93IG5ldyBSdW50aW1lRXJyb3IoXG4gKiAgICBSdW50aW1lRXJyb3JDb2RlLklOSkVDVE9SX0FMUkVBRFlfREVTVFJPWUVELFxuICogICAgbmdEZXZNb2RlICYmICdJbmplY3RvciBoYXMgYWxyZWFkeSBiZWVuIGRlc3Ryb3llZC4nKTtcbiAqIGBgYFxuICpcbiAqIE5vdGU6IHRoZSBgbWVzc2FnZWAgYXJndW1lbnQgY29udGFpbnMgYSBkZXNjcmlwdGl2ZSBlcnJvciBtZXNzYWdlIGFzIGEgc3RyaW5nIGluIGRldmVsb3BtZW50XG4gKiBtb2RlICh3aGVuIHRoZSBgbmdEZXZNb2RlYCBpcyBkZWZpbmVkKS4gSW4gcHJvZHVjdGlvbiBtb2RlIChhZnRlciB0cmVlLXNoYWtpbmcgcGFzcyksIHRoZVxuICogYG1lc3NhZ2VgIGFyZ3VtZW50IGJlY29tZXMgYGZhbHNlYCwgdGh1cyB3ZSBhY2NvdW50IGZvciBpdCBpbiB0aGUgdHlwaW5ncyBhbmQgdGhlIHJ1bnRpbWUgbG9naWMuXG4gKi9cbmV4cG9ydCBjbGFzcyBSdW50aW1lRXJyb3I8VCBleHRlbmRzIG51bWJlciA9IFJ1bnRpbWVFcnJvckNvZGU+IGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgY29kZTogVCwgbWVzc2FnZTogbnVsbHxmYWxzZXxzdHJpbmcpIHtcbiAgICBzdXBlcihmb3JtYXRSdW50aW1lRXJyb3I8VD4oY29kZSwgbWVzc2FnZSkpO1xuICB9XG59XG5cbi8qKlxuICogQ2FsbGVkIHRvIGZvcm1hdCBhIHJ1bnRpbWUgZXJyb3IuXG4gKiBTZWUgYWRkaXRpb25hbCBpbmZvIG9uIHRoZSBgbWVzc2FnZWAgYXJndW1lbnQgdHlwZSBpbiB0aGUgYFJ1bnRpbWVFcnJvcmAgY2xhc3MgZGVzY3JpcHRpb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRSdW50aW1lRXJyb3I8VCBleHRlbmRzIG51bWJlciA9IFJ1bnRpbWVFcnJvckNvZGU+KFxuICAgIGNvZGU6IFQsIG1lc3NhZ2U6IG51bGx8ZmFsc2V8c3RyaW5nKTogc3RyaW5nIHtcbiAgLy8gRXJyb3IgY29kZSBtaWdodCBiZSBhIG5lZ2F0aXZlIG51bWJlciwgd2hpY2ggaXMgYSBzcGVjaWFsIG1hcmtlciB0aGF0IGluc3RydWN0cyB0aGUgbG9naWMgdG9cbiAgLy8gZ2VuZXJhdGUgYSBsaW5rIHRvIHRoZSBlcnJvciBkZXRhaWxzIHBhZ2Ugb24gYW5ndWxhci5pby5cbiAgLy8gV2UgYWxzbyBwcmVwZW5kIGAwYCB0byBub24tY29tcGlsZS10aW1lIGVycm9ycy5cbiAgY29uc3QgZnVsbENvZGUgPSBgTkcwJHtNYXRoLmFicyhjb2RlKX1gO1xuXG4gIGxldCBlcnJvck1lc3NhZ2UgPSBgJHtmdWxsQ29kZX0ke21lc3NhZ2UgPyAnOiAnICsgbWVzc2FnZS50cmltKCkgOiAnJ31gO1xuXG4gIGlmIChuZ0Rldk1vZGUgJiYgY29kZSA8IDApIHtcbiAgICBjb25zdCBhZGRQZXJpb2RTZXBhcmF0b3IgPSAhZXJyb3JNZXNzYWdlLm1hdGNoKC9bLiw7IT9dJC8pO1xuICAgIGNvbnN0IHNlcGFyYXRvciA9IGFkZFBlcmlvZFNlcGFyYXRvciA/ICcuJyA6ICcnO1xuICAgIGVycm9yTWVzc2FnZSA9XG4gICAgICAgIGAke2Vycm9yTWVzc2FnZX0ke3NlcGFyYXRvcn0gRmluZCBtb3JlIGF0ICR7RVJST1JfREVUQUlMU19QQUdFX0JBU0VfVVJMfS8ke2Z1bGxDb2RlfWA7XG4gIH1cbiAgcmV0dXJuIGVycm9yTWVzc2FnZTtcbn1cbiJdfQ==