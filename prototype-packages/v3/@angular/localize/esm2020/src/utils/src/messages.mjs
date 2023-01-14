/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { computeMsgId } from '@angular/compiler';
import { BLOCK_MARKER, ID_SEPARATOR, LEGACY_ID_INDICATOR, MEANING_SEPARATOR } from './constants';
/**
 * Re-export this helper function so that users of `@angular/localize` don't need to actively import
 * from `@angular/compiler`.
 */
export { computeMsgId } from '@angular/compiler';
/**
 * Parse a `$localize` tagged string into a structure that can be used for translation or
 * extraction.
 *
 * See `ParsedMessage` for an example.
 */
export function parseMessage(messageParts, expressions, location, messagePartLocations, expressionLocations = []) {
    const substitutions = {};
    const substitutionLocations = {};
    const associatedMessageIds = {};
    const metadata = parseMetadata(messageParts[0], messageParts.raw[0]);
    const cleanedMessageParts = [metadata.text];
    const placeholderNames = [];
    let messageString = metadata.text;
    for (let i = 1; i < messageParts.length; i++) {
        const { messagePart, placeholderName = computePlaceholderName(i), associatedMessageId } = parsePlaceholder(messageParts[i], messageParts.raw[i]);
        messageString += `{$${placeholderName}}${messagePart}`;
        if (expressions !== undefined) {
            substitutions[placeholderName] = expressions[i - 1];
            substitutionLocations[placeholderName] = expressionLocations[i - 1];
        }
        placeholderNames.push(placeholderName);
        if (associatedMessageId !== undefined) {
            associatedMessageIds[placeholderName] = associatedMessageId;
        }
        cleanedMessageParts.push(messagePart);
    }
    const messageId = metadata.customId || computeMsgId(messageString, metadata.meaning || '');
    const legacyIds = metadata.legacyIds ? metadata.legacyIds.filter(id => id !== messageId) : [];
    return {
        id: messageId,
        legacyIds,
        substitutions,
        substitutionLocations,
        text: messageString,
        customId: metadata.customId,
        meaning: metadata.meaning || '',
        description: metadata.description || '',
        messageParts: cleanedMessageParts,
        messagePartLocations,
        placeholderNames,
        associatedMessageIds,
        location,
    };
}
/**
 * Parse the given message part (`cooked` + `raw`) to extract the message metadata from the text.
 *
 * If the message part has a metadata block this function will extract the `meaning`,
 * `description`, `customId` and `legacyId` (if provided) from the block. These metadata properties
 * are serialized in the string delimited by `|`, `@@` and `␟` respectively.
 *
 * (Note that `␟` is the `LEGACY_ID_INDICATOR` - see `constants.ts`.)
 *
 * For example:
 *
 * ```ts
 * `:meaning|description@@custom-id:`
 * `:meaning|@@custom-id:`
 * `:meaning|description:`
 * `:description@@custom-id:`
 * `:meaning|:`
 * `:description:`
 * `:@@custom-id:`
 * `:meaning|description@@custom-id␟legacy-id-1␟legacy-id-2:`
 * ```
 *
 * @param cooked The cooked version of the message part to parse.
 * @param raw The raw version of the message part to parse.
 * @returns A object containing any metadata that was parsed from the message part.
 */
export function parseMetadata(cooked, raw) {
    const { text: messageString, block } = splitBlock(cooked, raw);
    if (block === undefined) {
        return { text: messageString };
    }
    else {
        const [meaningDescAndId, ...legacyIds] = block.split(LEGACY_ID_INDICATOR);
        const [meaningAndDesc, customId] = meaningDescAndId.split(ID_SEPARATOR, 2);
        let [meaning, description] = meaningAndDesc.split(MEANING_SEPARATOR, 2);
        if (description === undefined) {
            description = meaning;
            meaning = undefined;
        }
        if (description === '') {
            description = undefined;
        }
        return { text: messageString, meaning, description, customId, legacyIds };
    }
}
/**
 * Parse the given message part (`cooked` + `raw`) to extract any placeholder metadata from the
 * text.
 *
 * If the message part has a metadata block this function will extract the `placeholderName` and
 * `associatedMessageId` (if provided) from the block.
 *
 * These metadata properties are serialized in the string delimited by `@@`.
 *
 * For example:
 *
 * ```ts
 * `:placeholder-name@@associated-id:`
 * ```
 *
 * @param cooked The cooked version of the message part to parse.
 * @param raw The raw version of the message part to parse.
 * @returns A object containing the metadata (`placeholderName` and `associatedMessageId`) of the
 *     preceding placeholder, along with the static text that follows.
 */
export function parsePlaceholder(cooked, raw) {
    const { text: messagePart, block } = splitBlock(cooked, raw);
    if (block === undefined) {
        return { messagePart };
    }
    else {
        const [placeholderName, associatedMessageId] = block.split(ID_SEPARATOR);
        return { messagePart, placeholderName, associatedMessageId };
    }
}
/**
 * Split a message part (`cooked` + `raw`) into an optional delimited "block" off the front and the
 * rest of the text of the message part.
 *
 * Blocks appear at the start of message parts. They are delimited by a colon `:` character at the
 * start and end of the block.
 *
 * If the block is in the first message part then it will be metadata about the whole message:
 * meaning, description, id.  Otherwise it will be metadata about the immediately preceding
 * substitution: placeholder name.
 *
 * Since blocks are optional, it is possible that the content of a message block actually starts
 * with a block marker. In this case the marker must be escaped `\:`.
 *
 * @param cooked The cooked version of the message part to parse.
 * @param raw The raw version of the message part to parse.
 * @returns An object containing the `text` of the message part and the text of the `block`, if it
 * exists.
 * @throws an error if the `block` is unterminated
 */
export function splitBlock(cooked, raw) {
    if (raw.charAt(0) !== BLOCK_MARKER) {
        return { text: cooked };
    }
    else {
        const endOfBlock = findEndOfBlock(cooked, raw);
        return {
            block: cooked.substring(1, endOfBlock),
            text: cooked.substring(endOfBlock + 1),
        };
    }
}
function computePlaceholderName(index) {
    return index === 1 ? 'PH' : `PH_${index - 1}`;
}
/**
 * Find the end of a "marked block" indicated by the first non-escaped colon.
 *
 * @param cooked The cooked string (where escaped chars have been processed)
 * @param raw The raw string (where escape sequences are still in place)
 *
 * @returns the index of the end of block marker
 * @throws an error if the block is unterminated
 */
export function findEndOfBlock(cooked, raw) {
    for (let cookedIndex = 1, rawIndex = 1; cookedIndex < cooked.length; cookedIndex++, rawIndex++) {
        if (raw[rawIndex] === '\\') {
            rawIndex++;
        }
        else if (cooked[cookedIndex] === BLOCK_MARKER) {
            return cookedIndex;
        }
    }
    throw new Error(`Unterminated $localize metadata block in "${raw}".`);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdXRpbHMvc3JjL21lc3NhZ2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUUvQyxPQUFPLEVBQUMsWUFBWSxFQUFFLFlBQVksRUFBRSxtQkFBbUIsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUUvRjs7O0dBR0c7QUFDSCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUE4SS9DOzs7OztHQUtHO0FBQ0gsTUFBTSxVQUFVLFlBQVksQ0FDeEIsWUFBa0MsRUFBRSxXQUE0QixFQUFFLFFBQXlCLEVBQzNGLG9CQUFtRCxFQUNuRCxzQkFBb0QsRUFBRTtJQUN4RCxNQUFNLGFBQWEsR0FBcUMsRUFBRSxDQUFDO0lBQzNELE1BQU0scUJBQXFCLEdBQTBELEVBQUUsQ0FBQztJQUN4RixNQUFNLG9CQUFvQixHQUEyQyxFQUFFLENBQUM7SUFDeEUsTUFBTSxRQUFRLEdBQUcsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBRSxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckUsTUFBTSxtQkFBbUIsR0FBYSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN0RCxNQUFNLGdCQUFnQixHQUFhLEVBQUUsQ0FBQztJQUN0QyxJQUFJLGFBQWEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDO0lBQ2xDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQzVDLE1BQU0sRUFBQyxXQUFXLEVBQUUsZUFBZSxHQUFHLHNCQUFzQixDQUFDLENBQUMs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QWMsQ0FBQyxNQUFjLEVBQUUsR0FBVztJQUN4RCxLQUFLLElBQUksV0FBVyxHQUFHLENBQUMsRUFBRSxRQUFRLEdBQUcsQ0FBQyxFQUFFLFdBQVcsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLFdBQVcsRUFBRSxFQUFFLFFBQVEsRUFBRSxFQUFFO1FBQzlGLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxLQUFLLElBQUksRUFBRTtZQUMxQixRQUFRLEVBQUUsQ0FBQztTQUNaO2FBQU0sSUFBSSxNQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssWUFBWSxFQUFFO1lBQy9DLE9BQU8sV0FBVyxDQUFDO1NBQ3BCO0tBQ0Y7SUFDRCxNQUFNLElBQUksS0FBSyxDQUFDLDZDQUE2QyxHQUFHLElBQUksQ0FBQyxDQUFDO0FBQ3hFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7Y29tcHV0ZU1zZ0lkfSBmcm9tICdAYW5ndWxhci9jb21waWxlcic7XG5cbmltcG9ydCB7QkxPQ0tfTUFSS0VSLCBJRF9TRVBBUkFUT1IsIExFR0FDWV9JRF9JTkRJQ0FUT1IsIE1FQU5JTkdfU0VQQVJBVE9SfSBmcm9tICcuL2NvbnN0YW50cyc7XG5cbi8qKlxuICogUmUtZXhwb3J0IHRoaXMgaGVscGVyIGZ1bmN0aW9uIHNvIHRoYXQgdXNlcnMgb2YgYEBhbmd1bGFyL2xvY2FsaXplYCBkb24ndCBuZWVkIHRvIGFjdGl2ZWx5IGltcG9ydFxuICogZnJvbSBgQGFuZ3VsYXIvY29tcGlsZXJgLlxuICovXG5leHBvcnQge2NvbXB1dGVNc2dJZH0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXInO1xuXG4vKipcbiAqIEEgc3RyaW5nIGNvbnRhaW5pbmcgYSB0cmFuc2xhdGlvbiBzb3VyY2UgbWVzc2FnZS5cbiAqXG4gKiBJLkUuIHRoZSBtZXNzYWdlIHRoYXQgaW5kaWNhdGVzIHdoYXQgd2lsbCBiZSB0cmFuc2xhdGVkIGZyb20uXG4gKlxuICogVXNlcyBgeyRwbGFjZWhvbGRlci1uYW1lfWAgdG8gaW5kaWNhdGUgYSBwbGFjZWhvbGRlci5cbiAqL1xuZXhwb3J0IHR5cGUgU291cmNlTWVzc2FnZSA9IHN0cmluZztcblxuLyoqXG4gKiBBIHN0cmluZyBjb250YWluaW5nIGEgdHJhbnNsYXRpb24gdGFyZ2V0IG1lc3NhZ2UuXG4gKlxuICogSS5FLiB0aGUgbWVzc2FnZSB0aGF0IGluZGljYXRlcyB3aGF0IHdpbGwgYmUgdHJhbnNsYXRlZCB0by5cbiAqXG4gKiBVc2VzIGB7JHBsYWNlaG9sZGVyLW5hbWV9YCB0byBpbmRpY2F0ZSBhIHBsYWNlaG9sZGVyLlxuICovXG5leHBvcnQgdHlwZSBUYXJnZXRNZXNzYWdlID0gc3RyaW5nO1xuXG4vKipcbiAqIEEgc3RyaW5nIHRoYXQgdW5pcXVlbHkgaWRlbnRpZmllcyBhIG1lc3NhZ2UsIHRvIGJlIHVzZWQgZm9yIG1hdGNoaW5nIHRyYW5zbGF0aW9ucy5cbiAqL1xuZXhwb3J0IHR5cGUgTWVzc2FnZUlkID0gc3RyaW5nO1xuXG4vKipcbiAqIERlY2xhcmVzIGEgY29weSBvZiB0aGUgYEFic29sdXRlRnNQYXRoYCBicmFuZGVkIHR5cGUgaW4gYEBhbmd1bGFyL2NvbXBpbGVyLWNsaWAgdG8gYXZvaWQgYW5cbiAqIGltcG9ydCBpbnRvIGBAYW5ndWxhci9jb21waWxlci1jbGlgLiBUaGUgY29tcGlsZXItY2xpJ3MgZGVjbGFyYXRpb24gZmlsZXMgYXJlIG5vdCBuZWNlc3NhcmlseVxuICogY29tcGF0aWJsZSB3aXRoIHdlYiBlbnZpcm9ubWVudHMgdGhhdCB1c2UgYEBhbmd1bGFyL2xvY2FsaXplYCwgYW5kIHdvdWxkIGluYWR2ZXJ0ZW50bHkgaW5jbHVkZVxuICogYHR5cGVzY3JpcHRgIGRlY2xhcmF0aW9uIGZpbGVzIGluIGFueSBjb21waWxhdGlvbiB1bml0IHRoYXQgdXNlcyBgQGFuZ3VsYXIvbG9jYWxpemVgICh3aGljaFxuICogaW5jcmVhc2VzIHBhcnNpbmcgdGltZSBhbmQgbWVtb3J5IHVzYWdlIGR1cmluZyBidWlsZHMpIHVzaW5nIGEgZGVmYXVsdCBpbXBvcnQgdGhhdCBvbmx5XG4gKiB0eXBlLWNoZWNrcyB3aGVuIGBhbGxvd1N5bnRoZXRpY0RlZmF1bHRJbXBvcnRzYCBpcyBlbmFibGVkLlxuICpcbiAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvNDUxNzlcbiAqL1xudHlwZSBBYnNvbHV0ZUZzUGF0aExvY2FsaXplQ29weSA9IHN0cmluZyZ7X2JyYW5kOiAnQWJzb2x1dGVGc1BhdGgnfTtcblxuLyoqXG4gKiBUaGUgbG9jYXRpb24gb2YgdGhlIG1lc3NhZ2UgaW4gdGhlIHNvdXJjZSBmaWxlLlxuICpcbiAqIFRoZSBgbGluZWAgYW5kIGBjb2x1bW5gIHZhbHVlcyBmb3IgdGhlIGBzdGFydGAgYW5kIGBlbmRgIHByb3BlcnRpZXMgYXJlIHplcm8tYmFzZWQuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU291cmNlTG9jYXRpb24ge1xuICBzdGFydDoge2xpbmU6IG51bWJlciwgY29sdW1uOiBudW1iZXJ9O1xuICBlbmQ6IHtsaW5lOiBudW1iZXIsIGNvbHVtbjogbnVtYmVyfTtcbiAgZmlsZTogQWJzb2x1dGVGc1BhdGhMb2NhbGl6ZUNvcHk7XG4gIHRleHQ/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogQWRkaXRpb25hbCBpbmZvcm1hdGlvbiB0aGF0IGNhbiBiZSBhc3NvY2lhdGVkIHdpdGggYSBtZXNzYWdlLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIE1lc3NhZ2VNZXRhZGF0YSB7XG4gIC8qKlxuICAgKiBBIGh1bWFuIHJlYWRhYmxlIHJlbmRlcmluZyBvZiB0aGUgbWVzc2FnZVxuICAgKi9cbiAgdGV4dDogc3RyaW5nO1xuICAvKipcbiAgICogTGVnYWN5IG1lc3NhZ2UgaWRzLCBpZiBwcm92aWRlZC5cbiAgICpcbiAgICogSW4gbGVnYWN5IG1lc3NhZ2UgZm9ybWF0cyB0aGUgbWVzc2FnZSBpZCBjYW4gb25seSBiZSBjb21wdXRlZCBkaXJlY3RseSBmcm9tIHRoZSBvcmlnaW5hbFxuICAgKiB0ZW1wbGF0ZSBzb3VyY2UuXG4gICAqXG4gICAqIFNpbmNlIHRoaXMgaW5mb3JtYXRpb24gaXMgbm90IGF2YWlsYWJsZSBpbiBgJGxvY2FsaXplYCBjYWxscywgdGhlIGxlZ2FjeSBtZXNzYWdlIGlkcyBtYXkgYmVcbiAgICogYXR0YWNoZWQgYnkgdGhlIGNvbXBpbGVyIHRvIHRoZSBgJGxvY2FsaXplYCBtZXRhYmxvY2sgc28gaXQgY2FuIGJlIHVzZWQgaWYgbmVlZGVkIGF0IHRoZSBwb2ludFxuICAgKiBvZiB0cmFuc2xhdGlvbiBpZiB0aGUgdHJhbnNsYXRpb25zIGFyZSBlbmNvZGVkIHVzaW5nIHRoZSBsZWdhY3kgbWVzc2FnZSBpZC5cbiAgICovXG4gIGxlZ2FjeUlkcz86IHN0cmluZ1tdO1xuICAvKipcbiAgICogVGhlIGlkIG9mIHRoZSBgbWVzc2FnZWAgaWYgYSBjdXN0b20gb25lIHdhcyBzcGVjaWZpZWQgZXhwbGljaXRseS5cbiAgICpcbiAgICogVGhpcyBpZCBvdmVycmlkZXMgYW55IGNvbXB1dGVkIG9yIGxlZ2FjeSBpZHMuXG4gICAqL1xuICBjdXN0b21JZD86IHN0cmluZztcbiAgLyoqXG4gICAqIFRoZSBtZWFuaW5nIG9mIHRoZSBgbWVzc2FnZWAsIHVzZWQgdG8gZGlzdGluZ3Vpc2ggaWRlbnRpY2FsIGBtZXNzYWdlU3RyaW5nYHMuXG4gICAqL1xuICBtZWFuaW5nPzogc3RyaW5nO1xuICAvKipcbiAgICogVGhlIGRlc2NyaXB0aW9uIG9mIHRoZSBgbWVzc2FnZWAsIHVzZWQgdG8gYWlkIHRyYW5zbGF0aW9uLlxuICAgKi9cbiAgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBUaGUgbG9jYXRpb24gb2YgdGhlIG1lc3NhZ2UgaW4gdGhlIHNvdXJjZS5cbiAgICovXG4gIGxvY2F0aW9uPzogU291cmNlTG9jYXRpb247XG59XG5cbi8qKlxuICogSW5mb3JtYXRpb24gcGFyc2VkIGZyb20gYSBgJGxvY2FsaXplYCB0YWdnZWQgc3RyaW5nIHRoYXQgaXMgdXNlZCB0byB0cmFuc2xhdGUgaXQuXG4gKlxuICogRm9yIGV4YW1wbGU6XG4gKlxuICogYGBgXG4gKiBjb25zdCBuYW1lID0gJ0pvIEJsb2dncyc7XG4gKiAkbG9jYWxpemVgSGVsbG8gJHtuYW1lfTp0aXRsZUBASUQ6IWA7XG4gKiBgYGBcbiAqXG4gKiBNYXkgYmUgcGFyc2VkIGludG86XG4gKlxuICogYGBgXG4gKiB7XG4gKiAgIGlkOiAnNjk5ODE5NDUwNzU5NzczMDU5MScsXG4gKiAgIHN1YnN0aXR1dGlvbnM6IHsgdGl0bGU6ICdKbyBCbG9nZ3MnIH0sXG4gKiAgIG1lc3NhZ2VTdHJpbmc6ICdIZWxsbyB7JHRpdGxlfSEnLFxuICogICBwbGFjZWhvbGRlck5hbWVzOiBbJ3RpdGxlJ10sXG4gKiAgIGFzc29jaWF0ZWRNZXNzYWdlSWRzOiB7IHRpdGxlOiAnSUQnIH0sXG4gKiB9XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBQYXJzZWRNZXNzYWdlIGV4dGVuZHMgTWVzc2FnZU1ldGFkYXRhIHtcbiAgLyoqXG4gICAqIFRoZSBrZXkgdXNlZCB0byBsb29rIHVwIHRoZSBhcHByb3ByaWF0ZSB0cmFuc2xhdGlvbiB0YXJnZXQuXG4gICAqL1xuICBpZDogTWVzc2FnZUlkO1xuICAvKipcbiAgICogQSBtYXBwaW5nIG9mIHBsYWNlaG9sZGVyIG5hbWVzIHRvIHN1YnN0aXR1dGlvbiB2YWx1ZXMuXG4gICAqL1xuICBzdWJzdGl0dXRpb25zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xuICAvKipcbiAgICogQW4gb3B0aW9uYWwgbWFwcGluZyBvZiBwbGFjZWhvbGRlciBuYW1lcyB0byBhc3NvY2lhdGVkIE1lc3NhZ2VJZHMuXG4gICAqIFRoaXMgY2FuIGJlIHVzZWQgdG8gbWF0Y2ggSUNVIHBsYWNlaG9sZGVycyB0byB0aGUgbWVzc2FnZSB0aGF0IGNvbnRhaW5zIHRoZSBJQ1UuXG4gICAqL1xuICBhc3NvY2lhdGVkTWVzc2FnZUlkcz86IFJlY29yZDxzdHJpbmcsIE1lc3NhZ2VJZD47XG4gIC8qKlxuICAgKiBBbiBvcHRpb25hbCBtYXBwaW5nIG9mIHBsYWNlaG9sZGVyIG5hbWVzIHRvIHNvdXJjZSBsb2NhdGlvbnNcbiAgICovXG4gIHN1YnN0aXR1dGlvbkxvY2F0aW9ucz86IFJlY29yZDxzdHJpbmcsIFNvdXJjZUxvY2F0aW9ufHVuZGVmaW5lZD47XG4gIC8qKlxuICAgKiBUaGUgc3RhdGljIHBhcnRzIG9mIHRoZSBtZXNzYWdlLlxuICAgKi9cbiAgbWVzc2FnZVBhcnRzOiBzdHJpbmdbXTtcbiAgLyoqXG4gICAqIEFuIG9wdGlvbmFsIG1hcHBpbmcgb2YgbWVzc2FnZSBwYXJ0cyB0byBzb3VyY2UgbG9jYXRpb25zXG4gICAqL1xuICBtZXNzYWdlUGFydExvY2F0aW9ucz86IChTb3VyY2VMb2NhdGlvbnx1bmRlZmluZWQpW107XG4gIC8qKlxuICAgKiBUaGUgbmFtZXMgb2YgdGhlIHBsYWNlaG9sZGVycyB0aGF0IHdpbGwgYmUgcmVwbGFjZWQgd2l0aCBzdWJzdGl0dXRpb25zLlxuICAgKi9cbiAgcGxhY2Vob2xkZXJOYW1lczogc3RyaW5nW107XG59XG5cbi8qKlxuICogUGFyc2UgYSBgJGxvY2FsaXplYCB0YWdnZWQgc3RyaW5nIGludG8gYSBzdHJ1Y3R1cmUgdGhhdCBjYW4gYmUgdXNlZCBmb3IgdHJhbnNsYXRpb24gb3JcbiAqIGV4dHJhY3Rpb24uXG4gKlxuICogU2VlIGBQYXJzZWRNZXNzYWdlYCBmb3IgYW4gZXhhbXBsZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlTWVzc2FnZShcbiAgICBtZXNzYWdlUGFydHM6IFRlbXBsYXRlU3RyaW5nc0FycmF5LCBleHByZXNzaW9ucz86IHJlYWRvbmx5IGFueVtdLCBsb2NhdGlvbj86IFNvdXJjZUxvY2F0aW9uLFxuICAgIG1lc3NhZ2VQYXJ0TG9jYXRpb25zPzogKFNvdXJjZUxvY2F0aW9ufHVuZGVmaW5lZClbXSxcbiAgICBleHByZXNzaW9uTG9jYXRpb25zOiAoU291cmNlTG9jYXRpb258dW5kZWZpbmVkKVtdID0gW10pOiBQYXJzZWRNZXNzYWdlIHtcbiAgY29uc3Qgc3Vic3RpdHV0aW9uczoge1twbGFjZWhvbGRlck5hbWU6IHN0cmluZ106IGFueX0gPSB7fTtcbiAgY29uc3Qgc3Vic3RpdHV0aW9uTG9jYXRpb25zOiB7W3BsYWNlaG9sZGVyTmFtZTogc3RyaW5nXTogU291cmNlTG9jYXRpb258dW5kZWZpbmVkfSA9IHt9O1xuICBjb25zdCBhc3NvY2lhdGVkTWVzc2FnZUlkczoge1twbGFjZWhvbGRlck5hbWU6IHN0cmluZ106IE1lc3NhZ2VJZH0gPSB7fTtcbiAgY29uc3QgbWV0YWRhdGEgPSBwYXJzZU1ldGFkYXRhKG1lc3NhZ2VQYXJ0c1swXSwgbWVzc2FnZVBhcnRzLnJhd1swXSk7XG4gIGNvbnN0IGNsZWFuZWRNZXNzYWdlUGFydHM6IHN0cmluZ1tdID0gW21ldGFkYXRhLnRleHRdO1xuICBjb25zdCBwbGFjZWhvbGRlck5hbWVzOiBzdHJpbmdbXSA9IFtdO1xuICBsZXQgbWVzc2FnZVN0cmluZyA9IG1ldGFkYXRhLnRleHQ7XG4gIGZvciAobGV0IGkgPSAxOyBpIDwgbWVzc2FnZVBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3Qge21lc3NhZ2VQYXJ0LCBwbGFjZWhvbGRlck5hbWUgPSBjb21wdXRlUGxhY2Vob2xkZXJOYW1lKGkpLCBhc3NvY2lhdGVkTWVzc2FnZUlkfSA9XG4gICAgICAgIHBhcnNlUGxhY2Vob2xkZXIobWVzc2FnZVBhcnRzW2ldLCBtZXNzYWdlUGFydHMucmF3W2ldKTtcbiAgICBtZXNzYWdlU3RyaW5nICs9IGB7JCR7cGxhY2Vob2xkZXJOYW1lfX0ke21lc3NhZ2VQYXJ0fWA7XG4gICAgaWYgKGV4cHJlc3Npb25zICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHN1YnN0aXR1dGlvbnNbcGxhY2Vob2xkZXJOYW1lXSA9IGV4cHJlc3Npb25zW2kgLSAxXTtcbiAgICAgIHN1YnN0aXR1dGlvbkxvY2F0aW9uc1twbGFjZWhvbGRlck5hbWVdID0gZXhwcmVzc2lvbkxvY2F0aW9uc1tpIC0gMV07XG4gICAgfVxuICAgIHBsYWNlaG9sZGVyTmFtZXMucHVzaChwbGFjZWhvbGRlck5hbWUpO1xuICAgIGlmIChhc3NvY2lhdGVkTWVzc2FnZUlkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGFzc29jaWF0ZWRNZXNzYWdlSWRzW3BsYWNlaG9sZGVyTmFtZV0gPSBhc3NvY2lhdGVkTWVzc2FnZUlkO1xuICAgIH1cbiAgICBjbGVhbmVkTWVzc2FnZVBhcnRzLnB1c2gobWVzc2FnZVBhcnQpO1xuICB9XG4gIGNvbnN0IG1lc3NhZ2VJZCA9IG1ldGFkYXRhLmN1c3RvbUlkIHx8IGNvbXB1dGVNc2dJZChtZXNzYWdlU3RyaW5nLCBtZXRhZGF0YS5tZWFuaW5nIHx8ICcnKTtcbiAgY29uc3QgbGVnYWN5SWRzID0gbWV0YWRhdGEubGVnYWN5SWRzID8gbWV0YWRhdGEubGVnYWN5SWRzLmZpbHRlcihpZCA9PiBpZCAhPT0gbWVzc2FnZUlkKSA6IFtdO1xuICByZXR1cm4ge1xuICAgIGlkOiBtZXNzYWdlSWQsXG4gICAgbGVnYWN5SWRzLFxuICAgIHN1YnN0aXR1dGlvbnMsXG4gICAgc3Vic3RpdHV0aW9uTG9jYXRpb25zLFxuICAgIHRleHQ6IG1lc3NhZ2VTdHJpbmcsXG4gICAgY3VzdG9tSWQ6IG1ldGFkYXRhLmN1c3RvbUlkLFxuICAgIG1lYW5pbmc6IG1ldGFkYXRhLm1lYW5pbmcgfHwgJycsXG4gICAgZGVzY3JpcHRpb246IG1ldGFkYXRhLmRlc2NyaXB0aW9uIHx8ICcnLFxuICAgIG1lc3NhZ2VQYXJ0czogY2xlYW5lZE1lc3NhZ2VQYXJ0cyxcbiAgICBtZXNzYWdlUGFydExvY2F0aW9ucyxcbiAgICBwbGFjZWhvbGRlck5hbWVzLFxuICAgIGFzc29jaWF0ZWRNZXNzYWdlSWRzLFxuICAgIGxvY2F0aW9uLFxuICB9O1xufVxuXG4vKipcbiAqIFBhcnNlIHRoZSBnaXZlbiBtZXNzYWdlIHBhcnQgKGBjb29rZWRgICsgYHJhd2ApIHRvIGV4dHJhY3QgdGhlIG1lc3NhZ2UgbWV0YWRhdGEgZnJvbSB0aGUgdGV4dC5cbiAqXG4gKiBJZiB0aGUgbWVzc2FnZSBwYXJ0IGhhcyBhIG1ldGFkYXRhIGJsb2NrIHRoaXMgZnVuY3Rpb24gd2lsbCBleHRyYWN0IHRoZSBgbWVhbmluZ2AsXG4gKiBgZGVzY3JpcHRpb25gLCBgY3VzdG9tSWRgIGFuZCBgbGVnYWN5SWRgIChpZiBwcm92aWRlZCkgZnJvbSB0aGUgYmxvY2suIFRoZXNlIG1ldGFkYXRhIHByb3BlcnRpZXNcbiAqIGFyZSBzZXJpYWxpemVkIGluIHRoZSBzdHJpbmcgZGVsaW1pdGVkIGJ5IGB8YCwgYEBAYCBhbmQgYOKQn2AgcmVzcGVjdGl2ZWx5LlxuICpcbiAqIChOb3RlIHRoYXQgYOKQn2AgaXMgdGhlIGBMRUdBQ1lfSURfSU5ESUNBVE9SYCAtIHNlZSBgY29uc3RhbnRzLnRzYC4pXG4gKlxuICogRm9yIGV4YW1wbGU6XG4gKlxuICogYGBgdHNcbiAqIGA6bWVhbmluZ3xkZXNjcmlwdGlvbkBAY3VzdG9tLWlkOmBcbiAqIGA6bWVhbmluZ3xAQGN1c3RvbS1pZDpgXG4gKiBgOm1lYW5pbmd8ZGVzY3JpcHRpb246YFxuICogYDpkZXNjcmlwdGlvbkBAY3VzdG9tLWlkOmBcbiAqIGA6bWVhbmluZ3w6YFxuICogYDpkZXNjcmlwdGlvbjpgXG4gKiBgOkBAY3VzdG9tLWlkOmBcbiAqIGA6bWVhbmluZ3xkZXNjcmlwdGlvbkBAY3VzdG9tLWlk4pCfbGVnYWN5LWlkLTHikJ9sZWdhY3ktaWQtMjpgXG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0gY29va2VkIFRoZSBjb29rZWQgdmVyc2lvbiBvZiB0aGUgbWVzc2FnZSBwYXJ0IHRvIHBhcnNlLlxuICogQHBhcmFtIHJhdyBUaGUgcmF3IHZlcnNpb24gb2YgdGhlIG1lc3NhZ2UgcGFydCB0byBwYXJzZS5cbiAqIEByZXR1cm5zIEEgb2JqZWN0IGNvbnRhaW5pbmcgYW55IG1ldGFkYXRhIHRoYXQgd2FzIHBhcnNlZCBmcm9tIHRoZSBtZXNzYWdlIHBhcnQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZU1ldGFkYXRhKGNvb2tlZDogc3RyaW5nLCByYXc6IHN0cmluZyk6IE1lc3NhZ2VNZXRhZGF0YSB7XG4gIGNvbnN0IHt0ZXh0OiBtZXNzYWdlU3RyaW5nLCBibG9ja30gPSBzcGxpdEJsb2NrKGNvb2tlZCwgcmF3KTtcbiAgaWYgKGJsb2NrID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4ge3RleHQ6IG1lc3NhZ2VTdHJpbmd9O1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IFttZWFuaW5nRGVzY0FuZElkLCAuLi5sZWdhY3lJZHNdID0gYmxvY2suc3BsaXQoTEVHQUNZX0lEX0lORElDQVRPUik7XG4gICAgY29uc3QgW21lYW5pbmdBbmREZXNjLCBjdXN0b21JZF0gPSBtZWFuaW5nRGVzY0FuZElkLnNwbGl0KElEX1NFUEFSQVRPUiwgMik7XG4gICAgbGV0IFttZWFuaW5nLCBkZXNjcmlwdGlvbl06IChzdHJpbmd8dW5kZWZpbmVkKVtdID0gbWVhbmluZ0FuZERlc2Muc3BsaXQoTUVBTklOR19TRVBBUkFUT1IsIDIpO1xuICAgIGlmIChkZXNjcmlwdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBkZXNjcmlwdGlvbiA9IG1lYW5pbmc7XG4gICAgICBtZWFuaW5nID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBpZiAoZGVzY3JpcHRpb24gPT09ICcnKSB7XG4gICAgICBkZXNjcmlwdGlvbiA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmV0dXJuIHt0ZXh0OiBtZXNzYWdlU3RyaW5nLCBtZWFuaW5nLCBkZXNjcmlwdGlvbiwgY3VzdG9tSWQsIGxlZ2FjeUlkc307XG4gIH1cbn1cblxuLyoqXG4gKiBQYXJzZSB0aGUgZ2l2ZW4gbWVzc2FnZSBwYXJ0IChgY29va2VkYCArIGByYXdgKSB0byBleHRyYWN0IGFueSBwbGFjZWhvbGRlciBtZXRhZGF0YSBmcm9tIHRoZVxuICogdGV4dC5cbiAqXG4gKiBJZiB0aGUgbWVzc2FnZSBwYXJ0IGhhcyBhIG1ldGFkYXRhIGJsb2NrIHRoaXMgZnVuY3Rpb24gd2lsbCBleHRyYWN0IHRoZSBgcGxhY2Vob2xkZXJOYW1lYCBhbmRcbiAqIGBhc3NvY2lhdGVkTWVzc2FnZUlkYCAoaWYgcHJvdmlkZWQpIGZyb20gdGhlIGJsb2NrLlxuICpcbiAqIFRoZXNlIG1ldGFkYXRhIHByb3BlcnRpZXMgYXJlIHNlcmlhbGl6ZWQgaW4gdGhlIHN0cmluZyBkZWxpbWl0ZWQgYnkgYEBAYC5cbiAqXG4gKiBGb3IgZXhhbXBsZTpcbiAqXG4gKiBgYGB0c1xuICogYDpwbGFjZWhvbGRlci1uYW1lQEBhc3NvY2lhdGVkLWlkOmBcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSBjb29rZWQgVGhlIGNvb2tlZCB2ZXJzaW9uIG9mIHRoZSBtZXNzYWdlIHBhcnQgdG8gcGFyc2UuXG4gKiBAcGFyYW0gcmF3IFRoZSByYXcgdmVyc2lvbiBvZiB0aGUgbWVzc2FnZSBwYXJ0IHRvIHBhcnNlLlxuICogQHJldHVybnMgQSBvYmplY3QgY29udGFpbmluZyB0aGUgbWV0YWRhdGEgKGBwbGFjZWhvbGRlck5hbWVgIGFuZCBgYXNzb2NpYXRlZE1lc3NhZ2VJZGApIG9mIHRoZVxuICogICAgIHByZWNlZGluZyBwbGFjZWhvbGRlciwgYWxvbmcgd2l0aCB0aGUgc3RhdGljIHRleHQgdGhhdCBmb2xsb3dzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VQbGFjZWhvbGRlcihjb29rZWQ6IHN0cmluZywgcmF3OiBzdHJpbmcpOlxuICAgIHttZXNzYWdlUGFydDogc3RyaW5nOyBwbGFjZWhvbGRlck5hbWU/OiBzdHJpbmc7IGFzc29jaWF0ZWRNZXNzYWdlSWQ/OiBzdHJpbmc7fSB7XG4gIGNvbnN0IHt0ZXh0OiBtZXNzYWdlUGFydCwgYmxvY2t9ID0gc3BsaXRCbG9jayhjb29rZWQsIHJhdyk7XG4gIGlmIChibG9jayA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIHttZXNzYWdlUGFydH07XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgW3BsYWNlaG9sZGVyTmFtZSwgYXNzb2NpYXRlZE1lc3NhZ2VJZF0gPSBibG9jay5zcGxpdChJRF9TRVBBUkFUT1IpO1xuICAgIHJldHVybiB7bWVzc2FnZVBhcnQsIHBsYWNlaG9sZGVyTmFtZSwgYXNzb2NpYXRlZE1lc3NhZ2VJZH07XG4gIH1cbn1cblxuLyoqXG4gKiBTcGxpdCBhIG1lc3NhZ2UgcGFydCAoYGNvb2tlZGAgKyBgcmF3YCkgaW50byBhbiBvcHRpb25hbCBkZWxpbWl0ZWQgXCJibG9ja1wiIG9mZiB0aGUgZnJvbnQgYW5kIHRoZVxuICogcmVzdCBvZiB0aGUgdGV4dCBvZiB0aGUgbWVzc2FnZSBwYXJ0LlxuICpcbiAqIEJsb2NrcyBhcHBlYXIgYXQgdGhlIHN0YXJ0IG9mIG1lc3NhZ2UgcGFydHMuIFRoZXkgYXJlIGRlbGltaXRlZCBieSBhIGNvbG9uIGA6YCBjaGFyYWN0ZXIgYXQgdGhlXG4gKiBzdGFydCBhbmQgZW5kIG9mIHRoZSBibG9jay5cbiAqXG4gKiBJZiB0aGUgYmxvY2sgaXMgaW4gdGhlIGZpcnN0IG1lc3NhZ2UgcGFydCB0aGVuIGl0IHdpbGwgYmUgbWV0YWRhdGEgYWJvdXQgdGhlIHdob2xlIG1lc3NhZ2U6XG4gKiBtZWFuaW5nLCBkZXNjcmlwdGlvbiwgaWQuICBPdGhlcndpc2UgaXQgd2lsbCBiZSBtZXRhZGF0YSBhYm91dCB0aGUgaW1tZWRpYXRlbHkgcHJlY2VkaW5nXG4gKiBzdWJzdGl0dXRpb246IHBsYWNlaG9sZGVyIG5hbWUuXG4gKlxuICogU2luY2UgYmxvY2tzIGFyZSBvcHRpb25hbCwgaXQgaXMgcG9zc2libGUgdGhhdCB0aGUgY29udGVudCBvZiBhIG1lc3NhZ2UgYmxvY2sgYWN0dWFsbHkgc3RhcnRzXG4gKiB3aXRoIGEgYmxvY2sgbWFya2VyLiBJbiB0aGlzIGNhc2UgdGhlIG1hcmtlciBtdXN0IGJlIGVzY2FwZWQgYFxcOmAuXG4gKlxuICogQHBhcmFtIGNvb2tlZCBUaGUgY29va2VkIHZlcnNpb24gb2YgdGhlIG1lc3NhZ2UgcGFydCB0byBwYXJzZS5cbiAqIEBwYXJhbSByYXcgVGhlIHJhdyB2ZXJzaW9uIG9mIHRoZSBtZXNzYWdlIHBhcnQgdG8gcGFyc2UuXG4gKiBAcmV0dXJucyBBbiBvYmplY3QgY29udGFpbmluZyB0aGUgYHRleHRgIG9mIHRoZSBtZXNzYWdlIHBhcnQgYW5kIHRoZSB0ZXh0IG9mIHRoZSBgYmxvY2tgLCBpZiBpdFxuICogZXhpc3RzLlxuICogQHRocm93cyBhbiBlcnJvciBpZiB0aGUgYGJsb2NrYCBpcyB1bnRlcm1pbmF0ZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNwbGl0QmxvY2soY29va2VkOiBzdHJpbmcsIHJhdzogc3RyaW5nKToge3RleHQ6IHN0cmluZywgYmxvY2s/OiBzdHJpbmd9IHtcbiAgaWYgKHJhdy5jaGFyQXQoMCkgIT09IEJMT0NLX01BUktFUikge1xuICAgIHJldHVybiB7dGV4dDogY29va2VkfTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBlbmRPZkJsb2NrID0gZmluZEVuZE9mQmxvY2soY29va2VkLCByYXcpO1xuICAgIHJldHVybiB7XG4gICAgICBibG9jazogY29va2VkLnN1YnN0cmluZygxLCBlbmRPZkJsb2NrKSxcbiAgICAgIHRleHQ6IGNvb2tlZC5zdWJzdHJpbmcoZW5kT2ZCbG9jayArIDEpLFxuICAgIH07XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBjb21wdXRlUGxhY2Vob2xkZXJOYW1lKGluZGV4OiBudW1iZXIpIHtcbiAgcmV0dXJuIGluZGV4ID09PSAxID8gJ1BIJyA6IGBQSF8ke2luZGV4IC0gMX1gO1xufVxuXG4vKipcbiAqIEZpbmQgdGhlIGVuZCBvZiBhIFwibWFya2VkIGJsb2NrXCIgaW5kaWNhdGVkIGJ5IHRoZSBmaXJzdCBub24tZXNjYXBlZCBjb2xvbi5cbiAqXG4gKiBAcGFyYW0gY29va2VkIFRoZSBjb29rZWQgc3RyaW5nICh3aGVyZSBlc2NhcGVkIGNoYXJzIGhhdmUgYmVlbiBwcm9jZXNzZWQpXG4gKiBAcGFyYW0gcmF3IFRoZSByYXcgc3RyaW5nICh3aGVyZSBlc2NhcGUgc2VxdWVuY2VzIGFyZSBzdGlsbCBpbiBwbGFjZSlcbiAqXG4gKiBAcmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIGVuZCBvZiBibG9jayBtYXJrZXJcbiAqIEB0aHJvd3MgYW4gZXJyb3IgaWYgdGhlIGJsb2NrIGlzIHVudGVybWluYXRlZFxuICovXG5leHBvcnQgZnVuY3Rpb24gZmluZEVuZE9mQmxvY2soY29va2VkOiBzdHJpbmcsIHJhdzogc3RyaW5nKTogbnVtYmVyIHtcbiAgZm9yIChsZXQgY29va2VkSW5kZXggPSAxLCByYXdJbmRleCA9IDE7IGNvb2tlZEluZGV4IDwgY29va2VkLmxlbmd0aDsgY29va2VkSW5kZXgrKywgcmF3SW5kZXgrKykge1xuICAgIGlmIChyYXdbcmF3SW5kZXhdID09PSAnXFxcXCcpIHtcbiAgICAgIHJhd0luZGV4Kys7XG4gICAgfSBlbHNlIGlmIChjb29rZWRbY29va2VkSW5kZXhdID09PSBCTE9DS19NQVJLRVIpIHtcbiAgICAgIHJldHVybiBjb29rZWRJbmRleDtcbiAgICB9XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKGBVbnRlcm1pbmF0ZWQgJGxvY2FsaXplIG1ldGFkYXRhIGJsb2NrIGluIFwiJHtyYXd9XCIuYCk7XG59XG4iXX0=