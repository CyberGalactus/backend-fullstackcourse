"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertDefined = void 0;
function assertDefined(value) {
    if (value === undefined || value === null) {
        throw Error('Expected value to be defined, but got: ' + value);
    }
}
exports.assertDefined = assertDefined;
function assertString(str) {
    assertDefined(str);
    if (typeof str !== 'string') {
        throw Error('Expected string, got ' + str);
    }
}
