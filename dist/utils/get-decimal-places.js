"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDecimalPlaces = getDecimalPlaces;
function getDecimalPlaces(num) {
    // Convert to string and split by decimal point
    const str = num.toString();
    const decimalPart = str.split('.')[1];
    // If no decimal part, return 0
    if (!decimalPart)
        return 0;
    // Return length of decimal part
    return decimalPart.length;
}
