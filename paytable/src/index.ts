import { generateSharePaytable, getShareAmount } from "./share-based-paytable";
import { getDecimalPlaces } from "./utils/get-decimal-places";
import { RoundToDP } from "./utils/round-dp";
import { sumPayTable } from "./utils/sum-paytable";
import { logEntireArray } from "./utils/log-entire-array";

// Color Logger
const logger = require('node-color-log');

// Inputs
const ticketPrice = 0.075;
const totalParticipants = 3957;

// Constants
const prizePoolShare = 0.7; // 70% of revenue goes to the prize pool // ❗
const totalPaidPercentage = 0.3; // 30% of total participants will be paid // ❗

// Always use 3 decimal places more than that of the ticket price
const decimalPlacesUsed = getDecimalPlaces(ticketPrice) + 3;

// Minimum participants check
if (totalParticipants < 2) {
    logger.error("Total participants must be at least 2");
    process.exit(1);
}

// Check price
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

// For low participation numbers, we go directly to using share based paytable
const minPaidPlacesToUseSharePaytableOnly = 4;

if (totalPlacesPaid <= minPaidPlacesToUseSharePaytableOnly) {
    // For low participants, we decrease the amount of shares for the top
    let sharesOnTopPercentage = 0.1;

    if (totalParticipants < 10 ) {
        totalPlacesPaid = Math.round(totalPaidPercentage * totalParticipants); // rounding instead of flooring so we get 1 more paid places in some cases
        sharesOnTopPercentage = 0; // Cancel the shares on top
    }

    // Generate paytable & sum up
    const payTable = generateSharePaytable(totalPlacesPaid, totalPrizePool, decimalPlacesUsed, sharesOnTopPercentage);
    totalInPaytable = sumPayTable(payTable, decimalPlacesUsed);

    logEntireArray(payTable);
    console.log("Total in Paytable:", totalInPaytable);

    process.exit(0);
}

/** FOR HIGHER PARTICIPATION NUMBER, THOSE WITH MORE PAID PLACES THAN MENTIONED ABOVE**/

// Initialize paytable
const payTable = new Array(totalPlacesPaid).fill(0);

// 2/3 of the bottom paytable get their money back
const moneyBackTotalPlayers = Math.round((2/3) * payTable.length);
const moneyBackTotal = moneyBackTotalPlayers * ticketPrice;

for (let i = totalPlacesPaid - moneyBackTotalPlayers; i < totalPlacesPaid; i++) {
    payTable[i] = ticketPrice;
}

// The top 1/3 (also means top 10% of players overall) are split into 2 groups
// Toppers: Those who get increasing amount of payouts
// Inbetweeners: Those who get a multiplier on the ticket price
const top10PercentPlaces = totalPlacesPaid - moneyBackTotalPlayers;
const inbetweenersMultiplier = 2;

// The top 10% are all initially toppers, the while loop below will determine the final amount of toppers 
let toppersAmount = top10PercentPlaces;
console.log("Initial Toppers:", toppersAmount);

let inbetweenerReward = 0;
let moneyInbetweenersTotal = 0;
let lastTopperReward = 0;
let toppersPrizePool = 0;

while (lastTopperReward <= inbetweenerReward) {
    let inbetweenersAmount = top10PercentPlaces - toppersAmount;
    moneyInbetweenersTotal = inbetweenersAmount * ticketPrice * inbetweenersMultiplier
    
    // Get the share for the amount of toppers and calculate the last topper's reward
    const { share } = getShareAmount(toppersAmount);
    toppersPrizePool = totalPrizePool - (moneyBackTotal + moneyInbetweenersTotal);
    
    // The last topper gets only 1 share in a share based paytable
    lastTopperReward = share * toppersPrizePool;
    inbetweenerReward = ticketPrice * inbetweenersMultiplier;
    
    // Adjust toppersAmount until the last topper receives more than the inbetweeners
    if (lastTopperReward < inbetweenerReward) toppersAmount--;

    if (toppersAmount < 0) {
        logger.error("Not enough money in prize pool for this payout structure");
        process.exit(1);
    }
}

console.log("Toppers:", toppersAmount);

// After the correct topper amount is determined, we can generate the share based paytable
const toppersTable = generateSharePaytable(toppersAmount, toppersPrizePool, decimalPlacesUsed);

// Fill in toppers' reward
for (let i = 0; i < toppersTable.length; i++) {
payTable[i] = toppersTable[i];
}

// Fill in inbetweeners' reward
for (let i = toppersAmount; i < top10PercentPlaces; i++) {
payTable[i] = RoundToDP(inbetweenerReward, decimalPlacesUsed);
}

// Find total
totalInPaytable = sumPayTable(payTable, decimalPlacesUsed);



logger.color('red').log("=======================================================================");
logger.color('red').log("=======================================================================");
logger.color('red').log("=======================================================================");


logEntireArray(payTable);
console.log("Players:", totalParticipants, " Price:", ticketPrice);
console.log("Prize Pool: ", totalPrizePool);
console.log("Total in Paytable:", totalInPaytable);
// console.log("Total money back (bottom 2/3 players):", moneyBackTotal);
// console.log("Money left after money back:", totalPrizePool - moneyBackTotal);
// console.log("Total for inbetweeners", moneyInbetweenersTotal);


logger.color('red').log("=======================================================================");
logger.color('red').log("=======================================================================");
logger.color('red').log("=======================================================================");