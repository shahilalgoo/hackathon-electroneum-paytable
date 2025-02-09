"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sumPayTable = sumPayTable;
const round_dp_1 = require("./round-dp");
function sumPayTable(payTable, decimalPlaces) {
    let total = 0;
    for (let i = 0; i < payTable.length; i++) {
        total += payTable[i];
    }
    return (0, round_dp_1.RoundToDP)(total, decimalPlaces);
}
