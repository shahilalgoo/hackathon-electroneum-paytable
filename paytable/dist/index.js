"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { generateSharePaytable } from "./share-based-paytable";
// const shareBasedPaytable = generateSharePaytable(200, 5000);
const log_entire_array_1 = require("./utils/log-entire-array");
// Constants
const prizePoolShare = 0.7; // 70 percent of revenue goes to the prize pool // ❗
const totalPaidPercentage = 0.3; // 30 percent of total participants will be paid // ❗
// Inputs
const ticketPrice = 0.05;
const totalParticipants = 10000;
// Variables 
let totalPrizePool = 0;
let totalInPaytable = 0;
let totalPlacesPaid = 0;
// Calculate prize pool, rounded
totalPrizePool = prizePoolShare * totalParticipants * ticketPrice;
// totalPrizePool = Math.round(totalPrizePool);
// Calculate paid places, rounded down 
totalPlacesPaid = Math.floor(totalPaidPercentage * totalParticipants);
// Initialize paytable
const payTable = new Array(totalPlacesPaid).fill(0);
// 2/3 of the bottom paytable with get their money back
const moneyBackTotalPlayers = Math.round((2 / 3) * payTable.length);
const moneyBackTotal = moneyBackTotalPlayers * ticketPrice;
for (let i = totalPlacesPaid - moneyBackTotalPlayers; i < totalPlacesPaid; i++) {
    payTable[i] = ticketPrice;
}
(0, log_entire_array_1.logEntireArray)(payTable);
