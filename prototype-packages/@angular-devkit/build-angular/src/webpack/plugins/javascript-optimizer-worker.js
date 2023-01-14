"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const remapping_1 = __importDefault(require("@ampproject/remapping"));
const terser_1 = require("terser");
const esbuild_executor_1 = require("./esbuild-executor");
/**
 * The cached esbuild executor.
 * This will automatically use the native or WASM version based on platform and availability
 * with the native version given priority due to its superior performance.
 */
let esbuild;
/**
 * Handles optimization requests sent from the main thread via the `JavaScriptOptimizerPlugin`.
 */
async function default_1({ asset, options }) {
    // esbuild is used as a first pass
    const esbuildResult = await optimizeWithEsbuild(asset.code, asset.name, options);
    if (isEsBuildFailure(esbuildResult)) {
        return {
            name: asset.name,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            errors: await esbuild.formatMessages(esbuildResult.errors, { kind: 'error' }),
        };
    }
    // terser is used as a second pass
    const terserResult = await optimizeWithTerser(asset.name, esbuildResult.code, options.sourcemap, options.advanced);
    // Merge intermediate sourcemaps with input sourcemap if enabled
    let fullSourcemap;
    if (options.sourcemap) {
        const partialSourcemaps = [];
        if (esbuildResult.map) {
            partialSourcemaps.unshift(JSON.parse(esbuildResult.map));
        }
        if (terserResult.map) {
            partialSourcemaps.unshift(terserResult.map);
        }
        if (asset.map) {
            partialSourcemaps.push(asset.map);
        }
        fullSourcemap = (0, remapping_1.default)(partialSourcemaps, () => null);
    }
    return { name: asset.name, code: terserResult.code, map: fullSourcemap };
}
exports.default = default_1;
/**
 * Optimizes a JavaScript asset using esbuild.
 *
 * @param content The JavaScript asset source content to optimize.
 * @param name The name of the JavaScript asset. Used to generate source maps.
 * @param options The optimization request options to apply to the content.
 * @returns A promise that resolves with the optimized code, source map, and any warnings.
 */
async function optimizeWithEsbuild(content, name, options) {
    if (!esbuild) {
        esbuild = new esbuild_executor_1.EsbuildExecutor(options.alwaysUseWasm);
    }
    try {
        return await esbuild.transform(content, {
            minifyIdentifiers: !options.keepIdentifierNames,
            minifySyntax: true,
            // NOTE: Disabling whitespace ensures unused pure annotations are kept
            minifyWhitespace: false,
            pure: ['forwardRef'],
            legalComments: options.removeLicenses ? 'none' : 'inline',
            sourcefile: name,
            sourcemap: options.sourcemap && 'external',
            define: options.define,
            // This option should always be disabled for browser builds as we don't rely on `.name`
            // and causes deadcode to be retained which makes `NG_BUILD_MANGLE` unusable to investigate tree-shaking issues.
            // We enable `keepNames` only for server builds as Domino relies on `.name`.
            // Once we no longer rely on Domino for SSR we should be able to remove this.
            keepNames: options.keepNames,
            target: options.target,
        });
    }
    catch (error) {
        if (isEsBuildFailure(error)) {
            return error;
        }
        throw error;
    }
}
/**
 * Optimizes a JavaScript asset using terser.
 *
 * @param name The name of the JavaScript asset. Used to generate source maps.
 * @param code The JavaScript asset source content to optimize.
 * @param sourcemaps If true, generate an output source map for the optimized code.
 * @param advanced Controls advanced optimizations.
 * @returns A promise that resolves with the optimized code and source map.
 */
async function optimizeWithTerser(name, code, sourcemaps, advanced) {
    const result = await (0, terser_1.minify)({ [name]: code }, {
        compress: {
            passes: advanced ? 2 : 1,
            pure_getters: advanced,
        },
        // Set to ES2015 to prevent higher level features from being introduced when browserslist
        // contains older browsers. The build system requires browsers to support ES2015 at a minimum.
        ecma: 2015,
        // esbuild in the first pass is used to minify identifiers instead of mangle here
        mangle: false,
        // esbuild in the first pass is used to minify function names
        keep_fnames: true,
        format: {
            // ASCII output is enabled here as well to prevent terser from converting back to UTF-8
            ascii_only: true,
            wrap_func_args: false,
        },
        sourceMap: sourcemaps &&
            {
                asObject: true,
                // typings don't include asObject option
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            },
    });
    if (!result.code) {
        throw new Error('Terser failed for unknown reason.');
    }
    return { code: result.code, map: result.map };
}
/**
 * Determines if an unknown value is an esbuild BuildFailure error object thrown by esbuild.
 * @param value A potential esbuild BuildFailure error object.
 * @returns `true` if the object is determined to be a BuildFailure object; otherwise, `false`.
 */
function isEsBuildFailure(value) {
    return !!value && typeof value === 'object' && 'errors' in value && 'warnings' in value;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiamF2YXNjcmlwdC1vcHRpbWl6ZXItd29ya2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvYW5ndWxhcl9kZXZraXQvYnVpbGRfYW5ndWxhci9zcmMvd2VicGFjay9wbHVnaW5zL2phdmFzY3JpcHQtb3B0aW1pemVyLXdvcmtlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7OztBQUVILHNFQUE4QztBQUU5QyxtQ0FBZ0M7QUFDaEMseURBQXFEO0FBOEVyRDs7OztHQUlHO0FBQ0gsSUFBSSxPQUFvQyxDQUFDO0FBRXpDOztHQUVHO0FBQ1ksS0FBSyxvQkFBVyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQW1CO0lBQ2hFLGtDQUFrQztJQUNsQyxNQUFNLGFBQWEsR0FBRyxNQUFNLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNqRixJQUFJLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxFQUFFO1FBQ25DLE9BQU87WUFDTCxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7WUFDaEIsb0VBQW9FO1lBQ3BFLE1BQU0sRUFBRSxNQUFNLE9BQVEsQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsQ0FBQztTQUMvRSxDQUFDO0tBQ0g7SUFFRCxrQ0FBa0M7SUFDbEMsTUFBTSxZQUFZLEdBQUcsTUFBTSxrQkFBa0IsQ0FDM0MsS0FBSyxDQUFDLElBQUksRUFDVixhQUFhLENBQUMsSUFBSSxFQUNsQixPQUFPLENBQUMsU0FBUyxFQUNqQixPQUFPLENBQUMsUUFBUSxDQUNqQixDQUFDO0lBRUYsZ0VBQWdFO0lBQ2hFLElBQUksYUFBYSxDQUFDO0lBQ2xCLElBQUksT0FBTyxDQUFDLFNBQVMsRUFBRTtRQUNyQixNQUFNLGlCQUFpQixHQUFH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QUNaLENBQ0YsQ0FBQztJQUVGLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFO1FBQ2hCLE1BQU0sSUFBSSxLQUFLLENBQUMsbUNBQW1DLENBQUMsQ0FBQztLQUN0RDtJQUVELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsTUFBTSxDQUFDLEdBQWEsRUFBRSxDQUFDO0FBQzFELENBQUM7QUFFRDs7OztHQUlHO0FBQ0gsU0FBUyxnQkFBZ0IsQ0FBQyxLQUFjO0lBQ3RDLE9BQU8sQ0FBQyxDQUFDLEtBQUssSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLElBQUksUUFBUSxJQUFJLEtBQUssSUFBSSxVQUFVLElBQUksS0FBSyxDQUFDO0FBQzFGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHJlbWFwcGluZyBmcm9tICdAYW1wcHJvamVjdC9yZW1hcHBpbmcnO1xuaW1wb3J0IHR5cGUgeyBCdWlsZEZhaWx1cmUsIFRyYW5zZm9ybVJlc3VsdCB9IGZyb20gJ2VzYnVpbGQnO1xuaW1wb3J0IHsgbWluaWZ5IH0gZnJvbSAndGVyc2VyJztcbmltcG9ydCB7IEVzYnVpbGRFeGVjdXRvciB9IGZyb20gJy4vZXNidWlsZC1leGVjdXRvcic7XG5cbi8qKlxuICogVGhlIG9wdGlvbnMgdG8gdXNlIHdoZW4gb3B0aW1pemluZy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBPcHRpbWl6ZVJlcXVlc3RPcHRpb25zIHtcbiAgLyoqXG4gICAqIENvbnRyb2xzIGFkdmFuY2VkIG9wdGltaXphdGlvbnMuXG4gICAqIEN1cnJlbnRseSB0aGVzZSBhcmUgb25seSB0ZXJzZXIgcmVsYXRlZDpcbiAgICogKiB0ZXJzZXIgY29tcHJlc3MgcGFzc2VzIGFyZSBzZXQgdG8gMlxuICAgKiAqIHRlcnNlciBwdXJlX2dldHRlcnMgb3B0aW9uIGlzIGVuYWJsZWRcbiAgICovXG4gIGFkdmFuY2VkPzogYm9vbGVhbjtcbiAgLyoqXG4gICAqIFNwZWNpZmllcyB0aGUgc3RyaW5nIHRva2VucyB0aGF0IHNob3VsZCBiZSByZXBsYWNlZCB3aXRoIGEgZGVmaW5lZCB2YWx1ZS5cbiAgICovXG4gIGRlZmluZT86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIC8qKlxuICAgKiBDb250cm9scyB3aGV0aGVyIGNsYXNzLCBmdW5jdGlvbiwgYW5kIHZhcmlhYmxlIG5hbWVzIHNob3VsZCBiZSBsZWZ0IGludGFjdFxuICAgKiB0aHJvdWdob3V0IHRoZSBvdXRwdXQgY29kZS5cbiAgICovXG4gIGtlZXBJZGVudGlmaWVyTmFtZXM6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIENvbnRyb2xzIHdoZXRoZXIgdG8gcmV0YWluIHRoZSBvcmlnaW5hbCBuYW1lIG9mIGNsYXNzZXMgYW5kIGZ1bmN0aW9ucy5cbiAgICovXG4gIGtlZXBOYW1lczogYm9vbGVhbjtcbiAgLyoqXG4gICAqIENvbnRyb2xzIHdoZXRoZXIgbGljZW5zZSB0ZXh0IGlzIHJlbW92ZWQgZnJvbSB0aGUgb3V0cHV0IGNvZGUuXG4gICAqIFdpdGhpbiB0aGUgQ0xJLCB0aGlzIG9wdGlvbiBpcyBsaW5rZWQgdG8gdGhlIGxpY2Vuc2UgZXh0cmFjdGlvbiBmdW5jdGlvbmFsaXR5LlxuICAgKi9cbiAgcmVtb3ZlTGljZW5zZXM/OiBib29sZWFuO1xuICAvKipcbiAgICogQ29udHJvbHMgd2hldGhlciBzb3VyY2UgbWFwcyBzaG91bGQgYmUgZ2VuZXJhdGVkLlxuICAgKi9cbiAgc291cmNlbWFwPzogYm9vbGVhbjtcbiAgLyoqXG4gICAqIFNwZWNpZmllcyB0aGUgbGlzdCBvZiBzdXBwb3J0ZWQgZXNidWlsZCB0YXJnZXRzLlxuICAgKiBAc2VlOiBodHRwczovL2VzYnVpbGQuZ2l0aHViLmlvL2FwaS8jdGFyZ2V0XG4gICAqL1xuICB0YXJnZXQ/OiBzdHJpbmdbXTtcbiAgLyoqXG4gICAqIENvbnRyb2xzIHdoZXRoZXIgZXNidWlsZCBzaG91bGQgb25seSB1c2UgdGhlIFdBU00tdmFyaWFudCBpbnN0ZWFkIG9mIHRyeWluZyB0b1xuICAgKiB1c2UgdGhlIG5hdGl2ZSB2YXJpYW50LiBTb21lIHBsYXRmb3JtcyBtYXkgbm90IHN1cHBvcnQgdGhlIG5hdGl2ZS12YXJpYW50IGFuZFxuICAgKiB0aGlzIG9wdGlvbiBhbGxvd3Mgb25lIHN1cHBvcnQgdGVzdCB0byBiZSBjb25kdWN0ZWQgcHJpb3IgdG8gYWxsIHRoZSB3b3JrZXJzIHN0YXJ0aW5nLlxuICAgKi9cbiAgYWx3YXlzVXNlV2FzbTogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBBIHJlcXVlc3QgdG8gb3B0aW1pemUgSmF2YVNjcmlwdCB1c2luZyB0aGUgc3VwcGxpZWQgb3B0aW9ucy5cbiAqL1xuaW50ZXJmYWNlIE9wdGltaXplUmVxdWVzdCB7XG4gIC8qKlxuICAgKiBUaGUgb3B0aW9ucyB0byB1c2Ugd2hlbiBvcHRpbWl6aW5nLlxuICAgKi9cbiAgb3B0aW9uczogT3B0aW1pemVSZXF1ZXN0T3B0aW9ucztcblxuICAvKipcbiAgICogVGhlIEphdmFTY3JpcHQgYXNzZXQgdG8gb3B0aW1pemUuXG4gICAqL1xuICBhc3NldDoge1xuICAgIC8qKlxuICAgICAqIFRoZSBuYW1lIG9mIHRoZSBKYXZhU2NyaXB0IGFzc2V0ICh0eXBpY2FsbHkgdGhlIGZpbGVuYW1lKS5cbiAgICAgKi9cbiAgICBuYW1lOiBzdHJpbmc7XG4gICAgLyoqXG4gICAgICogVGhlIHNvdXJjZSBjb250ZW50IG9mIHRoZSBKYXZhU2NyaXB0IGFzc2V0LlxuICAgICAqL1xuICAgIGNvZGU6IHN0cmluZztcbiAgICAvKipcbiAgICAgKiBUaGUgc291cmNlIG1hcCBvZiB0aGUgSmF2YVNjcmlwdCBhc3NldCwgaWYgYXZhaWxhYmxlLlxuICAgICAqIFRoaXMgbWFwIGlzIG1lcmdlZCB3aXRoIGFsbCBpbnRlcm1lZGlhdGUgc291cmNlIG1hcHMgZHVyaW5nIG9wdGltaXphdGlvbi5cbiAgICAgKi9cbiAgICBtYXA6IG9iamVjdDtcbiAgfTtcbn1cblxuLyoqXG4gKiBUaGUgY2FjaGVkIGVzYnVpbGQgZXhlY3V0b3IuXG4gKiBUaGlzIHdpbGwgYXV0b21hdGljYWxseSB1c2UgdGhlIG5hdGl2ZSBvciBXQVNNIHZlcnNpb24gYmFzZWQgb24gcGxhdGZvcm0gYW5kIGF2YWlsYWJpbGl0eVxuICogd2l0aCB0aGUgbmF0aXZlIHZlcnNpb24gZ2l2ZW4gcHJpb3JpdHkgZHVlIHRvIGl0cyBzdXBlcmlvciBwZXJmb3JtYW5jZS5cbiAqL1xubGV0IGVzYnVpbGQ6IEVzYnVpbGRFeGVjdXRvciB8IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBIYW5kbGVzIG9wdGltaXphdGlvbiByZXF1ZXN0cyBzZW50IGZyb20gdGhlIG1haW4gdGhyZWFkIHZpYSB0aGUgYEphdmFTY3JpcHRPcHRpbWl6ZXJQbHVnaW5gLlxuICovXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiAoeyBhc3NldCwgb3B0aW9ucyB9OiBPcHRpbWl6ZVJlcXVlc3QpIHtcbiAgLy8gZXNidWlsZCBpcyB1c2VkIGFzIGEgZmlyc3QgcGFzc1xuICBjb25zdCBlc2J1aWxkUmVzdWx0ID0gYXdhaXQgb3B0aW1pemVXaXRoRXNidWlsZChhc3NldC5jb2RlLCBhc3NldC5uYW1lLCBvcHRpb25zKTtcbiAgaWYgKGlzRXNCdWlsZEZhaWx1cmUoZXNidWlsZFJlc3VsdCkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogYXNzZXQubmFtZSxcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tbm9uLW51bGwtYXNzZXJ0aW9uXG4gICAgICBlcnJvcnM6IGF3YWl0IGVzYnVpbGQhLmZvcm1hdE1lc3NhZ2VzKGVzYnVpbGRSZXN1bHQuZXJyb3JzLCB7IGtpbmQ6ICdlcnJvcicgfSksXG4gICAgfTtcbiAgfVxuXG4gIC8vIHRlcnNlciBpcyB1c2VkIGFzIGEgc2Vjb25kIHBhc3NcbiAgY29uc3QgdGVyc2VyUmVzdWx0ID0gYXdhaXQgb3B0aW1pemVXaXRoVGVyc2VyKFxuICAgIGFzc2V0Lm5hbWUsXG4gICAgZXNidWlsZFJlc3VsdC5jb2RlLFxuICAgIG9wdGlvbnMuc291cmNlbWFwLFxuICAgIG9wdGlvbnMuYWR2YW5jZWQsXG4gICk7XG5cbiAgLy8gTWVyZ2UgaW50ZXJtZWRpYXRlIHNvdXJjZW1hcHMgd2l0aCBpbnB1dCBzb3VyY2VtYXAgaWYgZW5hYmxlZFxuICBsZXQgZnVsbFNvdXJjZW1hcDtcbiAgaWYgKG9wdGlvbnMuc291cmNlbWFwKSB7XG4gICAgY29uc3QgcGFydGlhbFNvdXJjZW1hcHMgPSBbXTtcblxuICAgIGlmIChlc2J1aWxkUmVzdWx0Lm1hcCkge1xuICAgICAgcGFydGlhbFNvdXJjZW1hcHMudW5zaGlmdChKU09OLnBhcnNlKGVzYnVpbGRSZXN1bHQubWFwKSk7XG4gICAgfVxuXG4gICAgaWYgKHRlcnNlclJlc3VsdC5tYXApIHtcbiAgICAgIHBhcnRpYWxTb3VyY2VtYXBzLnVuc2hpZnQodGVyc2VyUmVzdWx0Lm1hcCk7XG4gICAgfVxuXG4gICAgaWYgKGFzc2V0Lm1hcCkge1xuICAgICAgcGFydGlhbFNvdXJjZW1hcHMucHVzaChhc3NldC5tYXApO1xuICAgIH1cblxuICAgIGZ1bGxTb3VyY2VtYXAgPSByZW1hcHBpbmcocGFydGlhbFNvdXJjZW1hcHMsICgpID0+IG51bGwpO1xuICB9XG5cbiAgcmV0dXJuIHsgbmFtZTogYXNzZXQubmFtZSwgY29kZTogdGVyc2VyUmVzdWx0LmNvZGUsIG1hcDogZnVsbFNvdXJjZW1hcCB9O1xufVxuXG4vKipcbiAqIE9wdGltaXplcyBhIEphdmFTY3JpcHQgYXNzZXQgdXNpbmcgZXNidWlsZC5cbiAqXG4gKiBAcGFyYW0gY29udGVudCBUaGUgSmF2YVNjcmlwdCBhc3NldCBzb3VyY2UgY29udGVudCB0byBvcHRpbWl6ZS5cbiAqIEBwYXJhbSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBKYXZhU2NyaXB0IGFzc2V0LiBVc2VkIHRvIGdlbmVyYXRlIHNvdXJjZSBtYXBzLlxuICogQHBhcmFtIG9wdGlvbnMgVGhlIG9wdGltaXphdGlvbiByZXF1ZXN0IG9wdGlvbnMgdG8gYXBwbHkgdG8gdGhlIGNvbnRlbnQuXG4gKiBAcmV0dXJucyBBIHByb21pc2UgdGhhdCByZXNvbHZlcyB3aXRoIHRoZSBvcHRpbWl6ZWQgY29kZSwgc291cmNlIG1hcCwgYW5kIGFueSB3YXJuaW5ncy5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gb3B0aW1pemVXaXRoRXNidWlsZChcbiAgY29udGVudDogc3RyaW5nLFxuICBuYW1lOiBzdHJpbmcsXG4gIG9wdGlvbnM6IE9wdGltaXplUmVxdWVzdFsnb3B0aW9ucyddLFxuKTogUHJvbWlzZTxUcmFuc2Zvcm1SZXN1bHQgfCBCdWlsZEZhaWx1cmU+IHtcbiAgaWYgKCFlc2J1aWxkKSB7XG4gICAgZXNidWlsZCA9IG5ldyBFc2J1aWxkRXhlY3V0b3Iob3B0aW9ucy5hbHdheXNVc2VXYXNtKTtcbiAgfVxuXG4gIHRyeSB7XG4gICAgcmV0dXJuIGF3YWl0IGVzYnVpbGQudHJhbnNmb3JtKGNvbnRlbnQsIHtcbiAgICAgIG1pbmlmeUlkZW50aWZpZXJzOiAhb3B0aW9ucy5rZWVwSWRlbnRpZmllck5hbWVzLFxuICAgICAgbWluaWZ5U3ludGF4OiB0cnVlLFxuICAgICAgLy8gTk9URTogRGlzYWJsaW5nIHdoaXRlc3BhY2UgZW5zdXJlcyB1bnVzZWQgcHVyZSBhbm5vdGF0aW9ucyBhcmUga2VwdFxuICAgICAgbWluaWZ5V2hpdGVzcGFjZTogZmFsc2UsXG4gICAgICBwdXJlOiBbJ2ZvcndhcmRSZWYnXSxcbiAgICAgIGxlZ2FsQ29tbWVudHM6IG9wdGlvbnMucmVtb3ZlTGljZW5zZXMgPyAnbm9uZScgOiAnaW5saW5lJyxcbiAgICAgIHNvdXJjZWZpbGU6IG5hbWUsXG4gICAgICBzb3VyY2VtYXA6IG9wdGlvbnMuc291cmNlbWFwICYmICdleHRlcm5hbCcsXG4gICAgICBkZWZpbmU6IG9wdGlvbnMuZGVmaW5lLFxuICAgICAgLy8gVGhpcyBvcHRpb24gc2hvdWxkIGFsd2F5cyBiZSBkaXNhYmxlZCBmb3IgYnJvd3NlciBidWlsZHMgYXMgd2UgZG9uJ3QgcmVseSBvbiBgLm5hbWVgXG4gICAgICAvLyBhbmQgY2F1c2VzIGRlYWRjb2RlIHRvIGJlIHJldGFpbmVkIHdoaWNoIG1ha2VzIGBOR19CVUlMRF9NQU5HTEVgIHVudXNhYmxlIHRvIGludmVzdGlnYXRlIHRyZWUtc2hha2luZyBpc3N1ZXMuXG4gICAgICAvLyBXZSBlbmFibGUgYGtlZXBOYW1lc2Agb25seSBmb3Igc2VydmVyIGJ1aWxkcyBhcyBEb21pbm8gcmVsaWVzIG9uIGAubmFtZWAuXG4gICAgICAvLyBPbmNlIHdlIG5vIGxvbmdlciByZWx5IG9uIERvbWlubyBmb3IgU1NSIHdlIHNob3VsZCBiZSBhYmxlIHRvIHJlbW92ZSB0aGlzLlxuICAgICAga2VlcE5hbWVzOiBvcHRpb25zLmtlZXBOYW1lcyxcbiAgICAgIHRhcmdldDogb3B0aW9ucy50YXJnZXQsXG4gICAgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgaWYgKGlzRXNCdWlsZEZhaWx1cmUoZXJyb3IpKSB7XG4gICAgICByZXR1cm4gZXJyb3I7XG4gICAgfVxuXG4gICAgdGhyb3cgZXJyb3I7XG4gIH1cbn1cblxuLyoqXG4gKiBPcHRpbWl6ZXMgYSBKYXZhU2NyaXB0IGFzc2V0IHVzaW5nIHRlcnNlci5cbiAqXG4gKiBAcGFyYW0gbmFtZSBUaGUgbmFtZSBvZiB0aGUgSmF2YVNjcmlwdCBhc3NldC4gVXNlZCB0byBnZW5lcmF0ZSBzb3VyY2UgbWFwcy5cbiAqIEBwYXJhbSBjb2RlIFRoZSBKYXZhU2NyaXB0IGFzc2V0IHNvdXJjZSBjb250ZW50IHRvIG9wdGltaXplLlxuICogQHBhcmFtIHNvdXJjZW1hcHMgSWYgdHJ1ZSwgZ2VuZXJhdGUgYW4gb3V0cHV0IHNvdXJjZSBtYXAgZm9yIHRoZSBvcHRpbWl6ZWQgY29kZS5cbiAqIEBwYXJhbSBhZHZhbmNlZCBDb250cm9scyBhZHZhbmNlZCBvcHRpbWl6YXRpb25zLlxuICogQHJldHVybnMgQSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2l0aCB0aGUgb3B0aW1pemVkIGNvZGUgYW5kIHNvdXJjZSBtYXAuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIG9wdGltaXplV2l0aFRlcnNlcihcbiAgbmFtZTogc3RyaW5nLFxuICBjb2RlOiBzdHJpbmcsXG4gIHNvdXJjZW1hcHM6IGJvb2xlYW4gfCB1bmRlZmluZWQsXG4gIGFkdmFuY2VkOiBib29sZWFuIHwgdW5kZWZpbmVkLFxuKTogUHJvbWlzZTx7IGNvZGU6IHN0cmluZzsgbWFwPzogb2JqZWN0IH0+IHtcbiAgY29uc3QgcmVzdWx0ID0gYXdhaXQgbWluaWZ5KFxuICAgIHsgW25hbWVdOiBjb2RlIH0sXG4gICAge1xuICAgICAgY29tcHJlc3M6IHtcbiAgICAgICAgcGFzc2VzOiBhZHZhbmNlZCA/IDIgOiAxLFxuICAgICAgICBwdXJlX2dldHRlcnM6IGFkdmFuY2VkLFxuICAgICAgfSxcbiAgICAgIC8vIFNldCB0byBFUzIwMTUgdG8gcHJldmVudCBoaWdoZXIgbGV2ZWwgZmVhdHVyZXMgZnJvbSBiZWluZyBpbnRyb2R1Y2VkIHdoZW4gYnJvd3NlcnNsaXN0XG4gICAgICAvLyBjb250YWlucyBvbGRlciBicm93c2Vycy4gVGhlIGJ1aWxkIHN5c3RlbSByZXF1aXJlcyBicm93c2VycyB0byBzdXBwb3J0IEVTMjAxNSBhdCBhIG1pbmltdW0uXG4gICAgICBlY21hOiAyMDE1LFxuICAgICAgLy8gZXNidWlsZCBpbiB0aGUgZmlyc3QgcGFzcyBpcyB1c2VkIHRvIG1pbmlmeSBpZGVudGlmaWVycyBpbnN0ZWFkIG9mIG1hbmdsZSBoZXJlXG4gICAgICBtYW5nbGU6IGZhbHNlLFxuICAgICAgLy8gZXNidWlsZCBpbiB0aGUgZmlyc3QgcGFzcyBpcyB1c2VkIHRvIG1pbmlmeSBmdW5jdGlvbiBuYW1lc1xuICAgICAga2VlcF9mbmFtZXM6IHRydWUsXG4gICAgICBmb3JtYXQ6IHtcbiAgICAgICAgLy8gQVNDSUkgb3V0cHV0IGlzIGVuYWJsZWQgaGVyZSBhcyB3ZWxsIHRvIHByZXZlbnQgdGVyc2VyIGZyb20gY29udmVydGluZyBiYWNrIHRvIFVURi04XG4gICAgICAgIGFzY2lpX29ubHk6IHRydWUsXG4gICAgICAgIHdyYXBfZnVuY19hcmdzOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgICBzb3VyY2VNYXA6XG4gICAgICAgIHNvdXJjZW1hcHMgJiZcbiAgICAgICAgKHtcbiAgICAgICAgICBhc09iamVjdDogdHJ1ZSxcbiAgICAgICAgICAvLyB0eXBpbmdzIGRvbid0IGluY2x1ZGUgYXNPYmplY3Qgb3B0aW9uXG4gICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgICAgICAgfSBhcyBhbnkpLFxuICAgIH0sXG4gICk7XG5cbiAgaWYgKCFyZXN1bHQuY29kZSkge1xuICAgIHRocm93IG5ldyBFcnJvcignVGVyc2VyIGZhaWxlZCBmb3IgdW5rbm93biByZWFzb24uJyk7XG4gIH1cblxuICByZXR1cm4geyBjb2RlOiByZXN1bHQuY29kZSwgbWFwOiByZXN1bHQubWFwIGFzIG9iamVjdCB9O1xufVxuXG4vKipcbiAqIERldGVybWluZXMgaWYgYW4gdW5rbm93biB2YWx1ZSBpcyBhbiBlc2J1aWxkIEJ1aWxkRmFpbHVyZSBlcnJvciBvYmplY3QgdGhyb3duIGJ5IGVzYnVpbGQuXG4gKiBAcGFyYW0gdmFsdWUgQSBwb3RlbnRpYWwgZXNidWlsZCBCdWlsZEZhaWx1cmUgZXJyb3Igb2JqZWN0LlxuICogQHJldHVybnMgYHRydWVgIGlmIHRoZSBvYmplY3QgaXMgZGV0ZXJtaW5lZCB0byBiZSBhIEJ1aWxkRmFpbHVyZSBvYmplY3Q7IG90aGVyd2lzZSwgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNFc0J1aWxkRmFpbHVyZSh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIEJ1aWxkRmFpbHVyZSB7XG4gIHJldHVybiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgJ2Vycm9ycycgaW4gdmFsdWUgJiYgJ3dhcm5pbmdzJyBpbiB2YWx1ZTtcbn1cbiJdfQ==