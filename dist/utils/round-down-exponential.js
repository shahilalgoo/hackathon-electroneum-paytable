"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roundDownExponential = roundDownExponential;
exports.removeExcessPrecision = removeExcessPrecision;
function roundDownExponential(num, precision) {
    const [mantissa, exponent] = num.toExponential().split("e");
    const roundedMantissa = Math.floor(Number(mantissa) * 10 ** precision) / 10 ** precision;
    return Number(`${roundedMantissa}e${exponent}`);
}
function removeExcessPrecision(payTable) {
    return payTable.map(num => roundDownExponential(num, 10));
}
