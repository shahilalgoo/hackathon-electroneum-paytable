"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const share_based_paytable_1 = require("./share-based-paytable");
const get_decimal_places_1 = require("./utils/get-decimal-places");
const round_dp_1 = require("./utils/round-dp");
const sum_paytable_1 = require("./utils/sum-paytable");
const log_entire_array_1 = require("./utils/log-entire-array");
const calculate_optimal_toppers_1 = require("./utils/calculate-optimal-toppers");
const round_down_exponential_1 = require("./utils/round-down-exponential");
// Color Logger
const logger = require('node-color-log');
// Inputs
const ticketPrice = 16000000000000000000000000000;
const totalParticipants = 60;
// Constants
const prizePoolShare = 0.7; // 70% of revenue goes to the prize pool // ❗
const totalPaidPercentage = 0.3; // 30% of total participants will be paid // ❗
// Always use 3 decimal places more than that of the ticket price
const decimalPlacesUsed = (0, get_decimal_places_1.getDecimalPlaces)(ticketPrice) + 3;
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
    if (totalParticipants < 10) {
        totalPlacesPaid = Math.round(totalPaidPercentage * totalParticipants); // rounding instead of flooring so we get 1 more paid places in some cases
        sharesOnTopPercentage = 0; // Cancel the shares on top
    }
    // Generate paytable & sum up
    let payTable = (0, share_based_paytable_1.generateSharePaytable)(totalPlacesPaid, totalPrizePool, decimalPlacesUsed, sharesOnTopPercentage);
    payTable = (0, round_down_exponential_1.removeExcessPrecision)(payTable);
    totalInPaytable = (0, sum_paytable_1.sumPayTable)(payTable, decimalPlacesUsed);
    // for (let i = 0; i < payTable.length; i++) { 
    //     const roundedDown = roundDownExponential(payTable[i], 10);
    //     console.log(roundedDown);
    //     console.log(roundedDown.toLocaleString('fullwide', { useGrouping: false }));
    //     console.log(payTable[i].toLocaleString('fullwide', { useGrouping: false }));
    // }
    (0, log_entire_array_1.logEntireArray)(payTable);
    console.log("Total in Paytable:", totalInPaytable);
    console.log("Prize pool:", totalPrizePool);
    process.exit(0);
}
/** FOR HIGHER PARTICIPATION NUMBER, THOSE WITH MORE PAID PLACES THAN MENTIONED ABOVE**/
// Initialize paytable
let payTable = new Array(totalPlacesPaid).fill(0);
// 2/3 of the bottom paytable get their money back
const moneyBackTotalPlayers = Math.round((2 / 3) * payTable.length);
const moneyBackTotal = moneyBackTotalPlayers * ticketPrice;
for (let i = totalPlacesPaid - moneyBackTotalPlayers; i < totalPlacesPaid; i++) {
    payTable[i] = ticketPrice;
}
// The top 1/3 (also means top 10% of players overall) are split into 2 groups
// Toppers: Those who get increasing amount of payouts
// Inbetweeners: Those who get a multiplier on the ticket price. All inbetweeners receive the same amount
const top10PercentPlaces = totalPlacesPaid - moneyBackTotalPlayers;
const inbetweenersMultiplier = 2;
// Calculate amount of toppers so that the last topper receives more than an inbetweeners 
const { toppersAmount, toppersPrizePool } = (0, calculate_optimal_toppers_1.calculateOptimalToppers)(totalPrizePool, ticketPrice, top10PercentPlaces, moneyBackTotal, inbetweenersMultiplier, decimalPlacesUsed);
if (toppersAmount < 1) {
    logger.error("Not enough money in prize pool for this payout structure");
    process.exit(1);
}
// Generate the share based paytable for toppers
const toppersTable = (0, share_based_paytable_1.generateSharePaytable)(toppersAmount, toppersPrizePool, decimalPlacesUsed);
// Fill in toppers' reward
for (let i = 0; i < toppersTable.length; i++) {
    payTable[i] = toppersTable[i];
}
// Fill in inbetweeners' reward
const inbetweenerReward = ticketPrice * inbetweenersMultiplier;
for (let i = toppersAmount; i < top10PercentPlaces; i++) {
    payTable[i] = (0, round_dp_1.RoundToDP)(inbetweenerReward, decimalPlacesUsed);
}
// Find total
// payTable = removeExcessPrecision(payTable);
totalInPaytable = (0, sum_paytable_1.sumPayTable)(payTable, decimalPlacesUsed);
logger.color('red').log("=======================================================================");
logger.color('red').log("=======================================================================");
logger.color('red').log("=======================================================================");
(0, log_entire_array_1.logEntireArray)(payTable);
console.log("Players:", totalParticipants, " Price:", ticketPrice);
console.log("Prize Pool (70% of revenue): ", totalPrizePool);
console.log("Total in Paytable:", totalInPaytable);
logger.color('red').log("------------------------------------------------------------------------");
console.log("Paid Places (30%):", totalPlacesPaid);
console.log("Players getting their money back:", moneyBackTotalPlayers);
console.log("Players making 2x:", top10PercentPlaces - toppersAmount);
console.log("Players making more than 2x:", toppersAmount);
// console.log("Total money back (bottom 2/3 players):", moneyBackTotal);
// console.log("Money left after money back:", totalPrizePool - moneyBackTotal);
// console.log("Total for inbetweeners", moneyInbetweenersTotal);
logger.color('red').log("=======================================================================");
logger.color('red').log("=======================================================================");
logger.color('red').log("=======================================================================");
