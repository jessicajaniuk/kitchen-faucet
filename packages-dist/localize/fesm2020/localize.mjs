/**
 * @license Angular v16.0.0-next.0+sha-ba2c1d8
 * (c) 2010-2022 Google LLC. https://angular.io/
 * License: MIT
 */

/**
 * The character used to mark the start and end of a "block" in a `$localize` tagged string.
 * A block can indicate metadata about the message or specify a name of a placeholder for a
 * substitution expressions.
 *
 * For example:
 *
 * ```ts
 * $localize`Hello, ${title}:title:!`;
 * $localize`:meaning|description@@id:source message text`;
 * ```
 */
const BLOCK_MARKER$1 = ':';
/**
 * The marker used to separate a message's "meaning" from its "description" in a metadata block.
 *
 * For example:
 *
 * ```ts
 * $localize `:correct|Indicates that the user got the answer correct: Right!`;
 * $localize `:movement|Button label for moving to the right: Right!`;
 * ```
 */
const MEANING_SEPARATOR = '|';
/**
 * The marker used to separate a message's custom "id" from its "description" in a metadata block.
 *
 * For example:
 *
 * ```ts
 * $localize `:A welcome message on the home page@@myApp-homepage-welcome: Welcome!`;
 * ```
 */
const ID_SEPARATOR = '@@';
/**
 * The marker used to separate legacy message ids from the rest of a metadata block.
 *
 * For example:
 *
 * ```ts
 * $localize `:@@custom-id␟2df64767cd895a8fabe3e18b94b5b6b6f9e2e3f0: Welcome!`;
 * ```
 *
 * Note that this character is the "symbol for the unit separator" (␟) not the "unit separator
 * character" itself, since that has no visual representation. See https://graphemica.com/%E2%90%9F.
 *
 * Here is some background for the original "unit separator character":
 * https://stackoverflow.com/questions/8695118/whats-the-file-group-record-unit-separator-control-characters-and-its-usage
 */
const LEGACY_ID_INDICATOR = '\u241F';

/**
 * Represents a big integer using a buffer of its individual digits, with the least significant
 * digit stored at the beginning of the array (little endian).
 *
 * For performance reasons, each instance is mutable. The addition operation can be done in-place
 * to reduce memory pressure of allocation for the digits array.
 */
class BigInteger {
    static zero() {
        return new BigInteger([0]);
    }
    static one() {
        return new BigInteger([1]);
    }
    /**
     * Creates a big integer using its individual digits in little endian storage.
     */
    constructor(digits) {
        this.digits = digits;
    }
    /**
     * Creates a clone of this instance.
     */
    clone() {
        return new BigInteger(this.digits.slice());
    }
    /**
     * Returns a new big integer with the sum of `this` and `other` as its value. This does not mutate
     * `this` but instead returns a new instance, unlike `addToSelf`.
     */
    add(other) {
        const result = this.clone();
        result.addToSelf(other);
        return result;
    }
    /**
     * Adds `other` to the instance itself, thereby mutating its value.
     */
    addToSelf(other) {
        const maxNrOfDigits = Math.max(this.digits.length, other.digits.length);
        let carry = 0;
        for (let i = 0; i < maxNrOfDigits; i++) {
            let digitSum = carry;
            if (i < this.digits.length) {
                digitSum += this.digits[i];
            }
            if (i < other.digits.length) {
                digitSum += other.digits[i];
            }
            if (digitSum >= 10) {
                this.digits[i] = digitSum - 10;
                carry = 1;
            }
            else {
                this.digits[i] = digitSum;
                carry = 0;
            }
        }
        // Apply a remaining carry if needed.
        if (carry > 0) {
            this.digits[maxNrOfDigits] = 1;
        }
    }
    /**
     * Builds the decimal string representation of the big integer. As this is stored in
     * little endian, the digits are concatenated in reverse order.
     */
    toString() {
        let res = '';
        for (let i = this.digits.length - 1; i >= 0; i--) {
            res += this.digits[i];
        }
        return res;
    }
}
/**
 * Represents a big integer which is optimized for multiplication operations, as its power-of-twos
 * are memoized. See `multiplyBy()` for details on the multiplication algorithm.
 */
class BigIntForMultiplication {
    constructor(value) {
        this.powerOfTwos = [value];
    }
    /**
     * Returns the big integer itself.
     */
    getValue() {
        return this.powerOfTwos[0];
    }
    /**
     * Computes the value for `num * b`, where `num` is a JS number and `b` is a big integer. The
     * value for `b` is represented by a storage model that is optimized for this computation.
     *
     * This operation is implemented in N(log2(num)) by continuous halving of the number, where the
     * least-significant bit (LSB) is tested in each iteration. If the bit is set, the bit's index is
     * used as exponent into the power-of-two multiplication of `b`.
     *
     * As an example, consider the multiplication num=42, b=1337. In binary 42 is 0b00101010 and the
     * algorithm unrolls into the following iterations:
     *
     *  Iteration | num        | LSB  | b * 2^iter | Add? | product
     * -----------|------------|------|------------|------|--------
     *  0         | 0b00101010 | 0    | 1337       | No   | 0
     *  1         | 0b00010101 | 1    | 2674       | Yes  | 2674
     *  2         | 0b00001010 | 0    | 5348       | No   | 2674
     *  3         | 0b00000101 | 1    | 10696      | Yes  | 13370
     *  4         | 0b00000010 | 0    | 21392      | No   | 13370
     *  5         | 0b00000001 | 1    | 42784      | Yes  | 56154
     *  6         | 0b00000000 | 0    | 85568      | No   | 56154
     *
     * The computed product of 56154 is indeed the correct result.
     *
     * The `BigIntForMultiplication` representation for a big integer provides memoized access to the
     * power-of-two values to reduce the workload in computing those values.
     */
    multiplyBy(num) {
        const product = BigInteger.zero();
        this.multiplyByAndAddTo(num, product);
        return product;
    }
    /**
     * See `multiplyBy()` for details. This function allows for the computed product to be added
     * directly to the provided result big integer.
     */
    multiplyByAndAddTo(num, result) {
        for (let exponent = 0; num !== 0; num = num >>> 1, exponent++) {
            if (num & 1) {
                const value = this.getMultipliedByPowerOfTwo(exponent);
                result.addToSelf(value);
            }
        }
    }
    /**
     * Computes and memoizes the big integer value for `this.number * 2^exponent`.
     */
    getMultipliedByPowerOfTwo(exponent) {
        // Compute the powers up until the requested exponent, where each value is computed from its
        // predecessor. This is simple as `this.number * 2^(exponent - 1)` only has to be doubled (i.e.
        // added to itself) to reach `this.number * 2^exponent`.
        for (let i = this.powerOfTwos.length; i <= exponent; i++) {
            const previousPower = this.powerOfTwos[i - 1];
            this.powerOfTwos[i] = previousPower.add(previousPower);
        }
        return this.powerOfTwos[exponent];
    }
}
/**
 * Represents an exponentiation operation for the provided base, of which exponents are computed and
 * memoized. The results are represented by a `BigIntForMultiplication` which is tailored for
 * multiplication operations by memoizing the power-of-twos. This effectively results in a matrix
 * representation that is lazily computed upon request.
 */
class BigIntExponentiation {
    constructor(base) {
        this.base = base;
        this.exponents = [new BigIntForMultiplication(BigInteger.one())];
    }
    /**
     * Compute the value for `this.base^exponent`, resulting in a big integer that is optimized for
     * further multiplication operations.
     */
    toThePowerOf(exponent) {
        // Compute the results up until the requested exponent, where every value is computed from its
        // predecessor. This is because `this.base^(exponent - 1)` only has to be multiplied by `base`
        // to reach `this.base^exponent`.
        for (let i = this.exponents.length; i <= exponent; i++) {
            const value = this.exponents[i - 1].multiplyBy(this.base);
            this.exponents[i] = new BigIntForMultiplication(value);
        }
        return this.exponents[exponent];
    }
}

/**
 * A lazily created TextEncoder instance for converting strings into UTF-8 bytes
 */
let textEncoder;
/**
 * Return the message id or compute it using the XLIFF1 digest.
 */
function digest(message) {
    return message.id || computeDigest(message);
}
/**
 * Compute the message id using the XLIFF1 digest.
 */
function computeDigest(message) {
    return sha1(serializeNodes(message.nodes).join('') + `[${message.meaning}]`);
}
/**
 * Return the message id or compute it using the XLIFF2/XMB/$localize digest.
 */
function decimalDigest(message) {
    return message.id || computeDecimalDigest(message);
}
/**
 * Compute the message id using the XLIFF2/XMB/$localize digest.
 */
function computeDecimalDigest(message) {
    const visitor = new _SerializerIgnoreIcuExpVisitor();
    const parts = message.nodes.map(a => a.visit(visitor, null));
    return computeMsgId(parts.join(''), message.meaning);
}
/**
 * Serialize the i18n ast to something xml-like in order to generate an UID.
 *
 * The visitor is also used in the i18n parser tests
 *
 * @internal
 */
class _SerializerVisitor {
    visitText(text, context) {
        return text.value;
    }
    visitContainer(container, context) {
        return `[${container.children.map(child => child.visit(this)).join(', ')}]`;
    }
    visitIcu(icu, context) {
        const strCases = Object.keys(icu.cases).map((k) => `${k} {${icu.cases[k].visit(this)}}`);
        return `{${icu.expression}, ${icu.type}, ${strCases.join(', ')}}`;
    }
    visitTagPlaceholder(ph, context) {
        return ph.isVoid ?
            `<ph tag name="${ph.startName}"/>` :
            `<ph tag name="${ph.startName}">${ph.children.map(child => child.visit(this)).join(', ')}</ph name="${ph.closeName}">`;
    }
    visitPlaceholder(ph, context) {
        return ph.value ? `<ph name="${ph.name}">${ph.value}</ph>` : `<ph name="${ph.name}"/>`;
    }
    visitIcuPlaceholder(ph, context) {
        return `<ph icu name="${ph.name}">${ph.value.visit(this)}</ph>`;
    }
}
const serializerVisitor = new _SerializerVisitor();
function serializeNodes(nodes) {
    return nodes.map(a => a.visit(serializerVisitor, null));
}
/**
 * Serialize the i18n ast to something xml-like in order to generate an UID.
 *
 * Ignore the ICU expressions so that message IDs stays identical if only the expression changes.
 *
 * @internal
 */
class _SerializerIgnoreIcuExpVisitor extends _SerializerVisitor {
    visitIcu(icu, context) {
        let strCases = Object.keys(icu.cases).map((k) => `${k} {${icu.cases[k].visit(this)}}`);
        // Do not take the expression into account
        return `{${icu.type}, ${strCases.join(', ')}}`;
    }
}
/**
 * Compute the SHA1 of the given string
 *
 * see https://csrc.nist.gov/publications/fips/fips180-4/fips-180-4.pdf
 *
 * WARNING: this function has not been designed not tested with security in mind.
 *          DO NOT USE IT IN A SECURITY SENSITIVE CONTEXT.
 */
function sha1(str) {
    textEncoder ?? (textEncoder = new TextEncoder());
    const utf8 = [...textEncoder.encode(str)];
    const words32 = bytesToWords32(utf8, Endian.Big);
    const len = utf8.length * 8;
    const w = new Uint32Array(80);
    let a = 0x67452301, b = 0xefcdab89, c = 0x98badcfe, d = 0x10325476, e = 0xc3d2e1f0;
    words32[len >> 5] |= 0x80 << (24 - len % 32);
    words32[((len + 64 >> 9) << 4) + 15] = len;
    for (let i = 0; i < words32.length; i += 16) {
        const h0 = a, h1 = b, h2 = c, h3 = d, h4 = e;
        for (let j = 0; j < 80; j++) {
            if (j < 16) {
                w[j] = words32[i + j];
            }
            else {
                w[j] = rol32(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
            }
            const fkVal = fk(j, b, c, d);
            const f = fkVal[0];
            const k = fkVal[1];
            const temp = [rol32(a, 5), f, e, k, w[j]].reduce(add32);
            e = d;
            d = c;
            c = rol32(b, 30);
            b = a;
            a = temp;
        }
        a = add32(a, h0);
        b = add32(b, h1);
        c = add32(c, h2);
        d = add32(d, h3);
        e = add32(e, h4);
    }
    // Convert the output parts to a 160-bit hexadecimal string
    return toHexU32(a) + toHexU32(b) + toHexU32(c) + toHexU32(d) + toHexU32(e);
}
/**
 * Convert and format a number as a string representing a 32-bit unsigned hexadecimal number.
 * @param value The value to format as a string.
 * @returns A hexadecimal string representing the value.
 */
function toHexU32(value) {
    // unsigned right shift of zero ensures an unsigned 32-bit number
    return (value >>> 0).toString(16).padStart(8, '0');
}
function fk(index, b, c, d) {
    if (index < 20) {
        return [(b & c) | (~b & d), 0x5a827999];
    }
    if (index < 40) {
        return [b ^ c ^ d, 0x6ed9eba1];
    }
    if (index < 60) {
        return [(b & c) | (b & d) | (c & d), 0x8f1bbcdc];
    }
    return [b ^ c ^ d, 0xca62c1d6];
}
/**
 * Compute the fingerprint of the given string
 *
 * The output is 64 bit number encoded as a decimal string
 *
 * based on:
 * https://github.com/google/closure-compiler/blob/master/src/com/google/javascript/jscomp/GoogleJsMessageIdGenerator.java
 */
function fingerprint(str) {
    textEncoder ?? (textEncoder = new TextEncoder());
    const utf8 = textEncoder.encode(str);
    const view = new DataView(utf8.buffer, utf8.byteOffset, utf8.byteLength);
    let hi = hash32(view, utf8.length, 0);
    let lo = hash32(view, utf8.length, 102072);
    if (hi == 0 && (lo == 0 || lo == 1)) {
        hi = hi ^ 0x130f9bef;
        lo = lo ^ -0x6b5f56d8;
    }
    return [hi, lo];
}
function computeMsgId(msg, meaning = '') {
    let msgFingerprint = fingerprint(msg);
    if (meaning) {
        const meaningFingerprint = fingerprint(meaning);
        msgFingerprint = add64(rol64(msgFingerprint, 1), meaningFingerprint);
    }
    const hi = msgFingerprint[0];
    const lo = msgFingerprint[1];
    return wordsToDecimalString(hi & 0x7fffffff, lo);
}
function hash32(view, length, c) {
    let a = 0x9e3779b9, b = 0x9e3779b9;
    let index = 0;
    const end = length - 12;
    for (; index <= end; index += 12) {
        a += view.getUint32(index, true);
        b += view.getUint32(index + 4, true);
        c += view.getUint32(index + 8, true);
        const res = mix(a, b, c);
        a = res[0], b = res[1], c = res[2];
    }
    const remainder = length - index;
    // the first byte of c is reserved for the length
    c += length;
    if (remainder >= 4) {
        a += view.getUint32(index, true);
        index += 4;
        if (remainder >= 8) {
            b += view.getUint32(index, true);
            index += 4;
            // Partial 32-bit word for c
            if (remainder >= 9) {
                c += view.getUint8(index++) << 8;
            }
            if (remainder >= 10) {
                c += view.getUint8(index++) << 16;
            }
            if (remainder === 11) {
                c += view.getUint8(index++) << 24;
            }
        }
        else {
            // Partial 32-bit word for b
            if (remainder >= 5) {
                b += view.getUint8(index++);
            }
            if (remainder >= 6) {
                b += view.getUint8(index++) << 8;
            }
            if (remainder === 7) {
                b += view.getUint8(index++) << 16;
            }
        }
    }
    else {
        // Partial 32-bit word for a
        if (remainder >= 1) {
            a += view.getUint8(index++);
        }
        if (remainder >= 2) {
            a += view.getUint8(index++) << 8;
        }
        if (remainder === 3) {
            a += view.getUint8(index++) << 16;
        }
    }
    return mix(a, b, c)[2];
}
// clang-format off
function mix(a, b, c) {
    a -= b;
    a -= c;
    a ^= c >>> 13;
    b -= c;
    b -= a;
    b ^= a << 8;
    c -= a;
    c -= b;
    c ^= b >>> 13;
    a -= b;
    a -= c;
    a ^= c >>> 12;
    b -= c;
    b -= a;
    b ^= a << 16;
    c -= a;
    c -= b;
    c ^= b >>> 5;
    a -= b;
    a -= c;
    a ^= c >>> 3;
    b -= c;
    b -= a;
    b ^= a << 10;
    c -= a;
    c -= b;
    c ^= b >>> 15;
    return [a, b, c];
}
// clang-format on
// Utils
var Endian;
(function (Endian) {
    Endian[Endian["Little"] = 0] = "Little";
    Endian[Endian["Big"] = 1] = "Big";
})(Endian || (Endian = {}));
function add32(a, b) {
    return add32to64(a, b)[1];
}
function add32to64(a, b) {
    const low = (a & 0xffff) + (b & 0xffff);
    const high = (a >>> 16) + (b >>> 16) + (low >>> 16);
    return [high >>> 16, (high << 16) | (low & 0xffff)];
}
function add64(a, b) {
    const ah = a[0], al = a[1];
    const bh = b[0], bl = b[1];
    const result = add32to64(al, bl);
    const carry = result[0];
    const l = result[1];
    const h = add32(add32(ah, bh), carry);
    return [h, l];
}
// Rotate a 32b number left `count` position
function rol32(a, count) {
    return (a << count) | (a >>> (32 - count));
}
// Rotate a 64b number left `count` position
function rol64(num, count) {
    const hi = num[0], lo = num[1];
    const h = (hi << count) | (lo >>> (32 - count));
    const l = (lo << count) | (hi >>> (32 - count));
    return [h, l];
}
function bytesToWords32(bytes, endian) {
    const size = (bytes.length + 3) >>> 2;
    const words32 = [];
    for (let i = 0; i < size; i++) {
        words32[i] = wordAt(bytes, i * 4, endian);
    }
    return words32;
}
function byteAt(bytes, index) {
    return index >= bytes.length ? 0 : bytes[index];
}
function wordAt(bytes, index, endian) {
    let word = 0;
    if (endian === Endian.Big) {
        for (let i = 0; i < 4; i++) {
            word += byteAt(bytes, index + i) << (24 - 8 * i);
        }
    }
    else {
        for (let i = 0; i < 4; i++) {
            word += byteAt(bytes, index + i) << 8 * i;
        }
    }
    return word;
}
/**
 * Create a shared exponentiation pool for base-256 computations. This shared pool provides memoized
 * power-of-256 results with memoized power-of-two computations for efficient multiplication.
 *
 * For our purposes, this can be safely stored as a global without memory concerns. The reason is
 * that we encode two words, so only need the 0th (for the low word) and 4th (for the high word)
 * exponent.
 */
const base256 = new BigIntExponentiation(256);
/**
 * Represents two 32-bit words as a single decimal number. This requires a big integer storage
 * model as JS numbers are not accurate enough to represent the 64-bit number.
 *
 * Based on https://www.danvk.org/hex2dec.html
 */
function wordsToDecimalString(hi, lo) {
    // Encode the four bytes in lo in the lower digits of the decimal number.
    // Note: the multiplication results in lo itself but represented by a big integer using its
    // decimal digits.
    const decimal = base256.toThePowerOf(0).multiplyBy(lo);
    // Encode the four bytes in hi above the four lo bytes. lo is a maximum of (2^8)^4, which is why
    // this multiplication factor is applied.
    base256.toThePowerOf(4).multiplyByAndAddTo(hi, decimal);
    return decimal.toString();
}

// This module specifier is intentionally a relative path to allow bundling the code directly
/**
 * Parse a `$localize` tagged string into a structure that can be used for translation or
 * extraction.
 *
 * See `ParsedMessage` for an example.
 */
function parseMessage(messageParts, expressions, location, messagePartLocations, expressionLocations = []) {
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
function parseMetadata(cooked, raw) {
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
function parsePlaceholder(cooked, raw) {
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
function splitBlock(cooked, raw) {
    if (raw.charAt(0) !== BLOCK_MARKER$1) {
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
function findEndOfBlock(cooked, raw) {
    for (let cookedIndex = 1, rawIndex = 1; cookedIndex < cooked.length; cookedIndex++, rawIndex++) {
        if (raw[rawIndex] === '\\') {
            rawIndex++;
        }
        else if (cooked[cookedIndex] === BLOCK_MARKER$1) {
            return cookedIndex;
        }
    }
    throw new Error(`Unterminated $localize metadata block in "${raw}".`);
}

class MissingTranslationError extends Error {
    constructor(parsedMessage) {
        super(`No translation found for ${describeMessage(parsedMessage)}.`);
        this.parsedMessage = parsedMessage;
        this.type = 'MissingTranslationError';
    }
}
function isMissingTranslationError(e) {
    return e.type === 'MissingTranslationError';
}
/**
 * Translate the text of the `$localize` tagged-string (i.e. `messageParts` and
 * `substitutions`) using the given `translations`.
 *
 * The tagged-string is parsed to extract its `messageId` which is used to find an appropriate
 * `ParsedTranslation`. If this doesn't match and there are legacy ids then try matching a
 * translation using those.
 *
 * If one is found then it is used to translate the message into a new set of `messageParts` and
 * `substitutions`.
 * The translation may reorder (or remove) substitutions as appropriate.
 *
 * If there is no translation with a matching message id then an error is thrown.
 * If a translation contains a placeholder that is not found in the message being translated then an
 * error is thrown.
 */
function translate$1(translations, messageParts, substitutions) {
    const message = parseMessage(messageParts, substitutions);
    // Look up the translation using the messageId, and then the legacyId if available.
    let translation = translations[message.id];
    // If the messageId did not match a translation, try matching the legacy ids instead
    if (message.legacyIds !== undefined) {
        for (let i = 0; i < message.legacyIds.length && translation === undefined; i++) {
            translation = translations[message.legacyIds[i]];
        }
    }
    if (translation === undefined) {
        throw new MissingTranslationError(message);
    }
    return [
        translation.messageParts, translation.placeholderNames.map(placeholder => {
            if (message.substitutions.hasOwnProperty(placeholder)) {
                return message.substitutions[placeholder];
            }
            else {
                throw new Error(`There is a placeholder name mismatch with the translation provided for the message ${describeMessage(message)}.\n` +
                    `The translation contains a placeholder with name ${placeholder}, which does not exist in the message.`);
            }
        })
    ];
}
/**
 * Parse the `messageParts` and `placeholderNames` out of a target `message`.
 *
 * Used by `loadTranslations()` to convert target message strings into a structure that is more
 * appropriate for doing translation.
 *
 * @param message the message to be parsed.
 */
function parseTranslation(messageString) {
    const parts = messageString.split(/{\$([^}]*)}/);
    const messageParts = [parts[0]];
    const placeholderNames = [];
    for (let i = 1; i < parts.length - 1; i += 2) {
        placeholderNames.push(parts[i]);
        messageParts.push(`${parts[i + 1]}`);
    }
    const rawMessageParts = messageParts.map(part => part.charAt(0) === BLOCK_MARKER$1 ? '\\' + part : part);
    return {
        text: messageString,
        messageParts: makeTemplateObject(messageParts, rawMessageParts),
        placeholderNames,
    };
}
/**
 * Create a `ParsedTranslation` from a set of `messageParts` and `placeholderNames`.
 *
 * @param messageParts The message parts to appear in the ParsedTranslation.
 * @param placeholderNames The names of the placeholders to intersperse between the `messageParts`.
 */
function makeParsedTranslation(messageParts, placeholderNames = []) {
    let messageString = messageParts[0];
    for (let i = 0; i < placeholderNames.length; i++) {
        messageString += `{$${placeholderNames[i]}}${messageParts[i + 1]}`;
    }
    return {
        text: messageString,
        messageParts: makeTemplateObject(messageParts, messageParts),
        placeholderNames
    };
}
/**
 * Create the specialized array that is passed to tagged-string tag functions.
 *
 * @param cooked The message parts with their escape codes processed.
 * @param raw The message parts with their escaped codes as-is.
 */
function makeTemplateObject(cooked, raw) {
    Object.defineProperty(cooked, 'raw', { value: raw });
    return cooked;
}
function describeMessage(message) {
    const meaningString = message.meaning && ` - "${message.meaning}"`;
    const legacy = message.legacyIds && message.legacyIds.length > 0 ?
        ` [${message.legacyIds.map(l => `"${l}"`).join(', ')}]` :
        '';
    return `"${message.id}"${legacy} ("${message.text}"${meaningString})`;
}

/**
 * Load translations for use by `$localize`, if doing runtime translation.
 *
 * If the `$localize` tagged strings are not going to be replaced at compiled time, it is possible
 * to load a set of translations that will be applied to the `$localize` tagged strings at runtime,
 * in the browser.
 *
 * Loading a new translation will overwrite a previous translation if it has the same `MessageId`.
 *
 * Note that `$localize` messages are only processed once, when the tagged string is first
 * encountered, and does not provide dynamic language changing without refreshing the browser.
 * Loading new translations later in the application life-cycle will not change the translated text
 * of messages that have already been translated.
 *
 * The message IDs and translations are in the same format as that rendered to "simple JSON"
 * translation files when extracting messages. In particular, placeholders in messages are rendered
 * using the `{$PLACEHOLDER_NAME}` syntax. For example the message from the following template:
 *
 * ```html
 * <div i18n>pre<span>inner-pre<b>bold</b>inner-post</span>post</div>
 * ```
 *
 * would have the following form in the `translations` map:
 *
 * ```ts
 * {
 *   "2932901491976224757":
 *      "pre{$START_TAG_SPAN}inner-pre{$START_BOLD_TEXT}bold{$CLOSE_BOLD_TEXT}inner-post{$CLOSE_TAG_SPAN}post"
 * }
 * ```
 *
 * @param translations A map from message ID to translated message.
 *
 * These messages are processed and added to a lookup based on their `MessageId`.
 *
 * @see `clearTranslations()` for removing translations loaded using this function.
 * @see `$localize` for tagging messages as needing to be translated.
 * @publicApi
 */
function loadTranslations(translations) {
    // Ensure the translate function exists
    if (!$localize.translate) {
        $localize.translate = translate;
    }
    if (!$localize.TRANSLATIONS) {
        $localize.TRANSLATIONS = {};
    }
    Object.keys(translations).forEach(key => {
        $localize.TRANSLATIONS[key] = parseTranslation(translations[key]);
    });
}
/**
 * Remove all translations for `$localize`, if doing runtime translation.
 *
 * All translations that had been loading into memory using `loadTranslations()` will be removed.
 *
 * @see `loadTranslations()` for loading translations at runtime.
 * @see `$localize` for tagging messages as needing to be translated.
 *
 * @publicApi
 */
function clearTranslations() {
    $localize.translate = undefined;
    $localize.TRANSLATIONS = {};
}
/**
 * Translate the text of the given message, using the loaded translations.
 *
 * This function may reorder (or remove) substitutions as indicated in the matching translation.
 */
function translate(messageParts, substitutions) {
    try {
        return translate$1($localize.TRANSLATIONS, messageParts, substitutions);
    }
    catch (e) {
        console.warn(e.message);
        return [messageParts, substitutions];
    }
}

// Always use __globalThis if available, which is the spec-defined global variable across all
// environments, then fallback to __global first, because in Node tests both __global and
// __window may be defined and _global should be __global in that case. Note: Typeof/Instanceof
// checks are considered side-effects in Terser. We explicitly mark this as side-effect free:
// https://github.com/terser/terser/issues/250.
const _global = ( /* @__PURE__ */(() => (typeof globalThis !== 'undefined' && globalThis) ||
    (typeof global !== 'undefined' && global) || (typeof window !== 'undefined' && window) ||
    (typeof self !== 'undefined' && typeof WorkerGlobalScope !== 'undefined' &&
        self instanceof WorkerGlobalScope && self))());

/**
 * Tag a template literal string for localization.
 *
 * For example:
 *
 * ```ts
 * $localize `some string to localize`
 * ```
 *
 * **Providing meaning, description and id**
 *
 * You can optionally specify one or more of `meaning`, `description` and `id` for a localized
 * string by pre-pending it with a colon delimited block of the form:
 *
 * ```ts
 * $localize`:meaning|description@@id:source message text`;
 *
 * $localize`:meaning|:source message text`;
 * $localize`:description:source message text`;
 * $localize`:@@id:source message text`;
 * ```
 *
 * This format is the same as that used for `i18n` markers in Angular templates. See the
 * [Angular i18n guide](guide/i18n-common-prepare#mark-text-in-component-template).
 *
 * **Naming placeholders**
 *
 * If the template literal string contains expressions, then the expressions will be automatically
 * associated with placeholder names for you.
 *
 * For example:
 *
 * ```ts
 * $localize `Hi ${name}! There are ${items.length} items.`;
 * ```
 *
 * will generate a message-source of `Hi {$PH}! There are {$PH_1} items`.
 *
 * The recommended practice is to name the placeholder associated with each expression though.
 *
 * Do this by providing the placeholder name wrapped in `:` characters directly after the
 * expression. These placeholder names are stripped out of the rendered localized string.
 *
 * For example, to name the `items.length` expression placeholder `itemCount` you write:
 *
 * ```ts
 * $localize `There are ${items.length}:itemCount: items`;
 * ```
 *
 * **Escaping colon markers**
 *
 * If you need to use a `:` character directly at the start of a tagged string that has no
 * metadata block, or directly after a substitution expression that has no name you must escape
 * the `:` by preceding it with a backslash:
 *
 * For example:
 *
 * ```ts
 * // message has a metadata block so no need to escape colon
 * $localize `:some description::this message starts with a colon (:)`;
 * // no metadata block so the colon must be escaped
 * $localize `\:this message starts with a colon (:)`;
 * ```
 *
 * ```ts
 * // named substitution so no need to escape colon
 * $localize `${label}:label:: ${}`
 * // anonymous substitution so colon must be escaped
 * $localize `${label}\: ${}`
 * ```
 *
 * **Processing localized strings:**
 *
 * There are three scenarios:
 *
 * * **compile-time inlining**: the `$localize` tag is transformed at compile time by a
 * transpiler, removing the tag and replacing the template literal string with a translated
 * literal string from a collection of translations provided to the transpilation tool.
 *
 * * **run-time evaluation**: the `$localize` tag is a run-time function that replaces and
 * reorders the parts (static strings and expressions) of the template literal string with strings
 * from a collection of translations loaded at run-time.
 *
 * * **pass-through evaluation**: the `$localize` tag is a run-time function that simply evaluates
 * the original template literal string without applying any translations to the parts. This
 * version is used during development or where there is no need to translate the localized
 * template literals.
 *
 * @param messageParts a collection of the static parts of the template string.
 * @param expressions a collection of the values of each placeholder in the template string.
 * @returns the translated string, with the `messageParts` and `expressions` interleaved together.
 *
 * @globalApi
 * @publicApi
 */
const $localize$1 = function (messageParts, ...expressions) {
    if ($localize$1.translate) {
        // Don't use array expansion here to avoid the compiler adding `__read()` helper unnecessarily.
        const translation = $localize$1.translate(messageParts, expressions);
        messageParts = translation[0];
        expressions = translation[1];
    }
    let message = stripBlock(messageParts[0], messageParts.raw[0]);
    for (let i = 1; i < messageParts.length; i++) {
        message += expressions[i - 1] + stripBlock(messageParts[i], messageParts.raw[i]);
    }
    return message;
};
const BLOCK_MARKER = ':';
/**
 * Strip a delimited "block" from the start of the `messagePart`, if it is found.
 *
 * If a marker character (:) actually appears in the content at the start of a tagged string or
 * after a substitution expression, where a block has not been provided the character must be
 * escaped with a backslash, `\:`. This function checks for this by looking at the `raw`
 * messagePart, which should still contain the backslash.
 *
 * @param messagePart The cooked message part to process.
 * @param rawMessagePart The raw message part to check.
 * @returns the message part with the placeholder name stripped, if found.
 * @throws an error if the block is unterminated
 */
function stripBlock(messagePart, rawMessagePart) {
    return rawMessagePart.charAt(0) === BLOCK_MARKER ?
        messagePart.substring(findEndOfBlock(messagePart, rawMessagePart) + 1) :
        messagePart;
}

// This file exports all the `utils` as private exports so that other parts of `@angular/localize`

// This file contains the public API of the `@angular/localize` entry-point

// DO NOT ADD public exports to this file.

export { clearTranslations, loadTranslations, $localize$1 as ɵ$localize, MissingTranslationError as ɵMissingTranslationError, _global as ɵ_global, computeMsgId as ɵcomputeMsgId, findEndOfBlock as ɵfindEndOfBlock, isMissingTranslationError as ɵisMissingTranslationError, makeParsedTranslation as ɵmakeParsedTranslation, makeTemplateObject as ɵmakeTemplateObject, parseMessage as ɵparseMessage, parseMetadata as ɵparseMetadata, parseTranslation as ɵparseTranslation, splitBlock as ɵsplitBlock, translate$1 as ɵtranslate };
//# sourceMappingURL=localize.mjs.map
