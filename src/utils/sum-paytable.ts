import { RoundToDP } from "./round-dp";

export function sumPayTable(payTable: number[], decimalPlaces: number) {
    let total = 0;
    for (let i = 0; i < payTable.length; i++) {
        total += payTable[i];
    }
    return RoundToDP(total, decimalPlaces);
}