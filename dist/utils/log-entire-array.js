"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logEntireArray = logEntireArray;
function logEntireArray(arr, chunkSize = 100) {
    if (arr.length <= chunkSize) {
        console.dir(arr, { maxArrayLength: null });
        return;
    }
    // If array is larger, log in chunks
    for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize);
        console.log(`Elements ${i} to ${Math.min(i + chunkSize - 1, arr.length - 1)}:`);
        console.dir(chunk, { maxArrayLength: null });
    }
    // Log total length at the end
    console.log(`Total array length: ${arr.length}`);
}
