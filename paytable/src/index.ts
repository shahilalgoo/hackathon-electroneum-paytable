import { generateSharePaytable, getShareAmount } from "./share-based-paytable";
import { RoundToDP } from "./utils/round-dp";
import { logEntireArray } from "./utils/log-entire-array";
import { sumPayTable } from "./utils/sum-paytable";
import { getDecimalPlaces } from "./utils/get-decimal-places";

// Color Logger
const logger = require('node-color-log');

// Inputs
const ticketPrice = 0.00000000213002;
const totalParticipants = 256;

// Constants
const prizePoolShare = 0.7; // 70 percent of revenue goes to the prize pool // ❗
const totalPaidPercentage = 0.3; // 30 percent of total participants will be paid // ❗

// Always use 3 decimal places more than that of the ticket price
const decimalPlacesUsed = getDecimalPlaces(ticketPrice) + 3;

// Minimum participants check
if (totalParticipants < 2) {
    logger.error("Total participants must be at least 2");
    process.exit(1);
}

if (ticketPrice < 0) {
    logger.error("Price cannot be negative");
    process.exit(1);
}

// Variables 
let totalPrizePool = 0;
let totalInPaytable = 0;
let totalPlacesPaid = 0;

// Calculate prize pool, rounded
totalPrizePool = prizePoolShare * totalParticipants * ticketPrice;

// Calculate paid places, rounded down 
totalPlacesPaid = Math.floor(totalPaidPercentage * totalParticipants);

const minPaidPlacesToUseSharePaytableOnly = 4;

if (totalPlacesPaid <= minPaidPlacesToUseSharePaytableOnly) {
    let sharesOnTopPercentage = 0.1;

    if (totalParticipants < 10 ) {
        totalPlacesPaid = Math.round(totalPaidPercentage * totalParticipants); // rounding instead of flooring
        sharesOnTopPercentage = 0;
    }

    const payTable = generateSharePaytable(totalPlacesPaid, totalPrizePool, decimalPlacesUsed, sharesOnTopPercentage);
    totalInPaytable = sumPayTable(payTable, decimalPlacesUsed);

    logEntireArray(payTable);
    console.log("Total in Paytable:", totalInPaytable);

    process.exit(0);
}

// Initialize paytable
const payTable = new Array(totalPlacesPaid).fill(0);

// 2/3 of the bottom paytable with get their money back
const moneyBackTotalPlayers = Math.round((2/3) * payTable.length);
const moneyBackTotal = moneyBackTotalPlayers * ticketPrice;

for (let i = totalPlacesPaid - moneyBackTotalPlayers; i < totalPlacesPaid; i++) {
    payTable[i] = ticketPrice;
}

const top10PercentPlaces = totalPlacesPaid - moneyBackTotalPlayers;
const inbetweenersMultiplier = 2;

let toppersAmount = top10PercentPlaces;
console.log("Initial Toppers Calculated:", toppersAmount);

let inbetweenerReward = 0;
let moneyInbetweenersTotal = 0;
let lastTopperReward = 0;
let toppersPrizePool = 0;

while (lastTopperReward <= inbetweenerReward) {
    let inbetweenersAmount = top10PercentPlaces < toppersAmount? 0 : top10PercentPlaces - toppersAmount;
    
    if (top10PercentPlaces < toppersAmount) toppersAmount = top10PercentPlaces;
    moneyInbetweenersTotal = inbetweenersAmount * ticketPrice * inbetweenersMultiplier
    
    const { share } = getShareAmount(toppersAmount);
    toppersPrizePool = totalPrizePool - (moneyBackTotal + moneyInbetweenersTotal);
    
    // the last topper gets only 1 share
    lastTopperReward = share * toppersPrizePool;
    inbetweenerReward = ticketPrice * inbetweenersMultiplier;
    
    // adjust topper amount until the last topper receives more than the inbetweeners
    if (lastTopperReward < inbetweenerReward) toppersAmount--;
}

console.log("Toppers:", toppersAmount);
const toppersTable = generateSharePaytable(toppersAmount, toppersPrizePool, decimalPlacesUsed);

for (let i = 0; i < toppersTable.length; i++) {
payTable[i] = toppersTable[i];
}

for (let i = toppersAmount; i < top10PercentPlaces; i++) {
payTable[i] = RoundToDP(inbetweenerReward, decimalPlacesUsed);
}

totalInPaytable = sumPayTable(payTable, decimalPlacesUsed);

logger.color('red').log("=======================================================================");
logger.color('red').log("=======================================================================");
logger.color('red').log("=======================================================================");


logEntireArray(payTable);
console.log("Players:", totalParticipants, " Price:", ticketPrice);
console.log("Prize Pool: ", totalPrizePool);
console.log("Total money back (bottom 2/3 players):", moneyBackTotal);
console.log("Money left after money back:", totalPrizePool - moneyBackTotal);
console.log("Total for inbetweeners", moneyInbetweenersTotal);
console.log("Total in Paytable:", totalInPaytable);


logger.color('red').log("=======================================================================");
logger.color('red').log("=======================================================================");
logger.color('red').log("=======================================================================");