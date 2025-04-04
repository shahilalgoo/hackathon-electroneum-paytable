// This function generates a paytable that creates shares for each paid places and distributes the prize pool between them
import { RoundToDP } from "./utils/round-dp";
import { sumPayTable } from "./utils/sum-paytable";

const defaultAddedSharesForTop = 0.2; // 20%

export function generateSharePaytable(paidPlaces: number, prizePool: number, decimalPlaces: number, sharesOnTopPercentage?: number) {
    let payTable: number[] = new Array(paidPlaces).fill(0);
    
    let {share, sharesOnTop} = getShareAmount(paidPlaces, sharesOnTopPercentage ? sharesOnTopPercentage : defaultAddedSharesForTop);

    // Sharing between all places
    for (let i = 0; i < paidPlaces; i++) {
        const innerLoopTotal = paidPlaces - i;
        for (let j = 0; j < innerLoopTotal; j++) {
            payTable[j] += share;
        }
    }

    // Adding more shares for top places to break linear pattern in distribution
    const percentagePaidTop = 0.3;
    let topPlaces = Math.round(percentagePaidTop * paidPlaces);
    if (topPlaces > 10) topPlaces = 10;
    const freqTableForTop = new Array(topPlaces).fill(0);
    let pie = 1;

    if (topPlaces === 1) {
        freqTableForTop[0] = pie;
    } else {
        for (let i = 0; i < topPlaces; i++) {
            pie *= 0.5;
            freqTableForTop[i] += pie;
            if (freqTableForTop[i + 1] === undefined) {
                freqTableForTop[i] += pie / 2;
                freqTableForTop[i - 1] += pie / 2;
                break;
            }
        }
    }

    // Add 10% more for the top only
    for (let i = 0; i < topPlaces; i++) {
        payTable[i] += (freqTableForTop[i] * sharesOnTop) * share;
    }

    // Multiply each element by prizePool
    payTable = payTable.map(element => RoundToDP(element * prizePool, decimalPlaces));

    // Find total in paytable
    const totalInPayTable = sumPayTable(payTable, decimalPlaces);

    // If total is more, remove difference from 1st place
    if (totalInPayTable > prizePool) {
        payTable[0] -= (totalInPayTable - prizePool);
        // payTable[0] = RoundToDP(payTable[0], decimalPlaces);
    } 
    else if (totalInPayTable < prizePool) {
        payTable[0] += (prizePool - totalInPayTable);
        // payTable[0] = RoundToDP(payTable[0], decimalPlaces);
    }

    return payTable;

}

export function getShareAmount(paidPlaces: number, sharesOnTopPercentage?: number) {
    // Amount of shares using a triangular number derived from paidPlaces
    const shares = (paidPlaces * (paidPlaces + 1)) / 2;

    // Add a % more shares to be shared for the top only, 20% by default
    const percentageAddedShares = sharesOnTopPercentage ? sharesOnTopPercentage : defaultAddedSharesForTop;
    const sharesOnTop = Math.round(shares * percentageAddedShares);
    const sharesTotal = shares + sharesOnTop;
    const share = 1 / sharesTotal;
    return {share, sharesOnTop};
}